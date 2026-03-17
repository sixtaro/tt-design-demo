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

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

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

  const handleSelectAll = () => {
    if (treeCheckable && onChange) {
      const newAllSelected = !allSelected;
      setAllSelected(newAllSelected);
      onChange(newAllSelected ? [...getAllLeafKeys] : []);
    }
  };

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

  const dropdownRender = (menu) => {
    if (!showSelectAll) return menu;
    return (
      <div className="tt-tree-select-dropdown-custom">
        {menu}
        {renderSelectAll()}
      </div>
    );
  };

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
      suffixIcon={<RightOutlined />}
      switcherIcon={<DownOutlined />}
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
  version: PropTypes.string,
  className: PropTypes.string,
  popupClassName: PropTypes.string,
  treeData: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
  treeCheckable: PropTypes.bool,
  showSearch: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  maxTagCount: PropTypes.number,
  showSelectAll: PropTypes.bool,
  treeDefaultExpandAll: PropTypes.bool,
  treeDefaultExpandedKeys: PropTypes.array,
  treeExpandedKeys: PropTypes.array,
  onTreeExpand: PropTypes.func,
  dropdownStyle: PropTypes.object,
};

export default TreeSelect;
