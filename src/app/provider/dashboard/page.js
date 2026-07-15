'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  DollarSign, Calendar, CheckCircle2, Star,
  AlertCircle, Clock, CheckCheck, X, TrendingUp, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { PROVIDER_DASHBOARD_STATS_QUERY } from '../../../graphql/queries/provider';
import { GET_MY_BOOKINGS } from '../../../graphql/queries/bookings';
import { UPDATE_BOOKING_STATUS_MUTATION } from '../../../graphql/mutations/bookings';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function ProviderDashboard() {
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery(PROVIDER_DASHBOARD_STATS_QUERY, {
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });
  const { data: bookingsData, loading: bookingsLoading, refetch } = useQuery(GET_MY_BOOKINGS, {
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });
  const [bookingToReject, setBookingToReject] = React.useState(null);

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS_MUTATION, {
    onCompleted: () => { refetch(); refetchStats(); },
    onError: (err) => toast.error(err.message || 'Error updating booking'),
  });

  const stats = statsData?.providerDashboardStats || { totalEarnings: 0, pendingTasks: 0, completedJobs: 0, averageRating: 0 };
  const providerBookings = bookingsData?.bookings || [];
  const pendingBookings = providerBookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = providerBookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');

  const handleAccept = async (id) => {
    try {
      await updateBookingStatus({ variables: { id, status: 'ACCEPTED' } });
      toast.success('Booking confirmed!');
    } catch (e) { console.error(e); }
  };
  const handleReject = (id) => setBookingToReject(id);
  const confirmReject = async () => {
    if (bookingToReject) {
      try {
        await updateBookingStatus({ variables: { id: bookingToReject, status: 'REJECTED' } });
        toast.success('Booking declined');
        setBookingToReject(null);
      } catch (e) { console.error(e); }
    }
  };
  const handleComplete = async (id) => {
    try {
      await updateBookingStatus({ variables: { id, status: 'COMPLETED' } });
      toast.success('Marked as completed!');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Monitor payouts, appointments and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.subscriptionPlan && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100 uppercase tracking-widest">
              {stats.subscriptionPlan} Plan
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <StatCard
          title="Total Earnings"
          value={statsLoading ? '—' : `₹${stats.totalEarnings.toLocaleString('en-IN')}`}
          icon={DollarSign}
          accent="emerald"
          sub="Lifetime"
        />
        <StatCard
          title="Pending Tasks"
          value={statsLoading ? '—' : stats.pendingTasks}
          icon={Clock}
          accent={stats.pendingTasks > 0 ? 'amber' : 'slate'}
          sub={stats.pendingTasks > 0 ? 'Need attention' : 'All clear'}
        />
        <StatCard
          title="Completed Jobs"
          value={statsLoading ? '—' : stats.completedJobs}
          icon={CheckCircle2}
          accent="blue"
          sub="Total finished"
        />
        <StatCard
          title="Avg. Rating"
          value={statsLoading ? '—' : stats.averageRating.toFixed(1)}
          icon={Star}
          accent="violet"
          sub="Customer score"
        />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">

        {/* Pending Requests */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-800">New Requests</h2>
            {pendingBookings.length > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingBookings.length} pending
              </span>
            )}
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-y-auto min-h-0">
            {bookingsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : pendingBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 py-8">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400">No pending requests right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                          #{b.id.substring(b.id.length - 6)}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{b.service?.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {b.customer?.name || b.customerName || 'Customer'}
                          {b.bookingDate && <> · {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>}
                        </p>
                      </div>
                      <span className="text-base font-black text-emerald-600 shrink-0">
                        ₹{b.totalPrice || b.service?.price}
                      </span>
                    </div>
                    {b.location?.address && (
                      <p className="text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md mb-2 truncate">{b.location.address}</p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleReject(b.id)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                      >
                        <X className="h-3 w-3" /> Decline
                      </button>
                      <button
                        onClick={() => handleAccept(b.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Schedule */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-800">Active Schedule</h2>
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-y-auto min-h-0">
            {bookingsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : confirmedBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-1.5 py-8">
                <Calendar className="h-8 w-8 text-slate-200" />
                <p className="text-xs font-medium text-slate-400">No upcoming jobs</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 p-2">
                {confirmedBookings.slice(0, 8).map((b) => (
                  <div key={b.id} className="py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-xs text-slate-900 truncate">{b.service?.name}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                        b.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {b.status === 'IN_PROGRESS' ? 'In Progress' : 'Confirmed'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })
                        : 'Date TBD'}
                    </p>
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleComplete(b.id)}
                        className="mt-2 w-full py-1.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                      >
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
        title="Decline Booking"
        message="Are you sure you want to decline this booking? The customer will be notified."
        confirmText="Decline"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accent, sub }) {
  const accents = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', val: 'text-emerald-700' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   val: 'text-amber-700' },
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    val: 'text-slate-900' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  val: 'text-slate-900' },
    slate:   { bg: 'bg-slate-50',   text: 'text-slate-400',   val: 'text-slate-900' },
  };
  const a = accents[accent] || accents.slate;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className={`h-7 w-7 rounded-lg ${a.bg} flex items-center justify-center`}>
          <Icon className={`h-3.5 w-3.5 ${a.text}`} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-black tracking-tight ${a.val}`}>{value}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{sub}</p>
      </div>
    </div>
  );
}
