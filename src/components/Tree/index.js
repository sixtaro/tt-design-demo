import React from 'react';
import PropTypes from 'prop-types';
import { Tree as AntTree } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Tree = ({ version, className, ...props }) => {
  const treeClassName = classNames('tt-tree', className);

  return (
    <AntTree
      className={treeClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Tree.DirectoryTree = AntTree.DirectoryTree;

Tree.version = componentVersions.Tree;

Tree.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  allowDrop: PropTypes.func,
  autoExpandParent: PropTypes.bool,
  blockNode: PropTypes.bool,
  checkable: PropTypes.bool,
  checkedKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  checkStrictly: PropTypes.bool,
  defaultCheckedKeys: PropTypes.array,
  defaultExpandAll: PropTypes.bool,
  defaultExpandedKeys: PropTypes.array,
  defaultExpandParent: PropTypes.bool,
  defaultSelectedKeys: PropTypes.array,
  disabled: PropTypes.bool,
  draggable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  expandedKeys: PropTypes.array,
  filterTreeNode: PropTypes.func,
  height: PropTypes.number,
  icon: PropTypes.node,
  loadData: PropTypes.func,
  loadedKeys: PropTypes.array,
  multiple: PropTypes.bool,
  selectable: PropTypes.bool,
  selectedKeys: PropTypes.array,
  showIcon: PropTypes.bool,
  showLine: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  switcherIcon: PropTypes.node,
  treeData: PropTypes.array,
  virtual: PropTypes.bool,
  onCheck: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  onExpand: PropTypes.func,
  onLoad: PropTypes.func,
  onRightClick: PropTypes.func,
  onSelect: PropTypes.func,
};

export default Tree;
