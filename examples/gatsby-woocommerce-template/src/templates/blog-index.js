import React from 'react';
import { navigate } from 'gatsby';

import BlogPreviewGrid from '../components/BlogPreviewGrid';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Layout from '../components/Layout/Layout';
import * as styles from './blog-index.module.css';


const BlogPage = ({pageContext}) => {
  const { data } = pageContext;

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <Hero
          maxWidth={'400px'}
          image={{sourceUrl: '/blogCover.png'}}
          title={`The new standard of Crystal`}
          ctaLink={'read story'}
          ctaTo={'/blog/sample'}
          header={'design'}
        />


        {/* Blog Grid */}
        <div className={styles.blogsContainer}>
          <Container size={'large'}>
            <BlogPreviewGrid data={data} hideReadMoreOnWeb showExcerpt />
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;

