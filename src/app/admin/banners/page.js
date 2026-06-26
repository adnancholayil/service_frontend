'use client';

import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';

export default function AdminBanners() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Promo Banners <ImageIcon className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage homepage marketing banners and promotional campaigns.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> Upload Banner
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
          <ImageIcon className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No active banners</h2>
        <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Upload your first promotional banner to display it to customers on the main landing page.</p>
      </div>

    </div>
  );
}
