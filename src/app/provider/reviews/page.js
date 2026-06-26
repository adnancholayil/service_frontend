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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Customer Reviews <Star className="h-6 w-6 text-amber-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Read feedback from your clients and manage your reputation.</p>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
         <div className="min-h-[300px] flex items-center justify-center text-slate-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No reviews yet</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Once you complete jobs, customers will be able to leave ratings and reviews here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                    {review.customer?.avatar ? (
                      <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{review.customer?.name?.[0]}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.customer?.name}</h4>
                    <p className="text-xs text-slate-500">{new Date(parseInt(review.createdAt)).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-sm text-slate-700 italic">"{review.comment}"</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Service: {review.booking?.service?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
