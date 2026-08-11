import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        name
        email
        phone
        role
        avatar
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $phone: String!, $password: String!, $role: UserRole!, $providerDetails: ProviderRegisterInput) {
    register(name: $name, email: $email, phone: $phone, password: $password, role: $role, providerDetails: $providerDetails) {
      accessToken
      refreshToken
      user {
        id
        name
        email
        phone
        role
        avatar
      }
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($token: String!, $role: UserRole) {
    googleLogin(token: $token, role: $role) {
      accessToken
      refreshToken
      user {
        id
        name
        email
        phone
        role
        avatar
      }
    }
  }
`;

export const SEND_OTP_MUTATION = gql`
  mutation SendOtp($email: String!) {
    sendOtp(email: $email) {
      success
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      token
      user {
        id
        name
        email
        role
        avatar
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatar: String!) {
    updateUserAvatar(avatar: $avatar) {
      id
      avatar
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($name: String, $phone: String, $avatar: String) {
    updateUserProfile(name: $name, phone: $phone, avatar: $avatar) {
      id
      name
      email
      phone
      role
      avatar
    }
  }
`;
