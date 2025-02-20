import React, { Fragment } from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const OptimizedImage = (props) => {
  const { image, className } =
    props;

  return (
    <Fragment>
      {image?.localFile && <GatsbyImage className={className} image={getImage(image?.localFile)} alt={image.altText || 'alt'} />}
      {(!image || !image.localFile || !image.localFile.childImageSharp) && <img className={className} src={image.sourceUrl} alt={image.imageAlt || 'alt'} />}
    </Fragment>
  );
};

export default OptimizedImage;
