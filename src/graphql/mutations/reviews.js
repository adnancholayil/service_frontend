import { gql } from '@apollo/client';

export const ADD_REVIEW_MUTATION = gql`
  mutation AddReview($bookingId: ID!, $rating: Int!, $comment: String) {
    addReview(bookingId: $bookingId, rating: $rating, comment: $comment) {
      id
      rating
      comment
      createdAt
    }
  }
`;
