'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { SELECT_SUBSCRIPTION_PLAN } from '../../../graphql/mutations/provider';
import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { useSelector } from 'react-redux';
import { Check, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanUIId, setSelectedPlanUIId] = useState('MONTHLY');
  const [selectedActualPlanId, setSelectedActualPlanId] = useState('MONTHLY');
  const [selectedAmount, setSelectedAmount] = useState(199);

  const { data: profileData, loading: profileLoading } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [selectPlanMut] = useMutation(SELECT_SUBSCRIPTION_PLAN);

  const handleProceed = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!selectedActualPlanId) {
      toast.error('Please select a plan first.');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await selectPlanMut({ variables: { plan: selectedActualPlanId } });
      if (data && data.selectSubscriptionPlan) {
        if (selectedActualPlanId === 'TRIAL') {
          toast.success('Trial Activated Successfully!');
          router.push('/provider/dashboard');
        } else {
          router.push(`/provider/payment?plan=${selectedActualPlanId}&amount=${selectedAmount}`);
        }
      } else {
        alert('Server returned success but no data: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('Subscription Plan Error:', err);
      toast.error(err.message || 'Failed to select plan. Please try again.');
      alert(`Error: ${err.message || 'Failed to process plan selection'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentStatus = profileData?.providerProfile?.subscriptionStatus;
  if (currentStatus === 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-6">
        <div className="bg-card p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center border border-border">
          <div className="h-20 w-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-10 w-10 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Subscription Active</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">Your partner account is fully upgraded and active. You have access to all premium features.</p>
          <button 
            onClick={() => router.push('/provider/dashboard')} 
            className="w-full py-3.5 bg-brand-hover text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const plans = [
    {
      id: 'TRIAL',
      name: 'Starter',
      description: 'Perfect for exploring the platform and getting your first bookings.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: ['Basic Profile Listing', 'Up to 2 Active Services', 'Receive Bookings', '14-day free trial'],
      popular: false,
    },
    {
      id: 'MONTHLY',
      name: 'Professional',
      description: 'Everything you need to grow your business and reach more local customers.',
      priceMonthly: 199,
      priceAnnual: 1999, // One-time yearly payment
      features: ['Priority Profile Listing', 'Unlimited Services', 'Dashboard Analytics', 'Customer Reviews', 'Verified Provider Badge'],
      popular: true,
    },
    {
      id: 'YEARLY',
      name: 'Premium',
      description: 'Top-tier visibility with promoted ads to maximize your bookings.',
      priceMonthly: 499,
      priceAnnual: 4999, // One-time yearly payment
      features: ['Everything in Professional', 'Promoted Ads on Platform', 'Top of Search Results', 'Premium Support'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen w-full bg-muted/50 font-sans selection:bg-brand/20 selection:text-emerald-900 pb-12 md:pb-0 md:overflow-hidden flex flex-col justify-center relative">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-4 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            Choose the perfect plan for your business. No hidden fees. Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={`text-xs font-semibold transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-xs font-semibold transition-colors flex items-center gap-2 ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annually
              <span className="inline-flex items-center rounded-full bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold text-brand">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full items-start">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            
            let actualPlanId = plan.id;
            if (plan.name === 'Professional') {
              actualPlanId = isAnnual ? 'YEARLY' : 'MONTHLY';
            }

            return (
              <div 
                key={plan.id}
                onClick={() => {
                  setSelectedPlanUIId(plan.id);
                  setSelectedActualPlanId(actualPlanId);
                  setSelectedAmount(isAnnual ? plan.priceAnnual : plan.priceMonthly);
                }}
                className={`relative flex flex-col bg-card rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedPlanUIId === plan.id
                    ? 'border-brand shadow-xl scale-[1.02] z-10' 
                    : 'border-transparent ring-1 ring-slate-200 shadow-sm hover:shadow-md hover:border-brand/40 opacity-80 hover:opacity-100'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="bg-brand text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="p-5 md:p-6 pb-0">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground min-h-[32px] leading-snug">{plan.description}</p>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground tracking-tight">
                      ₹{(isAnnual ? plan.priceAnnual : plan.priceMonthly).toLocaleString('en-IN')}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-muted-foreground text-xs font-medium">/{isAnnual ? 'yr' : 'mo'}</span>
                    )}
                  </div>
                  {isAnnual && plan.priceMonthly > 0 && (
                    <p className="text-[10px] font-semibold text-brand mt-1">One-time yearly payment</p>
                  )}
                  {(!isAnnual || plan.priceMonthly === 0) && (
                    <p className="text-[10px] font-semibold text-transparent mt-1 select-none">Spacer</p>
                  )}
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-center transition-all duration-200 ${
                      selectedPlanUIId === plan.id
                        ? 'bg-brand-hover text-white shadow-sm'
                        : 'bg-muted/50 text-muted-foreground ring-1 ring-inset ring-slate-200'
                    }`}
                  >
                    {selectedPlanUIId === plan.id ? 'Selected' : 'Select Plan'}
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-3">What's included</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${selectedPlanUIId === plan.id ? 'bg-brand/20' : 'bg-muted'}`}>
                            <Check className={`h-2.5 w-2.5 ${selectedPlanUIId === plan.id ? 'text-brand' : 'text-muted-foreground'}`} />
                          </div>
                          <span className="text-xs text-muted-foreground leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceed Button Fixed at Bottom */}
        <div className="mt-8 flex justify-center w-full">
          <button
            onClick={handleProceed}
            disabled={isLoading}
            className="w-full md:w-auto min-w-[250px] py-3.5 px-8 bg-foreground hover:bg-foreground/90 text-background text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
