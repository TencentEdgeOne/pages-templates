import { Link } from 'gatsby';
import React from 'react';
import * as styles from './Highlight.module.css';
import OptimizedImage from '../Image';

const Highlight = (props) => {
  const {
    image,
    miniImage,
    title,
    description,
    textLink,
    link,
  } = props;
  return (
    <div className={styles.root}>
      <OptimizedImage image={image} />
      <div className={styles.contentContainer}>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={link}>{textLink}</Link>
        <OptimizedImage image={miniImage}/>
      </div>
    </div>
  );
};

export default Highlight;
