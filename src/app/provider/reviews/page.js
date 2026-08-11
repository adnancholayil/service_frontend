'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Flag, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { REPORT_REVIEW_MUTATION } from '../../../graphql/mutations/provider';

import { GET_PROVIDER_REVIEWS } from '../../../graphql/queries/provider';

export default function ProviderReviews() {
  const { user } = useSelector((state) => state.auth);
  
  const { data, loading, refetch } = useQuery(GET_PROVIDER_REVIEWS, {
    variables: { providerUserId: user?.id },
    skip: !user?.id,
  });

  const [reportReview, { loading: reporting }] = useMutation(REPORT_REVIEW_MUTATION);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reviewToReport, setReviewToReport] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const reviews = data?.providerReviews || [];

  const handleReportClick = (review) => {
    setReviewToReport(review);
    setReportReason('');
    setReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }
    
    try {
      await reportReview({
        variables: {
          reviewId: reviewToReport.id,
          reason: reportReason.trim()
        }
      });
      toast.success('Review reported successfully');
      setReportModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to report review');
    }
  };

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-hidden">

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Customer Reviews <Star className="h-4 w-4 text-amber-500" />
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Read feedback from your clients and manage your reputation.</p>
        </div>
        {reviews.length > 0 && (
          <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-border border-t-brand rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <MessageSquare className="h-10 w-10 text-muted" />
            <p className="text-sm font-semibold text-muted-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">Once you complete jobs, customers will leave ratings here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
            {reviews.map(review => (
              <div key={review.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                      {review.customer?.avatar ? (
                        <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-xs">{review.customer?.name?.[0]}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{review.customer?.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{new Date(parseInt(review.createdAt)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted/50'}`} />
                      ))}
                    </div>
                    {review.isReported ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${review.reportStatus === 'REJECTED' ? 'bg-red-100 text-red-600' : review.reportStatus === 'RESOLVED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {review.reportStatus === 'REJECTED' ? 'Report Rejected' : review.reportStatus === 'RESOLVED' ? 'Report Resolved' : 'Report Pending'}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleReportClick(review)}
                        className="cursor-pointer text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-colors flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md mt-1 shadow-sm"
                      >
                        <Flag className="h-3 w-3" /> Report Issue
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-xs text-muted-foreground italic bg-muted/50 px-3 py-2 rounded-lg">"{review.comment}"</p>
                )}
                {review.booking?.service?.name && (
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">
                    Service: {review.booking.service.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Review">
        <div className="space-y-4">
          <div className="flex gap-3 bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Reporting Guidelines</p>
              <p className="mt-1">Only report reviews that violate our terms of service (e.g., spam, harassment, inappropriate content, or false claims from users who did not receive service).</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Reason for Reporting</label>
            <textarea
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 min-h-[100px] resize-none"
              placeholder="Please explain in detail why this review should be removed..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleReportSubmit} isLoading={reporting} className="bg-red-500 hover:bg-red-600 text-white border-red-500">
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
