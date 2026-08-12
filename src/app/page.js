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
  Clock, BadgeCheck, Wrench, Smartphone, Monitor, Home, Scissors, Briefcase, Camera,
  Fan, Snowflake, Brush, MonitorSpeaker, Cpu, WashingMachine
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
  if (name.includes('ac ') || name.includes('air')) return Fan;
  if (name.includes('room') || name.includes('home')) return Home;
  if (name.includes('wash') || name.includes('clean')) return Brush;
  if (name.includes('plumb')) return Wrench;
  if (name.includes('car ') || name.includes('auto')) return Car;
  if (name.includes('carpenter') || name.includes('wood')) return Hammer;
  if (name.includes('mobile') || name.includes('phone')) return Smartphone;
  if (name.includes('electronic') || name.includes('tv') || name.includes('computer')) return Cpu;
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
  { icon: BadgeCheck, label: 'Quality Guarantee', color: 'text-brand' },
  { icon: Star, label: '4.9 / 5 Rating', color: 'text-yellow-500' },
  { icon: Clock, label: 'Fast Response', color: 'text-violet-500' },
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
  const categories = data?.categories || [];
  const providers = data?.providers?.data || [];
  const publicReviews = data?.publicReviews || [];
  const publicBanners = data?.publicBanners || [];
  const parseDate = (dStr) => {
    if (!dStr) return null;
    return /^\d+$/.test(dStr) ? new Date(parseInt(dStr, 10)) : new Date(dStr);
  };

  const allServices = providers.flatMap(p =>
    (p.services || []).map(s => ({ ...s, providerRating: p.rating, providerName: p.businessName, providerId: p.id }))
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
    <div className="flex-1 flex flex-col overflow-hidden bg-background text-foreground">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-background text-foreground animate-fade-in">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />

        {/* Mesh Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-24 text-center">
          {/* Label Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border backdrop-blur-md text-foreground text-xs sm:text-sm font-semibold mb-6 sm:mb-8"
          >
            <Award className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            <span>Trusted by 50,000+ Happy Homeowners</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Quality Home Services, <br />
            <span className="bg-gradient-to-r from-brand via-sky-400 to-violet-400 bg-clip-text text-transparent">Instantly Booked.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
          >
            Connect with background-verified plumbers, electricians, cleaners & more — at upfront flat rates.
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl mx-auto bg-foreground/5 p-2 rounded-2xl border border-border backdrop-blur-lg"
          >
            <div className="flex-1 w-full flex items-center bg-card rounded-xl px-4 gap-3 h-14 min-h-[56px] shadow-sm">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 h-full w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-base outline-none ring-0 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              className="w-full sm:w-auto h-14 min-h-[56px] px-8 text-base font-bold rounded-xl shadow-lg shrink-0 cursor-pointer"
            >
              Find Services
            </Button>
          </motion.form>

          {/* Trust Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 sm:mt-12"
          >
            {TRUST.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border text-foreground/80 text-xs sm:text-sm font-semibold">
                <Icon className={"h-4 w-4 " + color} />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute -bottom-1 left-0 right-0 z-10 flex flex-col">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-14 block">
            <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" className="fill-background" />
          </svg>
          <div className="h-[2px] w-full bg-background mt-[-1px]" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2. PROMO BANNERS                                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      {publicBanners.length > 0 && (
        <section className="section-py bg-background relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection>
              <SectionLabel>Exclusive Deals</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8">Special Offers</h2>
            </AnimSection>

            <AnimSection delay={100}>
              <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
                {/* Scrollable Container */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {publicBanners.map((banner) => {
                    const Wrapper = banner.link ? Link : 'div';
                    const wrapperProps = banner.link ? { href: banner.link } : {};
                    return (
                      <Wrapper
                        key={banner.id}
                        {...wrapperProps}
                        className="relative h-[220px] sm:h-[300px] lg:h-[360px] w-full max-w-[90vw] sm:max-w-none sm:w-[80%] lg:w-[70%] shrink-0 snap-center overflow-hidden rounded-2xl group cursor-pointer border border-border/40 shadow-sm"
                      >
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x400/0EA5E9/white?text=Special+Offer'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent flex items-center">
                          <div className="p-6 sm:p-12 max-w-xl">
                            <span className="inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-bold text-white bg-brand rounded-full uppercase tracking-wider">
                              Promo Deal
                            </span>
                            <h3 className="text-white font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                              {banner.title}
                            </h3>
                            {banner.link && (
                              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-brand hover:text-white transition-all shadow-md">
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
      {/* 3. HOW IT WORKS                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="section-py bg-card border-y border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-8 sm:mb-16">
            <SectionLabel>Simple Process</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Book in 3 Easy Steps</h2>
          </AnimSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%)] right-[calc(16.66%)] h-0.5 bg-border z-0" />
            {HOW_STEPS.map((step, i) => (
              <AnimSection key={step.n} delay={i * 120} className="relative z-10 flex flex-col items-center text-center group">
                <div className="h-20 w-20 rounded-2xl bg-brand/5 border-2 border-brand/20 group-hover:border-brand/40 group-hover:bg-brand/10 group-hover:shadow-lg group-hover:shadow-brand/10 flex items-center justify-center mb-5 transition-all duration-300">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-brand to-sky-400 bg-clip-text text-transparent">{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">{step.desc}</p>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4. CATEGORIES                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-12 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-end justify-between mb-6 sm:mb-12">
              <div>
                <SectionLabel>Browse by Category</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">What Do You Need?</h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1.5 shrink-0 ml-4 group transition-colors cursor-pointer"
              >
                See All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimSection>

            {/* Scrollable Row for single row premium layout */}
            <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
              <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat, i) => {
                  const Icon = getCategoryIcon(cat);
                  return (
                    <AnimSection key={cat.id} delay={i * 40} className="shrink-0 snap-center">
                      <Link href={"/services?category=" + (cat.slug || cat.id)} className="block">
                        <div className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-card border border-border/50 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full text-center w-[120px] sm:w-[140px]">
                          <div className="w-14 h-14 rounded-2xl bg-brand/5 border border-brand/10 text-brand flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-brand transition-colors leading-tight line-clamp-2">
                            {cat.name}
                          </span>
                        </div>
                      </Link>
                    </AnimSection>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 5. POPULAR SERVICES                                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      {allServices.length > 0 && (
        <section className="section-py bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-center justify-between mb-6 sm:mb-12">
              <div>
                <SectionLabel>Most Booked</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Popular Services</h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/5 border border-brand/10 px-3 py-1.5 rounded-full ml-4">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </span>
            </AnimSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {allServices.slice(0, 6).map((srv, i) => (
                <AnimSection key={srv.id} delay={i * 70} className="h-full">
                  <Link href={"/providers/" + srv.providerId} className="block h-full">
                    <Card hoverable className="group h-full flex flex-col bg-background border border-border/50 hover:border-brand/30 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <CardBody className="flex flex-col p-6 h-full">
                        {/* Tag & Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-extrabold text-brand bg-brand/5 border border-brand/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {srv.category?.name || 'Service'}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {srv.providerRating || 5.0}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors leading-tight">
                          {srv.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                          {srv.description}
                        </p>

                        {/* Price footer */}
                        <div className="flex items-center justify-between pt-5 border-t border-border/40 mt-auto">
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Price starting from</p>
                            <p className="text-2xl font-extrabold text-foreground">₹{srv.price}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/5 border border-brand/10 px-4 py-2.5 rounded-xl group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all cursor-pointer">
                            Book Service <ArrowRight className="h-3.5 w-3.5" />
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
      {/* 6. TOP RATED PROVIDERS                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      {providers.length > 0 && (
        <section className="section-py bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-end justify-between mb-6 sm:mb-12">
              <div>
                <SectionLabel>Top Professionals</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Highly Rated Partners</h2>
              </div>
              <Link
                href="/providers"
                className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1.5 shrink-0 ml-4 cursor-pointer"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {providers.slice(0, 4).map((prov, i) => (
                <AnimSection key={prov.id} delay={i * 80} className="h-full">
                  <Card hoverable className="group h-full flex flex-col bg-card border border-border/50 hover:border-brand/30 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardBody className="flex flex-col p-6 h-full">
                      {/* Provider info card top */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar
                          src={prov.user?.avatar}
                          alt={prov.businessName}
                          size="md"
                          className="h-14 w-14 rounded-2xl border border-border/60 group-hover:ring-2 group-hover:ring-brand/20 transition-all shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-foreground leading-tight flex items-center gap-1.5 truncate">
                            <span className="truncate">{prov.businessName}</span>
                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          </h3>
                          <p className="text-xs font-bold text-brand mt-1 truncate">{prov.category?.name}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" /> {prov.rating}
                            </span>
                            <span className="text-[10px] text-muted-foreground">({prov.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1 line-clamp-3">
                        {prov.description || 'Verified local service provider equipped to handle your home and commercial service tasks.'}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 pt-5 border-t border-border/40 mt-auto">
                        <Link href={"/providers/" + prov.id} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full h-10 text-xs font-bold rounded-xl cursor-pointer">Profile</Button>
                        </Link>
                        <Link href={"/providers/" + prov.id + "?book=true"} className="flex-1">
                          <Button variant="primary" size="sm" className="w-full h-10 text-xs font-bold rounded-xl shadow-sm cursor-pointer">Book Now</Button>
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
            <AnimSection className="text-center mb-6 sm:mb-12">
              <SectionLabel>Real Reviews</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Loved by Our Customers</h2>
            </AnimSection>

            {/* Marquee loop container */}
            <div className="relative overflow-hidden w-full py-4">
              <div className="flex gap-6 animate-marquee w-max hover:[animation-play-state:paused]">
                {[...publicReviews, ...publicReviews].map((review, i) => (
                  <Card
                    key={review.id + "-" + i}
                    className="w-[280px] sm:w-[320px] shrink-0 flex flex-col bg-background border border-border/50 shadow-sm"
                  >
                    <CardBody className="p-5 sm:p-6 flex flex-col h-full">
                      <div className="flex items-center gap-1 text-yellow-500 mb-4">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={"h-3.5 w-3.5 " + (s <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-300 fill-zinc-300 dark:text-zinc-700 dark:fill-zinc-700')} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed flex-1 mb-6 line-clamp-4">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <div className="flex items-center gap-3.5 pt-4 border-t border-border/40 mt-auto">
                        <Avatar src={review.customer?.avatar} alt={review.customer?.name} size="sm" className="h-10 w-10 shrink-0 rounded-full border border-border" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{review.customer?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">{parseDate(review.createdAt)?.toLocaleDateString() || 'Recent'}</p>
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
      <section className="py-16 sm:py-24 bg-card border-y border-border text-foreground relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand/10 blur-[100px] pointer-events-none" />

        <AnimSection className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="text-brand text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4">Grow with Servio</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
            Grow your business with Servio
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Reach thousands of local customers, manage bookings effortlessly, and build your reputation with verified reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => dispatch(openAuthModal('register'))}
              variant="accent"
              className="font-bold h-12 px-8 text-base shadow-lg cursor-pointer"
            >
              Join as Service Partner
            </Button>
            <Link href="/services">
              <Button variant="ghost" className="text-foreground border-2 border-border hover:bg-muted h-12 px-8 text-base font-bold cursor-pointer">
                Browse Services
              </Button>
            </Link>
          </div>
        </AnimSection>
      </section>

    </div>
  );
}
