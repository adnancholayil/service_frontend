'use client';

import React, { useState, useEffect } from 'react';
import { User, Image as ImageIcon, MapPin, Briefcase, Plus, X, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { UPDATE_PROVIDER_PROFILE } from '../../../graphql/mutations/provider';
import { UPDATE_USER_AVATAR } from '../../../graphql/mutations/auth';
import { updateProfile as updateReduxProfile } from '../../../store/slices/authSlice';
import ImageUpload from '../../../components/ui/ImageUpload';

export default function ProviderProfile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  const { data, loading, refetch } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  useEffect(() => {
    if (data?.providerProfile) {
      setBusinessName(data.providerProfile.businessName || '');
      setDescription(data.providerProfile.description || '');
      setAddress(data.providerProfile.address || '');
      setPortfolio(data.providerProfile.portfolio || []);
      setTimeout(() => setIsDirty(false), 0);
    }
  }, [data]);

  // Track if changes were made
  useEffect(() => {
    if (!data?.providerProfile) return;
    const initial = data.providerProfile;
    const hasChanges = 
      businessName !== (initial.businessName || '') ||
      description !== (initial.description || '') ||
      address !== (initial.address || '') ||
      JSON.stringify(portfolio) !== JSON.stringify(initial.portfolio || []);
    setIsDirty(hasChanges);
  }, [businessName, description, address, portfolio, data]);

  // Warn on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Warn on internal link click using custom modal
  useEffect(() => {
    const handleClick = (e) => {
      if (!isDirty) return;
      const target = e.target.closest('a');
      if (target && target.href && target.href !== window.location.href) {
        e.preventDefault();
        setPendingUrl(target.href);
        setShowModal(true);
      }
    };
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [isDirty]);

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROVIDER_PROFILE, {
    onCompleted: () => {
      toast.success('Profile updated successfully!');
      setIsDirty(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || 'Error updating profile'),
  });

  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR, {
    onCompleted: () => toast.success('Profile picture saved successfully'),
    onError: () => toast.error('Failed to save profile picture permanently'),
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        variables: { businessName, description, address, portfolio }
      });
    } catch (e) {
      // Error handled by mutation onError
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col p-4 max-w-[1400px] mx-auto w-full h-full overflow-hidden bg-slate-50/50">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0 pb-4 border-b border-slate-200/60 mb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Business Profile <User className="h-5 w-5 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-1 text-xs font-medium">Manage your online presence beautifully.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={updating}
          className={`flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 ${updating ? 'opacity-50' : ''}`}
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Sidebar - Profile & Sub (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1.5 pb-4 custom-scrollbar">
          
          {/* Elegant Profile Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-5 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 p-1 shadow-inner mb-3 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
                {(user?.avatar || data?.providerProfile?.user?.avatar) ? (
                   <img src={user?.avatar || data?.providerProfile?.user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User className="h-10 w-10 text-slate-300" />
                )}
              </div>
            </div>
            
            <h2 className="text-base font-black text-slate-900">{businessName || 'Your Business'}</h2>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5 uppercase tracking-widest">{data?.providerProfile?.subscriptionStatus === 'ACTIVE' ? 'Premium Member' : 'Basic Member'}</p>
            
            <div className="w-full pt-4 mt-3 border-t border-slate-100 px-2">
              <ImageUpload 
                label="Update Photo" 
                variant="button"
                onUpload={async (url) => {
                  dispatch(updateReduxProfile({ avatar: url }));
                  await updateUserAvatar({ variables: { avatar: url } });
                }} 
              />
            </div>
          </div>

          {/* Premium Subscription Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShieldCheck className="w-20 h-20" />
            </div>
            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-emerald-100 text-[9px] font-bold uppercase tracking-widest mb-1">Current Plan</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black">{data?.providerProfile?.subscriptionPlan || 'NONE'}</h3>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm ${
                    data?.providerProfile?.subscriptionStatus === 'ACTIVE' 
                      ? 'bg-white text-emerald-700' 
                      : 'bg-amber-400 text-amber-900'
                  }`}>
                    {data?.providerProfile?.subscriptionStatus || 'N/A'}
                  </span>
                </div>
              </div>

              <ul className="text-[11px] font-medium text-emerald-50 space-y-1.5 py-2 border-y border-emerald-500/30">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300"/> Premium profile badge</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300"/> Unlimited job requests</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300"/> Priority support</li>
              </ul>

              {data?.providerProfile?.subscriptionStatus === 'ACTIVE' && data?.providerProfile?.subscriptionExpiry && (
                <div className="flex justify-between items-center bg-black/10 rounded-lg p-2.5">
                  <span className="text-[9px] font-bold text-emerald-100 uppercase tracking-wider">Expires In</span>
                  <span className="text-[11px] font-black text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-300"/>
                    {Math.max(0, Math.ceil((new Date(data.providerProfile.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))} days
                  </span>
                </div>
              )}

              <a href="/provider/subscription" className="block w-full bg-white hover:bg-emerald-50 text-emerald-700 text-center py-2 rounded-lg text-xs font-bold shadow-md transition-all mt-1">
                Upgrade / Renew Plan
              </a>
            </div>
          </div>
        </div>

        {/* Right Main Area - Form & Gallery (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto pr-1.5 pb-4 custom-scrollbar">
          
          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-emerald-500" /> General Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:bg-white" 
                  placeholder="Your Business Name" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Service Area</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:bg-white" 
                  placeholder="City, State or Full Address" 
                />
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Business Bio</label>
                <textarea 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:bg-white resize-none" 
                  placeholder="Tell customers about your experience and expertise..." 
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500" /> Portfolio Gallery
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium pl-6">Showcase your best work (Max 5MB per image).</p>
              </div>
              <div className="scale-75 origin-right">
                <ImageUpload 
                  label="Upload New Photo"
                  variant="button"
                  onUpload={(url) => {
                    setPortfolio(prev => [...prev, url]);
                    toast.success('Photo added!');
                  }}
                />
              </div>
            </div>

            {portfolio.length > 0 ? (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {portfolio.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-100 aspect-square shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <img src={img} alt="Portfolio item" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => setPortfolio(prev => prev.filter((_, i) => i !== idx))}
                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 transform scale-75 group-hover:scale-100 transition-all shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-600">No portfolio images yet</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload images to attract more customers.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unsaved Changes</h3>
            <p className="text-sm text-slate-500 mb-6">You have unsaved changes. Do you want to leave without saving your work?</p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  window.location.href = pendingUrl;
                }}
                className="px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md shadow-red-500/20"
              >
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
