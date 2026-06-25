'use client';

import React from 'react';
import { Sparkles, Save, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function ProviderSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Business settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Partner Settings <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure business operating details and payment options.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Service Radius (km)"
            type="number"
            defaultValue={15}
          />

          <Input
            label="Payout Account Routing Number"
            type="text"
            defaultValue="xxxx-xxxx-8890"
          />

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
