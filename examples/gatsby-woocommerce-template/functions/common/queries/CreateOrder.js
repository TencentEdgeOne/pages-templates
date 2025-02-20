import { gql } from 'graphql-request';
export const CreateOrder = gql`
  mutation CreateOrder($lineItems: [LineItemInput]) {
    createOrder(input: {
      lineItems: $lineItems
    }) {
      clientMutationId
      order {
        id
        orderKey
        total
      }
    }
  }
`;