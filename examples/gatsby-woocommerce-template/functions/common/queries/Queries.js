import { gql } from 'graphql-request';
//这里的 query 是从插件官网抄的，有些版本不正确的，需要修改，其他文件里的 query 就是从这里验证过并独立出去的
export const ProductContentSlice = gql`
  fragment ProductContentSlice on Product {
    id
    databaseId
    name
    slug
    type
    image {
      id
      sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
      altText
    }
    ... on SimpleProduct {
      price
      regularPrice
      soldIndividually
    }
    ... on VariableProduct {
      price
      regularPrice
      soldIndividually
    }
  }
`;

export const ProductVariationContentSlice = gql`
  fragment ProductVariationContentSlice on ProductVariation {
    id
    databaseId
    name
    slug
    image {
      id
      sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
      altText
    }
    status
    price
    regularPrice
    ... on SimpleProductVariation {
      attributes {
        nodes {
          value
          name
          label
          id
          attributeId
        }
      }
    }
  }
`;

export const ProductContentFull = gql`
  fragment ProductContentFull on Product {
    id
    databaseId
    slug
    name
    type
    description
    shortDescription(format: RAW)
    image {
      id
      sourceUrl
      altText
    }
    galleryImages {
      nodes {
        id
        sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
        altText
      }
    }
    productTags(first: 20) {
      nodes {
        id
        slug
        name
      }
    }
    attributes {
      nodes {
        id
        attributeId
        ... on LocalProductAttribute {
          name
          options
          variation
        }
        ... on GlobalProductAttribute {
          name
          options
          variation
        }
      }
    }
    ... on SimpleProduct {
      onSale
      stockStatus
      price
      rawPrice: price(format: RAW)
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      soldIndividually
    }
    ... on VariableProduct {
      onSale
      price
      rawPrice: price(format: RAW)
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      soldIndividually
      variations(first: 50) {
        nodes {
          id
          databaseId
          name
          price
          rawPrice: price(format: RAW)
          regularPrice
          salePrice
          onSale
          attributes {
            nodes {
              name
              label
              value
            }
          }
        }
      }
    }
  }
`;

export const VariationContent = gql`
  fragment VariationContent on ProductVariation {
    id
    name
    slug
    price
    regularPrice
    salePrice
    stockStatus
    stockQuantity
    onSale
    image {
      id
      sourceUrl
      altText
    }
  }
`;

export const CartItemContent = gql`
  fragment CartItemContent on CartItem {
    key
    product {
      node {
        ...ProductContentSlice
      }
    }
    variation {
      node {
        ...ProductVariationContentSlice
      }
    }
    quantity
    total
    subtotal
    subtotalTax
    extraData {
      key
      value
    }
  }
  ${ProductContentSlice}
  ${ProductVariationContentSlice}
`;

export const CartContent = gql`
  fragment CartContent on Cart {
    contents(first: 100) {
      itemCount
      nodes {
        ...CartItemContent
      }
    }
    appliedCoupons {
      code
      discountAmount
      discountTax
    }
    needsShippingAddress
    availableShippingMethods {
      packageDetails
      supportsShippingCalculator
      rates {
        id
        instanceId
        methodId
        label
        cost
      }
    }
    chosenShippingMethods
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
`;

export const AddressFields = gql`
  fragment AddressFields on CustomerAddress {
    firstName
    lastName
    company
    address1
    address2
    city
    state
    country
    postcode
    phone
  }
`;

export const LineItemFields = gql`
  fragment LineItemFields on LineItem {
    databaseId
    product {
      node {
        ...ProductContentSlice
      }
    }
    orderId
    quantity
    subtotal
    total
    totalTax
  }
  ${ProductContentSlice}
`;

export const OrderFields = gql`
  fragment OrderFields on Order {
    id
    databaseId
    orderNumber
    orderVersion
    status
    needsProcessing
    subtotal
    paymentMethodTitle
    total
    totalTax
    date
    dateCompleted
    datePaid
    billing {
      ...AddressFields
    }
    shipping {
      ...AddressFields
    }
    lineItems {
      nodes {
        databaseId
        id
        productId
        quantity
        total
        totalTax
        product {
          node {
            name
            slug
            image {
              uri
              sourceUrl
            }
          }
        }
      }
    }
  }
  ${AddressFields}
`;

export const CustomerFields = gql`
  fragment CustomerFields on Customer {
    id
    databaseId
    firstName
    lastName
    displayName
    email
    sessionToken
    billing {
      ...AddressFields
    }
    shipping {
      ...AddressFields
    }
    orders(first: 100) {
      nodes {
        ...OrderFields
      } 
    }
  }
  ${OrderFields}
`;

export const CustomerContent = gql`
  fragment CustomerContent on Customer {
    id
    sessionToken
    
  }
`;

export const GetProduct = gql`
  query GetProduct($id: ID!, $idType: ProductIdTypeEnum) {
    product(id: $id, idType: $idType) {
      ...ProductContentFull
    }
  }
  ${ProductContentFull}
`;

export const GetProductVariation = gql`
  query GetProductVariation($id: ID!) {
    productVariation(id: $id, idType: DATABASE_ID) {
      ...VariationContent
    }
  }
  ${VariationContent}
`;

export const GetCart = gql`
  query GetCart($customerId: Int) {
    cart {
      ...CartContent
    }
    customer(customerId: $customerId) {
      ...CustomerFields
    }
  }
  ${CartContent}
  ${CartItemContent}
  ${CustomerFields}
`;
