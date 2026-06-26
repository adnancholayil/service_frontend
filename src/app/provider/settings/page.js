'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, CreditCard } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { CHANGE_PASSWORD } from '../../../graphql/mutations/provider';

export default function ProviderSettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err) => toast.error(err.message || 'Failed to change password'),
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await changePassword({ variables: { oldPassword, newPassword } });
    } catch (err) {
      // Error handled by mutation onError
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Account Settings <Settings className="h-6 w-6 text-slate-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage your security, notifications, and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation / Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-emerald-200 shadow-[0_2px_10px_rgb(16,185,129,0.1)] rounded-xl text-emerald-700 font-bold text-sm transition-all">
            <span className="flex items-center gap-3"><Shield className="h-4.5 w-4.5" /> Security</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-transparent text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-100 transition-all opacity-50 cursor-not-allowed">
            <span className="flex items-center gap-3"><Bell className="h-4.5 w-4.5" /> Notifications</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-transparent text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-100 transition-all opacity-50 cursor-not-allowed">
            <span className="flex items-center gap-3"><CreditCard className="h-4.5 w-4.5" /> Billing Info</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Key className="h-5 w-5 text-slate-400" /> Change Password
              </h2>
              <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
