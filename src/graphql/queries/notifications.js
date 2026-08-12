import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $page: Int) {
    notifications(limit: $limit, page: $page) {
      id
      title
      message
      type
      read
      createdAt
    }
  }
`;
