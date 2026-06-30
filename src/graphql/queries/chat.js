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
    }
  }
`;

export const GET_ADMIN_CONVERSATIONS = gql`
  query GetAdminConversations {
    adminConversations {
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
    }
  }
`;

export const GET_ADMIN_MESSAGES = gql`
  query GetAdminMessages($conversationId: ID!, $limit: Int, $page: Int) {
    adminMessages(conversationId: $conversationId, limit: $limit, page: $page) {
      id
      text
      createdAt
      sender {
        id
        name
        role
        avatar
      }
      attachments
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

export const GET_OR_CREATE_CONVERSATION = gql`
  mutation GetOrCreateConversation($userId: ID!) {
    getOrCreateConversation(userId: $userId) {
      id
      participants {
        id
        name
        avatar
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($recipientId: ID!, $text: String!, $attachments: [String!]) {
    sendMessage(recipientId: $recipientId, text: $text, attachments: $attachments) {
      id
      text
      createdAt
      attachments
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
      attachments
      sender {
        id
      }
    }
  }
`;
