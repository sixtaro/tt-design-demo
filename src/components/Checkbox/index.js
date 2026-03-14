import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const { Group: AntGroup } = AntCheckbox;

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

const Group = ({ version, className, options, ...props }) => {
  const groupClassName = classNames(
    'tt-checkbox-group',
    className
  );

  if (options) {
    const wrappedOptions = options.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }
      return option;
    });

    return (
      <AntGroup
        className={groupClassName}
        options={wrappedOptions}
        {...props}
        data-component-version={version}
      />
    );
  }

  return (
    <AntGroup
      className={groupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Checkbox.Group = Group;
Checkbox.version = componentVersions.Checkbox;

export default Checkbox;
