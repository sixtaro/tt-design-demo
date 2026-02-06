import React from 'react';
import { Button as AntButton } from 'antd';
// 测试
const Button = ({ type, size, children, ...props }) => {
  return (
    <AntButton type={type} size={size} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;
