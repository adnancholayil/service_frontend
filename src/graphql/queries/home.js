import { gql } from '@apollo/client';

export const GET_HOME_DATA = gql`
  query GetHomeData($longitude: Float, $latitude: Float) {
    categories {
      id
      name
      slug
      icon
    }
    providers(longitude: $longitude, latitude: $latitude) {
      id
      businessName
      description
      rating
      reviewsCount
      user {
        name
        avatar
      }
      category {
        name
      }
      services {
        id
        name
        description
        price
        category {
          name
        }
      }
    }
  }
`;
