'use client';

import React from 'react';
import { Star, MessageSquareX, CheckCircle } from 'lucide-react';

export default function AdminReviews() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Platform Reviews <Star className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Moderate customer feedback and maintain quality standards.</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">All caught up</h2>
        <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">There are no flagged or pending reviews that require administrative moderation at this time.</p>
      </div>

    </div>
  );
}
