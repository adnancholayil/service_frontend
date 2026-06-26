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
    let result = [...providers]; // Show all providers during development

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
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
        <div className="text-center py-20 bg-card border border-border rounded-xl flex flex-col items-center justify-center space-y-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No partners found</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different category or clearing search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProviders.map((p) => (
            <Card key={p.id} className="bg-card border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md hover:border-brand/30 transition-all flex flex-col">
              <CardBody className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar src={p.user?.avatar} alt={p.businessName} size="lg" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-border shrink-0" />
                    <div className="space-y-0.5">
                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight line-clamp-1" title={p.businessName}>
                        {p.businessName}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-semibold text-brand line-clamp-1">{p.category?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {p.rating}
                    </span>
                    {p.verificationStatus === 'VERIFIED' && (
                      <span className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wide whitespace-nowrap">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.description || 'No description available.'}</p>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium pb-2 border-b border-border/50">
                  <MapPin className="h-3 w-3 text-indigo-500" /> NY Metropolitan Area
                </div>

                <div className="flex items-center gap-2 pt-1 mt-auto">
                  <Link href={`/providers/${p.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold border-border rounded-lg py-1 h-8">
                      Profile
                    </Button>
                  </Link>
                  <Link href={`/providers/${p.id}?book=true`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full text-[11px] font-semibold rounded-lg py-1 h-8">
                      Book
                    </Button>
                  </Link>
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
