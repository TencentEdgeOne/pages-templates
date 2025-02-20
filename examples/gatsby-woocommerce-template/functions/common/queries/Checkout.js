import { gql } from 'graphql-request';
import { CustomerContent } from './Queries';
export const Checkout = gql`
  mutation Checkout($shippingMethod: [String], $paymentMethod: String, $shipping:CustomerAddressInput, $billing:CustomerAddressInput){
    checkout(input: {shippingMethod: $shippingMethod, paymentMethod: $paymentMethod, shipping:$shipping, billing:$billing}) {
      clientMutationId
      order {
        id
        orderKey
        total
      }
      customer{
        ...CustomerContent
      }
    }
  }
  ${CustomerContent}
`;