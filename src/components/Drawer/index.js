import React from 'react';
import { Drawer as AntDrawer } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Drawer = ({ 
  title, 
  visible, 
  onClose, 
  placement, 
  width, 
  height, 
  mask, 
  maskClosable, 
  version, 
  className, 
  ...props 
}) => {
  const drawerClassName = classNames(
    'tt-drawer',
    className
  );

  return (
    <AntDrawer
      title={title}
      visible={visible}
      onClose={onClose}
      placement={placement}
      width={width}
      height={height}
      mask={mask}
      maskClosable={maskClosable}
      className={drawerClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Drawer.version = componentVersions.Drawer;

export default Drawer;
