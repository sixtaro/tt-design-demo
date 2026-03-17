import React, { useState, useEffect, useMemo } from 'react';
import { TreeSelect as AntTreeSelect } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import './index.less';

const { TreeNode } = AntTreeSelect;

const TreeSelect = ({
  version,
  className,
  popupClassName,
  treeData,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  size,
  allowClear,
  showArrow,
  treeCheckable,
  showSearch,
  maxTagCount,
  showSelectAll = false,
  treeDefaultExpandAll,
  treeDefaultExpandedKeys,
  treeExpandedKeys,
  onTreeExpand,
  dropdownStyle,
  ...props
}) => {
  const treeSelectClassName = classNames('tt-tree-select', className);
  const treeSelectPopupClassName = classNames('tt-tree-select-dropdown', popupClassName);
  const [allSelected, setAllSelected] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  // 收集所有叶子节点的 key
  const getAllLeafKeys = useMemo(() => {
    const keys = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      } else {
        keys.push(node.value);
      }
    });
  };
  if (treeData) {
    traverse(treeData);
  }
  return keys;
}, [treeData]);

  // 获取当前已选中的值
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // 检查是否已全选或部分选中
  useEffect(() => {
    if (treeCheckable && value) {
      const selected = Array.isArray(value) ? value : [value];
      const isAllSelected = getAllLeafKeys.length > 0 &&
        getAllLeafKeys.every(key => selected.includes(key));
      const isIndeterminate = !isAllSelected && selected.length > 0;
      setAllSelected(isAllSelected);
      setIndeterminate(isIndeterminate);
    }
  }, [value, getAllLeafKeys, treeCheckable]);

  // 全选处理
  const handleSelectAll = () => {
    if (treeCheckable && onChange) {
      const newAllSelected = !allSelected;
      setAllSelected(newAllSelected);
      onChange(newAllSelected ? [...getAllLeafKeys] : []);
    }
  };

  // 全选复选框
  const renderSelectAll = () => {
    if (!showSelectAll || !treeCheckable) return null;
    return (
      <div className="tt-tree-select-select-all">
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
          disabled={getAllLeafKeys.length === 0}
        >
          全选
        </Checkbox>
      </div>
    );
  };

  // 自定义下拉菜单内容
  const dropdownRender = (menu) => {
    if (!showSelectAll) return menu;
    return (
      <div className="tt-tree-select-dropdown-custom">
        {menu}
        {renderSelectAll()}
      </div>
    );
  };

  // 自定义标签渲染
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <span className="tt-tree-select-tag" onMouseDown={onPreventMouseDown}>
        {label}
        {closable && (
          <span className="tt-tree-select-tag-close" onClick={onClose}>
            ×
          </span>
        )}
      </span>
    );
  };

  // 自定义超出数量显示 - 纯数字
  const maxTagPlaceholder = (omittedValues) => omittedValues.length;

  return (
    <AntTreeSelect
      className={treeSelectClassName}
      popupClassName={treeSelectPopupClassName}
      treeData={treeData}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      allowClear={allowClear}
      showArrow={showArrow}
      treeCheckable={treeCheckable}
      showSearch={showSearch}
      maxTagCount={maxTagCount}
      treeDefaultExpandAll={treeDefaultExpandAll}
      treeDefaultExpandedKeys={treeDefaultExpandedKeys}
      treeExpandedKeys={treeExpandedKeys}
      onTreeExpand={onTreeExpand}
      dropdownStyle={dropdownStyle}
      suffixIcon={<DownOutlined />}
      switcherIcon={<RightOutlined />}
      tagRender={treeCheckable ? tagRender : undefined}
      maxTagPlaceholder={maxTagCount ? maxTagPlaceholder : undefined}
      dropdownRender={showSelectAll ? dropdownRender : undefined}
      {...props}
      data-component-version={version}
    />
  );
};

TreeSelect.TreeNode = TreeNode;
TreeSelect.version = componentVersions.TreeSelect || '1.0.0';

TreeSelect.propTypes = {
  /** 组件版本号 */
  version: PropTypes.string,
  /** 自定义类名 */
  className: PropTypes.string,
  /** 下拉菜单类名 */
  popupClassName: PropTypes.string,
  /** 树形数据 */
  treeData: PropTypes.arrayOf(PropTypes.object),
  /** 当前值（受控） */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  /** 默认值（非受控） */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  /** 变化回调 */
  onChange: PropTypes.func,
  /** 占位文本 */
  placeholder: PropTypes.string,
  /** 是否禁用 */
  disabled: PropTypes.bool,
  /** 尺寸 */
  size: PropTypes.oneOf(['small', 'default', 'large']),
  /** 是否允许清空 */
  allowClear: PropTypes.bool,
  /** 是否显示箭头 */
  showArrow: PropTypes.bool,
  /** 是否支持多选（勾选） */
  treeCheckable: PropTypes.bool,
  /** 是否支持搜索 */
  showSearch: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** 最多显示的标签数量 */
  maxTagCount: PropTypes.number,
  /** 是否显示全选（仅多选） */
  showSelectAll: PropTypes.bool,
  /** 默认展开所有树节点 */
  treeDefaultExpandAll: PropTypes.bool,
  /** 默认展开的树节点 */
  treeDefaultExpandedKeys: PropTypes.array,
  /** 展开的树节点（受控） */
  treeExpandedKeys: PropTypes.array,
  /** 树节点展开回调 */
  onTreeExpand: PropTypes.func,
  /** 下拉菜单样式 */
  dropdownStyle: PropTypes.object,
};

export default TreeSelect;
