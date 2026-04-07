import React, { useState } from 'react';
import Tree from './index';

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }],
      },
    ],
  },
];

export default {
  title: '数据展示/Tree 树形控件',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Tree 树形控件组件，版本：${Tree.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => <Tree treeData={treeData} />;

// 可勾选
export const 可勾选 = () => <Tree checkable treeData={treeData} />;

// 受控模式
export const 受控模式 = () => {
  const [expandedKeys, setExpandedKeys] = useState(['0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  return (
    <Tree
      treeData={treeData}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onExpand={setExpandedKeys}
      onSelect={setSelectedKeys}
    />
  );
};

// 目录树
export const 目录树 = () => <Tree.DirectoryTree treeData={treeData} />;
