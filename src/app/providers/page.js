'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Star, Sparkles, CheckCircle2, SlidersHorizontal, MapPin, Compass, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { GET_PROVIDERS_PAGE_DATA } from '../../graphql/queries/provider';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { ProviderCardSkeleton } from '../../components/ui/Skeleton';

function ProvidersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const locationParam = searchParams.get('location') || '';
  const nearMeParam = searchParams.get('nearMe') === 'true';
  const latParam = searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null;
  const lngParam = searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null;
  const radiusParam = parseInt(searchParams.get('radius') || '50', 10);
  const ratingParam = parseFloat(searchParams.get('rating') || '0');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [locationText, setLocationText] = useState(locationParam);
  const [nearMe, setNearMe] = useState(nearMeParam);
  const [coordinates, setCoordinates] = useState({ lat: latParam, lng: lngParam });
  const [radius, setRadius] = useState(radiusParam);
  const [minRating, setMinRating] = useState(ratingParam);
  const [isLocating, setIsLocating] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#rating-dropdown-container')) {
        setIsRatingDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const categoryFilter = categoryParam === 'all' ? null : categoryParam;

  const limit = 12;
  const { data, loading, error } = useQuery(GET_PROVIDERS_PAGE_DATA, {
    variables: { 
      category: categoryFilter,
      longitude: nearMe && coordinates.lng ? coordinates.lng : null,
      latitude: nearMe && coordinates.lat ? coordinates.lat : null,
      maxDistance: nearMe ? parseFloat(radius) : null,
      page: currentPage,
      limit
    }
  });

  const CATEGORIES = data?.categories || [];
  const providers = data?.providers?.data || [];
  const totalPages = data?.providers?.totalPages || 1;

  // Sync state when query params change
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setLocationText(locationParam);
  }, [locationParam]);

  useEffect(() => {
    setNearMe(nearMeParam);
  }, [nearMeParam]);

  useEffect(() => {
    setCoordinates({ lat: latParam, lng: lngParam });
  }, [latParam, lngParam]);

  useEffect(() => {
    setRadius(radiusParam);
  }, [radiusParam]);

  useEffect(() => {
    setMinRating(ratingParam);
  }, [ratingParam]);

  // Derive filteredProviders without useEffect to avoid infinite loops
  const filteredProviders = useMemo(() => {
    let result = [...providers];

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

    if (locationText.trim() !== '') {
      const term = locationText.toLowerCase();
      result = result.filter(
        p => p.address?.toLowerCase().includes(term)
      );
    }

    if (minRating > 0) {
      result = result.filter(
        p => (p.rating || 0) >= minRating
      );
    }

    return result;
  }, [providers, searchTerm, locationText, minRating]);

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Service Partners <Sparkles className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore and book top rated professionals. Background-verified and reviews-checked.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(window.location.search);
    
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });
    
    params.set('page', '1');
    router.replace(`/providers?${params.toString()}`);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    updateFilters({ category: catId === 'all' ? '' : catId });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ search: value.trim() === '' ? '' : value.trim() });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationText(value);
    updateFilters({ location: value.trim() === '' ? '' : value.trim() });
  };

  const handleRatingChange = (e) => {
    const val = parseFloat(e.target.value);
    setMinRating(val);
    updateFilters({ rating: val === 0 ? '' : val.toString() });
  };

  const handleNearMeToggle = () => {
    if (!nearMe) {
      setIsLocating(true);
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        setIsLocating(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          setNearMe(true);
          setIsLocating(false);
          updateFilters({
            nearMe: 'true',
            lat: lat.toString(),
            lng: lng.toString(),
            radius: radius.toString()
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not access your location. Please check browser permissions or enter a location manually.');
          setIsLocating(false);
        }
      );
    } else {
      setNearMe(false);
      setCoordinates({ lat: null, lng: null });
      updateFilters({
        nearMe: null,
        lat: null,
        lng: null,
        radius: null
      });
    }
  };

  const handleRadiusChange = (e) => {
    const val = e.target.value;
    setRadius(val);
    updateFilters({ radius: val });
  };

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setLocationText('');
    setNearMe(false);
    setCoordinates({ lat: null, lng: null });
    setRadius(50);
    setMinRating(0);
    router.replace('/providers');
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/providers?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; 
    return d.toFixed(1);
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

      {/* Filters Dashboard */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Search Partners</label>
            <div className="relative w-full bg-muted/40 border border-border px-3 py-2 rounded-xl flex items-center gap-2 focus-within:border-brand transition-colors">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, skills..."
                className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm p-0"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Location</label>
            <div className="relative w-full bg-muted/40 border border-border px-3 py-2 rounded-xl flex items-center gap-2 focus-within:border-brand transition-colors">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter city or address..."
                className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm p-0"
                value={locationText}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1.5 relative" id="rating-dropdown-container">
            <label className="text-xs font-bold text-foreground">Rating</label>
            
            {/* Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
              className="relative w-full bg-muted/40 border border-border rounded-xl flex items-center justify-between pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand transition-colors h-[40px] text-left cursor-pointer"
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 absolute left-3 pointer-events-none" />
              <span>
                {minRating === 0 ? 'Any Rating' : `${minRating} ★ & above`}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200" style={{ transform: isRatingDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Custom Dropdown List */}
            {isRatingDropdownOpen && (
              <div className="absolute top-[68px] left-0 w-full bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {[
                  { value: 0, label: 'Any Rating' },
                  { value: 4.5, label: '4.5 ★ & above' },
                  { value: 4.0, label: '4.0 ★ & above' },
                  { value: 3.5, label: '3.5 ★ & above' },
                  { value: 3.0, label: '3.0 ★ & above' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setMinRating(opt.value);
                      updateFilters({ rating: opt.value === 0 ? '' : opt.value.toString() });
                      setIsRatingDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer flex items-center justify-between ${
                      minRating === opt.value ? 'text-brand bg-brand/5' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {minRating === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Near Me Toggle */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <div className="flex items-center justify-between bg-muted/40 border border-border px-3 py-2 rounded-xl h-[38px] sm:h-[40px]">
              <div className="flex items-center gap-2">
                <Compass className={`h-4 w-4 ${nearMe ? 'text-brand animate-pulse' : 'text-muted-foreground'}`} />
                <span className="text-xs font-semibold text-foreground">Find Partners Near Me</span>
              </div>
              <button
                type="button"
                onClick={handleNearMeToggle}
                disabled={isLocating}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  nearMe ? 'bg-brand' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    nearMe ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Categories scroll filter */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-foreground">Service Category</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-brand/10 hover:text-brand border-transparent'
              }`}
            >
              All Partners
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                  selectedCategory === cat.slug || selectedCategory === cat.id
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-brand/10 hover:text-brand border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters & Distance Slider */}
        {(nearMe || locationText || searchTerm || selectedCategory !== 'all' || minRating > 0) && (
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {nearMe && (
                <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-xl border border-border w-full sm:w-auto">
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Distance Radius:</span>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={radius}
                    onChange={handleRadiusChange}
                    className="w-32 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <span className="text-xs font-bold text-foreground whitespace-nowrap">{radius} km</span>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Keyword: {searchTerm}
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Category: {CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  </span>
                )}
                {locationText && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Location: {locationText}
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Rating: {minRating} ★ & above
                  </span>
                )}
                {nearMe && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Near Me ({radius}km)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1 px-2.5 py-1 bg-brand/5 hover:bg-brand/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl flex flex-col items-center justify-center space-y-3">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No partners matched all filters</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different category or clearing search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProviders.map((p) => (
            <Card key={p.id} className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md hover:border-brand/30 transition-all flex flex-col h-full">
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
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 whitespace-nowrap">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {p.rating}
                    </span>
                    {p.verificationStatus === 'VERIFIED' && (
                      <span className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wide whitespace-nowrap">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.description || 'No description available.'}</p>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium pb-2 border-b border-border/50" title={p.address}>
                  <MapPin className="h-3 w-3 text-indigo-500 shrink-0" />
                  <span className="truncate">{p.address || 'Location not specified'}</span>
                  {nearMe && coordinates.lat && p.location?.coordinates && (
                    <span className="font-semibold text-brand whitespace-nowrap">
                      • {getDistance(coordinates.lat, coordinates.lng, p.location.coordinates[1], p.location.coordinates[0])} km away
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 mt-auto">
                  <Link href={`/providers/${p.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full h-11 sm:h-10 text-[11px] sm:text-xs font-bold rounded-lg px-2">
                      Profile
                    </Button>
                  </Link>
                  <Link href={`/providers/${p.id}?book=true`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full h-11 sm:h-10 text-[11px] sm:text-xs font-bold rounded-lg px-2">
                      Book
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 pb-4">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
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
