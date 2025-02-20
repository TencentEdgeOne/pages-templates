import { gql } from 'graphql-request';
export const RegisterDocument = gql`
  mutation Register($username: String!, $password: String!, $email: String!) {
    registerCustomer(
      input: { username: $username, password: $password, email: $email }
    ) {
      authToken
      refreshToken
      customer {
        sessionToken
      }
    }
  }
`;