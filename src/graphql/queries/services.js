import { gql } from '@apollo/client';

export const GET_SERVICES_PAGE_DATA = gql`
  query GetServicesPageData($category: ID, $search: String) {
    categories {
      id
      name
      slug
      icon
    }
    globalServices(category: $category, search: $search) {
      id
      name
      description
      price
      category {
        name
      }
      provider {
        id
        businessName
        rating
        reviewsCount
        user {
          name
          avatar
        }
      }
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
