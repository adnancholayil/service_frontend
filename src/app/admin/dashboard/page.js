'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Activity,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

import { ADMIN_DASHBOARD_STATS_QUERY, ADMIN_PROVIDERS_QUERY } from '../../../graphql/queries/admin';
import Avatar from '../../../components/ui/Avatar';

export default function AdminDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(ADMIN_DASHBOARD_STATS_QUERY);
  const { data: providersData, loading: providersLoading } = useQuery(ADMIN_PROVIDERS_QUERY);

  const stats = statsData?.adminDashboardStats || {
    usersCount: 0,
    bookingsCount: 0,
    disputesCount: 0,
    totalRevenue: 0,
  };

  const pendingProviders = providersData?.adminProviders?.filter(p => p.status === 'PENDING') || [];
  const onlineProviders = providersData?.adminProviders?.filter(p => p.verificationStatus === 'VERIFIED') || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Platform metrics, pending verifications, and user registrations.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={statsLoading ? "..." : stats.usersCount} 
          icon={Users} 
          trendColor="text-emerald-600"
          trendIcon="↑"
          trend="+8%"
        />
        <StatCard 
          title="Partners Online" 
          value={statsLoading ? "..." : onlineProviders.length} 
          icon={Briefcase} 
          trendColor="text-emerald-600"
          trendIcon="↑"
          trend="Active"
        />
        <StatCard 
          title="Total Escrow" 
          value={statsLoading ? "..." : `$${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trendColor="text-indigo-600"
          trendIcon="↗"
          trend="Steady"
        />
        <StatCard 
          title="Active Disputes" 
          value={statsLoading ? "..." : stats.disputesCount} 
          icon={AlertTriangle} 
          trendColor={stats.disputesCount > 0 ? "text-rose-600" : "text-emerald-600"}
          trendIcon={stats.disputesCount > 0 ? "!" : "✓"}
          trend={stats.disputesCount > 0 ? "Action required" : "All clear"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Providers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800">Pending Verifications</h2>
            <Link href="/admin/providers" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View All
            </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {providersLoading ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">Loading...</div>
            ) : pendingProviders.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">No providers awaiting verification.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingProviders.slice(0, 5).map(provider => (
                  <div key={provider.id} className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar src={provider.user?.avatar} alt={provider.user?.name} size="md" />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{provider.businessName}</p>
                        <p className="text-xs font-medium text-slate-500">{provider.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/admin/providers" className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800">Activity</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center flex flex-col items-center justify-center h-[calc(100%-2rem)] min-h-[250px]">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Transaction Monitoring</p>
            <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Live monitoring will be connected in the next platform update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trendColor, trendIcon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trendColor}`}>
          <span>{trendIcon}</span> {trend}
        </p>
      </div>
    </div>
  );
}
