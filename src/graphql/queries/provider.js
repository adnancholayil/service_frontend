import { gql } from '@apollo/client';

export const GET_PROVIDER_DETAILS = gql`
  query GetProviderDetails($id: ID!) {
    providerDetails(id: $id) {
      id
      businessName
      description
      rating
      reviewsCount
      verificationStatus
      portfolio
      address
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
  query GetProvidersPageData($category: ID, $longitude: Float, $latitude: Float, $maxDistance: Float, $page: Int, $limit: Int) {
    categories {
      id
      name
    }
    providers(category: $category, longitude: $longitude, latitude: $latitude, maxDistance: $maxDistance, page: $page, limit: $limit) {
      data {
        id
        businessName
        description
        rating
        reviewsCount
        verificationStatus
        address
        location {
          coordinates
        }
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
      total
      page
      totalPages
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
      subscriptionPlan
      subscriptionStatus
      subscriptionExpiry
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
      subscriptionPlan
      subscriptionStatus
      subscriptionExpiry
      portfolio
      user {
        id
        name
        email
        avatar
      }
      services {
        id
        name
        description
        price
        duration
        isActive
        category {
          id
          name
        }
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
      isReported
      reportReason
      reportStatus
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
