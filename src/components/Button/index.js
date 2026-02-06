import React from 'react';
import { Button as AntButton } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Button = ({ type, size, children, version, className, ...props }) => {
  const buttonClassName = classNames(
    'tt-button',
    type && `tt-button-${type}`,
    size && `tt-button-${size}`,
    className
  );

  return (
    <AntButton
      type={type}
      size={size}
      className={buttonClassName}
      {...props}
      data-component-version={version}
    >
      {children}
    </AntButton>
  );
};

Button.version = componentVersions.Button;

export default Button;
