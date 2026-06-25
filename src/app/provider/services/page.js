'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles, Plus, Check, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_SERVICES = [];
import { addProviderService, removeProviderService } from '../../../store/slices/providerSlice';
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ProviderServices() {
  const dispatch = useDispatch();
  const providers = useSelector((state) => state.provider.providers);
  const activeProvider = providers.find(p => p.id === 'prov-1');

  const activeServiceIds = activeProvider ? activeProvider.services : [];

  const handleToggleService = (serviceId) => {
    const isOffering = activeServiceIds.includes(serviceId);
    
    if (isOffering) {
      // Prevent deleting if the provider has only one service left
      if (activeServiceIds.length === 1) {
        toast.error('You must offer at least one service');
        return;
      }
      dispatch(removeProviderService({ id: 'prov-1', serviceId }));
      toast.success('Service removed from your portfolio catalog');
    } else {
      dispatch(addProviderService({ id: 'prov-1', serviceId }));
      toast.success('Service added to your portfolio catalog');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Service Catalogue <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add or remove service categories you offer. Updated settings reflect instantly on client listings.
        </p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SERVICES.map((srv) => {
          const isOffering = activeServiceIds.includes(srv.id);
          return (
            <Card
              key={srv.id}
              className={`bg-card border transition-all ${
                isOffering ? 'border-brand/40 shadow-md ring-1 ring-brand/10' : 'border-border'
              }`}
            >
              <CardBody className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase bg-muted px-2 py-0.5 rounded">
                      {srv.category.replace('-', ' ')}
                    </span>
                    {isOffering && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-brand uppercase tracking-wider bg-brand/10 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" /> Active Offering
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-foreground text-base leading-snug">{srv.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-3">{srv.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="font-extrabold text-lg text-foreground">${srv.price}</span>
                  <Button
                    size="sm"
                    variant={isOffering ? 'outline' : 'primary'}
                    className="rounded-xl border-border"
                    onClick={() => handleToggleService(srv.id)}
                  >
                    {isOffering ? 'Disable Service' : 'Enable Service'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
