import React from 'react';
import * as styles from './BlogPreviewGrid.module.css';

import BlogPreview from '../BlogPreview';

const BlogPreviewGrid = (props) => {
  const { data, hideReadMoreOnWeb, showExcerpt } = props;
  return (
    <div className={styles.root}>
      {data &&
        data.map((blog, index) => {
          const category = blog.categories?.nodes[0]?.name ?? '';

          return (
            <BlogPreview
              key={index}
              image={blog.featuredImage.node}
              altImage={blog.alt}
              title={blog.title}
              link={`/blog/${blog.slug}`}
              category={category}
              excerpt={blog.excerpt}
              hideReadMoreOnWeb={hideReadMoreOnWeb}
              showExcerpt={showExcerpt}
            />
          );
        })}
    </div>
  );
};

export default BlogPreviewGrid;
