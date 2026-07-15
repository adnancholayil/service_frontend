'use client';

import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { useSelector } from 'react-redux';

import { GET_PROVIDER_REVIEWS } from '../../../graphql/queries/provider';

export default function ProviderReviews() {
  const { user } = useSelector((state) => state.auth);
  
  const { data, loading } = useQuery(GET_PROVIDER_REVIEWS, {
    variables: { providerUserId: user?.id },
    skip: !user?.id,
  });

  const reviews = data?.providerReviews || [];

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-hidden">

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Customer Reviews <Star className="h-4 w-4 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Read feedback from your clients and manage your reputation.</p>
        </div>
        {reviews.length > 0 && (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-amber-400 rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <MessageSquare className="h-10 w-10 text-slate-200" />
            <p className="text-sm font-semibold text-slate-500">No reviews yet</p>
            <p className="text-xs text-slate-400 text-center max-w-xs">Once you complete jobs, customers will leave ratings here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                      {review.customer?.avatar ? (
                        <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">{review.customer?.name?.[0]}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{review.customer?.name}</h4>
                      <p className="text-[11px] text-slate-400">{new Date(parseInt(review.createdAt)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 px-3 py-2 rounded-lg">"{review.comment}"</p>
                )}
                {review.booking?.service?.name && (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                    Service: {review.booking.service.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
