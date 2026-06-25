import { gql } from '@apollo/client';

export const GET_SERVICES = gql`
  query GetServices($category: String) {
    services(category: $category) {
      id
      title
      category
      price
      duration
      rating
      description
    }
  }
`;

export const GET_SERVICE_BY_ID = gql`
  query GetServiceById($id: ID!) {
    service(id: $id) {
      id
      title
      category
      price
      duration
      rating
      description
    }
  }
`;

export const GET_PROVIDERS = gql`
  query GetProviders($category: String) {
    providers(category: $category) {
      id
      name
      title
      avatar
      rating
      reviewsCount
      categories
    }
  }
`;

export const GET_PROVIDER_BY_ID = gql`
  query GetProviderById($id: ID!) {
    provider(id: $id) {
      id
      name
      title
      avatar
      coverImage
      about
      rating
      reviewsCount
      categories
      portfolio
      availability {
        days
        hours
      }
      services {
        id
        title
        price
        duration
        description
      }
      reviews {
        id
        user
        rating
        date
        comment
      }
    }
  }
`;
