'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { openLogoutModal } from '../../store/slices/appSlice';
import { LayoutDashboard, CalendarRange, Wrench, Star, BarChart3, User, Settings, Shield, LogOut, MessageCircle } from 'lucide-react';

export default function ProviderLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(openLogoutModal());
  };

  const menuItems = [
    { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Manage Bookings', href: '/provider/bookings', icon: CalendarRange },
    { label: 'My Services', href: '/provider/services', icon: Wrench },
    { label: 'Messages', href: '/messages', icon: MessageCircle },
    { label: 'Reviews', href: '/provider/reviews', icon: Star },
    { label: 'Earnings Analytics', href: '/provider/earnings', icon: BarChart3 },
    { label: 'Business Profile', href: '/provider/profile', icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-full md:w-64 border-r border-slate-200 bg-white shrink-0 py-8 px-5 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="space-y-8">
          <div className="px-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Partner Portal
            </span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pb-2 mt-auto hidden md:flex flex-col gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
          
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">ServiceHub</p>
              <p className="text-xs font-semibold text-slate-800">Partner Console</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10 pointer-events-none" />
        {children}
      </main>

    </div>
  );
}
