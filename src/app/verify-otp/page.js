'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter a valid OTP code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('OTP verified successfully!');
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }, 1000);
  };

  const handleResend = () => {
    toast.success('New OTP sent to ' + email);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </span>
            <span>Service<span className="text-brand">Hub</span></span>
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
            Verify OTP Code
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification code to <span className="font-semibold text-foreground">{email}</span>. Enter it below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="otp-code"
            name="otp"
            type="text"
            label="Verification Code"
            required
            maxLength={6}
            placeholder="123456"
            className="text-center text-lg tracking-widest font-bold"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center mt-6"
          >
            Verify OTP
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button onClick={handleResend} className="font-semibold text-brand hover:text-brand-hover cursor-pointer">
              Resend OTP
            </button>
          </p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
