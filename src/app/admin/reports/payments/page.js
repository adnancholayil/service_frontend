'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PAYMENTS_REPORT } from '../../../../graphql/queries/admin';
import { CheckCircle, XCircle, Clock, Search, Loader2 } from 'lucide-react';

export default function AdminPaymentsReport() {
  const { data, loading, error } = useQuery(GET_PAYMENTS_REPORT);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-xl">Error loading payments: {error.message}</div>
      </div>
    );
  }

  const payments = data?.getPaymentsReport || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Paid</span>;
      case 'PENDING_VERIFICATION':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> Pending Review</span>;
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1"><XCircle className="h-3 w-3" /> Failed</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Reports</h1>
          <p className="text-slate-500 text-sm">Review provider subscription transactions and offline payment requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID / Date</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Plan & Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm text-slate-900">{payment.transactionId || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{new Date(parseInt(payment.createdAt)).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{payment.provider?.businessName}</div>
                      <div className="text-xs text-slate-500">{payment.provider?.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-600 text-sm">₹{payment.amount.toLocaleString('en-IN')}</div>
                      <div className="text-xs font-medium text-slate-500 uppercase">{payment.plan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit uppercase">
                        {payment.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
