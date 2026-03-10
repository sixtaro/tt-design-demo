
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import './index.less';

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
  const iconClassName = classNames(
    'tt-icon',
    size !== 'default' && `tt-icon-${size}`,
    { 'tt-icon-spin': spin && !component },
    className
  );

  const style = {};
  if (color) style.color = color;
  if (rotate && !component) style.transform = `rotate(${rotate}deg)`;

  if (component) {
    const IconComponent = component;
    return (
      <span className={iconClassName} style={style} data-component-version={version}>
        <IconComponent
          spin={spin}
          rotate={rotate}
          {...props}
        />
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

