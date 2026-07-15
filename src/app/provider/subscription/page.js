'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { SELECT_SUBSCRIPTION_PLAN } from '../../../graphql/mutations/provider';
import { GET_PROVIDER_PROFILE } from '../../../graphql/queries/provider';
import { useSelector } from 'react-redux';
import { CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState('MONTHLY');
  const [isLoading, setIsLoading] = useState(false);

  const { data: profileData, loading: profileLoading } = useQuery(GET_PROVIDER_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [selectPlanMut] = useMutation(SELECT_SUBSCRIPTION_PLAN);

  const handleProceed = async () => {
    setIsLoading(true);
    try {
      const { data } = await selectPlanMut({ variables: { plan: selectedPlan } });
      if (data?.selectSubscriptionPlan) {
        if (selectedPlan === 'TRIAL') {
          toast.success('Trial Activated Successfully!');
          router.push('/provider/dashboard');
        } else {
          router.push(`/provider/payment?plan=${selectedPlan}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to select plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'TRIAL',
      name: 'Custom / Trial',
      price: '$0',
      period: 'for 14 days',
      features: ['Basic Profile Listing', 'Up to 5 Services', 'Standard Support'],
      icon: Shield,
      popular: false,
    },
    {
      id: 'MONTHLY',
      name: 'Monthly Pro',
      price: '$29',
      period: 'per month',
      features: ['Featured Profile Listing', 'Unlimited Services', 'Priority Support', 'Advanced Analytics'],
      icon: Zap,
      popular: true,
    },
    {
      id: 'YEARLY',
      name: 'Yearly Premium',
      price: '$290',
      period: 'per year',
      features: ['Everything in Monthly', '2 Months Free', 'Dedicated Account Manager', 'Custom Badge'],
      icon: Sparkles,
      popular: false,
    },
  ];

  if (profileLoading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  const currentStatus = profileData?.providerProfile?.subscriptionStatus;
  if (currentStatus === 'ACTIVE') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-emerald-600 mb-4">You have an active subscription!</h2>
        <button onClick={() => router.push('/provider/dashboard')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Choose Your Partner Plan
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto font-medium">
            Unlock premium features, reach more customers, and grow your service business today.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`group relative flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-105 z-10'
                  : 'bg-white border-2 border-transparent shadow-sm hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 flex justify-center">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-b-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`flex items-center gap-3 mb-4 ${plan.popular ? 'mt-3' : ''}`}>
                <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              </div>
              
              <div className="mb-5">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-slate-500">{plan.period}</span>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 mr-2.5 mt-0.5 transition-colors duration-300 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-full py-2.5 px-4 rounded-lg text-sm font-bold text-center transition-all duration-300 ${
                isSelected 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}>
                {isSelected ? 'Selected' : 'Select Plan'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleProceed}
          disabled={isLoading}
          className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? 'Processing...' : selectedPlan === 'TRIAL' ? 'Start Free Trial' : 'Proceed to Payment'}
        </button>
        
        <p className="mt-4 text-xs text-slate-500 font-medium">
          Need a custom enterprise plan? <a href="mailto:admin@servicehub.com" className="text-emerald-600 font-bold hover:text-emerald-500 transition-colors">Contact our Admin Team</a>
        </p>
      </div>
      </div>
    </div>
  );
}
