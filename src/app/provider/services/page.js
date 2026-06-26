'use client';

import React, { useState } from 'react';
import { Wrench, Plus, LayoutGrid, Edit, Trash2, X } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { GET_CATEGORIES } from '../../../graphql/queries/categories';
import { CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '../../../graphql/mutations/services';

export default function ProviderServices() {
  const { user } = useSelector((state) => state.auth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
  });

  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const { data: categoryData } = useQuery(GET_CATEGORIES);

  const [createService, { loading: creating }] = useMutation(CREATE_SERVICE, {
    onCompleted: () => {
      toast.success('Service created successfully!');
      closeModal();
      refetchProfile();
    },
    onError: (err) => toast.error(err.message || 'Error creating service'),
  });

  const [updateService, { loading: updating }] = useMutation(UPDATE_SERVICE, {
    onCompleted: () => {
      toast.success('Service updated successfully!');
      closeModal();
      refetchProfile();
    },
    onError: (err) => toast.error(err.message || 'Error updating service'),
  });

  const [deleteService] = useMutation(DELETE_SERVICE, {
    onCompleted: () => {
      toast.success('Service deleted successfully');
      refetchProfile();
    },
    onError: (err) => toast.error(err.message || 'Error deleting service'),
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingServiceId(null);
    setFormData({ name: '', description: '', category: '', price: '', duration: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category?.id || '',
      price: service.price.toString(),
      duration: service.duration ? service.duration.toString() : '60',
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditingServiceId(null);
    setFormData({ name: '', description: '', category: '', price: '', duration: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService({ variables: { id } });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const variables = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration) || 60,
      };

      if (isEditMode) {
        await updateService({
          variables: {
            id: editingServiceId,
            ...variables
          }
        });
      } else {
        await createService({ variables });
      }
    } catch (err) {
      // Error handled by mutation onError
    }
  };

  const services = profileData?.providerProfile?.services || [];

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
        <button onClick={openAddModal} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Content Area */}
      {profileLoading ? (
        <div className="min-h-[300px] flex items-center justify-center text-slate-400 font-bold">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">You haven't added any services yet</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Create your first service to start accepting bookings from customers in your area.</p>
          <button onClick={openAddModal} className="mt-6 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
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
                {service.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{service.description}</p>
                )}
              </div>
              <div className="mt-6 flex gap-2 pt-4 border-t border-slate-100 justify-end">
                <button onClick={() => openEditModal(service)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                  <Edit className="h-4.5 w-4.5" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete">
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Service' : 'Create New Service'}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  placeholder="e.g. Deep Home Cleaning" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category *</label>
                <select 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {categoryData?.categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price ($) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration (mins)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    placeholder="60" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  placeholder="Detail what is included in this service..." 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={closeModal} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                   Cancel
                 </button>
                 <button type="submit" disabled={creating || updating} className={`px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all ${(creating || updating) ? 'opacity-50' : ''}`}>
                   {creating || updating ? 'Saving...' : (isEditMode ? 'Update Service' : 'Create Service')}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
