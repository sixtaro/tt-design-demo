import React from 'react';
import { Button as AntButton } from 'antd';
import { componentVersions } from '../../utils/version-config';
const Button = ({ type, size, children, version, ...props }) => {
  return (
    <AntButton type={type} size={size} {...props} data-component-version={version}>
      {children}
    </AntButton>
  );
};

Button.version = componentVersions.Button;

export default Button;
