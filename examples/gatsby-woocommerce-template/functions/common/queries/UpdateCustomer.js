import { gql } from 'graphql-request';
import { CustomerFields } from './Queries';
export const UpdateCustomer = gql`
  mutation UpdateCustomer($customer: UpdateCustomerInput!) {
    updateCustomer(input: $customer) {
      customer {
        ...CustomerFields
      }
    }
  }
  ${CustomerFields}
`;