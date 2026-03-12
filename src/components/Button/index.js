import React from 'react';
import { Button as AntButton, Dropdown as AntDropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Button = ({
  type = 'default',
  size,
  children,
  version,
  className,
  shape = 'default',
  disabled,
  danger,
  border = true,
  ...props
}) => {
  let antdType = type;
  let antdShape = shape;

  const buttonClassName = classNames(
    'tt-button',
    type && `tt-button-${type}`,
    size && `tt-button-${size}`,
    shape && `tt-button-shape-${shape}`,
    disabled && 'tt-button-disabled',
    danger && 'tt-button-danger',
    !border && 'tt-button-borderless',
    className
  );

  if (shape === 'circle') {
    antdShape = 'circle';
  } else if (shape === 'round') {
    antdShape = 'round';
  } else {
    antdShape = undefined;
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

const ButtonDropdown = ({
  type = 'default',
  size,
  children,
  version,
  className,
  shape = 'default',
  disabled,
  danger,
  border = true,
  menu,
  ...props
}) => {
  let antdType = type;
  let antdShape = shape;

  const buttonClassName = classNames(
    'tt-button',
    type && `tt-button-${type}`,
    size && `tt-button-${size}`,
    shape && `tt-button-shape-${shape}`,
    disabled && 'tt-button-disabled',
    danger && 'tt-button-danger',
    !border && 'tt-button-borderless',
    className
  );

  if (shape === 'circle') {
    antdShape = 'circle';
  } else if (shape === 'round') {
    antdShape = 'round';
  } else {
    antdShape = undefined;
  }

  return (
    <AntDropdown.Button
      menu={menu}
      type={antdType}
      size={size}
      shape={antdShape}
      icon={<DownOutlined />}
      buttonsRender={([leftButton, rightButton]) => [
        React.cloneElement(leftButton, {
          className: classNames(leftButton.props.className, buttonClassName, 'tt-dropdown-button-left'),
          'data-component-version': version
        }),
        React.cloneElement(rightButton, {
          className: classNames(rightButton.props.className, buttonClassName, 'tt-dropdown-button-right')
        })
      ]}
      disabled={disabled}
      {...props}
    >
      {children}
    </AntDropdown.Button>
  );
};

ButtonDropdown.version = componentVersions.Button;

Button.Dropdown = ButtonDropdown;

export default Button;
