'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, Search, Filter, Sparkles, User, Calendar, MapPin, Compass, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { GET_SERVICES_PAGE_DATA } from '../../graphql/queries/services';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { CardSkeleton } from '../../components/ui/Skeleton';

function ServicesContent() {
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

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [locationText, setLocationText] = useState(locationParam);
  const [nearMe, setNearMe] = useState(nearMeParam);
  const [coordinates, setCoordinates] = useState({ lat: latParam, lng: lngParam });
  const [radius, setRadius] = useState(radiusParam);
  const [isLocating, setIsLocating] = useState(false);

  // Sync category state when query param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Sync search state when query param changes
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // Sync page state when query param changes
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  // Sync location states when query params change
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

  // Fetch from GraphQL
  const limit = 12;
  const { data, loading, error } = useQuery(GET_SERVICES_PAGE_DATA, {
    variables: { 
      category: selectedCategory === 'all' ? null : selectedCategory,
      search: searchTerm.trim() === '' ? null : searchTerm.trim(),
      longitude: nearMe && coordinates.lng ? coordinates.lng : null,
      latitude: nearMe && coordinates.lat ? coordinates.lat : null,
      maxDistance: nearMe ? parseFloat(radius) : null,
      locationText: locationText.trim() === '' ? null : locationText.trim(),
      page: currentPage,
      limit
    }
  });

  const categories = data?.categories || [];
  const filteredServices = data?.globalServices?.data || [];
  const totalPages = data?.globalServices?.totalPages || 1;

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(window.location.search);
    
    // Merge new filters
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });
    
    params.set('page', '1');
    router.replace(`/services?${params.toString()}`);
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
    router.replace('/services');
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/services?${params.toString()}`);
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
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 flex-1">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Explore Services <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Select a category and choose from our catalog of vetted flat-rate services.
        </p>
      </div>

      {/* Filters Dashboard */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Search Catalog</label>
            <div className="relative w-full bg-muted/40 border border-border px-3 py-2 rounded-xl flex items-center gap-2 focus-within:border-brand transition-colors">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
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

          {/* Near Me Toggle */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <div className="flex items-center justify-between bg-muted/40 border border-border px-3 py-2 rounded-xl h-[38px] sm:h-[40px]">
              <div className="flex items-center gap-2">
                <Compass className={`h-4 w-4 ${nearMe ? 'text-brand animate-pulse' : 'text-muted-foreground'}`} />
                <span className="text-xs font-semibold text-foreground">Find Services Near Me</span>
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

        {/* Categories Horizontal Scroll */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-foreground">Service Type</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-brand/10 hover:text-brand border-transparent'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug || cat.id)}
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

        {/* Active Filters, Distance Slider & Clear All button */}
        {(nearMe || locationText || searchTerm || selectedCategory !== 'all') && (
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
                    Category: {categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}
                  </span>
                )}
                {locationText && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                    Location: {locationText}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-base sm:text-lg text-muted-foreground">No services matched all filters</h3>
          <p className="text-xs text-muted-foreground">Try clearing search terms or picking another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((srv) => {
            const provider = srv.provider;
            return (
              <Card key={srv.id} className="flex flex-col bg-card relative h-full">
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
                            {provider.address && (
                              <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1 mt-1.5" title={provider.address}>
                                <MapPin className="h-3 w-3 shrink-0 text-brand" />
                                <span className="truncate">{provider.address}</span>
                                {nearMe && coordinates.lat && provider.location?.coordinates && (
                                  <span className="font-semibold text-brand whitespace-nowrap">
                                    • {getDistance(coordinates.lat, coordinates.lng, provider.location.coordinates[1], provider.location.coordinates[0])} km away
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xl sm:text-2xl font-extrabold text-foreground">₹{srv.price}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={provider ? `/providers/${provider.id}` : '#'} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full h-11 sm:h-10 text-xs px-2 font-bold">View Partner</Button>
                      </Link>
                      <Link href={provider ? `/providers/${provider.id}?book=true&service=${srv.id}` : '#'} className="flex-1">
                        <Button size="sm" className="w-full h-11 sm:h-10 text-xs px-2 font-bold">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
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
