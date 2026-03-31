import React, { useEffect, useMemo, useState } from 'react';
import { Menu as AntMenu } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '../Button';
import './index.less';

const { Item, SubMenu, Divider, ItemGroup } = AntMenu;

const getDefaultPage = (childrenArray, pageSize, selectedKeys, defaultSelectedKeys) => {
  const activeKeys = selectedKeys && selectedKeys.length > 0 ? selectedKeys : defaultSelectedKeys;

  if (!activeKeys || activeKeys.length === 0) {
    return 0;
  }

  const activeIndex = childrenArray.findIndex((child) => {
    return child && child.key && activeKeys.includes(child.key);
  });

  return activeIndex >= 0 ? Math.floor(activeIndex / pageSize) : 0;
};

const Menu = ({
  version,
  className,
  showIndicator,
  activeStyle,
  pagination,
  pageSize,
  children,
  mode,
  selectedKeys,
  defaultSelectedKeys,
  ...props
}) => {
  const childrenArray = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);
  const totalPages = pagination && mode === 'horizontal' ? Math.ceil(childrenArray.length / pageSize) : 1;
  const [currentPage, setCurrentPage] = useState(() => getDefaultPage(childrenArray, pageSize, selectedKeys, defaultSelectedKeys));

  useEffect(() => {
    setCurrentPage((prevPage) => {
      const targetPage = getDefaultPage(childrenArray, pageSize, selectedKeys, defaultSelectedKeys);

      if (selectedKeys && selectedKeys.length > 0) {
        return targetPage;
      }

      return Math.min(prevPage, Math.max(totalPages - 1, 0));
    });
  }, [childrenArray, pageSize, selectedKeys, defaultSelectedKeys, totalPages]);

  const menuClassName = classNames(
    'tt-menu',
    { 'tt-menu-with-indicator': showIndicator },
    { 'tt-menu-active-text': activeStyle === 'text' },
    className
  );

  const visibleChildren = pagination && mode === 'horizontal'
    ? childrenArray.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : children;

  const menuNode = (
    <AntMenu
      className={menuClassName}
      mode={mode}
      disabledOverflow={pagination && mode === 'horizontal'}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      {...props}
      data-component-version={version}
    >
      {visibleChildren}
    </AntMenu>
  );

  if (!(pagination && mode === 'horizontal')) {
    return menuNode;
  }

  return (
    <div className="tt-menu-horizontal-pagination">
      <div className="tt-menu-horizontal-pagination-content">
        {menuNode}
      </div>
      <div className="tt-menu-horizontal-pagination-actions">
        <Button
          type="text"
          border={false}
          disabled={currentPage === 0}
          className="tt-menu-pagination-button"
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
          version={Button.version}
        >
          <LeftOutlined />
        </Button>
        <Button
          type="text"
          border={false}
          disabled={currentPage >= totalPages - 1}
          className="tt-menu-pagination-button"
          onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
          version={Button.version}
        >
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};

Menu.Item = Item;
Menu.SubMenu = SubMenu;
Menu.Divider = Divider;
Menu.Group = ItemGroup;
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
  showIndicator: PropTypes.bool,
  activeStyle: PropTypes.oneOf(['filled', 'text']),
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
};

Menu.defaultProps = {
  activeStyle: 'filled',
  pageSize: 5,
};

export default Menu;
