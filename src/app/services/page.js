'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, Search, Filter, Sparkles, User, Calendar } from 'lucide-react';
import Link from 'next/link';

import { CATEGORIES, MOCK_SERVICES, MOCK_PROVIDERS } from '../../constants/mockData';
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
  const [filteredServices, setFilteredServices] = useState([]);

  // Sync category state when query param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync search state when query param changes
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    let result = MOCK_SERVICES;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(srv => srv.category === selectedCategory);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        srv =>
          srv.title.toLowerCase().includes(term) ||
          srv.description.toLowerCase().includes(term)
      );
    }

    setFilteredServices(result);
  }, [selectedCategory, searchTerm]);

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

  // Get matching providers for a service
  const getServiceProviders = (serviceId) => {
    return MOCK_PROVIDERS.filter(p => p.services.includes(serviceId) && p.status === 'verified');
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
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
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-base sm:text-lg text-muted-foreground">No services found</h3>
          <p className="text-xs text-muted-foreground">Try clearing search terms or picking another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((srv) => {
            const matchingProviders = getServiceProviders(srv.id);
            return (
              <Card key={srv.id} className="flex flex-col bg-card relative">
                <CardBody className="p-4 sm:p-6 flex-1 flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                        {srv.category.replace('-', ' ')}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-foreground mt-1 sm:mt-2 leading-snug">{srv.title}</h3>
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-brand shrink-0">${srv.price}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{srv.description}</p>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold text-muted-foreground py-2 border-y border-border">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" /> Dur: {srv.duration}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" /> {srv.rating} rating</span>
                  </div>

                  {/* Matching Providers */}
                  <div className="pt-2">
                    <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Service Providers:</p>
                    {matchingProviders.length === 0 ? (
                      <p className="text-[10px] sm:text-xs text-muted-foreground italic">No providers currently available for this service</p>
                    ) : (
                      <div className="space-y-2">
                        {matchingProviders.map((p) => (
                          <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 border border-brand/10 hover:border-brand/40 bg-brand/5 dark:bg-brand/10 hover:bg-brand/10 dark:hover:bg-brand/20 rounded-xl transition-all gap-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar src={p.avatar} alt={p.name} size="sm" />
                              <div>
                                <p className="text-[11px] sm:text-xs font-bold text-foreground">{p.name}</p>
                                <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold text-amber-500">
                                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-500 text-amber-500" /> {p.rating}
                                </span>
                              </div>
                            </div>
                            <Link href={`/providers/${p.id}?service=${srv.id}&book=true`} className="w-full sm:w-auto">
                              <Button size="sm" variant="outline" className="text-[10px] sm:text-xs py-1 px-3 rounded-lg border-border w-full sm:w-auto mt-1 sm:mt-0">
                                Book Partner
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
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
