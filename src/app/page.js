'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Sparkles,
  BookOpen,
  Heart,
  Car,
  Wind,
  Leaf,
  Search,
  Star,
  MapPin,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';

import { useQuery } from '@apollo/client/react';
import { GET_HOME_DATA } from '../graphql/queries/home';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

// Map icon string names to components
const iconMap = {
  Zap: Zap,
  Droplet: Droplet,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  Sparkles: Sparkles,
  BookOpen: BookOpen,
  Heart: Heart,
  Car: Car,
  Wind: Wind,
  Leaf: Leaf,
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error } = useQuery(GET_HOME_DATA);

  const categories = data?.categories || [];
  const providers = data?.providers || [];
  
  // Extract all services from providers to show in "Popular Services"
  const allServices = providers.flatMap(p => 
    p.services.map(s => ({ ...s, providerRating: p.rating }))
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ================================================= */}
      {/* 1. PROFESSIONAL HERO SECTION WITH BACKGROUND IMAGE*/}
      {/* ================================================= */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop" 
            alt="Professional Home Service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-4 py-8 sm:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Column: Typography and Search Box */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-sm font-semibold shadow-sm">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" /> Premium Local Services at Your Fingertips
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
                  Quality services. <br className="hidden sm:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-hover to-indigo-400">
                    Exceptional results.
                  </span>
                </h1>
                
                <p className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium">
                  Book certified plumbers, AC mechanics, house deep cleaners, and experts at upfront flat rates. Zero negotiations. Zero stress.
                </p>
              </motion.div>

              {/* Search form box */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSearchSubmit}
                className="p-1.5 sm:p-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full max-w-2xl"
              >
                <div className="w-full flex-1 flex items-center bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-0 h-10 sm:h-14">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    className="w-full bg-transparent border-none text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 text-xs sm:text-base ml-2 sm:ml-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto h-10 sm:h-14 rounded-lg sm:rounded-xl shrink-0 font-bold px-6 sm:px-8 shadow-md text-xs sm:text-base">
                  Find Service
                </Button>
              </motion.form>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 pt-2 sm:pt-4 text-[10px] sm:text-sm font-semibold text-zinc-300"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-emerald-400" />
                  <span>100% Background Verified</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-brand" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Star className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-400" />
                  <span>4.9/5 Average Rating</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating Stats/Card (Optional, adds professional flair) */}
            <div className="lg:col-span-4 hidden lg:flex justify-end relative h-full items-center">
               <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 20, delay: 0.5 }}
                className="w-[280px] p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-accent" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">10k+</h4>
                    <p className="text-zinc-300 text-xs font-medium">Jobs Completed</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                     <span className="text-xs text-zinc-300">Customer Satisfaction</span>
                     <span className="text-sm font-bold text-white">99%</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                     <span className="text-xs text-zinc-300">Verified Providers</span>
                     <span className="text-sm font-bold text-white">500+</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 2. CATEGORIES CAROUSEL GRID                      */}
      {/* ================================================= */}
      <section className="py-10 sm:py-16 border-t border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-4">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="text-lg sm:text-3xl font-bold text-foreground">Explore Categories</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Browse our top rated home service catalogues</p>
            </div>
            <Link href="/services" className="text-xs sm:text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1 shrink-0 ml-4">
              See All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4"
          >
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <motion.div key={cat.id} variants={itemVariants}>
                  <Link href={`/services?category=${cat.id}`}>
                    <div className="group flex flex-col items-center justify-center p-4 sm:p-6 border border-border rounded-xl sm:rounded-2xl hover:border-brand/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all text-center h-full cursor-pointer hover:shadow-md">
                      <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </span>
                      <h3 className="font-semibold text-foreground mt-3 sm:mt-4 text-xs sm:text-sm group-hover:text-brand transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 3. POPULAR SERVICES                              */}
      {/* ================================================= */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-4">
          <div className="mb-6 sm:mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-3xl font-bold text-foreground">Popular Services</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Book highly demanded services</p>
            </div>
            <span className="inline-flex shrink-0 ml-4 items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-500/10 text-amber-600 rounded-full">
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Trending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {allServices.slice(0, 3).map((srv) => (
              <Card key={srv.id} hoverable className="flex flex-col h-full bg-card rounded-xl sm:rounded-2xl">
                <CardBody className="flex-1 flex flex-col p-4 sm:p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {srv.category?.name || 'Service'}
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-500 text-amber-500" /> {srv.providerRating || 5.0}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{srv.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">{srv.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Starting from</p>
                      <p className="text-lg sm:text-xl font-extrabold text-foreground">${srv.price}</p>
                    </div>
                    <Link href={`/services?category=${srv.category?.name}`}>
                      <Button variant="outline" size="sm" className="text-xs h-9 px-4">Book</Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 4. TOP RATED PROVIDERS                            */}
      {/* ================================================= */}
      <section className="py-10 sm:py-16 border-t border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-4">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-3xl font-bold text-foreground">Top-Rated Partners</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Verified experts with outstanding reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {providers.slice(0, 4).map((prov) => (
              <div key={prov.id} className="p-4 sm:p-6 border border-border bg-card hover:border-brand/30 hover:shadow-md transition-all rounded-xl sm:rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <Avatar src={prov.user?.avatar} alt={prov.businessName} size="xl" className="shrink-0 rounded-xl sm:rounded-2xl h-14 w-14 sm:h-24 sm:w-24" />
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight flex items-center gap-1.5">
                      {prov.businessName}
                      <CheckCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-500 fill-emerald-50" />
                    </h3>
                    <span className="flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-500 text-amber-500" /> {prov.rating} ({prov.reviewsCount})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-brand leading-tight">{prov.user?.name}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-tight pt-0.5">{prov.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-2">
                    {prov.category?.name && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                        {prov.category.name}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 sm:pt-4 flex items-center gap-3">
                    <Link href={`/providers/${prov.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs h-9">View Profile</Button>
                    </Link>
                    <Link href={`/providers/${prov.id}?book=true`} className="flex-1">
                      <Button variant="accent" size="sm" className="w-full text-xs h-9">Book Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 5. TESTIMONIALS                                  */}
      {/* ================================================= */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground">Loved by thousands</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">See what our home service users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 border border-border bg-card rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic leading-snug">
                &ldquo;Booking a cleaner through ServiceHub was incredibly straightforward. The provider was right on time and did an exceptional job deep cleaning my kitchen!&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Robert Downey" size="sm" className="h-8 w-8" />
                <div>
                  <p className="text-xs font-bold leading-tight">Robert Downey</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">New York, NY</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 border border-border bg-card rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic leading-snug">
                &ldquo;The AC servicing is top-notch. Flat rates are clear upfront, so I didn&apos;t have to negotiate or argue. Alex Mercer was professional, polite, and quick!&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Emily Watson" size="sm" className="h-8 w-8" />
                <div>
                  <p className="text-xs font-bold leading-tight">Emily Watson</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Brooklyn, NY</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 border border-border bg-card rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4.5 w-4.5 text-zinc-300 fill-zinc-300 dark:text-zinc-700 dark:fill-zinc-700" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic leading-snug">
                &ldquo;Excellent interface and high-quality profiles. The custom calendar availability was very convenient to plan bookings around my office schedule.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Marcus Aurelius" size="sm" className="h-8 w-8" />
                <div>
                  <p className="text-xs font-bold leading-tight">Marcus Aurelius</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Queens, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. CTA SECTION                                   */}
      {/* ================================================= */}
      <section className="py-12 sm:py-20 border-t border-border bg-gradient-to-t from-indigo-50/40 via-card to-card dark:from-indigo-950/15 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-4xl font-extrabold text-foreground">
            Are you a service professional?
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Partner with ServiceHub to grow your customer base, manage appointments via custom calendars, and receive direct digital payouts weekly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link href="/register?role=provider" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-10 sm:h-12">Join as Service Partner</Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-12">Find Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
