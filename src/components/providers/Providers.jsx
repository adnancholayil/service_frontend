'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from 'next-themes';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { store, persistor } from '../../store';
import { apolloClient } from '../../graphql/client';
import AuthModals from '../auth/AuthModals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'placeholder'}>
        <ReduxProvider store={store}>
          <PersistGate loading={
            <div className="flex h-screen items-center justify-center bg-background">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
          } persistor={persistor}>
            <ApolloProvider client={apolloClient}>
              <QueryClientProvider client={queryClient}>
                {children}
                <AuthModals />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--card)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {(t) => (
                    <div onClick={() => toast.dismiss(t.id)}>
                      <ToastBar toast={t} />
                    </div>
                  )}
                </Toaster>
              </QueryClientProvider>
            </ApolloProvider>
          </PersistGate>
        </ReduxProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
