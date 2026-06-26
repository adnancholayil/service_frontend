import { gql } from '@apollo/client';

export const CREATE_SERVICE = gql`
  mutation CreateService($category: ID!, $name: String!, $description: String!, $price: Float!, $duration: Int, $images: [String!]) {
    createService(category: $category, name: $name, description: $description, price: $price, duration: $duration, images: $images) {
      id
      name
      description
      price
      duration
      isActive
      images
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $name: String, $description: String, $price: Float, $duration: Int, $images: [String!], $isActive: Boolean) {
    updateService(id: $id, name: $name, description: $description, price: $price, duration: $duration, images: $images, isActive: $isActive) {
      id
      name
      description
      price
      duration
      isActive
      images
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;
