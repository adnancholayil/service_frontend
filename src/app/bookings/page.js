'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Clock, MapPin, Search, Star, Sparkles, Filter, Eye } from 'lucide-react';
import Link from 'next/link';

import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { cancelBooking } from '../../store/slices/bookingSlice';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
      toast.success('Booking cancelled successfully');
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 lg:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 flex-1">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          My Bookings <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor status, cancel, or review your scheduled home service visits.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        {['all', 'pending', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold shrink-0 transition-all border cursor-pointer capitalize ${
              filterStatus === status
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {status} Bookings
          </button>
        ))}
      </div>

      {/* List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-base sm:text-lg text-muted-foreground">No bookings found</h3>
          <p className="text-xs text-muted-foreground">You don&apos;t have any appointments under this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredBookings.map((b) => (
            <Card key={b.id} className="bg-card flex flex-col relative overflow-hidden">
              <CardBody className="p-4 sm:p-5 flex-1 flex flex-col">
                
                {/* Card Header (ID & Status Badges) */}
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <span className="text-[10px] sm:text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                    ID: #{b.id}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant={getStatusVariant(b.status)} className="text-[9px] sm:text-[10px] px-2 py-0.5">{b.status}</Badge>
                    <Badge variant={b.paymentStatus === 'paid' ? 'success' : 'default'} className="text-[9px] sm:text-[10px] px-2 py-0.5">
                      {b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                </div>

                {/* Main Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">{b.service.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Service Partner: <span className="font-semibold text-brand">{b.providerName}</span></p>
                    </div>
                  </div>
                  
                  {/* Info Grid */}
                  <div className="bg-brand/5 dark:bg-brand/10 border border-brand/10 rounded-xl p-3 grid grid-cols-2 gap-3 text-xs font-medium text-foreground/80">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand" /> {b.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand" /> {b.time}</span>
                    <span className="flex items-center gap-1.5 col-span-2 text-wrap"><MapPin className="h-3.5 w-3.5 shrink-0 text-brand" /> {b.address}</span>
                  </div>
                </div>
                
                {/* Footer (Price & Actions) */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider">Amount Paid</p>
                    <p className="text-lg sm:text-xl font-extrabold text-brand">${b.service.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/bookings/${b.id}`}>
                      <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 border-border rounded-lg shadow-sm">
                        <Eye className="h-3.5 w-3.5 mr-1" /> Details
                      </Button>
                    </Link>
                    {b.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs py-1.5 px-3 rounded-lg shadow-sm"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
