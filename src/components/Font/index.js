
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const Font = ({ 
  variant = 'body', 
  className, 
  children, 
  version, 
  ...props 
}) => {
  const fontClassName = classNames(
    'tt-font',
    `tt-font-${variant}`,
    className
  );

  const TagName = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    small: 'span',
  }[variant] || 'p';

  return (
    <TagName
      className={fontClassName}
      data-component-version={version}
      {...props}
    >
      {children}
    </TagName>
  );
};

Font.version = componentVersions.Font || '1.0.0';

Font.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'body', 'small']),
  className: PropTypes.string,
  children: PropTypes.node,
  version: PropTypes.string,
};

Font.defaultProps = {
  variant: 'body',
};

export default Font;

