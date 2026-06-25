'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ArrowLeft, Star, Sparkles } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';

export default function ReviewsPage() {
  const reviews = useSelector((state) => state.user.reviews);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      <div>
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          My Reviews & Ratings <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Check reviews logs and rating history of completed bookings.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Star className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No reviews submitted yet</h3>
          <p className="text-xs text-muted-foreground">Once a service booking is completed, you can rate and review providers from the booking details page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev, i) => (
            <Card key={i} className="bg-card">
              <CardBody className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-foreground">{rev.providerName}</h4>
                    <p className="text-[10px] text-muted-foreground">Service: {rev.serviceTitle}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                </div>
                
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
