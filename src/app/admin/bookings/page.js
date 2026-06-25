'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, CalendarDays } from 'lucide-react';

import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function AdminBookings() {
  const bookings = useSelector((state) => state.booking.bookings);

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
          Global Bookings Logs <Sparkles className="h-6 w-6 text-brand" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Platform wide audit trail logs for client appointment bookings.</p>
      </div>

      {/* Directory listing table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs divide-y divide-border">
            <thead className="bg-muted/40 font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-bold text-foreground">#{b.id}</td>
                  <td className="px-6 py-4 font-semibold">{b.service.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{b.customerName}</td>
                  <td className="px-6 py-4 text-brand font-semibold">{b.providerName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{b.date} • {b.time}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-foreground">${b.service.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
