'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Star } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';

export default function ProviderReviews() {
  const providers = useSelector((state) => state.provider.providers);
  const activeProvider = providers.find(p => p.id === 'prov-1');

  const reviews = activeProvider ? activeProvider.reviews : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Partner Reviews <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review dashboard logs and customer feedback rating cards.</p>
      </div>

      {/* List */}
      <div className="space-y-4 max-w-3xl">
        {reviews.length === 0 ? (
          <div className="p-8 text-center border border-border bg-card rounded-2xl">
            <Star className="h-8 w-8 text-muted-foreground opacity-40 mx-auto" />
            <p className="font-bold text-sm text-muted-foreground mt-2">No reviews logged yet</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <Card key={rev.id} className="bg-card">
              <CardBody className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-foreground text-sm">{rev.user}</h4>
                  <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                </div>
                
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
