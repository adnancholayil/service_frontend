'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Sparkles, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION } from '../../graphql/mutations/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [role, setRole] = useState('CUSTOMER'); // CUSTOMER, PROVIDER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [registerMut] = useMutation(REGISTER_MUTATION);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await registerMut({
        variables: { name, email, password, role }
      });

      if (data?.register) {
        const { accessToken, refreshToken, user } = data.register;

        // Set cookies for middleware
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch(loginSuccess({ user, token: accessToken }));
        toast.success(`Welcome to ServiceHub, ${user.name}! 🎉`);

        if (user.role === 'PROVIDER') {
          router.push('/provider/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.message || 'Registration failed'));
      toast.error(err.message || 'Could not create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand hover:text-brand-hover">
              Sign in
            </Link>
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              role === 'CUSTOMER'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('PROVIDER')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              role === 'PROVIDER'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Service Partner
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input
            id="full-name"
            name="name"
            type="text"
            label="Full Name"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="email-address"
            name="email"
            type="email"
            label="Email Address"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center mt-6"
          >
            Sign Up as {role === 'PROVIDER' ? 'Service Partner' : 'Customer'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
}
