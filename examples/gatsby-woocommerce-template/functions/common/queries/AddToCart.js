import {  gql} from 'graphql-request';
import { CartItemContent } from './Queries';
export
  const AddToCart = gql`
  mutation AddToCart(
    $productId: Int!
    $quantity: Int!
    $variation: [ProductAttributeInput]
    $variationId: Int
    $extraData: String
  ) {
    addToCart(
      input: {
        productId: $productId
        quantity: $quantity
        variation: $variation
        variationId: $variationId
        extraData: $extraData
      }
    ) {
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
      cartItem {
       ...CartItemContent
      }
      clientMutationId
    }
  }
    ${CartItemContent}
`;