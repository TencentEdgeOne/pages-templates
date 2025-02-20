import React from 'react';

import * as styles from './BreadCrumbs.module.css';
import Icon from '../Icons/Icon';

const Breadcrumbs = ({ crumbs }) => {
  let crumbsOutput = crumbs;
  if (crumbsOutput && typeof crumbsOutput !== 'object') {
    if (crumbsOutput.indexOf('>') > -1) {
      crumbsOutput = crumbsOutput.split('>');
    } else {
      crumbsOutput = [crumbsOutput];
    }
  }

  return (
    <div data-breadcrumbs className={styles.breadcrumbs}>
      {crumbsOutput &&
        crumbsOutput.map((crumb, crumbIndex) => (
          <span key={crumbIndex}>
            {crumbIndex > 0 && (
              <span className={styles.spacer}>
                <Icon symbol={'caret'}></Icon>
              </span>
            )}
            {typeof crumb === 'object' && 'link' in crumb && (
              <a className={styles.crumb} href={crumb.link}>
                {crumb.label.trim()}
              </a>
            )}
            {typeof crumb === 'object' && !('link' in crumb) && (
              <span className={styles.crumb}>{crumb.label.trim()}</span>
            )}
            {typeof crumb !== 'object' && (
              <span className={styles.crumb}>{crumb.trim()}</span>
            )}
          </span>
        ))}
    </div>
  );
};

export default Breadcrumbs;
