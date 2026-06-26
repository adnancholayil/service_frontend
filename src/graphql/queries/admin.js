import { gql } from '@apollo/client';

export const ADMIN_PROVIDERS_QUERY = gql`
  query AdminProviders {
    adminProviders {
      id
      businessName
      description
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
