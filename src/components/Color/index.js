
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const Color = ({ type, name, hex, size = 'default', className, version, onClick, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (navigator.clipboard && hex) {
      navigator.clipboard.writeText(hex).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
    onClick?.();
  };

  const colorClassName = classNames(
    'tt-color',
    `tt-color-${type}`,
    `tt-color-${size}`,
    { 'tt-color-copied': copied },
    className
  );

  return (
    <div 
      className={colorClassName} 
      data-component-version={version}
      onClick={handleClick}
      {...props}
    >
      <div className="tt-color-swatch" style={{ backgroundColor: hex }} />
      <div className="tt-color-info">
        <div className="tt-color-name">{name}</div>
        <div className="tt-color-hex">{copied ? '已复制!' : hex}</div>
      </div>
      {copied && <div className="tt-color-tooltip">已复制!</div>}
    </div>
  );
};

Color.version = componentVersions.Color || '1.0.0';

Color.propTypes = {
  type: PropTypes.oneOf(['primary', 'neutral', 'success', 'warning', 'error']),
  name: PropTypes.string,
  hex: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
  version: PropTypes.string,
  onClick: PropTypes.func,
};

Color.defaultProps = {
  size: 'default',
};

export default Color;

