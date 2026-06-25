'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ShieldCheck, Calendar, Clock, MapPin, Sparkles, ArrowLeft, CheckCircle2, ChevronRight, User, AlertTriangle } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export default function BookingDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const bookings = useSelector((state) => state.booking.bookings);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const found = bookings.find(b => b.id === id);
    if (found) {
      setBooking(found);
    }
  }, [id, bookings]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4 flex-1">
        <AlertTriangle className="h-10 w-10 text-rose-500" />
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <p className="text-sm text-muted-foreground">The booking ID you requested is invalid.</p>
        <Link href="/bookings">
          <Button>Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Booking Created', desc: 'Sent request to provider', date: booking.createdAt, done: true },
    { label: 'Provider Confirmed', desc: 'Partner accepted slot', date: booking.date, done: booking.status !== 'pending' && booking.status !== 'cancelled' },
    { label: 'Work in Progress', desc: 'Partner on site', date: booking.date, done: booking.status === 'completed' },
    { label: 'Service Completed', desc: 'Signed off and paid', date: booking.date, done: booking.status === 'completed' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
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
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-muted-foreground">ID: #{booking.id}</span>
              <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}>
                {booking.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{booking.service.title}</h3>
                <p className="text-xs text-muted-foreground">Service Partner: <span className="font-semibold text-brand">{booking.providerName}</span></p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs font-medium text-muted-foreground">
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand" /> {booking.date}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> {booking.time}</p>
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-brand shrink-0" /> {booking.address}</p>
              </div>

              {booking.notes && (
                <div className="p-3 bg-muted rounded-xl text-xs space-y-1">
                  <p className="font-bold text-muted-foreground">Customer Notes:</p>
                  <p className="text-foreground leading-normal italic">&ldquo;{booking.notes}&rdquo;</p>
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-between font-bold">
                <span className="text-xs text-muted-foreground">Amount Paid</span>
                <span className="text-base text-foreground">${booking.service.price}</span>
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
