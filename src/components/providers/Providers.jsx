'use client';

import { ThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { store, persistor } from '../../store';
import { apolloClient } from '../../graphql/client';
import AuthModals from '../auth/AuthModals';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
                  },
                }}
              />
            </QueryClientProvider>
          </ApolloProvider>
        </PersistGate>
      </ReduxProvider>
    </ThemeProvider>
  );
}
