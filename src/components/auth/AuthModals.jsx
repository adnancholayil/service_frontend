'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Sparkles, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import CreatableSelect from 'react-select/creatable';

import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { closeAuthModal, openAuthModal } from '../../store/slices/appSlice';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN_MUTATION, REGISTER_MUTATION, GOOGLE_LOGIN_MUTATION } from '../../graphql/mutations/auth';
import { GET_CATEGORIES } from '../../graphql/queries/categories';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function AuthModals() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { authModalType } = useSelector((state) => state.app);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isOpen = authModalType !== null;

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      dispatch(closeAuthModal());
    }
  }, [isAuthenticated, isOpen, dispatch]);

  // --- Common ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Register Specific ---
  const [role, setRole] = useState('CUSTOMER'); // CUSTOMER, PROVIDER
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('');

  const { data: catData } = useQuery(GET_CATEGORIES, { skip: authModalType !== 'register' });
  const categories = catData?.categories || [];

  const [loginMut] = useMutation(LOGIN_MUTATION);
  const [registerMut] = useMutation(REGISTER_MUTATION);
  const [googleLoginMut] = useMutation(GOOGLE_LOGIN_MUTATION);

  const handleClose = () => {
    dispatch(closeAuthModal());
    // Reset fields if needed, or leave them for convenience
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const { data, errors } = await loginMut({
        variables: { email, password }
      });
      
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      
      if (data?.login) {
        const { accessToken, refreshToken, user } = data.login;
        // Set cookies for middleware
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        dispatch(loginSuccess({ user, token: accessToken }));
        toast.success(`Welcome back, ${user.name}!`);
        handleClose();

        const redirectPath = searchParams.get('redirect');
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          if (user.role === 'ADMIN') router.push('/admin/dashboard');
          else if (user.role === 'PROVIDER') router.push('/provider/dashboard');
          else router.push('/');
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
      const variables = { name, email, password, role };
      
      if (role === 'PROVIDER') {
        if (!businessName || !description || !categoryId || !address) {
          toast.error('Please fill in all provider details');
          setIsLoading(false);
          return;
        }
        variables.providerDetails = {
          businessName,
          description,
          category: categoryId,
          address,
          coordinates: [0, 0] // Default dummy coordinates
        };
      }

      const { data, errors } = await registerMut({ variables });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data?.register) {
        const { accessToken, refreshToken, user } = data.register;

        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch(loginSuccess({ user, token: accessToken }));
        toast.success(`Welcome to ServiceHub, ${user.name}! 🎉`);
        handleClose();

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    dispatch(loginStart());
    try {
      const { data } = await googleLoginMut({
        variables: {
          token: credentialResponse.credential,
          role: authModalType === 'register' ? role : undefined,
        }
      });
      if (data?.googleLogin) {
        const { accessToken, refreshToken, user } = data.googleLogin;
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        document.cookie = `user_role=${user.role}; path=/; max-age=86400`;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        dispatch(loginSuccess({ user, token: accessToken }));
        toast.success(`Welcome, ${user.name}!`);
        handleClose();
        
        const redirectPath = searchParams.get('redirect');
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          if (user.role === 'ADMIN') router.push('/admin/dashboard');
          else if (user.role === 'PROVIDER') router.push('/provider/dashboard');
          else router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.message || 'Google Login failed'));
      toast.error('Could not authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchModal = (type) => {
    dispatch(openAuthModal(type));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={authModalType === 'login' ? 'Sign In' : 'Create Account'}
      size="lg"
    >
      <div className="space-y-6">
        
        {/* Title logo inside modal */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>Service<span className="text-brand">Hub</span></span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {authModalType === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchModal('register')} className="font-semibold text-brand hover:text-brand-hover">
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => switchModal('login')} className="font-semibold text-brand hover:text-brand-hover">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {!(authModalType === 'register' && role === 'PROVIDER') && (
          <>
            <div className="flex justify-center w-full py-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Login failed')}
                shape="rectangular"
                theme="outline"
                text={authModalType === 'login' ? 'signin_with' : 'signup_with'}
                size="large"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        {authModalType === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              id="email-address-login"
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
                <Link href="/forgot-password" onClick={handleClose} className="text-xs font-semibold text-brand hover:text-brand-hover">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password-login"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full justify-center mt-6">
              Log In
            </Button>
          </form>
        ) : (
          <>
            {/* Role Selector Tabs for Register */}
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
                id="email-address-register"
                name="email"
                type="email"
                label="Email Address"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password-register"
                name="password"
                type="password"
                label="Password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {role === 'PROVIDER' && (
                <div className="space-y-4 pt-4 border-t border-border mt-4">
                  <h3 className="text-sm font-semibold text-foreground">Provider Details</h3>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    label="Business Name"
                    required
                    placeholder="Your Service Business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    label="Description"
                    required
                    placeholder="What services do you provide?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </label>
                    <CreatableSelect
                      isClearable
                      required
                      placeholder="Select or type to create..."
                      options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                      value={categoryId ? { value: categoryId, label: categories.find(c => c.id === categoryId)?.name || categoryId } : null}
                      onChange={(selected) => setCategoryId(selected ? selected.value : '')}
                      className="text-sm font-medium"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: 'var(--card)',
                          borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
                          borderRadius: '0.75rem',
                          padding: '0.15rem',
                          boxShadow: state.isFocused ? '0 0 0 1px var(--ring)' : 'none',
                          '&:hover': {
                            borderColor: 'var(--ring)'
                          }
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: 'var(--card)',
                          borderRadius: '0.75rem',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          zIndex: 50,
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused ? 'var(--muted)' : 'transparent',
                          color: 'var(--foreground)',
                          cursor: 'pointer',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: 'var(--foreground)',
                        }),
                        input: (base) => ({
                          ...base,
                          color: 'var(--foreground)',
                        })
                      }}
                    />
                  </div>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    label="Address"
                    required
                    placeholder="City, Area or Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full justify-center mt-6">
                Sign Up as {role === 'PROVIDER' ? 'Service Partner' : 'Customer'}
              </Button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
