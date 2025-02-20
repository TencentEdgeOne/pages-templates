import * as React from 'react';
import { Link, navigate, graphql } from 'gatsby';
import * as styles from './index.module.css';

// Component imports
import AttributeGrid from '../components/AttributeGrid';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Highlight from '../components/Highlight';
import Layout from '../components/Layout/Layout';
import ProductCollectionGrid from '../components/ProductCollectionGrid';
import ProductCardGrid from '../components/ProductCardGrid';
import Quote from '../components/Quote';
import Title from '../components/Title';

/**
 * Home page component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - GraphQL query data
 * @returns {React.ReactElement} Home page component
 */
const IndexPage = ({ data }) => {
  // Extract data from WordPress GraphQL response
  const { wordpress } = data;
  const newArrivals = wordpress.newArrials?.edges.map(({ node }) => node) ?? [];
  const collections = wordpress.collections?.edges.map(({ node }) => node) ?? [];
  const banner = wordpress.banner?.banner ?? {};
  const highlight = wordpress.highlight?.highlight ?? {};
  const promotion = wordpress.promotion?.promotion ?? {};

  // Navigation handlers
  const handleShopNavigation = () => {
    navigate('/shop');
  };

  return (
    <Layout disablePaddingBottom>
      {/* Hero Banner Section */}
      <Hero
        maxWidth="500px"
        image={banner.image.node}
        title={banner.title}
        subtitle={banner.subtitle}
        ctaText={banner.ctatext}
        ctaAction={handleShopNavigation}
      />

      {/* New Arrivals Section */}
      <div className={styles.newArrivalsContainer}>
        <Container>
          <Title
            name="New Arrivals"
            link="/shop"
            textLink="view all"
          />
          <ProductCardGrid
            spacing
            showSlider
            height={480}
            columns={3}
            data={newArrivals}
          />
        </Container>
      </div>

      {/* Collections Section */}
      <div className={styles.collectionContainer}>
        <Container size="large">
          <Title name="Popular Collection" />
          <ProductCollectionGrid collections={collections} />
        </Container>
      </div>

      

      {/* Highlight Section */}
      <div className={styles.highlightContainer}>
        <Container size="large" fullMobile>
          <Highlight
            image={highlight.mainimage.node}
            altImage="highlight image"
            miniImage={highlight.subImage.node}
            miniImageAlt="mini highlight image"
            title={highlight.title}
            description={highlight.description}
            textLink={highlight.buttonText}
            link={highlight.jumpUrl}
          />
        </Container>
      </div>

      {/* Promotion Section */}
      <div className={styles.promotionContainer}>
        <Hero
          image={promotion.backgroundImage.node}
          title={promotion.title}
        />
        <div className={styles.linkContainers}>
          <Link to={promotion.buttonUrl}>{promotion.button}</Link>
        </div>
      </div>

      {/* About Section */}
      <Quote
        bgColor="var(--standard-light-grey)"
        title="about US"
        quote="Our brand believes crystals embody nature's spirit. We bring their pure beauty to those seeking uniqueness. Each piece is handcrafted to reflect your individuality."
      />

      {/* Attributes Section */}
      <AttributeGrid />
    </Layout>
  );
};

export default IndexPage;


export const query = graphql`
query NewQuery {
  wordpress {
    newArrials: products(first: 3, where: {orderby: {field: DATE, order: DESC}}) {
      edges {
        node {
          slug
          productId
          image {
            id
            sourceUrl
            localFile {
              childImageSharp {
                id
                gatsbyImageData(width: 400, quality: 80)
              }
            }
          }
          name
          id
          ... on WordPress_SimpleProduct {
            regularPrice
            salePrice
            price
          }
          ... on WordPress_VariableProduct {
            id
            price
          }
        }
      }
    }
    collections:productCategories(where: {parent: 16}) {
      edges {
        node {
          count
          id
          slug
          image {
            id
            sourceUrl
            localFile {
                childImageSharp {
                  gatsbyImageData(width: 600)
                }
              }
          }
          menuOrder
          name
        }
      }
    }
    banner: page(id: "sample-page", idType: URI) {
      banner {
        title
        subtitle
        ctatext
        image {
          node {
            id
            altText
            sourceUrl
            localFile {
                childImageSharp {
                  gatsbyImageData(width: 800)
                }
              }
          }
        }
      }
    }
    highlight:  page(id: "highlight", idType: URI) {
      highlight {
        title
        subImage {
          node {
            id
            altText
            sourceUrl
            localFile {
                childImageSharp {
                  gatsbyImageData(width: 800)
                }
              }
          }
        }
        mainimage {
          node {
            id
            altText
            sourceUrl
            localFile {
                childImageSharp {
                  gatsbyImageData(width: 800)
                }
              }
          }
        }
        description
        buttonText
        jumpUrl
      }
    }
    promotion: page(id: "promotion", idType: URI) {
      promotion {
        backgroundImage {
          node {
            id
            sourceUrl
            altText
            localFile {
                childImageSharp {
                  gatsbyImageData(width: 800)
                }
              }
          }
        }
        title
        buttonUrl
        button
      }
    }
  }
}
`
