'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BANNERS } from '../../../graphql/queries/banners';
import { CREATE_BANNER_MUTATION, UPDATE_BANNER_MUTATION, DELETE_BANNER_MUTATION } from '../../../graphql/mutations/admin';
import { Image as ImageIcon, Plus, Trash2, Edit2, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import ImageUpload from '../../../components/ui/ImageUpload';

export default function AdminBanners() {
  const { data, loading, error, refetch } = useQuery(GET_BANNERS, {
    fetchPolicy: 'cache-and-network',
    skip: typeof window === 'undefined',
  });

  const [createBanner, { loading: creating }] = useMutation(CREATE_BANNER_MUTATION);
  const [updateBanner, { loading: updating }] = useMutation(UPDATE_BANNER_MUTATION);
  const [deleteBanner, { loading: deleting }] = useMutation(DELETE_BANNER_MUTATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', link: '', isActive: true });
  const [bannerToDelete, setBannerToDelete] = useState(null);
  
  const banners = data?.adminBanners || [];

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ 
        title: banner.title, 
        imageUrl: banner.imageUrl, 
        link: banner.link || '', 
        isActive: banner.isActive 
      });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', imageUrl: '', link: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.imageUrl.trim()) return toast.error('Image URL is required');

    try {
      if (editingBanner) {
        await updateBanner({
          variables: {
            id: editingBanner.id,
            title: formData.title,
            imageUrl: formData.imageUrl,
            link: formData.link,
            isActive: formData.isActive
          }
        });
        toast.success('Banner updated successfully');
      } else {
        await createBanner({
          variables: {
            title: formData.title,
            imageUrl: formData.imageUrl,
            link: formData.link
          }
        });
        toast.success('Banner created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const handleDelete = (id, title) => {
    setBannerToDelete({ id, title });
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBanner({ variables: { id: bannerToDelete.id } });
      toast.success('Banner deleted');
      setBannerToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );

  if (error) {
    console.error("BANNERS PAGE ERROR:", error);
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Error loading banners: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Promo Banners <ImageIcon className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Manage homepage marketing banners and promotional campaigns.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-md">
          <Plus className="h-4 w-4" /> Upload Banner
        </Button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border-2 border-dashed border-border">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">No active banners</h2>
            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md">Upload your first promotional banner to display it to customers on the main landing page.</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              
              <div className="relative aspect-[21/9] w-full bg-muted overflow-hidden border-b border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 ${!banner.isActive ? 'grayscale opacity-70' : ''}`}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400?text=Invalid+Image+URL'; }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${banner.isActive ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-foreground text-xl mb-1 line-clamp-1" title={banner.title}>{banner.title}</h3>
                
                {banner.link ? (
                  <a href={banner.link} target="_blank" rel="noreferrer" className="text-brand flex items-center gap-1.5 text-sm font-medium hover:underline mb-4 line-clamp-1">
                    <LinkIcon className="h-3.5 w-3.5" /> {banner.link}
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm mb-4">No link attached</p>
                )}
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {banner.id.slice(-6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(banner)} className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(banner.id, banner.title)} disabled={deleting} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBanner ? 'Edit Banner' : 'Upload Banner'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="banner-title"
            label="Internal Title"
            placeholder="e.g. Summer Sale 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <ImageUpload 
            label="Banner Image" 
            initialImage={formData.imageUrl} 
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })} 
          />

          <Input
            id="banner-link"
            label="Target Link (Optional)"
            placeholder="https://example.com/promo"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          
          {editingBanner && (
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card mt-2">
              <div>
                <p className="font-semibold text-sm">Status</p>
                <p className="text-xs text-muted-foreground">Control if this banner is visible to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creating || updating}>
              {editingBanner ? 'Save Changes' : 'Upload Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={!!bannerToDelete} 
        onClose={() => setBannerToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        message={`Are you sure you want to delete the "${bannerToDelete?.title}" banner?`}
        confirmText="Delete"
      />
    </div>
  );
}
