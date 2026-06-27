import { gql } from '@apollo/client';

export const GET_BANNERS = gql`
  query GetBanners {
    adminBanners {
      id
      title
      imageUrl
      link
      isActive
      createdAt
      updatedAt
    }
  }
`;
