'use client';

import React, { useState } from 'react';
import { CalendarRange, Calendar, CheckCircle, Clock, XCircle, MapPin, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_MY_BOOKINGS, BOOKING_SUBSCRIPTION } from '../../../graphql/queries/bookings';
import { UPDATE_BOOKING_STATUS_MUTATION } from '../../../graphql/mutations/bookings';

export default function ProviderBookings() {
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, ACCEPTED, COMPLETED
  
  const { data, loading, refetch, subscribeToMore } = useQuery(GET_MY_BOOKINGS, {
    fetchPolicy: 'network-only',
  });
  
  React.useEffect(() => {
    if (user?.id && subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: BOOKING_SUBSCRIPTION,
        variables: { userId: user.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const updatedBooking = subscriptionData.data.bookingStatusChanged;
          
          const existingIndex = prev.bookings.findIndex(b => b.id === updatedBooking.id);
          
          if (existingIndex > -1) {
            // Update existing booking
            const newBookings = [...prev.bookings];
            newBookings[existingIndex] = updatedBooking;
            return Object.assign({}, prev, { bookings: newBookings });
          } else {
            // Add new booking
            return Object.assign({}, prev, {
              bookings: [updatedBooking, ...prev.bookings]
            });
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user?.id, subscribeToMore]);
  
  const [updateStatus] = useMutation(UPDATE_BOOKING_STATUS_MUTATION, {
    onCompleted: () => refetch(),
    onError: (err) => toast.error(err.message || 'Error updating status')
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ variables: { id, status } });
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch (e) {
      console.error(e);
    }
  };

  const bookings = data?.bookings || [];
  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="h-full flex flex-col p-5 gap-4 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Manage Bookings <CalendarRange className="h-4 w-4 text-emerald-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">View, filter and manage all your service requests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              filter === f
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-16">
            <Calendar className="h-10 w-10 text-slate-200" />
            <p className="text-sm font-semibold text-slate-500">No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings</p>
            <p className="text-xs text-slate-400">New requests will appear here.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between gap-3 items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">#{b.id.slice(-6)}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      b.status === 'PENDING'   ? 'bg-amber-100 text-amber-700'   :
                      b.status === 'ACCEPTED'  ? 'bg-blue-100 text-blue-700'     :
                      b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{b.service?.name || 'Custom Service'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{b.customer?.name || 'Customer'}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    {b.location?.address && <span className="flex items-center gap-1 truncate max-w-[160px]"><MapPin className="h-3 w-3 shrink-0" /> {b.location.address}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-emerald-600">₹{b.totalPrice}</p>
                  <div className="flex gap-1.5 mt-2 justify-end">
                    {b.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleUpdateStatus(b.id, 'REJECTED')} className="px-2.5 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-lg transition-colors">Decline</button>
                        <button onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')} className="px-2.5 py-1 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-[11px] rounded-lg transition-colors">Accept</button>
                      </>
                    )}
                    {b.status === 'ACCEPTED' && (
                      <button onClick={() => handleUpdateStatus(b.id, 'COMPLETED')} className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-700 font-bold text-[11px] rounded-lg transition-colors">Complete</button>
                    )}
                  </div>
                </div>
              </div>
              {b.notes && (
                <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50 px-3 py-2 rounded-lg">"{b.notes}"</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
