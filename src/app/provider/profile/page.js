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
    return <div className="p-12 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Business Profile <User className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage your online presence beautifully.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={updating}
          className={`flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5 ${updating ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar - Profile & Sub (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Elegant Profile Card */}
          <div className="bg-card rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-border p-5 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 p-1 shadow-inner mb-3 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-background border-2 border-background flex items-center justify-center">
                {(user?.avatar || data?.providerProfile?.user?.avatar) ? (
                   <img src={user?.avatar || data?.providerProfile?.user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <h2 className="text-base font-black text-foreground">{businessName || 'Your Business'}</h2>
            <p className="text-[10px] text-brand font-bold mt-0.5 uppercase tracking-widest">{data?.providerProfile?.subscriptionStatus === 'ACTIVE' ? 'Premium Member' : 'Basic Member'}</p>
            
            <div className="w-full pt-4 mt-3 border-t border-border px-2">
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
          <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="absolute -top-12 -right-12 p-8 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors w-40 h-40"></div>
            <div className="absolute top-4 right-4 text-brand/20 group-hover:text-brand/30 transition-colors">
              <ShieldCheck className="w-12 h-12" />
            </div>
            
            <div className="relative z-10 space-y-5">
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1.5">Current Plan</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tight">{data?.providerProfile?.subscriptionPlan || 'Basic'}</h3>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm border ${
                    data?.providerProfile?.subscriptionStatus === 'ACTIVE' 
                      ? 'bg-brand/10 text-brand border-brand/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {data?.providerProfile?.subscriptionStatus || 'FREE'}
                  </span>
                </div>
              </div>

              <ul className="text-xs font-medium text-muted-foreground space-y-2 py-3 border-y border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand"/> Premium profile badge</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand"/> Unlimited job requests</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand"/> Priority support</li>
              </ul>

              {data?.providerProfile?.subscriptionStatus === 'ACTIVE' && data?.providerProfile?.subscriptionExpiry && (
                <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expires In</span>
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand"/>
                    {Math.max(0, Math.ceil((new Date(data.providerProfile.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))} days
                  </span>
                </div>
              )}

              <a href="/provider/subscription" className="block w-full bg-brand hover:bg-brand-hover text-white text-center py-2.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all mt-2">
                Upgrade / Renew Plan
              </a>
            </div>
          </div>
        </div>

        {/* Right Main Area - Form & Gallery (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-card border border-border rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-brand" /> General Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all hover:bg-muted/50 shadow-sm shadow-black/5" 
                  placeholder="Your Business Name" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground/70" /> Service Area</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all hover:bg-muted/50 shadow-sm shadow-black/5" 
                  placeholder="City, State or Full Address" 
                />
              </div>
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Business Bio</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all hover:bg-muted/50 resize-none shadow-sm shadow-black/5 leading-relaxed" 
                  placeholder="Tell customers about your experience and expertise..." 
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-brand" /> Portfolio Gallery
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Showcase your best work (Max 5MB per image)</p>
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
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {portfolio.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-border aspect-square shadow-sm">
                    <img src={img} alt="Portfolio item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => setPortfolio(prev => prev.filter((_, i) => i !== idx))}
                        className="bg-background hover:bg-red-500/10 text-red-500 rounded-full p-2 transform scale-75 group-hover:scale-100 transition-all shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 py-12 flex flex-col items-center justify-center text-center transition-colors hover:bg-muted/40">
                <div className="w-14 h-14 bg-background rounded-2xl shadow-sm border border-border flex items-center justify-center mb-4 text-brand">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-foreground">No portfolio images yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Upload high-quality images of your previous work to attract more customers.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground mb-2">Unsaved Changes</h3>
            <p className="text-sm text-muted-foreground mb-6">You have unsaved changes. Do you want to leave without saving your work?</p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
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
