'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { openLogoutModal } from '../../store/slices/appSlice';
import { useQuery } from '@apollo/client/react';
import { GET_PROVIDER_PROFILE } from '../../graphql/queries/provider';
import {
  LayoutDashboard, CalendarRange, Wrench, Star, BarChart3,
  User, Shield, LogOut, MessageCircle, Loader2, ChevronRight,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ProviderLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data, loading } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const subscriptionStatus = data?.providerProfile?.subscriptionStatus;

  React.useEffect(() => {
    if (!loading && subscriptionStatus) {
      if (
        subscriptionStatus === 'PENDING_PAYMENT' &&
        !pathname.includes('/provider/subscription') &&
        !pathname.includes('/provider/payment')
      ) {
        router.replace('/provider/subscription');
      }
    }
  }, [loading, subscriptionStatus, pathname, router]);

  const handleLogout = () => dispatch(openLogoutModal());

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (
    subscriptionStatus === 'PENDING_PAYMENT' &&
    !pathname.includes('/provider/subscription') &&
    !pathname.includes('/provider/payment')
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/provider/bookings', icon: CalendarRange },
    { label: 'Services', href: '/provider/services', icon: Wrench },
    { label: 'Messages', href: '/provider/messages', icon: MessageCircle },
    { label: 'Reviews', href: '/provider/reviews', icon: Star },
    { label: 'Earnings', href: '/provider/earnings', icon: BarChart3 },
    { label: 'Profile', href: '/provider/profile', icon: User },
  ];

  const isAuthOrPaymentPage =
    pathname.includes('/provider/subscription') ||
    pathname.includes('/provider/payment');

  if (isAuthOrPaymentPage) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        {children}
      </div>
    );
  }

  const providerName = data?.providerProfile?.businessName || user?.name || 'Provider';
  const initials = providerName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex w-full h-full min-h-0 bg-background text-foreground">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 h-full flex-col bg-card border-r border-border shrink-0 shadow-sm z-10 sticky top-0">

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-3 mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-brand" /> Partner Portal
          </p>
          {menuItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/provider/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-brand transition-colors'}`} />
                  {label}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/70" />}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="p-4 border-t border-border shrink-0 bg-muted/30">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all p-1.5 rounded-lg"
                title="Toggle Theme"
              >
                {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all p-1.5 rounded-lg"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-card border border-border p-2.5 rounded-xl shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-9 w-9 rounded-lg object-cover shrink-0 shadow-sm" />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{providerName}</p>
              <p className="text-[10px] font-bold text-brand uppercase tracking-wider mt-0.5 truncate">{subscriptionStatus === 'ACTIVE' ? 'Premium' : 'Provider'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 relative flex flex-col h-full overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
