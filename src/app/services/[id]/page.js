'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShieldAlert, Sparkles, Clock, Check, Calendar, ArrowLeft } from 'lucide-react';

const MOCK_SERVICES = [];
const MOCK_PROVIDERS = [];
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';

export default function ServiceDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const srv = MOCK_SERVICES.find(s => s.id === id);
    if (srv) {
      setService(srv);
      const provs = MOCK_PROVIDERS.filter(p => p.services.includes(srv.id) && p.status === 'verified');
      setProviders(provs);
    }
  }, [id]);

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4 flex-1">
        <ShieldAlert className="h-10 w-10 text-rose-500" />
        <h2 className="text-xl font-bold">Service Not Found</h2>
        <p className="text-sm text-muted-foreground">The service ID you requested is invalid or has been archived.</p>
        <Link href="/services">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      {/* Back button */}
      <div>
        <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Service Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase bg-brand/10 text-brand px-2.5 py-1 rounded-full">
              {service.category.replace('-', ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{service.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand" /> Duration: {service.duration}</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> Rated {service.rating} ({providers.length} Partners)</span>
            </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand" /> What&apos;s Included?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Background-verified partner', 'Fixed flat rates', '24/7 service warranty', 'Eco-friendly/safe materials', 'Post-service cleanup', 'Secure payment handling'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Providers List */}
        <div className="space-y-4">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <h3 className="font-bold text-foreground">Available Service Partners</h3>
            <p className="text-xs text-muted-foreground">Choose your preferred provider to proceed with booking.</p>
            
            <div className="space-y-3 pt-2">
              {providers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-6">No providers currently available for this service</p>
              ) : (
                providers.map((p) => (
                  <div key={p.id} className="p-4 border border-border bg-background rounded-xl hover:border-brand/40 transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={p.avatar} alt={p.name} size="md" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {p.rating}
                          </span>
                          <span>•</span>
                          <span>{p.reviewsCount} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-base font-bold text-foreground">${service.price}</span>
                      <Link href={`/providers/${p.id}?service=${service.id}&book=true`}>
                        <Button size="sm" variant="accent">Book Partner</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
