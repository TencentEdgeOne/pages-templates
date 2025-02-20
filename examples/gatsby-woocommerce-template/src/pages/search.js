import React from 'react';
import { parse } from 'query-string';

import Breadcrumbs from '../components/Breadcrumbs';
import Layout from '../components/Layout/Layout';
import Container from '../components/Container/Container';
import ProductCardGrid from '../components/ProductCardGrid';

import * as JsSearch from 'js-search';

import * as styles from './search.module.css';
import {  graphql} from 'gatsby';
import { useEffect } from 'react';
import { useState } from 'react';

var search = new JsSearch.Search('title');
search.addIndex('content');
search.addIndex('slug');
search.addIndex('title');

const SearchPage = (props) => {
  const data = props;
  const products = data.data.wordpress.products.nodes;
  const params = parse(props.location.search);
  const searchQuery = params.q ? params.q : '';

  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    search.addDocuments(products);
    const res = search.search(searchQuery);
    setSearchResults(res);
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { label: `Search results for '${searchQuery}'` },
            ]}
          />
          <div className={styles.searchLabels}>
            <h4>Search results for '{searchQuery}'</h4>
            <span>{searchResults.length} results</span>
          </div>
          <ProductCardGrid
            showSlider={false}
            height={580}
            columns={3}
            data={searchResults}
          />
        </Container>
      </div>
    </Layout>
  );
};

export default SearchPage;
export const query = graphql`
query Products {
  wordpress {
    products {
      nodes {
        id
        content
        image {
          altText
          sourceUrl
        }
        name
        productId
        purchasable
        sku
        slug
        status
        title
        ... on WordPress_SimpleProduct {
          price
        }
      }
    }
  }
}
`