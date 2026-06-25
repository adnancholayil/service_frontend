'use client';

import React from 'react';
import { Sparkles, DollarSign, Calendar, BarChart3, TrendingUp } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';

export default function AdminReports() {
  const chartData = [
    { label: 'Q1', revenue: 45000 },
    { label: 'Q2', revenue: 58000 },
    { label: 'Q3', revenue: 74000 },
    { label: 'Q4', revenue: 92000 }
  ];

  const maxVal = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Platform Reports & Payouts <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review revenue growth indexes, commission balances, and escrow distributions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Platform GMV</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">$269,000</p>
            </div>
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl"><DollarSign className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Commission (15%)</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">$40,350</p>
            </div>
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl"><TrendingUp className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Partner Payouts</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">$4,820</p>
            </div>
            <span className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl"><Calendar className="h-5.5 w-5.5" /></span>
          </CardBody>
        </Card>
      </div>

      {/* Growth Card */}
      <Card className="bg-card">
        <CardBody className="p-6 space-y-6">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5 text-brand" /> Quarterly Platform GMV (Gross Merchandise Value)
          </h3>

          <div className="h-64 flex items-end gap-6 pt-6 border-b border-border">
            {chartData.map((d, i) => {
              const heightPct = Math.round((d.revenue / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity pb-1">
                    ${d.revenue.toLocaleString()}
                  </div>
                  <div
                    className="w-full bg-brand rounded-t-lg transition-all duration-500 hover:bg-brand-hover relative"
                    style={{ height: `${heightPct}%`, minHeight: '15%' }}
                  >
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 pointer-events-none transition-opacity">
                      ${d.revenue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold pt-1">{d.label}</span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
