import React from 'react';
import { Radio as AntRadio } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const { Group: AntGroup, Button } = AntRadio;

const Radio = ({ checked, disabled, version, className, ...props }) => {
  const radioClassName = classNames(
    'tt-radio',
    className
  );

  return (
    <AntRadio
      checked={checked}
      disabled={disabled}
      className={radioClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const Group = ({ version, className, options, ...props }) => {
  const groupClassName = classNames(
    'tt-radio-group',
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

Radio.Group = Group;
Radio.Button = Button;
Radio.version = componentVersions.Radio;

export default Radio;
