import { gql } from 'graphql-request';
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      customer {
        sessionToken
      }
    }
  }
`;