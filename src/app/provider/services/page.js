'use client';

import React, { useState } from 'react';
import { Wrench, Plus, LayoutGrid, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { CREATE_SERVICE, DELETE_SERVICE } from '../../../graphql/mutations/services';

export default function ProviderServices() {
  const { user } = useSelector((state) => state.auth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, loading, refetch } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [deleteService] = useMutation(DELETE_SERVICE, {
    onCompleted: () => {
      toast.success('Service deleted successfully');
      refetch();
    },
    onError: (err) => toast.error(err.message || 'Error deleting service'),
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService({ variables: { id } });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const services = data?.providerProfile?.services || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            My Services <Wrench className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage your service offerings, pricing, and availability.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center text-slate-400">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">You haven't added any services yet</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Create your first service to start accepting bookings from customers in your area.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="mt-6 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            <Plus className="h-4 w-4" /> Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{service.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {service.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-2xl font-black text-emerald-600">${service.price}</p>
              </div>
              <div className="mt-6 flex gap-2 pt-4 border-t border-slate-100 justify-end">
                <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete">
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Placeholder Modal Logic */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Service</h2>
            <p className="text-sm text-slate-500 mb-6">Service creation form will be wired up to the category select soon.</p>
            <div className="flex justify-end gap-3">
               <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
               <button className="px-5 py-2 bg-emerald-500 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">Save Service</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
