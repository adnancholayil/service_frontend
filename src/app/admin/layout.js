'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client/react';
import { openLogoutModal } from '../../store/slices/appSlice';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  FolderTree,
  Star,
  Image,
  FileBarChart2,
  ShieldAlert,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const client = useApolloClient();

  const handleLogout = () => {
    dispatch(openLogoutModal());
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Providers Verification', href: '/admin/providers', icon: Briefcase },
    { label: 'Global Bookings', href: '/admin/bookings', icon: CalendarDays },
    { label: 'Category CRUD Manager', href: '/admin/categories', icon: FolderTree },
    { label: 'Platform Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Promo Banners', href: '/admin/banners', icon: Image },
    { label: 'Reports & Payouts', href: '/admin/reports', icon: FileBarChart2 },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-full md:w-64 border-r border-slate-200 bg-white shrink-0 py-8 px-5 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="space-y-8">
          <div className="px-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              Admin Portal
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
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
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
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            Log Out
          </button>
          
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">ServiceHub</p>
              <p className="text-xs font-semibold text-slate-800">Admin Console</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />
        {children}
      </main>

    </div>
  );
}
