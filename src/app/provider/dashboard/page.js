'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  Sparkles,
  TrendingUp,
  AlertCircle,
  XCircle,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

import { PROVIDER_DASHBOARD_STATS_QUERY } from '../../../graphql/queries/provider';
import { GET_MY_BOOKINGS } from '../../../graphql/queries/bookings';
import { UPDATE_BOOKING_STATUS_MUTATION } from '../../../graphql/mutations/bookings';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function ProviderDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(PROVIDER_DASHBOARD_STATS_QUERY);
  const { data: bookingsData, loading: bookingsLoading, refetch } = useQuery(GET_MY_BOOKINGS);
  const [bookingToReject, setBookingToReject] = React.useState(null);
  
  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || 'Error updating booking');
    }
  });

  const stats = statsData?.providerDashboardStats || {
    totalEarnings: 0,
    pendingTasks: 0,
    completedJobs: 0,
    averageRating: 0
  };

  const providerBookings = bookingsData?.bookings || [];
  const pendingBookings = providerBookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = providerBookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');

  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatus({ variables: { id: bookingId, status: 'ACCEPTED' } });
      toast.success('Booking confirmed! Customer has been notified.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = (bookingId) => {
    setBookingToReject(bookingId);
  };

  const confirmReject = async () => {
    if (bookingToReject) {
      try {
        await updateBookingStatus({ variables: { id: bookingToReject, status: 'REJECTED' } });
        toast.success('Booking rejected');
        setBookingToReject(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await updateBookingStatus({ variables: { id: bookingId, status: 'COMPLETED' } });
      toast.success('Job marked as completed!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Overview <Sparkles className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Monitor payouts, accept appointments, and analyze performance.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Partner Account Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value={statsLoading ? "..." : `$${stats.totalEarnings.toLocaleString()}`} 
          icon={DollarSign} 
          trendColor="text-emerald-600"
          trendIcon="↑"
          trend="Lifetime"
        />
        <StatCard 
          title="Pending Tasks" 
          value={statsLoading ? "..." : stats.pendingTasks} 
          icon={Calendar} 
          trendColor={stats.pendingTasks > 0 ? "text-amber-600" : "text-slate-500"}
          trendIcon={stats.pendingTasks > 0 ? "!" : "-"}
          trend={stats.pendingTasks > 0 ? "Awaiting reply" : "None pending"}
        />
        <StatCard 
          title="Completed Jobs" 
          value={statsLoading ? "..." : stats.completedJobs} 
          icon={CheckCircle} 
          trendColor="text-emerald-600"
          trendIcon="✓"
          trend="Finished"
        />
        <StatCard 
          title="Average Rating" 
          value={statsLoading ? "..." : stats.averageRating.toFixed(1)} 
          icon={Star} 
          trendColor="text-indigo-600"
          trendIcon="★"
          trend="Customer score"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-emerald-500" /> 
              Action Required: New Requests
            </h2>
          </div>
          
          {bookingsLoading ? (
             <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center text-slate-400 text-sm font-medium">
               Loading appointments...
             </div>
          ) : pendingBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-500 opacity-60" />
              </div>
              <p className="text-sm font-semibold text-slate-600">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">You don't have any pending appointment requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase bg-slate-100 px-2 py-1 rounded-md">
                        #{b.id.substring(b.id.length - 6)}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2">{b.service?.name}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Customer: <span className="font-semibold text-slate-700">{b.customer?.name || b.customerName || 'Customer'}</span></p>
                    </div>
                    <span className="text-xl font-black text-emerald-600">${b.totalPrice || b.service?.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-600 py-3 border-y border-slate-100">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400"/> {new Date(b.bookingDate || b.date).toLocaleDateString()}</span>
                  </div>

                  {(b.notes || b.location?.address) && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                       {b.location?.address && <p><span className="font-semibold">Address:</span> {b.location.address}</p>}
                       {b.notes && <p><span className="font-semibold text-slate-500 italic">"{b.notes}"</span></p>}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 justify-end">
                    <button onClick={() => handleReject(b.id)} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
                      Decline
                    </button>
                    <button onClick={() => handleAccept(b.id)} className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
                      Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-800">Active Schedule</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {bookingsLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
            ) : confirmedBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm font-medium">No upcoming jobs.</div>
            ) : (
              <div className="divide-y divide-slate-100 p-2">
                {confirmedBookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-slate-900 truncate pr-4">{b.service?.name}</p>
                      <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md whitespace-nowrap">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{new Date(b.bookingDate || b.date).toLocaleDateString()}</p>
                    {b.location?.address && <p className="text-xs text-slate-400 truncate">{b.location.address}</p>}
                    {b.status === 'ACCEPTED' && (
                       <button onClick={() => handleComplete(b.id)} className="mt-2 w-full px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                         Mark Completed
                       </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmModal 
        isOpen={!!bookingToReject} 
        onClose={() => setBookingToReject(null)}
        onConfirm={confirmReject}
        title="Reject Booking"
        message="Are you sure you want to decline this booking request? The customer will be notified."
        confirmText="Decline"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trendColor, trendIcon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trendColor}`}>
          <span>{trendIcon}</span> {trend}
        </p>
      </div>
    </div>
  );
}
