import { gql } from 'graphql-request';
import { CartContent, CartItemContent } from './Queries';

export const UpdateCartItemQuantities = gql`
  mutation UpdateCartItemQuantities($items: [CartItemQuantityInput]) {
    updateItemQuantities(input: {items: $items}) {
      cart {
        ...CartContent
      }
      items {
        ...CartItemContent
      }
    }
  }
  ${CartContent}
  ${CartItemContent}
`;