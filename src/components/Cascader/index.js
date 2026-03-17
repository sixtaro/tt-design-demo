import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Cascader as AntCascader } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import './index.less';

// ==================== 工具函数 ====================

/**
 * 递归收集所有叶子节点的路径
 */
const collectLeafPaths = (options) => {
  const paths = [];
  const traverse = (opts, currentPath = []) => {
    opts.forEach(opt => {
      const newPath = [...currentPath, opt.value];
      if (opt.children && opt.children.length > 0) {
        traverse(opt.children, newPath);
      } else {
        paths.push(newPath);
      }
    });
  };
  if (options) {
    traverse(options);
  }
  return paths;
};

/**
 * 检查两个路径数组是否相等
 */
const isPathEqual = (path1, path2) => JSON.stringify(path1) === JSON.stringify(path2);

// ==================== 组件定义 ====================

const Cascader = ({
  version,
  className,
  popupClassName,
  options,
  value,
  defaultValue,
  onChange,
  expandTrigger,
  showSearch,
  placeholder,
  disabled,
  size,
  allowClear,
  showArrow,
  multiple,
  maxTagCount,
  showSelectAll = false,
  ...props
}) => {
  // ==================== State ====================

  const [allSelected, setAllSelected] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  // ==================== 计算属性 ====================

  const cascaderClassName = classNames('tt-cascader', className);
  const cascaderPopupClassName = classNames('tt-cascader-dropdown', popupClassName);

  // 所有叶子节点路径
  const allLeafPaths = useMemo(() => collectLeafPaths(options), [options]);

  // 当前已选中的值
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // ==================== Effects ====================

  // 检查全选状态
  useEffect(() => {
    if (!multiple || !value) {
      setAllSelected(false);
      setIndeterminate(false);
      return;
    }

    const selected = Array.isArray(value) ? value : [value];
    const hasValues = selected.length > 0;
    const isAllSelected = allLeafPaths.length > 0 &&
      allLeafPaths.every(path => selected.some(s => isPathEqual(s, path)));
    const isIndeterminate = !isAllSelected && hasValues;

    setAllSelected(isAllSelected);
    setIndeterminate(isIndeterminate);
  }, [value, allLeafPaths, multiple]);

  // ==================== 事件处理 ====================

  // 全选处理
  const handleSelectAll = useCallback(() => {
    if (multiple && onChange) {
      const newAllSelected = !allSelected;
      setAllSelected(newAllSelected);
      onChange(newAllSelected ? allLeafPaths : []);
    }
  }, [multiple, onChange, allSelected, allLeafPaths]);

  // ==================== 渲染函数 ====================

  // 全选复选框
  const renderSelectAll = useCallback(() => {
    if (!showSelectAll || !multiple) return null;
    return (
      <div className="tt-cascader-select-all">
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
          disabled={allLeafPaths.length === 0}
        >
          全选
        </Checkbox>
      </div>
    );
  }, [showSelectAll, multiple, allSelected, indeterminate, handleSelectAll, allLeafPaths]);

  // 自定义下拉菜单内容
  const dropdownRender = useCallback((menu) => {
    if (!showSelectAll) return menu;
    return (
      <div className="tt-cascader-dropdown-custom">
        {menu}
        {renderSelectAll()}
      </div>
    );
  }, [showSelectAll, renderSelectAll]);

  // 自定义标签渲染
  const tagRender = useCallback((props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <span className="tt-cascader-tag" onMouseDown={onPreventMouseDown}>
        {label}
        {closable && (
          <span className="tt-cascader-tag-close" onClick={onClose}>
            ×
          </span>
        )}
      </span>
    );
  }, []);

  // 自定义超出数量显示 - 纯数字
  const maxTagPlaceholder = useCallback((omittedValues) => omittedValues.length, []);

  // ==================== Render ====================

  return (
    <AntCascader
      className={cascaderClassName}
      popupClassName={cascaderPopupClassName}
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      expandTrigger={expandTrigger}
      showSearch={showSearch}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      allowClear={allowClear}
      showArrow={showArrow}
      multiple={multiple}
      maxTagCount={maxTagCount}
      tagRender={multiple ? tagRender : undefined}
      maxTagPlaceholder={maxTagCount ? maxTagPlaceholder : undefined}
      dropdownRender={showSelectAll ? dropdownRender : undefined}
      {...props}
      data-component-version={version}
    />
  );
};

// ==================== 组件属性 ====================

Cascader.version = componentVersions.Cascader || '1.0.0';

Cascader.propTypes = {
  /** 组件版本号 */
  version: PropTypes.string,
  /** 自定义类名 */
  className: PropTypes.string,
  /** 下拉菜单类名 */
  popupClassName: PropTypes.string,
  /** 可选项数据源 */
  options: PropTypes.arrayOf(PropTypes.object),
  /** 当前值（受控） */
  value: PropTypes.array,
  /** 默认值（非受控） */
  defaultValue: PropTypes.array,
  /** 变化回调 */
  onChange: PropTypes.func,
  /** 次级菜单的展开方式 */
  expandTrigger: PropTypes.oneOf(['click', 'hover']),
  /** 是否支持搜索 */
  showSearch: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
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
  /** 是否多选 */
  multiple: PropTypes.bool,
  /** 最多显示的标签数量 */
  maxTagCount: PropTypes.number,
  /** 是否显示全选（仅多选） */
  showSelectAll: PropTypes.bool,
};

export default Cascader;
