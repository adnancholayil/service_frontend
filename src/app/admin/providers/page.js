'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { ADMIN_PROVIDERS_QUERY } from '../../../graphql/queries/admin';
import { VERIFY_PROVIDER_MUTATION } from '../../../graphql/mutations/admin';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function AdminProviders() {
  const { data, loading, error, refetch } = useQuery(ADMIN_PROVIDERS_QUERY);
  const [verifyProvider] = useMutation(VERIFY_PROVIDER_MUTATION);
  const [providerToReject, setProviderToReject] = React.useState(null);

  const providers = data?.adminProviders || [];

  const handleVerify = async (provId) => {
    try {
      await verifyProvider({ variables: { providerId: provId, status: 'VERIFIED' } });
      toast.success('Service partner verified! Listed online.');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Error verifying partner');
    }
  };

  const handleSuspend = (provId) => {
    setProviderToReject(provId);
  };

  const confirmSuspend = async () => {
    if (providerToReject) {
      try {
        await verifyProvider({ variables: { providerId: providerToReject, status: 'REJECTED' } });
        toast.error('Partner status set to rejected/suspended');
        setProviderToReject(null);
        refetch();
      } catch (err) {
        toast.error(err.message || 'Error rejecting partner');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading partners...</div>;
  if (error) return <div className="p-8 text-center text-danger">Error: {error.message}</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner Verification</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Review onboarding applications, verify background reports, and configure partner listings.</p>
        </div>
      </div>

      {/* Directory listing table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">User Details</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Business Info</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-4 font-bold text-xs uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* User Details */}
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      {p.user?.avatar ? <Avatar src={p.user?.avatar} alt={p.user?.name} size="sm" /> : (p.user?.name?.charAt(0) || '?')}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{p.user?.name || 'Unknown'}</span>
                      <span className="text-slate-500 font-medium text-xs mt-0.5">{p.user?.email || 'No email'}</span>
                    </div>
                  </td>
                  
                  {/* Business Info */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{p.businessName}</span>
                      <span className="text-slate-500 font-medium text-xs mt-0.5 truncate max-w-[200px]" title={p.description}>
                        {p.description}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-8 py-5 text-slate-600 font-semibold text-sm">
                    {p.category?.name || 'Uncategorized'}
                  </td>

                  {/* Status */}
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                      p.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' : 
                      p.verificationStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {p.verificationStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.verificationStatus !== 'VERIFIED' && (
                        <button 
                          onClick={() => handleVerify(p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {p.verificationStatus !== 'REJECTED' && (
                        <button 
                          onClick={() => handleSuspend(p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-500">No service partners found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!providerToReject} 
        onClose={() => setProviderToReject(null)}
        onConfirm={confirmSuspend}
        title="Reject or Suspend Partner"
        message="Are you sure you want to suspend or reject this service partner? They will not be able to accept new bookings."
        confirmText="Reject Partner"
      />
    </div>
  );
}
