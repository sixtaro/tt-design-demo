import React from 'react';
import { Input as AntInput } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const { Password: AntPassword, TextArea: AntTextArea, Search: AntSearch, Group: AntGroup } = AntInput;

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

const Password = ({ version, className, ...props }) => {
  const inputClassName = classNames(
    'tt-input',
    className
  );
  return (
    <AntPassword
      className={inputClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const TextArea = ({ version, className, ...props }) => {
  const inputClassName = classNames(
    'tt-input',
    className
  );
  return (
    <AntTextArea
      className={inputClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const Search = ({ version, className, ...props }) => {
  const inputClassName = classNames(
    'tt-input',
    className
  );
  return (
    <AntSearch
      className={inputClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const Group = ({ version, className, ...props }) => {
  const inputClassName = classNames(
    'tt-input',
    className
  );
  return (
    <AntGroup
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
