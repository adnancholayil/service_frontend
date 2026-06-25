'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { updateBookingStatus } from '../../../store/slices/bookingSlice';

export default function ProviderDashboard() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  
  // Provider ID: prov-1 (Alex Mercer)
  const providerBookings = bookings.filter(b => b.providerId === 'prov-1');
  const pendingBookings = providerBookings.filter(b => b.status === 'pending');
  const completedBookings = providerBookings.filter(b => b.status === 'completed');

  const handleAccept = (bookingId) => {
    dispatch(updateBookingStatus({ id: bookingId, status: 'confirmed' }));
    toast.success('Booking confirmed! Customer has been notified.');
  };

  const handleReject = (bookingId) => {
    if (window.confirm('Are you sure you want to reject this booking request?')) {
      dispatch(updateBookingStatus({ id: bookingId, status: 'cancelled' }));
      toast.error('Booking rejected');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Partner Dashboard <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, Alex. Monitor payouts, accept appointments, and analyze profile performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Earnings</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">$5,420</p>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" /> +12% from last month
              </span>
            </div>
            <span className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-brand rounded-xl"><DollarSign className="h-6 w-6" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card border-border">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Tasks</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{pendingBookings.length}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">Awaiting confirmation</span>
            </div>
            <span className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl"><Calendar className="h-6 w-6" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card border-border">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed Jobs</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{completedBookings.length}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">Full customer sign-offs</span>
            </div>
            <span className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl"><CheckCircle className="h-6 w-6" /></span>
          </CardBody>
        </Card>

        <Card className="bg-card border-border">
          <CardBody className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Rating</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">4.9</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">Based on 124 reviews</span>
            </div>
            <span className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl"><Star className="h-6 w-6" /></span>
          </CardBody>
        </Card>
      </div>

      {/* Grid: Pending Actions and Bookings lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Pending Bookings requests */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
            <AlertCircle className="h-5 w-5 text-brand" /> Action Required: New Requests
          </h2>

          {pendingBookings.length === 0 ? (
            <div className="p-8 text-center border border-border bg-card rounded-2xl flex flex-col items-center justify-center space-y-2">
              <CheckCircle className="h-8 w-8 text-emerald-500 opacity-60" />
              <p className="font-bold text-sm text-muted-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground">You don&apos;t have any pending appointment requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-4 border border-border bg-card rounded-xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase bg-muted px-2 py-0.5 rounded">
                        #{b.id}
                      </span>
                      <h4 className="font-bold text-foreground text-sm mt-1.5">{b.service.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Customer: <span className="font-semibold text-foreground">{b.customerName}</span></p>
                    </div>
                    <span className="text-base font-extrabold text-foreground">${b.service.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground py-2 border-y border-border/60">
                    <span>Date: {b.date}</span>
                    <span>Time Slot: {b.time}</span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded-lg">Notes: &ldquo;{b.notes}&rdquo;</p>
                  )}

                  <div className="flex gap-2 pt-1.5 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleReject(b.id)}>
                      Reject
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleAccept(b.id)}>
                      Accept Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick summary schedule list */}
        <div className="space-y-4">
          <h3 className="font-bold text-foreground">Upcoming Calendar Schedule</h3>
          <Card className="bg-card">
            <CardBody className="p-4 space-y-4">
              {providerBookings.filter(b => b.status === 'confirmed').length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-6">No scheduled jobs</p>
              ) : (
                providerBookings.filter(b => b.status === 'confirmed').slice(0, 3).map((b) => (
                  <div key={b.id} className="text-xs space-y-1.5 pb-3 last:pb-0 border-b border-border last:border-b-0">
                    <p className="font-bold text-foreground truncate">{b.service.title}</p>
                    <p className="text-muted-foreground leading-normal">{b.date} at {b.time}</p>
                    <p className="text-muted-foreground leading-normal truncate">{b.address}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}
