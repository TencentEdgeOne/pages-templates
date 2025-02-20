import React from 'react';
import { Link, navigate } from 'gatsby';
import * as styles from './BlogPreview.module.css';
import OptimizedImage from '../Image'
const BlogPreview = (props) => {
  const { image, altImage, title, link, category, showExcerpt, excerpt } =
    props;

  const handleClick = () => {
    navigate(link);
  };
  return (
    <div className={styles.root} onClick={handleClick}>
      <OptimizedImage image={image} className={styles.blogPreviewImage} />
      <span className={styles.category}>{category}</span>
      <h4 className={styles.title}>
        <Link to={link}>{title}</Link>
      </h4>
      {showExcerpt && <p className={styles.excerpt}>{excerpt}</p>}
    </div>
  );
};

export default BlogPreview;
