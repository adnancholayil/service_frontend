'use client';

import React from 'react';
import { Settings, Shield, Bell, Lock } from 'lucide-react';

export default function ProviderSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Account Settings <Settings className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage preferences, security, and notification configurations.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/50 p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-200">
              <Shield className="h-4.5 w-4.5" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-4.5 w-4.5" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Lock className="h-4.5 w-4.5" /> Privacy
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8 md:p-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
              <p className="text-sm text-slate-500">Update your password and secure your account.</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
              
              <button className="mt-4 w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-slate-800 transition-colors">
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
