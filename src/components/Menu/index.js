import React from 'react';
import { Menu as AntMenu } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { Item, SubMenu, Divider, Group } = AntMenu;

const Menu = ({ version, className, ...props }) => {
  const menuClassName = classNames(
    'tt-menu',
    className
  );

  return (
    <AntMenu
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

Menu.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'inline']),
  theme: PropTypes.oneOf(['light', 'dark']),
  selectedKeys: PropTypes.array,
  defaultSelectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  defaultOpenKeys: PropTypes.array,
  onSelect: PropTypes.func,
  onOpenChange: PropTypes.func,
  inlineCollapsed: PropTypes.bool,
  inlineIndent: PropTypes.number,
  selectable: PropTypes.bool,
  children: PropTypes.node,
};

export default Menu;