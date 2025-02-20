import React from 'react';
import * as styles from './blog.module.css';

import Blog from '../components/Blog';
import Container from '../components/Container';
import Layout from '../components/Layout/Layout';

const processContent = (content) => {
  return content.replace(
    /class=\"excerpt\"/g,
    `class="${styles.excerpt}"`
  ).replace(
    /class=\"blogParagraph\"/g,
    `class="${styles.blogParagraph}"`
  ).replace(
    /class=\"imageContainer\"/g,
    `class="${styles.imageContainer}"`
  );
};

const BlogDetail = ({ pageContext }) => {
  const { data } = pageContext;
  const category = data.categories?.nodes[0]?.name ?? '';
  return (
    <Layout>
      <div className={styles.root}>
        <Container>
          <div className={styles.blogContainer}>
            <Blog
              category={category}
              title={data.title}
              image={data.featuredImage.node}
              alt={''}
            >
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: processContent(data.content)}}>
              </div>
              
            </Blog>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default BlogDetail;
