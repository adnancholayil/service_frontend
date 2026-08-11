'use client';

import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { PROVIDER_DASHBOARD_STATS_QUERY } from '../../../graphql/queries/provider';
import { REQUEST_PAYOUT } from '../../../graphql/mutations/provider';

export default function ProviderEarnings() {
  const { data, loading } = useQuery(PROVIDER_DASHBOARD_STATS_QUERY);

  const stats = data?.providerDashboardStats || {
    totalEarnings: 0,
    pendingTasks: 0,
    completedJobs: 0,
  };

  const [requestPayout, { loading: requesting }] = useMutation(REQUEST_PAYOUT, {
    onCompleted: () => {
      toast.success('Payout requested successfully! It will be processed soon.');
    },
    onError: (err) => toast.error(err.message || 'Failed to request payout'),
  });

  const handleWithdraw = async () => {
    if (stats.totalEarnings <= 0) {
      toast.error('No funds available for withdrawal.');
      return;
    }
    try {
      await requestPayout({ variables: { amount: stats.totalEarnings } });
    } catch (err) {
      // Error handled by mutation onError
    }
  };

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            Earnings & Payouts <BarChart3 className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Track your revenue, view payment history, and request withdrawals.</p>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-all shadow-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Available Balance</p>
          <h3 className="text-3xl font-black text-foreground">{loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`}</h3>
          <button 
            onClick={handleWithdraw}
            disabled={requesting || loading || stats.totalEarnings <= 0}
            className={`mt-4 w-full bg-foreground text-background rounded-lg py-2 text-xs font-bold transition-colors shadow-md shadow-foreground/20 ${
              requesting || loading || stats.totalEarnings <= 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-foreground/90'
            }`}
          >
            {requesting ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
            Completed Jobs <TrendingUp className="h-4 w-4 text-brand" />
          </p>
          <h3 className="text-3xl font-black text-foreground">{loading ? '...' : stats.completedJobs}</h3>
          <p className="text-xs font-medium text-muted-foreground mt-2">Lifetime completed services</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center justify-between">
            Lifetime Earnings <DollarSign className="h-4 w-4 text-indigo-500" />
          </p>
          <h3 className="text-3xl font-black text-foreground">{loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`}</h3>
          <p className="text-xs font-medium text-muted-foreground mt-2">Since joining</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
        </div>
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-12 bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No transactions yet</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md">Your completed jobs and payouts will appear here.</p>
        </div>
      </div>

    </div>
  );
}
