
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const isGradientColor = (color) => {
  return color && typeof color === 'string' && /gradient/i.test(color);
};

const Icon = ({
  type,
  component,
  iconfont,
  size = 'default',
  color,
  spin,
  rotate,
  className,
  version,
  ...props
}) => {
  const isGradient = isGradientColor(color);
  
  const iconClassName = classNames(
    'tt-icon',
    size !== 'default' && `tt-icon-${size}`,
    { 'tt-icon-spin': spin && !component },
    { 'tt-icon-gradient': isGradient },
    className
  );

  const style = {};
  if (color) {
    if (isGradient) {
      style.background = color;
    } else {
      style.color = color;
    }
  }
  if (rotate && !component) style.transform = `rotate(${rotate}deg)`;

  if (component) {
    const IconComponent = component;
    const componentProps = {
      spin,
      rotate,
      ...props,
    };
    
    if (color && !isGradient) {
      componentProps.style = { color };
    }
    
    return (
      <span className={iconClassName} style={style} data-component-version={version}>
        <IconComponent {...componentProps} />
      </span>
    );
  }

  if (iconfont) {
    return (
      <i
        className={classNames(iconClassName, iconfont)}
        style={style}
        data-component-version={version}
        {...props}
      />
    );
  }

  if (type) {
    return (
      <span className={iconClassName} style={style} data-component-version={version} {...props}>
        {type}
      </span>
    );
  }

  return null;
};

Icon.version = componentVersions.Icon || '1.0.0';

Icon.propTypes = {
  type: PropTypes.string,
  component: PropTypes.elementType,
  iconfont: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  color: PropTypes.string,
  spin: PropTypes.bool,
  rotate: PropTypes.number,
  className: PropTypes.string,
  version: PropTypes.string,
};

Icon.defaultProps = {
  size: 'default',
  spin: false,
};

export default Icon;

