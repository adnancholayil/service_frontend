'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarRange, Wrench, Star, BarChart3, User, Settings, Shield } from 'lucide-react';

export default function ProviderLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Manage Bookings', href: '/provider/bookings', icon: CalendarRange },
    { label: 'My Services', href: '/provider/services', icon: Wrench },
    { label: 'Reviews', href: '/provider/reviews', icon: Star },
    { label: 'Earnings Analytics', href: '/provider/earnings', icon: BarChart3 },
    { label: 'Business Profile', href: '/provider/profile', icon: User },
    { label: 'Settings', href: '/provider/settings', icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-full md:w-64 border-r border-border bg-card shrink-0 p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex-col justify-between">
        <div className="space-y-6">
          <div className="px-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full">
              <Shield className="h-3.5 w-3.5" /> Partner Portal
            </span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-border mt-auto hidden md:block">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ServiceHub Partner v1.0</p>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar">
        {children}
      </main>

    </div>
  );
}
