'use client';

import React, { useState } from 'react';
import { CalendarRange, Calendar, CheckCircle, Clock, XCircle, MapPin, Loader2, Phone } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { GET_MY_BOOKINGS, BOOKING_SUBSCRIPTION } from '../../../graphql/queries/bookings';
import { UPDATE_BOOKING_STATUS_MUTATION } from '../../../graphql/mutations/bookings';

export default function ProviderBookings() {
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, ACCEPTED, IN_PROGRESS, COMPLETED
  const [updatingId, setUpdatingId] = useState(null);
  const [visiblePhones, setVisiblePhones] = useState(new Set());

  const togglePhone = (id) => {
    setVisiblePhones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  
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
    onError: (err) => toast.error(err.message || 'Error updating status')
  });

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateStatus({ variables: { id, status } });
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
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
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Manage Bookings <CalendarRange className="h-4 w-4 text-brand" />
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">View, filter and manage all your service requests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border overflow-x-auto no-scrollbar shrink-0">
        {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              filter === f
                ? 'border-brand text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-16">
            <Calendar className="h-10 w-10 text-muted" />
            <p className="text-sm font-semibold text-muted-foreground">No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings</p>
            <p className="text-xs text-muted-foreground">New requests will appear here.</p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const bookingDate = new Date(isNaN(Number(b.bookingDate)) ? b.bookingDate : Number(b.bookingDate));
            const dateStr = bookingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = bookingDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const isTimeArrived = Date.now() >= bookingDate.getTime() - (60 * 60 * 1000); // Allow arriving 1 hour early

            return (
              <div key={b.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-brand/40 transition-colors shadow-sm">
                
                {/* Top: Header */}
                <div className="flex justify-between items-start mb-4 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">#{b.id.slice(-6)}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        b.status === 'PENDING'   ? 'bg-amber-500/10 text-amber-500'   :
                        b.status === 'ACCEPTED'  ? 'bg-blue-500/10 text-blue-500'     :
                        b.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-500' :
                        b.status === 'COMPLETED' ? 'bg-brand/10 text-brand' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{b.service?.name || 'Custom Service'}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-brand">₹{b.totalPrice}</p>
                  </div>
                </div>

                {/* Middle: Details & Customer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Schedule & Location */}
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-sm text-foreground">
                      <Calendar className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{dateStr}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {timeStr}</p>
                      </div>
                    </div>
                    {b.location?.address && (
                      <div className="flex items-start gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed pr-4">{b.location.address}</p>
                      </div>
                    )}
                    {b.notes && (
                      <div className="flex items-start gap-2 text-sm text-foreground mt-2">
                        <div className="h-4 w-4 shrink-0 text-brand flex items-center justify-center font-serif italic font-bold text-[10px]">i</div>
                        <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded-lg flex-1">"{b.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Customer Info & Actions */}
                  <div className="flex flex-col justify-between items-start md:items-end gap-4 border-t border-border md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-3 w-full md:w-auto bg-muted/30 p-2.5 rounded-xl border border-border/50">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg overflow-hidden">
                        {b.customer?.avatar ? <img src={b.customer.avatar} alt="avatar" className="w-full h-full object-cover" /> : (b.customer?.name?.[0] || 'C').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate pr-2">{b.customer?.name || 'Unknown Customer'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> 
                            {visiblePhones.has(b.id) 
                              ? (b.customerPhone || b.customer?.phone || 'N/A') 
                              : (b.customerPhone || b.customer?.phone ? '+91 ••••••••••' : 'No phone provided')}
                          </p>
                          {(b.customerPhone || b.customer?.phone) && (b.customerPhone !== 'N/A') && (
                            <div className="flex items-center gap-2 border-l border-border/50 pl-2 ml-1">
                              <button 
                                onClick={() => togglePhone(b.id)}
                                className="text-[10px] font-bold text-brand hover:underline cursor-pointer bg-transparent border-none p-0"
                              >
                                {visiblePhones.has(b.id) ? 'Hide' : 'Show'}
                              </button>
                              <a 
                                href={`tel:${b.customerPhone || b.customer?.phone}`}
                                className="text-[10px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full hover:bg-green-500/20 transition-colors flex items-center gap-1"
                              >
                                <Phone className="h-2.5 w-2.5" /> Call
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      {b.status === 'PENDING' && (
                        <>
                          <button disabled={updatingId === b.id} onClick={() => handleUpdateStatus(b.id, 'REJECTED')} className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 disabled:opacity-50 font-bold text-xs rounded-xl transition-colors flex-1 md:flex-none text-center">Decline</button>
                          <button disabled={updatingId === b.id} onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')} className="px-4 py-2 bg-brand text-white hover:bg-brand-hover disabled:opacity-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 flex-1 md:flex-none shadow-sm">
                            {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Accept Booking
                          </button>
                        </>
                      )}
                      {b.status === 'ACCEPTED' && (
                        <button 
                          disabled={updatingId === b.id || !isTimeArrived} 
                          onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')} 
                          title={!isTimeArrived ? "You can only mark as arrived within 1 hour of the booking time" : ""}
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full md:w-auto shadow-sm"
                        >
                          {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Location Reached
                        </button>
                      )}
                      {b.status === 'IN_PROGRESS' && (
                        <button disabled={updatingId === b.id} onClick={() => handleUpdateStatus(b.id, 'COMPLETED')} className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full md:w-auto shadow-sm">
                          {updatingId === b.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
