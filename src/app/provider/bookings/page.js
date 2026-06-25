'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CalendarRange, Sparkles, Filter, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { updateBookingStatus } from '../../../store/slices/bookingSlice';

export default function ProviderBookings() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  const [filter, setFilter] = useState('all');

  // Filter provider bookings
  const providerBookings = bookings.filter(b => b.providerId === 'prov-1');

  const filteredBookings = filter === 'all'
    ? providerBookings
    : providerBookings.filter(b => b.status === filter);

  const handleComplete = (bookingId) => {
    dispatch(updateBookingStatus({ id: bookingId, status: 'completed' }));
    toast.success('Marked job as completed! Payout released.');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Manage Appointments <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Check scheduled visits, client locations, and checkoff completed jobs.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-border">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer capitalize ${
              filter === tab
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
          <CalendarRange className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-bold text-lg text-muted-foreground">No appointments found</h3>
          <p className="text-xs text-muted-foreground">No bookings are recorded matching this filter status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <Card key={b.id} className="bg-card">
              <CardBody className="p-6 flex flex-col sm:flex-row gap-5 items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">ID: #{b.id}</span>
                    <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
                    <Badge variant="success">Paid</Badge>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground leading-snug">{b.service.title}</h4>
                    <p className="text-xs text-muted-foreground">Client: <span className="font-semibold text-foreground">{b.customerName}</span></p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-muted-foreground pt-1">
                    <span>Date: {b.date}</span>
                    <span>Time: {b.time}</span>
                    <span className="sm:col-span-2">Address: {b.address}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="text-xl font-extrabold text-foreground">${b.service.price}</p>
                  </div>

                  {b.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex items-center gap-1"
                      onClick={() => handleComplete(b.id)}
                    >
                      <CheckCircle className="h-4 w-4" /> Mark Completed
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
