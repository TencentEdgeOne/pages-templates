import React from 'react';
import { Link } from 'gatsby';

import * as styles from './Button.module.css';

const Button = ({
  children,
  href,
  target,
  level,
  type,
  size,
  disabled,
  onClick,
  className,
  flat,
  link,
  fullWidth,
  theme,
}) => {
  const classes = level ? [styles.button] : [styles.link];

  if (level in styles) {
    classes.push(styles[level]);
  }
  if (size in styles) {
    classes.push(styles[size]);
  }
  if (theme in styles) {
    classes.push(styles[theme]);
  }

  if (disabled) {
    classes.push(styles.disabled);
  }
  if (flat) {
    classes.push(styles.flat);
  }
  if (link) {
    classes.push(styles.link);
  }
  if (fullWidth) {
    classes.push(styles.fullWidth);
  }
  if (className) {
    classes.push(className);
  }

  const classOutput = classes.join(' ');
  return (
    <>
      {href && target && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={classOutput}
          onClick={onClick}
        >
          {children}
        </a>
      )}
      {href && !target && (
        <Link to={href} className={classOutput} onClick={onClick}>
          {children}
        </Link>
      )}
      {!href && (
        <button
          className={classOutput}
          onClick={onClick}
          type={type}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
