'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { PROCESS_PAYMENT } from '../../../graphql/mutations/provider';
import { CreditCard, Building2, Smartphone, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [processPaymentMut] = useMutation(PROCESS_PAYMENT);

  useEffect(() => {
    if (!plan) {
      router.replace('/provider/subscription');
    }
  }, [plan, router]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate mock payment gateway delay
    setTimeout(async () => {
      try {
        const { data } = await processPaymentMut({ variables: { method: paymentMethod } });
        if (data?.processPayment) {
          setIsSuccess(true);
          toast.success('Payment Successful! Subscription Activated.');
          setTimeout(() => {
            router.push('/provider/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  const amount = plan === 'YEARLY' ? '$290' : '$29';

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-emerald-100 p-6 rounded-full mb-6 animate-pulse">
          <CheckCircle className="h-16 w-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-slate-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Secure Checkout
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Complete your payment to activate the <span className="text-emerald-600 font-bold">{plan}</span> plan</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Form */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Select Payment Method
          </h2>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'card' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-100 bg-slate-50 hover:border-emerald-200 text-slate-500'
              }`}
            >
              <CreditCard className={`h-6 w-6 mb-2 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
              <span className="text-xs font-bold">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('netbanking')}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'netbanking' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-100 bg-slate-50 hover:border-emerald-200 text-slate-500'
              }`}
            >
              <Building2 className={`h-6 w-6 mb-2 ${paymentMethod === 'netbanking' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
              <span className="text-xs font-bold">Net Banking</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'upi' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-100 bg-slate-50 hover:border-emerald-200 text-slate-500'
              }`}
            >
              <Smartphone className={`h-6 w-6 mb-2 ${paymentMethod === 'upi' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
              <span className="text-xs font-bold">UPI</span>
            </button>
          </div>

          <form onSubmit={handlePayment} className="animate-in fade-in duration-300">
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input required type="text" placeholder="MM/YY" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input required type="password" placeholder="123" maxLength="4" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name on Card</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-4 mb-6">
                <p className="text-xs font-medium text-slate-500">You will be redirected to your bank's secure portal.</p>
                <select required className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all bg-white cursor-pointer">
                  <option value="">Select your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID</label>
                  <input required type="text" placeholder="username@upi" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <p className="text-[10px] font-medium text-slate-400">A payment request will be sent to your UPI app.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...
                </>
              ) : (
                `Pay ${amount}`
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Payments are 100% secure and encrypted</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-100 p-6 rounded-2xl h-fit border border-slate-200">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Order Summary</h2>
          
          <div className="space-y-3 mb-4 text-sm text-slate-600">
            <div className="flex justify-between items-center">
              <span>Subscription Plan</span>
              <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-xs">{plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taxes</span>
              <span className="text-emerald-600 font-medium">Included</span>
            </div>
          </div>
          
          <div className="border-t border-slate-300 pt-4 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-700">Total</span>
              <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">{amount}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 leading-relaxed">
            By proceeding, you agree to our Terms of Service and auto-renewal policy. You can cancel at any time.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
