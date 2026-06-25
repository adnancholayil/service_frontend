import { gql } from '@apollo/client';

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    myBookings {
      id
      service {
        id
        title
        price
      }
      provider {
        id
        name
        avatar
      }
      address
      date
      time
      notes
      status
      paymentStatus
      createdAt
    }
  }
`;

export const GET_BOOKING_BY_ID = gql`
  query GetBookingById($id: ID!) {
    booking(id: $id) {
      id
      service {
        id
        title
        price
        description
      }
      provider {
        id
        name
        avatar
        title
      }
      customer {
        id
        name
        email
      }
      address
      date
      time
      notes
      status
      paymentStatus
      createdAt
    }
  }
`;
