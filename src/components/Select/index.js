import React from 'react';
import { Select as AntSelect } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Option } = AntSelect;

const Select = ({ placeholder, options, value, onChange, version, className, ...props }) => {
  const selectClassName = classNames(
    'tt-select',
    className
  );

  return (
    <AntSelect
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      className={selectClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Select.Option = Option;
Select.version = componentVersions.Select;

export default Select;
