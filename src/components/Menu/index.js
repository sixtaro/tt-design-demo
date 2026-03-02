import React from 'react';
import { Menu as AntMenu } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Item, SubMenu, Divider, Group } = AntMenu;

const Menu = ({ mode, theme, selectedKeys, defaultSelectedKeys, openKeys, defaultOpenKeys, onSelect, onOpenChange, version, className, ...props }) => {
  const menuClassName = classNames(
    'tt-menu',
    className
  );

  return (
    <AntMenu
      mode={mode}
      theme={theme}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      openKeys={openKeys}
      defaultOpenKeys={defaultOpenKeys}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      className={menuClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Menu.Item = Item;
Menu.SubMenu = SubMenu;
Menu.Divider = Divider;
Menu.Group = Group;
Menu.version = componentVersions.Menu;

export default Menu;