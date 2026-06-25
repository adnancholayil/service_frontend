import { gql } from '@apollo/client';

export const NOTIFICATION_RECEIVED_SUBSCRIPTION = gql`
  subscription OnNotificationReceived($userId: ID!) {
    notificationReceived(userId: $userId) {
      id
      title
      message
      type
      read
      createdAt
    }
  }
`;
