import { gql } from 'graphql-request';
import { CartItemContent } from './Queries';

export const RemoveItemsFromCart = gql`
  mutation RemoveItemsFromCart($keys: [ID], $all: Boolean) {
    removeItemsFromCart(input: {keys: $keys, all: $all}) {
      cart {
        subtotal
        subtotalTax
        shippingTax
        shippingTotal
        total
        totalTax
        feeTax
        feeTotal
        discountTax
        discountTotal
      }
      cartItems {
        ...CartItemContent
      }
    }
  }
  ${CartItemContent}
`;