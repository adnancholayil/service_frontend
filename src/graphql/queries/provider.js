import { gql } from '@apollo/client';

export const GET_PROVIDER_DETAILS = gql`
  query GetProviderDetails($id: ID!) {
    providerDetails(id: $id) {
      id
      businessName
      bio
      rating
      reviewsCount
      verificationStatus
      user {
        id
        name
        email
        avatar
      }
      category {
        id
        name
      }
      services {
        id
        name
        description
        price
        duration
      }
    }
  }
`;

export const GET_PROVIDERS_PAGE_DATA = gql`
  query GetProvidersPageData($category: ID) {
    categories {
      id
      name
    }
    providers(category: $category) {
      id
      businessName
      bio
      rating
      reviewsCount
      verificationStatus
      user {
        id
        name
        avatar
      }
      category {
        id
        name
      }
    }
  }
`;

export const PROVIDER_DASHBOARD_STATS_QUERY = gql`
  query ProviderDashboardStats {
    providerDashboardStats {
      totalEarnings
      pendingTasks
      completedJobs
      averageRating
    }
  }
`;

export const GET_PROVIDER_PROFILE = gql`
  query GetProviderProfile($userId: ID!) {
    providerProfile(userId: $userId) {
      id
      businessName
      description
      address
      rating
      reviewsCount
      verificationStatus
      user {
        id
        name
        email
        avatar
      }
      services {
        id
        name
        price
        isActive
      }
    }
  }
`;

export const GET_PROVIDER_REVIEWS = gql`
  query GetProviderReviews($providerUserId: ID!) {
    providerReviews(providerUserId: $providerUserId) {
      id
      rating
      comment
      createdAt
      customer {
        name
        avatar
      }
      booking {
        service {
          name
        }
      }
    }
  }
`;
