import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      id
      participants {
        id
        name
        avatar
        role
      }
      lastMessage {
        id
        text
        createdAt
        sender {
          id
        }
      }
      updatedAt
      unreadCount
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $limit: Int, $page: Int) {
    messages(conversationId: $conversationId, limit: $limit, page: $page) {
      id
      text
      createdAt
      sender {
        id
      }
      attachments
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($recipientId: ID!, $text: String!) {
    sendMessage(recipientId: $recipientId, text: $text) {
      id
      text
      createdAt
      sender {
        id
      }
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessage($conversationId: ID!) {
    newMessage(conversationId: $conversationId) {
      id
      text
      createdAt
      sender {
        id
      }
    }
  }
`;
