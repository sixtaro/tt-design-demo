import React from 'react';
import { Button as AntButton } from 'antd';
const Button = ({ type, size, children, ...props }) => {
  return (
    <AntButton type={type} size={size} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;
