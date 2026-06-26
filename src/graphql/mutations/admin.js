import { gql } from '@apollo/client';

export const VERIFY_PROVIDER_MUTATION = gql`
  mutation VerifyProvider($providerId: ID!, $status: VerificationStatus!) {
    verifyProvider(providerId: $providerId, status: $status) {
      id
      verificationStatus
    }
  }
`;
