import React from 'react';
import { Spin as AntSpin } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Spin = ({ spinning, size, tip, version, className, ...props }) => {
  const spinClassName = classNames(
    'tt-spin',
    className
  );

  return (
    <AntSpin
      spinning={spinning}
      size={size}
      tip={tip}
      className={spinClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Spin.version = componentVersions.Spin;

export default Spin;
