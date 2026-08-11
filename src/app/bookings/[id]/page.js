'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKING_BY_ID } from '../../../graphql/queries/bookings';
import { Calendar, Clock, MapPin, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function BookingDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, loading, error } = useQuery(GET_BOOKING_BY_ID, {
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 flex flex-col items-center justify-center space-y-4 flex-1">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading booking details...</p>
      </div>
    );
  }

  const booking = data?.bookingDetails;

  if (error || !booking) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center space-y-4 flex-1">
        <AlertTriangle className="h-10 w-10 text-rose-500" />
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <p className="text-sm text-muted-foreground">{error ? error.message : 'The booking ID you requested is invalid.'}</p>
        <Link href="/bookings">
          <Button>Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const parseDate = (dStr) => {
    if (!dStr) return null;
    return /^\d+$/.test(dStr) ? new Date(parseInt(dStr, 10)) : new Date(dStr);
  };

  const bookingDateObj = parseDate(booking.bookingDate);
  const formattedDate = bookingDateObj ? bookingDateObj.toLocaleDateString() : 'Invalid Date';
  const formattedTime = bookingDateObj ? bookingDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time';

  const statusStr = (booking.status || '').toUpperCase();
  const paymentStatusStr = (booking.paymentStatus || '').toUpperCase();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'primary';
      default: return 'default';
    }
  };

  const steps = [
    { label: 'Booking Created', desc: 'Sent request to provider', date: booking.createdAt, done: true },
    { label: 'Provider Confirmed', desc: 'Partner accepted slot', date: booking.createdAt, done: statusStr !== 'PENDING' && statusStr !== 'CANCELLED' },
    { label: 'Work in Progress', desc: 'Partner on site', date: booking.createdAt, done: statusStr === 'COMPLETED' },
    { label: 'Service Completed', desc: 'Signed off and paid', date: booking.createdAt, done: statusStr === 'COMPLETED' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
      {/* Back Link */}
      <div>
        <Link href="/bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to My Bookings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Booking Timeline Tracker */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-foreground">Service Progress Tracker</h2>
            
            {/* Vertical timeline */}
            <div className="relative border-l-2 border-border pl-6 space-y-6">
              {steps.map((st, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <span className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-card flex items-center justify-center ${
                    st.done
                      ? 'bg-brand'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`} />
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold leading-none ${st.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {st.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">{st.desc}</p>
                    {st.done && (
                      <span className="text-[10px] text-muted-foreground block pt-1">
                        {new Date(st.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Appointment Spec details Card */}
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <span className="text-[10px] sm:text-xs font-extrabold text-muted-foreground uppercase tracking-wider truncate max-w-[200px] sm:max-w-none" title={`ID: #${booking.id}`}>
                ID: #{booking.id}
              </span>
              <div className="flex gap-1.5 shrink-0">
                <Badge variant={getStatusVariant(statusStr)} className="text-[10px] px-2 py-0.5">{statusStr}</Badge>
                <Badge variant={paymentStatusStr === 'PAID' ? 'success' : 'default'} className="text-[10px] px-2 py-0.5">
                  {paymentStatusStr === 'PAID' ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{booking.service?.name}</h3>
                <p className="text-xs text-muted-foreground">Service Partner: <span className="font-semibold text-brand">{booking.provider?.businessName}</span></p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs font-medium text-muted-foreground">
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand" /> {formattedDate}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> {formattedTime}</p>
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-brand shrink-0" /> {booking.location?.address || 'Address not set'}</p>
              </div>

              {booking.notes && (
                <div className="p-3 bg-muted rounded-xl text-xs space-y-1">
                  <p className="font-bold text-muted-foreground">Customer Notes:</p>
                  <p className="text-foreground leading-normal italic">&ldquo;{booking.notes}&rdquo;</p>
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-between font-bold">
                <span className="text-xs text-muted-foreground">Amount Paid</span>
                <span className="text-base text-foreground">₹{booking.service?.price}</span>
              </div>
            </div>
            
            <Link href="/messages" className="block pt-2">
              <Button variant="outline" className="w-full flex items-center justify-center gap-1.5 border-border text-xs">
                Chat with Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
