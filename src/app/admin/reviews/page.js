'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody } from '../../../components/ui/Card';

export default function AdminReviews() {
  const providers = useSelector((state) => state.provider.providers);
  
  // Aggregate all reviews across all providers
  const [allReviews, setAllReviews] = useState(() => {
    return providers.flatMap(p => 
      p.reviews.map(r => ({
        ...r,
        providerName: p.name,
        providerId: p.id
      }))
    );
  });

  const handleDelete = (revId) => {
    if (window.confirm('Delete this review from platform registry?')) {
      setAllReviews(prev => prev.filter(r => r.id !== revId));
      toast.success('Review deleted (moderated)');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Platform Reviews Moderation <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Audit customer ratings logs, filter flags, and delete inappropriate content reviews.</p>
      </div>

      {/* List */}
      <div className="space-y-4 max-w-4xl">
        {allReviews.map((rev) => (
          <Card key={rev.id} className="bg-card">
            <CardBody className="p-5 flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{rev.user}</h4>
                    <p className="text-[10px] text-muted-foreground">Provider: <span className="font-semibold text-brand">{rev.providerName}</span></p>
                  </div>
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
              </div>

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all shrink-0 cursor-pointer"
                title="Delete/Moderate review"
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
