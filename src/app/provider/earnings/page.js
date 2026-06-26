'use client';

import React from 'react';
import { BarChart3, Download, TrendingUp, DollarSign } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { PROVIDER_DASHBOARD_STATS_QUERY } from '../../../graphql/queries/provider';

export default function ProviderEarnings() {
  const { data, loading } = useQuery(PROVIDER_DASHBOARD_STATS_QUERY);

  const stats = data?.providerDashboardStats || {
    totalEarnings: 0,
    pendingTasks: 0,
    completedJobs: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Earnings & Payouts <BarChart3 className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Track your revenue, view payment history, and request withdrawals.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Available Balance</p>
          <h3 className="text-3xl font-black text-slate-900">{loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`}</h3>
          <button className="mt-4 w-full bg-slate-900 text-white rounded-lg py-2 text-xs font-bold hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed">
            Withdraw Funds
          </button>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            Completed Jobs <TrendingUp className="h-4 w-4 text-emerald-500" />
          </p>
          <h3 className="text-3xl font-black text-slate-900">{loading ? '...' : stats.completedJobs}</h3>
          <p className="text-xs font-medium text-slate-400 mt-2">Lifetime completed services</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            Lifetime Earnings <DollarSign className="h-4 w-4 text-indigo-500" />
          </p>
          <h3 className="text-3xl font-black text-slate-900">{loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`}</h3>
          <p className="text-xs font-medium text-slate-400 mt-2">Since joining</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
        </div>
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No transactions yet</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Your completed jobs and payouts will appear here.</p>
        </div>
      </div>

    </div>
  );
}
