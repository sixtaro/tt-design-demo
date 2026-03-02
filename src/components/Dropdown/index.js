import React from 'react';
import { Dropdown as AntDropdown, Menu } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Dropdown = ({ overlay, trigger, placement, visible, onVisibleChange, disabled, version, className, ...props }) => {
  const dropdownClassName = classNames(
    'tt-dropdown',
    className
  );

  return (
    <AntDropdown
      overlay={overlay}
      trigger={trigger}
      placement={placement}
      visible={visible}
      onVisibleChange={onVisibleChange}
      disabled={disabled}
      className={dropdownClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Dropdown.version = componentVersions.Dropdown;

export default Dropdown;