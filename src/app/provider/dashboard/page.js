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
    <div className="p-5 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Overview</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Monitor payouts, appointments and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.subscriptionPlan && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20 uppercase tracking-widest shadow-sm">
              {stats.subscriptionPlan} Plan
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-full border border-brand/20 uppercase tracking-widest shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
            Online
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Pending Requests */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> New Requests
            </h2>
            {pendingBookings.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {pendingBookings.length} pending
              </span>
            )}
          </div>
          <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            {bookingsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Loading requests...</p>
              </div>
            ) : pendingBookings.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-muted/30">
                <div className="h-14 w-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-3 shadow-sm">
                  <CheckCheck className="h-6 w-6 text-brand" />
                </div>
                <p className="text-base font-bold text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">No pending requests right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-1 block">
                          Request #{b.id.substring(b.id.length - 6)}
                        </span>
                        <h4 className="font-bold text-foreground text-base">{b.service?.name}</h4>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">
                          {b.customer?.name || b.customerName || 'Customer'}
                          {b.bookingDate && <> <span className="mx-1.5 opacity-50">•</span> {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>}
                        </p>
                      </div>
                      <span className="text-lg font-black text-brand shrink-0">
                        ₹{b.totalPrice || b.service?.price}
                      </span>
                    </div>
                    {b.location?.address && (
                      <div className="inline-block max-w-full text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg mb-4 truncate border border-border">
                        📍 {b.location.address}
                      </div>
                    )}
                    <div className="flex gap-2 justify-end pt-3 border-t border-border">
                      <button
                         onClick={() => handleReject(b.id)}
                         className="flex items-center gap-1.5 px-4 py-2 bg-card border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all"
                      >
                        <X className="h-4 w-4" /> Decline
                      </button>
                      <button
                        onClick={() => handleAccept(b.id)}
                        className="flex items-center gap-1.5 px-6 py-2 bg-brand text-white hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 rounded-xl text-xs font-bold transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Accept Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Schedule */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" /> Active Schedule
            </h2>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            {bookingsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Loading schedule...</p>
              </div>
            ) : confirmedBookings.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-muted/30">
                <div className="h-14 w-14 rounded-full bg-muted border border-border flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground">No upcoming jobs</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">Your schedule is clear.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {confirmedBookings.slice(0, 8).map((b) => (
                  <div key={b.id} className="p-4 sm:p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{b.service?.name}</p>
                        <p className="text-xs font-medium text-muted-foreground mt-1">
                          {b.bookingDate
                            ? new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'long' })
                            : 'Date TBD'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${
                        b.status === 'IN_PROGRESS'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : 'bg-brand/10 text-brand border border-brand/20'
                      }`}>
                        {b.status === 'IN_PROGRESS' ? 'In Progress' : 'Confirmed'}
                      </span>
                    </div>
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleComplete(b.id)}
                        className="mt-4 w-full py-2 bg-foreground hover:bg-foreground/90 text-background rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                        Mark as Completed
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
    emerald: { bg: 'bg-brand/10', border: 'border-brand/20', text: 'text-brand', val: 'text-foreground', iconBg: 'bg-card', shadow: 'shadow-brand/5' },
    amber:   { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', val: 'text-foreground', iconBg: 'bg-card', shadow: 'shadow-amber-500/5' },
    blue:    { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', val: 'text-foreground', iconBg: 'bg-card', shadow: 'shadow-blue-500/5' },
    violet:  { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-500', val: 'text-foreground', iconBg: 'bg-card', shadow: 'shadow-violet-500/5' },
    slate:   { bg: 'bg-card', border: 'border-border', text: 'text-muted-foreground', val: 'text-foreground', iconBg: 'bg-muted/50', shadow: 'shadow-black/5' },
  };
  const a = accents[accent] || accents.slate;

  return (
    <div className={`${a.bg} border ${a.border} rounded-2xl p-5 sm:p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg ${a.shadow} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
        <div className={`h-9 w-9 rounded-xl ${a.iconBg} shadow-sm border ${a.border} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${a.text}`} />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-black tracking-tight ${a.val}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1 font-semibold">{sub}</p>
      </div>
    </div>
  );
}
