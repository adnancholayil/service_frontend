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
  User, Shield, LogOut, MessageCircle, Loader2, ChevronRight
} from 'lucide-react';

export default function ProviderLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
    <div className="flex overflow-hidden h-[100dvh]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-56 h-full flex-col bg-white border-r border-slate-100 shrink-0">

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
          <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-emerald-500" /> Partner Portal
          </p>
          {menuItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/provider/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <span className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}>
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto text-emerald-400" />}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log Out
          </button>
          <div className="flex items-center gap-2.5 px-3 pt-3 mt-2 border-t border-slate-100">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-7 w-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{providerName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-slate-400 font-medium">Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-slate-50/70 min-w-0">
        {children}
      </main>

    </div>
  );
}
