import { gql } from '@apollo/client';

export const UPDATE_PROVIDER_PROFILE = gql`
  mutation UpdateProviderProfile($businessName: String, $description: String, $address: String) {
    updateProviderProfile(businessName: $businessName, description: $description, address: $address) {
      id
      businessName
      description
      address
      location {
        coordinates
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const REQUEST_PAYOUT = gql`
  mutation RequestPayout($amount: Float!) {
    requestPayout(amount: $amount)
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($longitude: Float!, $latitude: Float!) {
    updateLocation(longitude: $longitude, latitude: $latitude) {
      id
      location {
        coordinates
      }
    }
  }
`;
