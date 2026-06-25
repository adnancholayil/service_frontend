import { gql } from '@apollo/client';

export const GET_PROVIDER_DETAILS = gql`
  query GetProviderDetails($id: ID!) {
    providerDetails(id: $id) {
      id
      businessName
      bio
      rating
      reviewsCount
      verificationStatus
      user {
        id
        name
        email
        avatar
      }
      category {
        id
        name
      }
      services {
        id
        name
        description
        price
        duration
      }
    }
  }
`;

export const GET_PROVIDERS_PAGE_DATA = gql`
  query GetProvidersPageData($category: ID) {
    categories {
      id
      name
    }
    providers(category: $category) {
      id
      businessName
      bio
      rating
      reviewsCount
      verificationStatus
      user {
        id
        name
        avatar
      }
      category {
        id
        name
      }
    }
  }
`;
