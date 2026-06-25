'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AdminBanners() {
  const [banners, setBanners] = useState([
    { id: 'b-1', title: 'Summer Cleaning Offer', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500', desc: 'Get 20% off on all deep cleaning services.' },
    { id: 'b-2', title: 'Monsoon AC Special', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500', desc: 'AC tune-ups and servicing at flat rates.' }
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner from carousel database?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      toast.success('Promo banner deleted');
    }
  };

  const handleAdd = () => {
    toast.success('Simulated banner upload successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Promotion Banners Console <Sparkles className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configure client-side home page slider advertisements and promo banners.</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-1.5 rounded-xl text-xs py-2">
          <Plus className="h-4 w-4" /> Create Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <Card key={b.id} className="bg-card">
            <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-800">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <CardBody className="p-5 flex justify-between items-start gap-4">
              <div>
                <h4 className="font-bold text-foreground text-sm">{b.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
