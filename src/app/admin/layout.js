'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  FolderTree,
  Star,
  Image,
  FileBarChart2,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

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
    <div className="flex-1 flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-full md:w-64 border-r border-border bg-card shrink-0 p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex-col justify-between">
        <div className="space-y-6">
          <div className="px-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-rose-500/10 text-rose-600 rounded-full">
              <ShieldAlert className="h-3.5 w-3.5" /> Admin Control
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
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ServiceHub Admin Console</p>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar">
        {children}
      </main>

    </div>
  );
}
