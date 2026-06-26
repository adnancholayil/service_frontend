'use client';

import React, { useState, useEffect } from 'react';
import { User, Image as ImageIcon, MapPin, Briefcase, Plus } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { UPDATE_PROVIDER_PROFILE } from '../../../graphql/mutations/provider';

export default function ProviderProfile() {
  const { user } = useSelector((state) => state.auth);
  
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const { data, loading, refetch } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  useEffect(() => {
    if (data?.providerProfile) {
      setBusinessName(data.providerProfile.businessName || '');
      setDescription(data.providerProfile.description || '');
      setAddress(data.providerProfile.address || '');
    }
  }, [data]);

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROVIDER_PROFILE, {
    onCompleted: () => {
      toast.success('Profile updated successfully!');
      refetch();
    },
    onError: (err) => toast.error(err.message || 'Error updating profile'),
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        variables: { businessName, description, address }
      });
    } catch (e) {
      // Error handled by mutation onError
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Business Profile <User className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage how customers see your business on the platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={updating}
          className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 ${updating ? 'opacity-50' : ''}`}
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Briefcase className="h-5 w-5 text-slate-400" /> General Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  placeholder="Your Business Name" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio / Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  placeholder="Tell customers about your experience and expertise..." 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Service Area / Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  placeholder="City, State or Full Address" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {data?.providerProfile?.user?.avatar ? (
                 <img src={data.providerProfile.user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 <User className="h-10 w-10 text-slate-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Profile Photo</h3>
              <p className="text-xs text-slate-500 mt-1">Recommended size: 400x400px</p>
            </div>
            <button className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-2 text-xs font-bold hover:bg-slate-100 transition-colors">
              Upload New Image
            </button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-slate-400" /> Portfolio Gallery
            </h3>
            <p className="text-xs text-slate-500">Showcase your past work to attract more customers.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <Plus className="h-6 w-6 text-slate-300 group-hover:text-emerald-500 transition-colors mb-2" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Add Photos</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
