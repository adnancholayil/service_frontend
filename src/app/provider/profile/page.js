'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function ProviderProfile() {
  const providers = useSelector((state) => state.provider.providers);
  const activeProvider = providers.find(p => p.id === 'prov-1') || { name: 'Alex Mercer', title: 'Specialist', about: '', coverImage: '' };

  const [title, setTitle] = useState(activeProvider.title);
  const [about, setAbout] = useState(activeProvider.about);
  const [coverImage, setCoverImage] = useState(activeProvider.coverImage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Business profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Business Profile <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your title description, about details, and gallery cover images.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Professional Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">About/Bio description</label>
            <textarea
              rows={5}
              className="w-full p-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-brand text-sm"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
            />
          </div>

          <Input
            label="Cover Image Banner URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              Save Business Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
