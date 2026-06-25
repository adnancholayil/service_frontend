import { gql } from '@apollo/client';

export const MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  subscription OnMessageReceived($conversationId: ID!) {
    messageReceived(conversationId: $conversationId) {
      id
      senderId
      text
      timestamp
    }
  }
`;
