'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles, Briefcase, UserCheck, ShieldAlert, Award } from 'lucide-react';
import toast from 'react-hot-toast';

import { updateProviderVerification } from '../../../store/slices/providerSlice';
import Avatar from '../../../components/ui/Avatar';
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function AdminProviders() {
  const dispatch = useDispatch();
  const providers = useSelector((state) => state.provider.providers);

  const handleVerify = (provId) => {
    dispatch(updateProviderVerification({ id: provId, status: 'verified' }));
    toast.success('Service partner verified! Listed online.');
  };

  const handleSuspend = (provId) => {
    if (window.confirm('Suspend this partner?')) {
      dispatch(updateProviderVerification({ id: provId, status: 'suspended' }));
      toast.error('Partner status set to suspended');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Partner Verification Console <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review onboarding applications, verify background reports, and configure partner listings.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p) => (
          <Card key={p.id} className="bg-card">
            <CardBody className="p-6 flex flex-col justify-between h-full space-y-4">
              <div className="flex gap-4 items-start">
                <Avatar src={p.avatar} alt={p.name} size="lg" className="rounded-xl shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-foreground">{p.name}</h4>
                    <Badge variant={p.status === 'verified' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-brand">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{p.about}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                {p.status !== 'verified' && (
                  <Button size="sm" variant="primary" onClick={() => handleVerify(p.id)}>
                    Verify & Approve
                  </Button>
                )}
                {p.status !== 'suspended' && (
                  <Button size="sm" variant="outline" className="border-border text-xs" onClick={() => handleSuspend(p.id)}>
                    Suspend
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
