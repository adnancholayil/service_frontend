import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql';
const wsUri = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  let isUnauthorized = false;

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (
        err.message?.includes('You must be logged in') ||
        err.message?.includes('UNAUTHENTICATED')
      ) {
        isUnauthorized = true;
      }
    }
  }

  if (networkError) {
    if (
      networkError.statusCode === 401 ||
      networkError.message?.includes('You must be logged in')
    ) {
      isUnauthorized = true;
    }
    // Also check networkError.result.errors
    if (networkError.result && networkError.result.errors) {
      for (let err of networkError.result.errors) {
        if (err.message?.includes('You must be logged in')) {
          isUnauthorized = true;
        }
      }
    }
  }

  if (isUnauthorized) {
    if (typeof window !== 'undefined') {
      store.dispatch(logout());
      localStorage.removeItem('token');
      document.cookie = 'user_token=; Max-Age=0; path=/;';
      toast.error('Session expired. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }
});

const httpLink = new HttpLink({ uri: httpUri });

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
