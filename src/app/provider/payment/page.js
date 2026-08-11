'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useMutation, useQuery } from '@apollo/client/react';
import { PROCESS_PAYMENT } from '../../../graphql/mutations/provider';
import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { useSelector } from 'react-redux';
import { CreditCard, Landmark, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const plan = searchParams.get('plan');
  const amountParam = searchParams.get('amount') || '999';
  const amountValue = parseInt(amountParam, 10);
  const formattedAmount = `₹${amountValue.toLocaleString('en-IN')}`;
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: profileData } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [processPaymentMut] = useMutation(PROCESS_PAYMENT);

  useEffect(() => {
    if (!plan) {
      router.replace('/provider/subscription');
    }
  }, [plan, router]);

  useEffect(() => {
    // If the provider already has an active subscription, redirect to dashboard
    if (profileData?.providerProfile?.subscriptionStatus === 'ACTIVE') {
      toast.success('Your subscription is already active!');
      router.replace('/provider/dashboard');
    }
  }, [profileData, router]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummykey';

      if (rzpKey === 'rzp_test_dummykey') {
        toast.loading('Simulating Razorpay Test Payment...', { id: 'mock-payment' });
        
        setTimeout(async () => {
          try {
            const response = await processPaymentMut({ variables: { method: 'razorpay' }, errorPolicy: 'all' });
            const { data, errors } = response;
            toast.dismiss('mock-payment');
            
            if (errors && errors.length > 0) {
              toast.error(errors[0].message || 'Server verification failed.');
              setIsProcessing(false);
              return;
            }

            if (data?.processPayment) {
              setIsSuccess(true);
              setIsProcessing(false);
              toast.success('Payment Successful! Subscription Activated.');
              setTimeout(() => {
                router.push('/provider/dashboard');
              }, 2000);
            } else {
              toast.error('Payment simulation failed (No data).');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error(err);
            toast.dismiss('mock-payment');
            toast.error(err.message || 'Server verification failed.');
            setIsProcessing(false);
          }
        }, 1500);
        
        return;
      }

      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error('Payment gateway is still loading. Please check your internet connection or disable adblockers.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: rzpKey,
        amount: amountValue * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Service Finder',
        description: `Subscription: ${plan} Plan`,
        image: 'https://cdn-icons-png.flaticon.com/512/1055/1055661.png',
        handler: async function (response) {
          // Razorpay Success Callback
          try {
            const { data } = await processPaymentMut({ variables: { method: 'razorpay' } });
            if (data?.processPayment) {
              setIsSuccess(true);
              setIsProcessing(false);
              toast.success('Payment Successful! Subscription Activated.');
              setTimeout(() => {
                router.push('/provider/dashboard');
              }, 2000);
            } else {
              toast.error('Payment verification failed.');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error(err);
            toast.error(err.message || 'Server verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: profileData?.providerProfile?.companyName || user?.name || 'Service Provider',
          email: user?.email || 'provider@example.com',
          contact: profileData?.providerProfile?.phone || '9999999999',
        },
        theme: {
          color: '#059669', // Emerald 600
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description || 'Payment failed.');
        setIsProcessing(false);
      });
      rzp.open();
    } else {
      // Simulate Offline / Manual Bank Transfer
      setTimeout(async () => {
        try {
          const { data } = await processPaymentMut({ variables: { method: 'offline' } });
          if (data?.processPayment) {
            setIsSuccess(true);
            setIsProcessing(false);
            toast.success('Offline Transfer Submitted! We will verify and activate your subscription.');
            setTimeout(() => {
              router.push('/provider/dashboard');
            }, 3000);
          } else {
            toast.error('Submission failed. Invalid response from server.');
            setIsProcessing(false);
          }
        } catch (err) {
          console.error(err);
          toast.error(err.message || 'Submission failed. Please try again.');
          setIsProcessing(false);
        }
      }, 1500);
    }
  };

  return (
    <>
    {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && (
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    )}
    <div className="min-h-screen w-full bg-muted/50 flex flex-col items-center justify-center px-3 py-6 sm:px-6 sm:py-8 md:p-10">
      <div className="max-w-5xl w-full">

        {/* Header — compact on mobile */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Secure Checkout
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
            Complete your payment to activate the{' '}
            <span className="text-brand font-bold uppercase">{plan}</span> plan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">

          {/* Payment Form */}
          <div className="lg:col-span-2 bg-card p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl shadow-sm border border-border">
            <h2 className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-brand" />
              Select Payment Method
            </h2>

            {/* Always 2-column buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={() => setPaymentMethod('razorpay')}
                className={`group flex flex-col items-center justify-center py-2.5 px-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === 'razorpay'
                    ? 'border-brand bg-brand/10 text-brand shadow-sm'
                    : 'border-border bg-muted/50 hover:border-brand/40 text-muted-foreground'
                }`}
              >
                <CreditCard className={`h-5 w-5 mb-1 ${paymentMethod === 'razorpay' ? 'text-brand' : 'text-muted-foreground group-hover:text-brand'}`} />
                <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">
                  Pay Online<br />
                  <span className="font-medium text-[9px] sm:text-[10px] opacity-70">(Cards, UPI, NetBanking)</span>
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod('offline')}
                className={`group flex flex-col items-center justify-center py-2.5 px-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === 'offline'
                    ? 'border-brand bg-brand/10 text-brand shadow-sm'
                    : 'border-border bg-muted/50 hover:border-brand/40 text-muted-foreground'
                }`}
              >
                <Landmark className={`h-5 w-5 mb-1 ${paymentMethod === 'offline' ? 'text-brand' : 'text-muted-foreground group-hover:text-brand'}`} />
                <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">
                  Bank Transfer<br />
                  <span className="font-medium text-[9px] sm:text-[10px] opacity-70">(Offline NEFT/RTGS)</span>
                </span>
              </button>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'razorpay' && (
                <div className="mb-4 text-center py-3 sm:py-4 px-3 bg-muted/50 border border-border rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Razorpay Secure Checkout</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 leading-relaxed">
                    Redirected to Razorpay to pay via card, UPI, or Net Banking.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-card border border-border rounded h-7 w-12 flex items-center justify-center shadow-sm">
                      <span className="text-muted-foreground font-extrabold text-[11px] tracking-tight border-b-2 border-brand leading-none">UPI</span>
                    </div>
                    <div className="bg-card border border-border rounded h-7 w-12 flex items-center justify-center shadow-sm">
                      <span className="text-blue-800 font-black italic text-[13px] tracking-tighter">VISA</span>
                    </div>
                    <div className="bg-card border border-border rounded h-7 w-12 flex items-center justify-center shadow-sm overflow-hidden">
                      <div className="flex items-center -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#EB001B] mix-blend-multiply"></div>
                        <div className="w-4 h-4 rounded-full bg-[#F79E1B] mix-blend-multiply"></div>
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded h-7 w-12 flex items-center justify-center shadow-sm">
                      <span className="text-blue-900 font-extrabold italic text-[11px] tracking-tight">Ru<span className="text-orange-500">Pay</span></span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'offline' && (
                <div className="mb-4 p-3 sm:p-4 bg-muted/50 border border-border rounded-lg sm:rounded-xl">
                  <div className="flex items-start gap-2">
                    <Landmark className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-foreground mb-2">Our Bank Details</h3>
                      <div className="space-y-1 text-[11px] text-muted-foreground">
                        <p><span className="font-semibold w-24 inline-block">Account Name:</span> Service Finder India Pvt Ltd</p>
                        <p><span className="font-semibold w-24 inline-block">Account No:</span> 99990123456789</p>
                        <p><span className="font-semibold w-24 inline-block">IFSC Code:</span> HDFC0001234</p>
                        <p><span className="font-semibold w-24 inline-block">Bank Branch:</span> Koramangala, Bangalore</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Transfer exactly <strong className="text-foreground">{formattedAmount}</strong> to the above account. We will verify and activate your subscription within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center py-3 bg-brand-hover hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-70"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Processing...</>
                ) : (
                  paymentMethod === 'offline' ? 'Submit Transfer Request' : `Pay ${formattedAmount} via Razorpay`
                )}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Payments are 100% secure and encrypted</span>
            </div>
          </div>

          {/* Order Summary — compact card on mobile, full card on desktop */}
          <div className="bg-muted p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-border">
            <h2 className="text-sm sm:text-base font-bold mb-3 text-foreground">Order Summary</h2>

            <div className="space-y-2 mb-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Subscription Plan</span>
                <span className="font-bold text-foreground bg-card px-2 py-0.5 rounded-full border border-border text-[10px] sm:text-xs uppercase">{plan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formattedAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span className="text-brand font-medium">Included</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-muted-foreground">Total</span>
                <span className="text-xl sm:text-2xl font-extrabold text-brand tracking-tight">{formattedAmount}</span>
              </div>
            </div>

            <div className="bg-brand/10 border border-emerald-100 rounded-lg p-2.5 text-[10px] sm:text-xs text-emerald-800 leading-relaxed">
              By proceeding, you agree to our Terms of Service and auto-renewal policy. You can cancel at any time.
            </div>
          </div>

        </div>
      </div>
    </div>

    {isSuccess && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
        <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-xs sm:max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
          <div className="bg-brand/20 p-4 sm:p-5 rounded-full mb-4 sm:mb-6">
            <CheckCircle className="h-10 w-10 sm:h-14 sm:w-14 text-brand" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
            {paymentMethod === 'offline' ? 'Request Submitted!' : 'Payment Successful!'}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to dashboard...
          </p>
        </div>
      </div>
    )}
    </>
  );
}
