import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink, Observable } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql';
const wsUri = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql';

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = () => {
  pendingRequests.map(callback => callback());
  pendingRequests = [];
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(httpUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($token: String!) {
            refreshToken(token: $token) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { token: refreshToken }
      })
    });

    const result = await response.json();

    if (result.errors || !result.data?.refreshToken) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken;
    
    // Save new tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;

    return accessToken;
  } catch (error) {
    throw error;
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  let isUnauthorized = false;

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (
        err.message?.includes('You must be logged in') ||
        err.message?.includes('UNAUTHENTICATED') ||
        err.message?.includes('jwt expired') ||
        err.message?.includes('invalid signature')
      ) {
        isUnauthorized = true;
      }
    }
    // Filter the error so it doesn't propagate to the UI components
    if (isUnauthorized && response) {
      response.errors = response.errors.filter(
        err => !(
          err.message?.includes('You must be logged in') ||
          err.message?.includes('UNAUTHENTICATED') ||
          err.message?.includes('jwt expired') ||
          err.message?.includes('invalid signature')
        )
      );
      if (response.errors.length === 0) {
        response.errors = undefined;
      }
    }
  }

  if (networkError) {
    if (
      networkError.statusCode === 401 ||
      networkError.message?.includes('You must be logged in') ||
      networkError.message?.includes('jwt expired') ||
      networkError.message?.includes('invalid signature')
    ) {
      isUnauthorized = true;
    }
    // Also check networkError.result.errors
    if (networkError.result && networkError.result.errors) {
      for (let err of networkError.result.errors) {
        if (
          err.message?.includes('You must be logged in') ||
          err.message?.includes('jwt expired') ||
          err.message?.includes('invalid signature')
        ) {
          isUnauthorized = true;
        }
      }
    }
  }

  if (isUnauthorized) {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        store.dispatch(logout());
        localStorage.removeItem('token');
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        toast.error('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        // Return an empty observable that never completes, so the UI just hangs in loading state
        // until the redirect happens, preventing a flash of the error message.
        return new Observable(() => {});
      }

      if (!isRefreshing) {
        isRefreshing = true;
        
        return new Observable((observer) => {
          let subscriber;
          refreshAccessToken()
            .then((newToken) => {
              resolvePendingRequests(true);
              
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${newToken}`,
                },
              });
              
              subscriber = forward(operation).subscribe({
                next: (value) => observer.next(value),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
            })
            .catch((err) => {
              resolvePendingRequests(false);
              store.dispatch(logout());
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              document.cookie = 'auth_token=; Max-Age=0; path=/;';
              toast.error('Session expired. Please log in again.');
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
              // Don't call observer.error(err) to prevent UI flash, just hang until redirect
            })
            .finally(() => {
              isRefreshing = false;
            });
            
          return () => {
            if (subscriber) subscriber.unsubscribe();
          };
        });
      } else {
        return new Observable((observer) => {
          let subscriber;
          new Promise((resolve) => {
            pendingRequests.push(resolve);
          }).then((success) => {
            if (!success) return; // if refresh failed, do nothing and wait for redirect
            
            const accessToken = localStorage.getItem('token');
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${accessToken}`,
              },
            });
            subscriber = forward(operation).subscribe({
              next: (value) => observer.next(value),
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
          });
          
          return () => {
            if (subscriber) subscriber.unsubscribe();
          };
        });
      }
    }
  }
});

const httpLink = new HttpLink({
  uri: httpUri,
  fetchOptions: { cache: 'no-store' }
});

// Middleware that attaches the auth token to every request at call time
const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

// Avoid executing WebSocket link on the server side
const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: wsUri,
        connectionParams: () => {
          const token = localStorage.getItem('token');
          return {
            Authorization: token ? `Bearer ${token}` : '',
          };
        },
        shouldRetry: () => true, // Force retry even on 4xxx errors (e.g. 4403 Forbidden due to expired token)
      })
    )
  : null;

// Split routing based on operation type (subscription vs query/mutation)
const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      errorLink.concat(authLink.concat(httpLink))
    )
  : errorLink.concat(authLink.concat(httpLink));

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
});

export default apolloClient;
