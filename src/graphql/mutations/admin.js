import { gql } from '@apollo/client';

export const VERIFY_PROVIDER_MUTATION = gql`
  mutation VerifyProvider($providerId: ID!, $status: VerificationStatus!) {
    verifyProvider(providerId: $providerId, status: $status) {
      id
      verificationStatus
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!, $icon: String) {
    createCategory(name: $name, icon: $icon) {
      id
      name
      slug
      icon
      isActive
      createdAt
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $name: String!, $icon: String, $isActive: Boolean) {
    updateCategory(id: $id, name: $name, icon: $icon, isActive: $isActive) {
      id
      name
      slug
      icon
      isActive
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const CREATE_BANNER_MUTATION = gql`
  mutation CreateBanner($title: String!, $imageUrl: String!, $link: String) {
    createBanner(title: $title, imageUrl: $imageUrl, link: $link) {
      id
      title
      imageUrl
      link
      isActive
      createdAt
    }
  }
`;

export const UPDATE_BANNER_MUTATION = gql`
  mutation UpdateBanner($id: ID!, $title: String!, $imageUrl: String!, $link: String, $isActive: Boolean) {
    updateBanner(id: $id, title: $title, imageUrl: $imageUrl, link: $link, isActive: $isActive) {
      id
      title
      imageUrl
      link
      isActive
      updatedAt
    }
  }
`;

export const DELETE_BANNER_MUTATION = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id)
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;
