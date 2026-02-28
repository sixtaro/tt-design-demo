import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Group } = AntCheckbox;

const Checkbox = ({ checked, indeterminate, disabled, version, className, ...props }) => {
  const checkboxClassName = classNames(
    'tt-checkbox',
    className
  );

  return (
    <AntCheckbox
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      className={checkboxClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Checkbox.Group = Group;
Checkbox.version = componentVersions.Checkbox;

export default Checkbox;
