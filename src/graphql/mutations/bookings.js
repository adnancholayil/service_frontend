import { gql } from '@apollo/client';

export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      service {
        id
        title
      }
      provider {
        id
        name
      }
      address
      date
      time
      status
      paymentStatus
    }
  }
`;

export const UPDATE_BOOKING_STATUS_MUTATION = gql`
  mutation UpdateBookingStatus($id: ID!, $status: String!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const PROCESS_PAYMENT_MUTATION = gql`
  mutation ProcessPayment($bookingId: ID!, $paymentMethodId: String!) {
    processPayment(bookingId: $bookingId, paymentMethodId: $paymentMethodId) {
      id
      paymentStatus
    }
  }
`;
