'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_REVIEWS, GET_REPORTED_REVIEWS } from '../../../graphql/queries/admin';
import { DELETE_REVIEW_MUTATION, RESOLVE_REVIEW_REPORT_MUTATION } from '../../../graphql/mutations/admin';
import { Star, Trash2, Loader2, AlertCircle, MessageSquare, Flag, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'reported'
  
  const { data, loading, error, refetch } = useQuery(GET_REVIEWS, {
    fetchPolicy: 'cache-and-network',
    skip: typeof window === 'undefined' || activeTab !== 'all',
  });

  const { data: reportedData, loading: reportedLoading, refetch: refetchReported } = useQuery(GET_REPORTED_REVIEWS, {
    fetchPolicy: 'cache-and-network',
    skip: typeof window === 'undefined' || activeTab !== 'reported',
  });

  const [deleteReview, { loading: deleting }] = useMutation(DELETE_REVIEW_MUTATION);
  const [resolveReport, { loading: resolving }] = useMutation(RESOLVE_REVIEW_REPORT_MUTATION);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
  const reviews = data?.adminReviews || [];
  const reportedReviews = reportedData?.adminReportedReviews || [];

  const handleDelete = (id) => {
    setReviewToDelete(id);
  };

  const handleResolve = async (id, action) => {
    try {
      await resolveReport({ variables: { reviewId: id, action } });
      toast.success(action === 'APPROVE' ? 'Review deleted successfully' : 'Report rejected');
      refetchReported();
    } catch (err) {
      toast.error(err.message || 'Failed to resolve report');
    }
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview({ variables: { id: reviewToDelete } });
      toast.success('Review deleted');
      setReviewToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'}`}
          />
        ))}
      </div>
    );
  };

  if (loading || reportedLoading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
    </div>
  );

  if (error) return (
    <div className="flex h-64 flex-col items-center justify-center text-destructive">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p>Error loading reviews</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Platform Reviews <Star className="h-6 w-6 text-brand fill-brand/20" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Moderate customer feedback and maintain quality standards.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveTab('reported')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'reported' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Reported <Flag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {(activeTab === 'all' ? reviews : reportedReviews).length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">All caught up</h2>
            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md">There are no {activeTab === 'reported' ? 'reported ' : ''}reviews that require administrative moderation at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Provider</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Comment {activeTab === 'reported' && '& Reason'}</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(activeTab === 'all' ? reviews : reportedReviews).map((review) => (
                  <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold uppercase overflow-hidden shrink-0">
                          {review.customer?.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={review.customer.avatar} alt="avatar" className="h-full w-full object-cover" />
                          ) : (
                            review.customer?.name?.[0] || '?'
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{review.customer?.name || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{review.customer?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground line-clamp-1">{review.provider?.businessName || 'Unknown Provider'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">ID: {review.provider?.id?.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                      <p className="text-xs text-muted-foreground mt-1.5">{new Date(Number(review.createdAt)).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">{review.comment || <span className="italic text-slate-400">No comment provided</span>}</p>
                      {activeTab === 'reported' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <p className="text-xs font-bold text-red-800 flex items-center gap-1.5 mb-1">
                            <Flag className="h-3 w-3" /> Reported By Provider
                          </p>
                          <p className="text-xs text-red-700 italic">"{review.reportReason}"</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeTab === 'all' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ml-auto"
                          onClick={() => handleDelete(review.id)}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2 items-end justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 w-full justify-center"
                            onClick={() => handleResolve(review.id, 'APPROVE')}
                            disabled={resolving}
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5" /> Approve (Delete)
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 w-full justify-center"
                            onClick={() => handleResolve(review.id, 'REJECT')}
                            disabled={resolving}
                          >
                            <XCircle className="h-4 w-4 mr-1.5" /> Reject Report
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!reviewToDelete} 
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
