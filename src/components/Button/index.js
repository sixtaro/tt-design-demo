
import React from 'react';
import { Button as AntButton } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Button = ({ type, size, children, version, className, variant = 'filled', shape = 'square', disabled, ...props }) => {
  let antdType = type;
  let antdShape = shape;
  const buttonClassName = classNames(
    'tt-button',
    type && `tt-button-${type}`,
    size && `tt-button-${size}`,
    variant && `tt-button-${variant}`,
    shape && `tt-button-shape-${shape}`,
    disabled && 'tt-button-disabled',
    className
  );

  if (type === 'link') {
    antdType = 'link';
  }

  if (variant === 'outline') {
    if (type === 'primary') {
      antdType = 'default';
    }
  }

  if (shape === 'circle') {
    antdShape = 'round';
    if (type !== 'link' && type !== 'text') {
      antdType = 'default';
    }
  } else if (shape === 'square') {
    antdShape = undefined;
    if (variant === 'filled' && type !== 'link' && type !== 'text') {
      antdType = 'primary';
    }
  }

  return (
    <AntButton
      type={antdType}
      size={size}
      shape={antdShape}
      className={buttonClassName}
      disabled={disabled}
      {...props}
      data-component-version={version}
    >
      {children}
    </AntButton>
  );
};

Button.version = componentVersions.Button;

export default Button;

