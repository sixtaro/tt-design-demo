import React, { useState, useMemo } from 'react';
import { Dropdown as AntDropdown, Menu, Input, Popover } from 'antd';
import Button from '../Button';
import { SearchOutlined, PlusOutlined, EllipsisOutlined, UpOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { SubMenu } = Menu;

const Dropdown = ({
  overlay,
  trigger,
  placement,
  visible,
  onVisibleChange,
  disabled,
  version,
  className,
  children,
  items = [],
  multiple = false,
  searchable = false,
  searchIcon = <SearchOutlined />,
  searchPlaceholder = '请输入关键字',
  addable = false,
  addMode = 'inline',
  maxVisible = null,
  selectedKey = null,
  onSelect,
  onAdd,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [addInputVisible, setAddInputVisible] = useState(false);
  const [addInputValue, setAddInputValue] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverInputValue, setPopoverInputValue] = useState('');
  const [showMore, setShowMore] = useState(false);

  const dropdownClassName = classNames(
    'tt-dropdown',
    className
  );

  const filteredItems = useMemo(() => {
    if (!searchable || !searchValue) return items;
    const filter = (arr) => {
      return arr.filter(item => {
        if (item.children) {
          const filteredChildren = filter(item.children);
          return filteredChildren.length > 0 || item.label?.includes(searchValue);
        }
        return item.label?.includes(searchValue);
      });
    };
    return filter(items);
  }, [items, searchable, searchValue]);

  const displayItems = useMemo(() => {
    if (maxVisible === null || showMore) {
      return filteredItems;
    }
    return filteredItems.slice(0, maxVisible);
  }, [filteredItems, maxVisible, showMore]);

  const renderMenuItems = (data, parentKey = '') => {
    return data.map((item, index) => {
      const key = item.key || `${parentKey}-${index}`;
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={key} title={item.label} icon={item.icon}>
            {renderMenuItems(item.children, key)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={key} icon={item.icon} disabled={item.disabled}>
          {item.label}
        </Menu.Item>
      );
    });
  };

  const handleAddConfirm = () => {
    const value = addMode === 'inline' ? addInputValue : popoverInputValue;
    if (value && onAdd) {
      onAdd(value);
    }
    setAddInputValue('');
    setPopoverInputValue('');
    setAddInputVisible(false);
    setPopoverVisible(false);
  };

  const handleAddCancel = () => {
    setAddInputValue('');
    setPopoverInputValue('');
    setAddInputVisible(false);
    setPopoverVisible(false);
  };

  const renderAddSection = () => {
    if (!addable) return null;

    if (addMode === 'inline') {
      return (
        <div className="tt-dropdown-add-trigger">
          <Input
            value={addInputValue}
            onChange={(e) => setAddInputValue(e.target.value)}
            placeholder="请输入选项名"
            onPressEnter={handleAddConfirm}
          />
          <Button type="text" onClick={() => {
            onAdd(addInputValue);
          }}>新增</Button>
        </div>
      );
    }

    if (addMode === 'popover') {
      const content = (
        <div className="tt-dropdown-add-popover-content">
          <div className="tt-dropdown-add-popover-item">
            <label>新增选项：</label>
            <Input
              value={popoverInputValue}
              onChange={(e) => setPopoverInputValue(e.target.value)}
              onPressEnter={handleAddConfirm}
            />
          </div>
          <div className="tt-dropdown-add-popover-buttons">
            <Button onClick={handleAddCancel}>取消</Button>
            <Button type="primary" onClick={handleAddConfirm}>确认</Button>
          </div>
        </div>
      );

      return (
        <div className="tt-dropdown-add-trigger">
          <Popover
            content={content}
            title={null}
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={setPopoverVisible}
            placement="bottomLeft"
          >
            <Button type="text" icon={<PlusOutlined />}>新增</Button>
          </Popover>
        </div>
      );
    }

    return null;
  };

  const renderMoreItem = () => {
    if (maxVisible === null || filteredItems.length <= maxVisible) return null;
    return (
      <div
        className="tt-dropdown-more-item"
        onClick={() => setShowMore(!showMore)}
      >
        {!showMore && <EllipsisOutlined className="tt-dropdown-more-icon-left" />}
        {showMore ? '收起' : '更多'}
        {showMore && <UpOutlined className="tt-dropdown-more-icon-right" />}
      </div>
    );
  };

  const customOverlay = overlay || (
    <div className="tt-dropdown-menu-wrapper">
      {searchable && (
        <div className="tt-dropdown-search">
          <Input
            prefix={searchIcon}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}
      <Menu
        className="tt-dropdown-menu"
        selectedKeys={selectedKey ? [selectedKey] : []}
        onClick={({ key, keyPath }) => {
          onSelect?.({ key, keyPath });
        }}
      >
        {renderMenuItems(displayItems)}
      </Menu>
      {renderMoreItem()}
      {renderAddSection()}
    </div>
  );

  return (
    <AntDropdown
      overlay={customOverlay}
      trigger={trigger}
      placement={placement}
      visible={visible}
      onVisibleChange={onVisibleChange}
      disabled={disabled}
      overlayClassName={dropdownClassName}
      {...props}
      data-component-version={version}
    >
      {children}
    </AntDropdown>
  );
};

Dropdown.version = componentVersions.Dropdown;

Dropdown.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  items: PropTypes.array,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  searchIcon: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  addable: PropTypes.bool,
  addMode: PropTypes.oneOf(['inline', 'popover']),
  maxVisible: PropTypes.number,
  selectedKey: PropTypes.string,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
  overlay: PropTypes.node,
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  placement: PropTypes.string,
  visible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
  disabled: PropTypes.bool,
};

Dropdown.defaultProps = {
  multiple: false,
  searchable: false,
  addable: false,
  addMode: 'inline',
  searchPlaceholder: '请输入关键字',
};

export default Dropdown;
