import React from 'react';
import { Switch as AntSwitch } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Switch = ({ checked, disabled, loading, version, className, ...props }) => {
  const switchClassName = classNames(
    'tt-switch',
    className
  );

  return (
    <AntSwitch
      checked={checked}
      disabled={disabled}
      loading={loading}
      className={switchClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Switch.version = componentVersions.Switch;

export default Switch;
