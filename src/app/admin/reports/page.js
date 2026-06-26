'use client';

import React from 'react';
import { FileBarChart2, Download, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Reports & Payouts <FileBarChart2 className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Monitor platform revenue, process provider withdrawals, and generate financial reports.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Download className="h-4 w-4" /> Export Financials
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            Gross Merchandise Value <TrendingUp className="h-4 w-4 text-emerald-500" />
          </p>
          <h3 className="text-3xl font-black text-slate-900">$0.00</h3>
          <p className="text-xs font-medium text-slate-400 mt-2">Total volume processed</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-indigo-600 to-indigo-900">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center justify-between">
            Platform Commissions <DollarSign className="h-4 w-4 text-indigo-300" />
          </p>
          <h3 className="text-3xl font-black text-white">$0.00</h3>
          <p className="text-xs font-medium text-indigo-200 mt-2">Net revenue earned</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pending Payouts</p>
          <h3 className="text-3xl font-black text-slate-900">0</h3>
          <p className="text-xs font-medium text-slate-400 mt-2">Awaiting processing</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Withdrawal Requests</h2>
        </div>
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No pending requests</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">All provider payouts have been processed successfully.</p>
        </div>
      </div>

    </div>
  );
}
