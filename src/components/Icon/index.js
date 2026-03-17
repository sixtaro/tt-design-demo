import React, { useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import { isGradientColor, generateGradientId, parseGradientColor, renderGradientSvg } from './gradient';
import './index.less';

const Icon = ({ type, component, iconfont, size = 'default', color, spin, rotate, className, version, ...props }) => {
  const isGradient = isGradientColor(color);
  const gradientId = useMemo(() => (isGradient ? generateGradientId() : null), [isGradient, color]);
  const gradientData = useMemo(() => (isGradient ? parseGradientColor(color) : null), [isGradient, color]);

  const iconClassName = classNames(
    'tt-icon',
    size !== 'default' && `tt-icon-${size}`,
    { 'tt-icon-spin': spin && !component },
    { 'tt-icon-gradient': isGradient },
    className
  );

  const style = { ...props.style };
  if (color && !isGradient) {
    style.color = color;
  }
  if (rotate && !component) style.transform = `rotate(${rotate}deg)`;

  if (component) {
    const IconComponent = component;
    const componentProps = {
      spin,
      rotate,
      ...props,
    };

    if (color) {
      if (isGradient) {
        componentProps.style = {
          ...componentProps.style,
          '--icon-fill': `url(#${gradientId})`,
        };
      } else {
        componentProps.style = { color };
      }
    }

    return (
      <span className={iconClassName} style={style} data-component-version={version}>
        {isGradient && renderGradientSvg(gradientId, gradientData)}
        <IconComponent {...componentProps} />
      </span>
    );
  }

  if (iconfont) {
    style.width = '1em';
    style.height = '1em';
    if (isGradient) {
      style.color = 'transparent';
      style.backgroundImage = color;
      style.WebkitBackgroundClip = 'text';
    }
    return <i className={classNames(iconClassName, iconfont)} data-component-version={version} {...props} style={style} />;
  }

  if (type) {
    return (
      <span className={iconClassName} data-component-version={version} {...props} style={style}>
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
