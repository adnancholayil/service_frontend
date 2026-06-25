'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Star, Sparkles, CheckCircle2, SlidersHorizontal, MapPin } from 'lucide-react';
import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { GET_PROVIDERS_PAGE_DATA } from '../../graphql/queries/provider';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

function ProvidersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  const categoryFilter = categoryParam === 'all' ? null : categoryParam;

  const { data, loading, error } = useQuery(GET_PROVIDERS_PAGE_DATA, {
    variables: { category: categoryFilter }
  });

  const CATEGORIES = data?.categories || [];
  const providers = data?.providers || [];

  // Sync state when query params change
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // Derive filteredProviders without useEffect to avoid infinite loops
  const filteredProviders = useMemo(() => {
    let result = providers.filter(p => p.verificationStatus === 'VERIFIED');

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.businessName?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.user?.name?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [providers, searchTerm]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    router.replace(`/providers?${params.toString()}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim() === '') {
      params.delete('search');
    } else {
      params.set('search', value.trim());
    }
    router.replace(`/providers?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-2 py-10 sm:px-4 lg:px-4 space-y-8 flex-1">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Service Partners <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore and book top rated professionals. Background-verified and reviews-checked.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-lg bg-card border border-border p-1.5 rounded-xl shadow-xs flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search provider by name, skills..."
            className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm py-1.5"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Categories scroll filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            All Partners
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-card text-muted-foreground hover:text-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No partners found</h3>
          <p className="text-xs text-muted-foreground">Try selecting a different category or clearing search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProviders.map((p) => (
            <Card key={p.id} className="bg-card">
              <CardBody className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                <Avatar src={p.user?.avatar} alt={p.businessName} size="xl" className="rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5 leading-tight">
                      {p.businessName}
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
                    </h3>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {p.rating} ({p.reviewsCount} reviews)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-brand">{p.category?.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.bio || 'No biography available.'}</p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" /> NY Metropolitan Area
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded capitalize">
                        {p.category?.name}
                      </span>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Link href={`/providers/${p.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-semibold border-border">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/providers/${p.id}?book=true`} className="flex-1">
                      <Button variant="accent" size="sm" className="w-full font-semibold">
                        Book Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    }>
      <ProvidersContent />
    </Suspense>
  );
}
