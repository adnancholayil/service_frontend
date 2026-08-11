import { gql } from '@apollo/client';

export const ADMIN_PROVIDERS_QUERY = gql`
  query AdminProviders {
    adminProviders {
      id
      businessName
      description
      verificationStatus
      subscriptionStatus
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
    }
  }
`;

export const ADMIN_USERS_QUERY = gql`
  query AdminUsers {
    adminUsers {
      id
      name
      email
      role
      avatar
      createdAt
      password
    }
  }
`;

export const ADMIN_DASHBOARD_STATS_QUERY = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      usersCount
      bookingsCount
      disputesCount
      totalRevenue
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetAdminReviews {
    adminReviews {
      id
      rating
      comment
      createdAt
      customer {
        id
        name
        email
        avatar
      }
      provider {
        id
        businessName
      }
    }
  }
`;

export const GET_PAYMENTS_REPORT = gql`
  query GetPaymentsReport {
    getPaymentsReport {
      id
      plan
      amount
      method
      status
      transactionId
      createdAt
      provider {
        id
        businessName
        user {
          name
          email
        }
      }
    }
  }
`;

export const GET_REPORTED_REVIEWS = gql`
  query GetAdminReportedReviews {
    adminReportedReviews {
      id
      rating
      comment
      isReported
      reportReason
      reportStatus
      createdAt
      customer {
        id
        name
        email
        avatar
      }
      provider {
        id
        businessName
      }
    }
  }
`;
