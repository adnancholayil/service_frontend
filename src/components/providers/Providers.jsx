'use client';

import { ThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, ToastBar, toast } from 'react-hot-toast';

import { store, persistor } from '../../store';
import { apolloClient } from '../../graphql/client';
import AuthModals from '../auth/AuthModals';
import LogoutConfirmModal from '../auth/LogoutConfirmModal';

import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

console.log("GOOGLE CLIENT ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
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
                <LogoutConfirmModal />
                <Toaster
                  position="top-right"
                  containerStyle={{ zIndex: 999999 }}
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--card)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      zIndex: 999999,
                    },
                  }}
                >
                  {(t) => (
                    <ToastBar toast={t}>
                      {({ icon, message }) => (
                        <div 
                          className="flex items-center cursor-pointer w-full h-full"
                          onClick={() => toast.dismiss(t.id)}
                        >
                          {icon}
                          {message}
                        </div>
                      )}
                    </ToastBar>
                  )}
                </Toaster>
              </QueryClientProvider>
            </ApolloProvider>
          </PersistGate>
        </ReduxProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
