'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'next-themes';
import {
  Sun, Moon, Bell, MessageSquare, User, LogOut, Settings,
  Shield, Briefcase, Calendar, Home, Menu, X, BarChart3, Star, CalendarRange,
  Users, LayoutDashboard, Wrench, Search, ChevronDown, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import { logout } from '../../store/slices/authSlice';
import { toggleNotificationDrawer, openAuthModal, openLogoutModal } from '../../store/slices/appSlice';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    const authQuery = searchParams.get('auth');
    if (authQuery === 'login') dispatch(openAuthModal('login'));
    else if (authQuery === 'register') dispatch(openAuthModal('register'));
  }, [isAuthenticated, searchParams, dispatch]);

  // Scroll-aware navbar transparency
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    dispatch(openLogoutModal());
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Hide desktop nav on admin/provider dashboard pages, but keep mobile nav
  const isDashboard = pathname && (pathname.startsWith('/admin') || pathname === '/provider' || pathname.startsWith('/provider/'));

  // ─── Desktop nav links ────────────────────────────────────
  const getNavLinks = () => {
    if (!isAuthenticated) return [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Providers', href: '/providers' },
    ];
    if (user?.role?.toLowerCase() === 'admin') return [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Providers', href: '/admin/providers' },
      { label: 'Bookings', href: '/admin/bookings' },
    ];
    if (user?.role?.toLowerCase() === 'provider') return [
      { label: 'Dashboard', href: '/provider/dashboard' },
      { label: 'My Bookings', href: '/provider/bookings' },
      { label: 'Services', href: '/provider/services' },
    ];
    return [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Providers', href: '/providers' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'Chats', href: '/messages' },
    ];
  };

  // ─── Mobile bottom tab links ─────────────────────────────
  const getMobileTabLinks = () => {
    if (!isAuthenticated) return [
      { label: 'Home',     href: '/',          icon: Home },
      { label: 'Services', href: '/services',  icon: Search },
      { label: 'Find',     href: '/providers', icon: Users },
      { label: 'Sign In',  href: '#',          icon: User, onClick: () => dispatch(openAuthModal('login')) },
    ];
    if (user?.role?.toLowerCase() === 'admin') return [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users',     href: '/admin/users',     icon: Users },
      { label: 'Providers', href: '/admin/providers', icon: Briefcase },
      { label: 'Profile',   href: '/profile',         icon: User },
    ];
    if (user?.role?.toLowerCase() === 'provider') return [
      { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
      { label: 'Bookings',  href: '/provider/bookings',  icon: Calendar },
      { label: 'Services',  href: '/provider/services',  icon: Wrench },
      { label: 'More',      href: '#',                   icon: Menu, onClick: () => setMobileMenuOpen(true) },
    ];
    return [
      { label: 'Home',     href: '/',         icon: Home },
      { label: 'Services', href: '/services', icon: Search },
      { label: 'Bookings', href: '/bookings', icon: Calendar },
      { label: 'Messages', href: '/messages', icon: MessageSquare },
      { label: 'Profile',  href: '/profile',  icon: User },
    ];
  };

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const mobileLinks = getMobileTabLinks();

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* DESKTOP STICKY HEADER                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      {!isDashboard && (
        <nav
          className={`hidden md:flex sticky top-0 z-40 w-full transition-all duration-300 ${
            scrolled
              ? 'bg-card/90 backdrop-blur-xl border-b border-border shadow-sm'
              : 'bg-card/70 backdrop-blur-md border-b border-border/50'
          }`}
        >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <Image
                src="/assets/LOGO.png"
                alt="Servio Logo"
                width={36}
                height={36}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Ser<span className="text-brand">vio</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="flex items-center gap-1">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'text-brand bg-brand/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-brand rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <button
                    onClick={() => dispatch(toggleNotificationDrawer())}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 flex items-center justify-center rounded-full bg-accent text-white text-[9px] font-bold leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Messages */}
                  <Link href="/messages"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    aria-label="Messages"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                  </Link>

                  {/* User dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-muted transition-all"
                    >
                      <Avatar src={user?.avatar} alt={user?.name} size="sm" className="h-7 w-7 ring-2 ring-brand/20" />
                      <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-lg overflow-hidden animate-scale-in z-50">
                        <div className="p-3 border-b border-border">
                          <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5">
                          {[
                            { label: 'My Profile', href: '/profile', icon: User },
                            { label: 'Bookings', href: '/bookings', icon: Calendar },
                            { label: 'Settings', href: '/profile#settings', icon: Settings },
                            ...(user?.role === 'ADMIN' ? [{ label: 'Admin Panel', href: '/admin/dashboard', icon: Shield }] : []),
                            ...(user?.role === 'PROVIDER' ? [{ label: 'Provider Portal', href: '/provider/dashboard', icon: Briefcase }] : []),
                          ].map(item => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-0.5"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => dispatch(openAuthModal('login'))}
                    className="text-sm font-semibold"
                  >
                    Log In
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => dispatch(openAuthModal('register'))}
                    className="text-sm font-semibold rounded-xl px-5 shadow-md shadow-brand/20"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE TOP MINI-BAR (logo + icons, hidden on desktop)  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
        <Link href="/" className="flex items-center gap-2 active:opacity-70 transition-opacity">
          <Image
            src="/assets/LOGO.png"
            alt="Servio Logo"
            width={32}
            height={32}
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Ser<span className="text-brand">vio</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:scale-95 transition-all"
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => dispatch(toggleNotificationDrawer())}
                className="relative h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:scale-95 transition-all"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-3.5 min-w-3.5 px-1 flex items-center justify-center rounded-full bg-accent text-white text-[8px] font-bold ring-2 ring-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <Link href={user?.role?.toLowerCase() === 'provider' ? '/provider/profile' : user?.role?.toLowerCase() === 'admin' ? '/admin/profile' : '/profile'} className="ml-1 active:scale-95 transition-transform">
                <Avatar src={user?.avatar} alt={user?.name} size="sm" className="h-8 w-8 ring-2 ring-transparent hover:ring-brand/30 transition-all" />
              </Link>
            </>
          ) : (
            <button
              onClick={() => dispatch(openAuthModal('login'))}
              className="text-sm font-bold text-white px-4 py-1.5 bg-brand rounded-full active:scale-95 transition-all ml-2"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE BOTTOM TAB BAR                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <nav className="mobile-tab-bar md:hidden">
        <div className="flex items-stretch h-[60px]">
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const active = link.href !== '#' && isActive(link.href);
            const isButton = link.href === '#' || !!link.onClick;

            const content = (
              <>
                <span className={`relative flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-200 ${
                  active ? 'bg-brand/12 scale-100' : 'scale-90'
                }`}>
                  <Icon className={`transition-all duration-200 ${active ? 'h-5 w-5' : 'h-[19px] w-[19px]'}`} strokeWidth={active ? 2.5 : 1.8} />
                  {/* Notification dot for messages */}
                  {link.href === '/messages' && unreadCount > 0 && (
                    <span className="absolute top-0.5 right-1 h-2 w-2 rounded-full bg-accent" />
                  )}
                </span>
                <span className={`text-[10px] font-semibold leading-none transition-all ${active ? 'opacity-100' : 'opacity-70'}`}>
                  {link.label}
                </span>
              </>
            );

            if (isButton) {
              return (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    active ? 'text-brand' : 'text-muted-foreground'
                  }`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  active ? 'text-brand' : 'text-muted-foreground'
                }`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FULL SCREEN MOBILE MENU (For "More" tab)               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            <div className="space-y-1">
              <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Menu</p>
              {[
                { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
                { label: 'Bookings', href: '/provider/bookings', icon: CalendarRange },
                { label: 'Services', href: '/provider/services', icon: Wrench },
                { label: 'Messages', href: '/provider/messages', icon: MessageSquare },
                { label: 'Reviews', href: '/provider/reviews', icon: Star },
                { label: 'Earnings', href: '/provider/earnings', icon: BarChart3 },
                { label: 'Profile', href: '/provider/profile', icon: User },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-colors ${
                    isActive(link.href)
                      ? 'bg-brand/10 text-brand'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                </Link>
              ))}
            </div>

            <div className="space-y-1 pt-6 border-t border-border">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
