'use client';

import React, { useState } from 'react';
import { CalendarRange, Calendar, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

import { GET_MY_BOOKINGS } from '../../../graphql/queries/bookings';
import { UPDATE_BOOKING_STATUS_MUTATION } from '../../../graphql/mutations/bookings';

export default function ProviderBookings() {
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, ACCEPTED, COMPLETED
  const { data, loading, refetch } = useQuery(GET_MY_BOOKINGS);
  
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Manage Bookings <CalendarRange className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">View, filter, and manage all your service requests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              filter === f 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center text-slate-400">Loading...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings found</h2>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">Your schedule is clear. New requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase bg-slate-100 px-2 py-1 rounded-md">
                      #{b.id.slice(-6)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      b.status === 'ACCEPTED' ? 'bg-indigo-100 text-indigo-700' :
                      b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{b.service?.name || 'Custom Service'}</h3>
                  <p className="text-sm font-medium text-slate-500">
                    Customer: <span className="text-slate-700">{b.customer?.name || 'Customer'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-emerald-600">${b.totalPrice}</h3>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Calendar className="h-4 w-4 text-slate-400" /> {new Date(b.bookingDate).toLocaleDateString()}
                  </p>
                  {b.location?.address && (
                    <p className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <MapPin className="h-4 w-4 text-slate-400" /> {b.location.address}
                    </p>
                  )}
                </div>
                {b.notes && (
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Notes</p>
                    <p className="text-sm text-slate-700 italic">"{b.notes}"</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {b.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleUpdateStatus(b.id, 'REJECTED')} className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-colors">
                      Decline
                    </button>
                    <button onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')} className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-500/20">
                      Accept Job
                    </button>
                  </>
                )}
                {b.status === 'ACCEPTED' && (
                  <button onClick={() => handleUpdateStatus(b.id, 'COMPLETED')} className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm rounded-xl transition-colors shadow-md">
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
