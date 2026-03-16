import React from 'react';
import { Switch as AntSwitch } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Switch = ({ version, className, ...props }) => {
  const switchClassName = classNames('tt-switch', className);

  return (
    <AntSwitch
      className={switchClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Switch.version = componentVersions.Switch;

export default Switch;
