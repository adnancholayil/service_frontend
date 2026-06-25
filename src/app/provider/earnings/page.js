'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, DollarSign, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';

export default function ProviderEarnings() {
  const providers = useSelector((state) => state.provider.providers);
  const activeProvider = providers.find(p => p.id === 'prov-1');

  const earnings = activeProvider ? activeProvider.earnings : { total: 5420, pending: 480, completedBookings: 89 };

  const barData = [
    { month: 'Jan', amount: 850 },
    { month: 'Feb', amount: 980 },
    { month: 'Mar', amount: 1100 },
    { month: 'Apr', amount: 940 },
    { month: 'May', amount: 1250 },
    { month: 'Jun', amount: 1450 }
  ];

  const maxAmount = Math.max(...barData.map(d => d.amount));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Earnings Analytics <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review payouts, historical logs, and monthly growth charts.</p>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Income</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">${earnings.total}</p>
            </div>
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl"><DollarSign className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Escrow Balance</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">${earnings.pending}</p>
            </div>
            <span className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl"><Calendar className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payout Count</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{earnings.completedBookings}</p>
            </div>
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl"><TrendingUp className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>
      </div>

      {/* Monthly Chart Card */}
      <Card className="bg-card">
        <CardBody className="p-6 space-y-6">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5 text-brand" /> Monthly Income Progression
          </h3>

          {/* Pure HTML/CSS styled bar chart */}
          <div className="h-64 flex items-end gap-4 sm:gap-6 pt-6 border-b border-border">
            {barData.map((d, i) => {
              const heightPct = Math.round((d.amount / maxAmount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity pb-1">
                    ${d.amount}
                  </div>
                  <div
                    className="w-full bg-brand rounded-t-lg transition-all duration-500 hover:bg-brand-hover relative"
                    style={{ height: `${heightPct}%`, minHeight: '10%' }}
                  >
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 pointer-events-none transition-opacity">
                      ${d.amount}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold pt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
