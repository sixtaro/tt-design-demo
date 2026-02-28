import React from 'react';
import { Radio as AntRadio } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Group, Button } = AntRadio;

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

Radio.Group = Group;
Radio.Button = Button;
Radio.version = componentVersions.Radio;

export default Radio;
