'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '../../graphql/mutations/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  const [loginMut] = useMutation(LOGIN_MUTATION);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await loginMut({
        variables: { email, password }
      });
      
      if (data?.login) {
        const { accessToken, refreshToken, user } = data.login;
        // Set cookies for middleware
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        dispatch(loginSuccess({ user, token: accessToken }));
        toast.success(`Welcome back, ${user.name}!`);

        // Redirect based on role
        if (redirectPath !== '/') {
          router.push(redirectPath);
        } else if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'PROVIDER') {
          router.push('/provider/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.message || 'Invalid email or password'));
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('password123');
    toast.success('Fields pre-filled! Click Log In.');
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

        {/* Quick Login hint for demo */}
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Use your registered email and password to log in.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand">
              Sign up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
