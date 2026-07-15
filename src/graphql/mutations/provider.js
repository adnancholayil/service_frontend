import { gql } from '@apollo/client';

export const UPDATE_PROVIDER_PROFILE = gql`
  mutation UpdateProviderProfile($businessName: String, $description: String, $address: String, $portfolio: [String!]) {
    updateProviderProfile(businessName: $businessName, description: $description, address: $address, portfolio: $portfolio) {
      id
      businessName
      description
      address
      portfolio
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

export const SELECT_SUBSCRIPTION_PLAN = gql`
  mutation SelectSubscriptionPlan($plan: String!) {
    selectSubscriptionPlan(plan: $plan) {
      id
      subscriptionPlan
      subscriptionStatus
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($method: String!) {
    processPayment(method: $method) {
      id
      subscriptionPlan
      subscriptionStatus
    }
  }
`;
