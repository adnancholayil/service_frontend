import { gql } from '@apollo/client';

export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($serviceId: ID!, $bookingDate: String!, $address: String!, $coordinates: [Float!]!, $notes: String) {
    createBooking(serviceId: $serviceId, bookingDate: $bookingDate, address: $address, coordinates: $coordinates, notes: $notes) {
      id
      service {
        id
        name
      }
      provider {
        id
        businessName
      }
      bookingDate
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
