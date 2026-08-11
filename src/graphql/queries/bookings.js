import { gql } from '@apollo/client';

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    bookings {
      id
      service {
        id
        name
        price
      }
      provider {
        id
        businessName
        user {
          name
          avatar
        }
      }
      customer {
        id
        name
        email
        phone
        avatar
      }
      location {
        address
      }
      bookingDate
      customerPhone
      notes
      status
      paymentStatus
      totalPrice
      createdAt
    }
  }
`;

export const GET_BOOKING_BY_ID = gql`
  query GetBookingById($id: ID!) {
    bookingDetails(id: $id) {
      id
      service {
        id
        name
        price
        description
      }
      provider {
        id
        businessName
        user {
          name
          avatar
        }
      }
      customer {
        id
        name
        email
      }
      location {
        address
      }
      bookingDate
      notes
      status
      paymentStatus
      createdAt
    }
  }
`;

export const BOOKING_SUBSCRIPTION = gql`
  subscription OnBookingStatusChanged($userId: ID!) {
    bookingStatusChanged(userId: $userId) {
      id
      service {
        id
        name
        price
      }
      provider {
        id
        businessName
        user {
          name
          avatar
        }
      }
      customer {
        id
        name
        email
        phone
        avatar
      }
      location {
        address
      }
      bookingDate
      customerPhone
      notes
      status
      paymentStatus
      totalPrice
      createdAt
    }
  }
`;
