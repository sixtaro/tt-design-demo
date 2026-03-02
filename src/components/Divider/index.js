import React from 'react';
import { Divider as AntDivider } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Divider = ({ type, orientation, dashed, plain, version, className, ...props }) => {
  const dividerClassName = classNames(
    'tt-divider',
    className
  );

  return (
    <AntDivider
      type={type}
      orientation={orientation}
      dashed={dashed}
      plain={plain}
      className={dividerClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Divider.version = componentVersions.Divider;

export default Divider;
