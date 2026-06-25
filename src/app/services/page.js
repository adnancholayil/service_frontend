'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, Search, Filter, Sparkles, User, Calendar } from 'lucide-react';
import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { GET_SERVICES_PAGE_DATA } from '../../graphql/queries/services';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Sync category state when query param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync search state when query param changes
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // Fetch from GraphQL
  const { data, loading, error } = useQuery(GET_SERVICES_PAGE_DATA, {
    variables: { 
      category: selectedCategory === 'all' ? null : selectedCategory,
      search: searchTerm.trim() === '' ? null : searchTerm.trim()
    }
  });

  const categories = data?.categories || [];
  const filteredServices = data?.globalServices || [];

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    router.replace(`/services?${params.toString()}`);
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
    router.replace(`/services?${params.toString()}`);
  };



  return (
    <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 lg:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 flex-1">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Explore Services <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Select a category and choose from our catalog of vetted flat-rate services.
        </p>
      </div>

      {/* Filters: Search bar and category list */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {/* Search */}
        <div className="relative w-full sm:max-w-lg bg-card border border-border p-1.5 rounded-xl shadow-xs flex items-center gap-2">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search service catalog..."
            className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm py-1.5"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug || cat.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                selectedCategory === (cat.slug || cat.id)
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
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-base sm:text-lg text-muted-foreground">No services found</h3>
          <p className="text-xs text-muted-foreground">Try clearing search terms or picking another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((srv) => {
            const provider = srv.provider;
            return (
              <Card key={srv.id} className="flex flex-col bg-card relative">
                <CardBody className="p-4 sm:p-6 flex-1 flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-muted text-muted-foreground capitalize">
                      {srv.category?.name || 'Service'}
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-500 text-amber-500" /> {provider?.rating || '5.0'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 leading-tight">{srv.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">{srv.description}</p>
                  
                  <div className="mt-auto space-y-4">
                    {provider && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Offered By</p>
                        <div className="flex items-center gap-3">
                          <Avatar src={provider.user?.avatar} alt={provider.businessName} size="sm" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">{provider.businessName}</h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5">{provider.user?.name}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xl sm:text-2xl font-extrabold text-foreground">${srv.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={provider ? `/providers/${provider.id}` : '#'}>
                        <Button variant="outline" size="sm" className="h-10 text-xs px-3">View Partner</Button>
                      </Link>
                      <Link href={provider ? `/providers/${provider.id}?book=true&service=${srv.id}` : '#'}>
                        <Button size="sm" className="h-10 text-xs px-4">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
