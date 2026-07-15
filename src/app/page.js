'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Zap, Droplet, Hammer, Paintbrush, Sparkles, BookOpen,
  Heart, Car, Wind, Leaf, Search, Star, MapPin, CheckCircle,
  ArrowRight, TrendingUp, Award, Users, ShieldCheck, Check,
  Clock, BadgeCheck, Wrench, Smartphone, Monitor, Home, Scissors, Briefcase, Camera
} from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_HOME_DATA } from '../graphql/queries/home';
import { openAuthModal } from '../store/slices/appSlice';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

const iconMap = {
  Zap, Droplet, Hammer, Paintbrush, Sparkles, BookOpen,
  Heart, Car, Wind, Leaf, Wrench, Smartphone, Monitor, Home,
  Scissors, Briefcase, Camera
};

const getCategoryIcon = (cat) => {
  if (cat.icon && iconMap[cat.icon]) return iconMap[cat.icon];
  
  const name = cat.name?.toLowerCase() || '';
  if (name.includes('ac ') || name.includes('air')) return Wind;
  if (name.includes('wash') || name.includes('clean')) return Droplet;
  if (name.includes('plumb')) return Wrench;
  if (name.includes('car ') || name.includes('auto')) return Car;
  if (name.includes('carpenter') || name.includes('wood')) return Hammer;
  if (name.includes('mobile') || name.includes('phone')) return Smartphone;
  if (name.includes('electronic') || name.includes('tv') || name.includes('computer')) return Monitor;
  if (name.includes('room') || name.includes('home')) return Home;
  if (name.includes('salon') || name.includes('hair') || name.includes('beauty')) return Scissors;
  if (name.includes('photo') || name.includes('camera')) return Camera;
  if (name.includes('company') || name.includes('business')) return Briefcase;
  
  return Sparkles; // fallback
};

/* ─── Reusable Animated Section Wrapper ─────────────────── */
function AnimSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Immediately check if already visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      setTimeout(() => setVisible(true), delay);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

/* ─── Section Label ──────────────────────────────────────── */
function SectionLabel({ children }) {
  return <p className="section-label mb-2">{children}</p>;
}

/* ─── Trust badges ───────────────────────────────────────── */
const TRUST = [
  { icon: ShieldCheck, label: '100% Verified', color: 'text-emerald-500' },
  { icon: BadgeCheck,  label: 'Quality Guarantee', color: 'text-brand' },
  { icon: Star,        label: '4.9 / 5 Rating', color: 'text-yellow-500' },
  { icon: Clock,       label: 'Fast Response', color: 'text-violet-500' },
];

