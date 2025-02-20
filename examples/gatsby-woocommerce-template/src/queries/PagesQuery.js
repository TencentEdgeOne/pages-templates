exports.PagesQuery = `
query PagesQuery {
  wordpress {
    productCategories {
      nodes {
        count
        id
        description
        menuOrder
        name
        products {
          nodes {
            productId
            image {
              id
              altText
              sourceUrl
              localFile {
                childImageSharp {
                  gatsbyImageData(width: 400, quality: 100)
                }
              }
            }
            id
            name
            slug
            ... on WordPress_SimpleProduct {
              price
              regularPrice
              salePrice
              shippingClassId
              shippingTaxable
              status
              weight
              width
              taxClass
            }
            name
            id
            content
            purchasable
            title
            sku
          }
        }
        slug
        parent {
          node {
            name
            id
            slug
            parent {
              node {
                id
                slug
                name
              }
            }
          }
        }
      }
    }
    posts {
      nodes {
        date
        title
        slug
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            id
            altText
            sourceUrl
            localFile {
              childImageSharp {
                gatsbyImageData(width: 600)
              }
            }
          }
        }
        content(format: RENDERED)
      }
    }
    products {
      nodes {
        id
        content
        image {
          id
          altText
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(width: 800)
            }
          }
        }
        productCategories {
          nodes {
            name
            id
            slug
            parent {
              node {
                id
                name
                slug
              }
            }
          }
        }
        name
        productId
        purchasable
        sku
        slug
        status
        title
        ... on WordPress_SimpleProduct {
          id
          name
          price
          regularPrice
          salePrice
          shippingRequired
          width
          weight
          totalSales
          title
        }
        ... on WordPress_VariableProduct {
          id
          name
          price
          attributes {
            nodes {
              attributeId
              id
              label
              name
              options
              position
              scope
              variation
              visible
              ... on WordPress_GlobalProductAttribute {
                id
                name
              }
              ... on WordPress_LocalProductAttribute {
                id
                name
              }
            }
          }
          variations {
            nodes {
              regularPrice
              name
              salePrice
              price
              sku
              id
              databaseId
              attributes {
                nodes {
                  id
                  attributeId
                  label
                  name
                  value
                }
              }
              stockStatus
            }
          }
        }
      }
    }
  }
}
`;
