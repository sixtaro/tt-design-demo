import React from 'react';
import { Input as AntInput } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Password, TextArea, Search, Group } = AntInput;

const Input = ({ type, placeholder, version, className, ...props }) => {
  const inputClassName = classNames(
    'tt-input',
    className
  );
  return (
    <AntInput
      type={type}
      placeholder={placeholder}
      className={inputClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Input.Password = Password;
Input.TextArea = TextArea;
Input.Search = Search;
Input.Group = Group;
Input.version = componentVersions.Input;

export default Input;
