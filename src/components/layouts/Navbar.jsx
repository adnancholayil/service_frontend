'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Shield,
  Briefcase,
  Calendar,
  Sparkles,
  Home,
  Grid,
  Users,
  LayoutDashboard,
  Wrench,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

import { logout } from '../../store/slices/authSlice';
import { toggleNotificationDrawer, openAuthModal } from '../../store/slices/appSlice';
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

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    setMounted(true);
    // Self-healing: if Redux says not authenticated, ensure cookies are actually cleared to prevent redirect loops
    if (!isAuthenticated) {
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Check for auth query params
    const authQuery = searchParams.get('auth');
    if (authQuery === 'login') {
      dispatch(openAuthModal('login'));
    } else if (authQuery === 'register') {
      dispatch(openAuthModal('register'));
    }
  }, [isAuthenticated, searchParams, dispatch]);

  const handleLogout = () => {
    // Clear the Redux state
    dispatch(logout());
    // Crucially clear the auth cookies so Next.js middleware doesn't redirect us back
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUserDropdownOpen(false);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Do not render Navbar on admin or provider dashboard routes since they have their own layouts
  if (pathname && (pathname.startsWith('/admin') || pathname === '/provider' || pathname.startsWith('/provider/'))) {
    return null;
  }

  // 1. Links for desktop navigation (header)
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Explore Services', href: '/services' },
        { label: 'Find Providers', href: '/providers' },
      ];
    }
    if (user?.role?.toLowerCase() === 'admin') {
      return [
        { label: 'Admin Panel', href: '/admin/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Providers', href: '/admin/providers' },
        { label: 'Bookings', href: '/admin/bookings' },
      ];
    }
    if (user?.role?.toLowerCase() === 'provider') {
      return [
        { label: 'Provider Portal', href: '/provider/dashboard' },
        { label: 'My Bookings', href: '/provider/bookings' },
        { label: 'My Services', href: '/provider/services' },
        { label: 'Earnings', href: '/provider/earnings' },
      ];
    }
    return [
      { label: 'Services', href: '/services' },
      { label: 'Providers', href: '/providers' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'Chats', href: '/messages' },
    ];
  };

  // 2. Links for mobile bottom navigation (tab bar)
  const getMobileBottomLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Services', href: '/services', icon: Search },
        { label: 'Providers', href: '/providers', icon: Users },
        { label: 'Log In', href: '#login', onClick: () => dispatch(openAuthModal('login')), icon: User },
      ];
    }

    if (user?.role?.toLowerCase() === 'admin') {
      return [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Providers', href: '/admin/providers', icon: Briefcase },
        { label: 'Profile', href: '/profile', icon: User },
      ];
    }

    if (user?.role?.toLowerCase() === 'provider') {
      return [
        { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
        { label: 'Bookings', href: '/provider/bookings', icon: Calendar },
        { label: 'Services', href: '/provider/services', icon: Wrench },
        { label: 'Profile', href: '/provider/profile', icon: User },
      ];
    }

    // Customer
    return [
      { label: 'Home', href: '/', icon: Home },
      { label: 'Services', href: '/services', icon: Search },
      { label: 'Bookings', href: '/bookings', icon: Calendar },
      { label: 'Chats', href: '/messages', icon: MessageSquare },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  };

  const checkActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ================================================= */}
      {/* DESKTOP HEADER (Hidden on mobile)                 */}
      {/* ================================================= */}
      <nav className="hidden md:block sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span>Service<span className="text-brand">Hub</span></span>
              </Link>

              {/* Desktop links only */}
              <div className="hidden md:flex items-center gap-6">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors ${
                      checkActive(link.href)
                        ? 'text-brand'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions (Desktop and Mobile Top header items) */}
            <div className="flex items-center gap-3">
              {/* Theme Toggler */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => dispatch(toggleNotificationDrawer())}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground relative transition-all cursor-pointer"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-accent" />
                    )}
                  </button>

                  {/* Desktop Profile Dropdown */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-all cursor-pointer"
                    >
                      <Avatar src={user?.avatar} alt={user?.name || 'User'} size="sm" />
                    </button>

                    {userDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg ring-1 ring-black/5 z-20">
                          <div className="px-3 py-2 border-b border-border">
                            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            <p className="mt-1 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-brand capitalize">
                              {user?.role}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              href={user?.role?.toLowerCase() === 'customer' ? '/profile' : `/${user?.role?.toLowerCase()}/profile`}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              <User className="h-4 w-4" />
                              My Profile
                            </Link>
                            {user?.role?.toLowerCase() === 'customer' && (
                              <Link
                                href="/bookings"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                              >
                                <Calendar className="h-4 w-4" />
                                My Bookings
                              </Link>
                            )}
                            <Link
                              href={user?.role?.toLowerCase() === 'customer' ? '/profile/edit' : `/${user?.role?.toLowerCase()}/settings`}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                          </div>
                          <div className="border-t border-border p-1">
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => dispatch(openAuthModal('login'))}>Log In</Button>
                  <Button variant="primary" size="sm" onClick={() => dispatch(openAuthModal('register'))}>Sign Up</Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* ================================================= */}
      {/* MOBILE BOTTOM NAVIGATION TAB BAR                  */}
      {/* ================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 z-40 w-full bg-card/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 shadow-2xl safe-bottom pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] min-h-[4rem]">
        {getMobileBottomLinks().map((tab) => {
          const Icon = tab.icon;
          const isActive = checkActive(tab.href);

          if (tab.onClick) {
            return (
              <button key={tab.label} onClick={tab.onClick} className="flex-1 flex flex-col items-center justify-center cursor-pointer">
                <span className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors ${
                  isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
                }`}>
                  <Icon className="h-5 w-5 transition-transform group-active:scale-95" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          }

          return (
            <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center justify-center">
              <span className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors ${
                isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
              }`}>
                <Icon className="h-5 w-5 transition-transform group-active:scale-95" />
                <span>{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Navbar;