/* ─── HOW IT WORKS steps ─────────────────────────────────── */
const HOW_STEPS = [
  { n: '01', title: 'Browse & Search', desc: 'Find the exact service or professional you need.' },
  { n: '02', title: 'Book in Seconds', desc: 'Pick a time slot that works for you with a few taps.' },
  { n: '03', title: 'Get It Done', desc: 'A verified professional arrives and delivers quality work.' },
];

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const bannerRef = useRef(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  const { data, loading } = useQuery(GET_HOME_DATA);
  const categories   = data?.categories    || [];
  const providers    = data?.providers     || [];
  const publicReviews = data?.publicReviews || [];
  const publicBanners = data?.publicBanners || [];
  const allServices  = providers.flatMap(p =>
    p.services.map(s => ({ ...s, providerRating: p.rating, providerName: p.businessName, providerId: p.id }))
  );

  // Auto-play banners
  useEffect(() => {
    if (publicBanners.length < 2) return;
    const timer = setInterval(() => {
      setBannerIdx(i => (i + 1) % publicBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [publicBanners.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading services…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop"
            alt="Professional service background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          {/* subtle brand tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-900/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          
          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold mb-6"
          >
            <Award className="h-3.5 w-3.5 text-yellow-400" />
            Trusted by 50,000+ Homeowners
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5"
          >
            Quality Home Services,{' '}
            <span className="gradient-text">Instantly Booked.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8"
          >
            Connect with background-verified plumbers, electricians, cleaners & more — at upfront flat rates.
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
          >
            <div className="flex-1 w-full flex items-center bg-white rounded-2xl px-4 gap-3 h-14 shadow-xl shadow-black/20">
              <Search className="h-5 w-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-400 text-sm sm:text-base focus:outline-none border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-2xl shadow-xl shadow-accent/30 shrink-0"
            >
              Find Services
            </Button>
          </motion.form>

          {/* Trust chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-8"
          >
            {TRUST.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm font-semibold">
                <Icon className={`h-4 w-4 ${color}`} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-14">
            <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. PROMO BANNERS                                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      {publicBanners.length > 0 && (
        <section className="section-py bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection>
              <SectionLabel>Exclusive Deals</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Special Offers</h2>
            </AnimSection>

            <AnimSection delay={100}>
              <div className="relative w-full">
                {/* Scrollable Container */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {publicBanners.map((banner, idx) => {
                    const Wrapper = banner.link ? Link : 'div';
                    const wrapperProps = banner.link ? { href: banner.link } : {};
                    return (
                      <Wrapper
                        key={banner.id}
                        {...wrapperProps}
                        className="relative h-[220px] sm:h-[280px] lg:h-[340px] w-full max-w-[90vw] sm:max-w-none sm:w-[80%] lg:w-[70%] shrink-0 snap-center rounded-3xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x400/0EA5E9/white?text=Special+Offer'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                          <div className="p-6 sm:p-10 max-w-xl">
                            <span className="inline-block px-3 py-1 mb-3 text-[10px] sm:text-xs font-bold text-white bg-brand rounded-full uppercase tracking-wider">
                              Promo
                            </span>
                            <h3 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4">
                              {banner.title}
                            </h3>
                            {banner.link && (
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 font-bold text-xs sm:text-sm rounded-full hover:bg-brand hover:text-white transition-all shadow-lg">
                                Claim Offer <ArrowRight className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            </AnimSection>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 3. CATEGORIES                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="section-py bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <SectionLabel>Browse by Category</SectionLabel>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What do you need?</h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1.5 shrink-0 ml-4"
              >
                See All <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimSection>

            {/* All devices: horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat, i) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <AnimSection key={cat.id} delay={i * 40} className="shrink-0">
                    <Link href={`/services?category=${cat.id}`} className="block">
                      <div className="group flex flex-col items-center gap-2.5 p-4 sm:p-5 min-w-[90px] sm:min-w-[110px] lg:min-w-[120px] border border-border rounded-3xl hover:border-brand/40 hover:bg-brand/5 transition-all cursor-pointer text-center h-full">
                        <span className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-muted group-hover:bg-brand/10 group-hover:text-brand text-muted-foreground transition-all shadow-sm">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-brand transition-colors whitespace-nowrap lg:whitespace-normal leading-tight">
                          {cat.name}
                        </span>
                      </div>
                    </Link>
                  </AnimSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. POPULAR SERVICES                                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      {allServices.length > 0 && (
        <section className="section-py bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <SectionLabel>Most Booked</SectionLabel>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Services</h2>
              </div>
              <span className="chip chip-brand ml-4">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </span>
            </AnimSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {allServices.slice(0, 6).map((srv, i) => (
                <AnimSection key={srv.id} delay={i * 70} className="h-full">
                  <Link href={`/providers/${srv.providerId}`} className="block h-full">
                    <Card hoverable className="group h-full">
                      <CardBody className="flex flex-col p-5 sm:p-6 h-full">
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="chip chip-muted text-[11px] font-bold">
                            {srv.category?.name || 'Service'}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 fill-yellow-500" /> {srv.providerRating || 5.0}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors leading-tight">
                          {srv.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                          {srv.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Starting from</p>
                            <p className="text-xl font-extrabold text-foreground">₹{srv.price}</p>
                          </div>
                          <span className="text-xs font-bold text-brand bg-brand/10 px-4 py-2 rounded-full group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                            Book →
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. HOW IT WORKS                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="section-py bg-card border-t border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-10 sm:mb-14">
            <SectionLabel>Simple Process</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Book in 3 easy steps</h2>
          </AnimSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-9 left-[calc(16.66%)] right-[calc(16.66%)] h-px bg-border z-0" />
            {HOW_STEPS.map((step, i) => (
              <AnimSection key={step.n} delay={i * 120} className="relative z-10 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-brand/10 border-2 border-brand/20 flex items-center justify-center mb-4 shadow-md shadow-brand/10">
                  <span className="text-2xl font-extrabold gradient-text">{step.n}</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 6. TOP RATED PROVIDERS                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      {providers.length > 0 && (
        <section className="section-py bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <SectionLabel>Top Professionals</SectionLabel>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Highly Rated Partners</h2>
              </div>
              <Link
                href="/providers"
                className="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1.5 shrink-0 ml-4"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {providers.slice(0, 4).map((prov, i) => (
                <AnimSection key={prov.id} delay={i * 80} className="h-full">
                  <Card hoverable className="group h-full">
                    <CardBody className="flex flex-col p-5 h-full">
                      {/* Header with Avatar */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar
                          src={prov.user?.avatar}
                          alt={prov.businessName}
                          size="md"
                          className="h-12 w-12 rounded-full border border-border group-hover:ring-2 group-hover:ring-brand/30 transition-all shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight flex items-center gap-1.5 truncate">
                            <span className="truncate">{prov.businessName}</span>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          </h3>
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <p className="text-xs font-semibold text-brand truncate">{prov.category?.name}</p>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full shrink-0">
                              <Star className="h-2.5 w-2.5 fill-yellow-500" /> {prov.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                        {prov.description || 'Professional local service provider ready to assist you.'}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-border/30 mt-auto">
                        <Link href={`/providers/${prov.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">Profile</Button>
                        </Link>
                        <Link href={`/providers/${prov.id}?book=true`} className="flex-1">
                          <Button variant="primary" size="sm" className="w-full text-xs shadow-sm">Book</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 7. TESTIMONIALS                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      {publicReviews.length > 0 && (
        <section className="section-py bg-card border-t border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="text-center mb-8 sm:mb-10">
              <SectionLabel>Real Reviews</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Loved by our customers</h2>
            </AnimSection>

            {/* Marquee loop container */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="flex gap-4 sm:gap-6 animate-marquee w-max hover:[animation-play-state:paused]">
                {[...publicReviews, ...publicReviews].map((review, i) => (
                  <Card
                    key={`${review.id}-${i}`}
                    className="w-[260px] sm:w-[280px] shrink-0 flex flex-col cursor-grab active:cursor-grabbing"
                  >
                    <CardBody className="p-4 sm:p-5 flex flex-col h-full">
                      <div className="flex items-center gap-1 text-yellow-500 mb-3">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${s <= review.rating ? 'fill-yellow-500' : 'text-zinc-300 fill-zinc-300 dark:text-zinc-700 dark:fill-zinc-700'}`} />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed flex-1 mb-5 line-clamp-4">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-3 border-t border-border/30 mt-auto">
                        <Avatar src={review.customer?.avatar} alt={review.customer?.name} size="sm" className="h-8 w-8 shrink-0 rounded-full border border-border" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{review.customer?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{new Date(Number(review.createdAt)).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 8. CTA — Join as Provider                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="section-py bg-gradient-to-br from-brand to-sky-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />
        
        <AnimSection className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-3">For Service Professionals</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Grow your business with ServiceHub
          </h2>
          <p className="text-white/80 text-base max-w-lg mx-auto mb-8">
            Reach thousands of local customers, manage bookings effortlessly, and build your reputation with verified reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => dispatch(openAuthModal('register'))}
              variant="secondary"
              className="font-bold h-12 px-8 text-brand shadow-xl"
            >
              Join as Service Partner
            </Button>
            <Link href="/services">
              <Button variant="ghost" className="text-white border-2 border-white/30 hover:bg-white/10 h-12 px-8 font-bold">
                Browse Services
              </Button>
            </Link>
          </div>
        </AnimSection>
      </section>

    </div>
  );
}
