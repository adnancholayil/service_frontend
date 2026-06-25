'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Shield, Sparkles, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { MOCK_USERS } from '../../constants/mockData';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    // Find in mock users
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Set cookies for middleware
        document.cookie = `auth_token=mock-jwt-token-12345; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        
        dispatch(loginSuccess({ user, token: 'mock-jwt-token-12345' }));
        toast.success(`Welcome back, ${user.name}!`);
        setIsLoading(false);

        // Redirect based on role
        if (redirectPath !== '/') {
          router.push(redirectPath);
        } else if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'provider') {
          router.push('/provider/dashboard');
        } else {
          router.push('/');
        }
      } else {
        dispatch(loginFailure('Invalid email or password'));
        toast.error('User not found. Try one of the Quick Login options below!');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleQuickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('password');
    toast.success('Fields pre-filled! Click Log In.');
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    toast.loading('Connecting with Google...');
    
    setTimeout(() => {
      toast.dismiss();
      const customerUser = MOCK_USERS[0]; // John Doe
      
      document.cookie = `auth_token=mock-jwt-token-google; path=/; max-age=86400`;
      document.cookie = `user_role=${customerUser.role}; path=/; max-age=86400`;
      
      dispatch(loginSuccess({ user: customerUser, token: 'mock-jwt-token-google' }));
      toast.success(`Connected as ${customerUser.name}!`);
      setIsLoading(false);
      router.push('/');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-xl">
        
        {/* Title logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </span>
            <span>Service<span className="text-brand">Hub</span></span>
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{' '}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-hover">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            id="email-address"
            name="email"
            type="email"
            label="Email Address"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-brand hover:text-brand-hover">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center mt-6"
          >
            Log In
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-muted-foreground">Or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Google Login button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-border"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.788-6.228-6.228 0-3.44 2.788-6.228 6.228-6.228 1.496 0 2.868.537 3.943 1.425l3.11-3.11C18.99 1.952 15.823 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.62 0 10.22-3.985 10.22-9.68 0-.616-.055-1.228-.15-1.83H12.24z"
            />
          </svg>
          Google
        </Button>

        {/* Quick Mock Login Buttons */}
        <div className="border-t border-border pt-6 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
            Demo Quick Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('john@example.com')}
              className="px-2 py-1.5 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-900 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 cursor-pointer"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@servicehub.com')}
              className="px-2 py-1.5 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-900 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@servicehub.com')}
              className="px-2 py-1.5 text-[10px] font-semibold border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400 cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
