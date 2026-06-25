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

import { CATEGORIES, MOCK_SERVICES, MOCK_PROVIDERS } from '../constants/mockData';
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ================================================= */}
      {/* 1. PROFESSIONAL HERO SECTION WITH BACKGROUND IMAGE*/}
      {/* ================================================= */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop" 
            alt="Professional Home Service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-2 sm:px-4 lg:px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Typography and Search Box */}
            <div className="lg:col-span-8 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-sm">
                  <Award className="h-4 w-4 text-amber-400" /> Premium Local Services at Your Fingertips
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
                  Quality services. <br className="hidden sm:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-hover to-indigo-400">
                    Exceptional results.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium">
                  Book certified plumbers, AC mechanics, house deep cleaners, and experts at upfront flat rates. Zero negotiations. Zero stress.
                </p>
              </motion.div>

              {/* Search form box */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSearchSubmit}
                className="p-2 sm:p-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl"
              >
                <div className="w-full flex-1 flex items-center bg-white rounded-xl px-4 py-3 sm:py-0 h-12 sm:h-14">
                  <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    className="w-full bg-transparent border-none text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 text-sm sm:text-base ml-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto h-12 sm:h-14 rounded-xl shrink-0 font-bold px-8 shadow-md">
                  Find Service
                </Button>
              </motion.form>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 text-xs sm:text-sm font-semibold text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>100% Background Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
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
      <section className="py-16 border-t border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Explore Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">Browse our top rated home service catalogues</p>
            </div>
            <Link href="/services" className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1">
              See All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-4"
          >
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <motion.div key={cat.id} variants={itemVariants}>
                  <Link href={`/services?category=${cat.id}`}>
                    <div className="group flex flex-col items-center justify-center p-6 border border-border rounded-2xl hover:border-brand/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all text-center h-full cursor-pointer hover:shadow-md">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="font-semibold text-foreground mt-4 text-sm group-hover:text-brand transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
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
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Services</h2>
              <p className="text-sm text-muted-foreground mt-1">Book highly demanded services with flat-rate pricing</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full">
              <TrendingUp className="h-3 w-3" /> Trending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_SERVICES.slice(0, 3).map((srv) => (
              <Card key={srv.id} hoverable className="flex flex-col h-full bg-card">
                <CardBody className="flex-1 flex flex-col p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {srv.category.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {srv.rating}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{srv.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">{srv.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-xl font-extrabold text-foreground">${srv.price}</p>
                    </div>
                    <Link href={`/services?category=${srv.category}`}>
                      <Button variant="outline" size="sm">Book Service</Button>
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
      <section className="py-16 border-t border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-4">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Top-Rated Service Partners</h2>
            <p className="text-sm text-muted-foreground mt-1">Verified experts with outstanding reviews and high ratings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PROVIDERS.filter(p => p.status === 'verified').map((prov) => (
              <div key={prov.id} className="p-6 border border-border bg-card hover:border-brand/30 hover:shadow-md transition-all rounded-2xl flex flex-col sm:flex-row gap-6 items-start">
                <Avatar src={prov.avatar} alt={prov.name} size="xl" className="shrink-0 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground leading-tight flex items-center gap-1.5">
                      {prov.name}
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
                    </h3>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {prov.rating} ({prov.reviewsCount} reviews)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-brand">{prov.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{prov.about}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {prov.categories.map((catId) => (
                      <span key={catId} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                        {catId.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Link href={`/providers/${prov.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                    </Link>
                    <Link href={`/providers/${prov.id}?book=true`} className="flex-1">
                      <Button variant="accent" size="sm" className="w-full">Book Now</Button>
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
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Loved by thousands of customers</h2>
            <p className="text-sm text-muted-foreground mt-2">See what our home service users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;Booking a cleaner through ServiceHub was incredibly straightforward. The provider was right on time and did an exceptional job deep cleaning my kitchen!&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Robert Downey" size="sm" />
                <div>
                  <p className="text-xs font-bold">Robert Downey</p>
                  <p className="text-[10px] text-muted-foreground">New York, NY</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;The AC servicing is top-notch. Flat rates are clear upfront, so I didn&apos;t have to negotiate or argue. Alex Mercer was professional, polite, and quick!&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Emily Watson" size="sm" />
                <div>
                  <p className="text-xs font-bold">Emily Watson</p>
                  <p className="text-[10px] text-muted-foreground">Brooklyn, NY</p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4 w-4 fill-amber-500 text-amber-500" /><Star className="h-4.5 w-4.5 text-zinc-300 fill-zinc-300 dark:text-zinc-700 dark:fill-zinc-700" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;Excellent interface and high-quality profiles. The custom calendar availability was very convenient to plan bookings around my office schedule.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Avatar alt="Marcus Aurelius" size="sm" />
                <div>
                  <p className="text-xs font-bold">Marcus Aurelius</p>
                  <p className="text-[10px] text-muted-foreground">Queens, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. CTA SECTION                                   */}
      {/* ================================================= */}
      <section className="py-20 border-t border-border bg-gradient-to-t from-indigo-50/40 via-card to-card dark:from-indigo-950/15 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Are you a service professional?
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Partner with ServiceHub to grow your customer base, manage appointments via custom calendars, and receive direct digital payouts weekly.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register?role=provider">
              <Button size="lg">Join as Service Partner</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">Find Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
