import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import '@/utils';
import Tree from './tree';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = 'public';
};

ensureBusinessStoryEnv();

const mockTreeData = [
  {
    id: 'org_1',
    text: '未来集团',
    attributes: {
      orgID: 1,
      orgType: 1,
      parkID: 0,
      onlineOrder: 1,
      parents: [],
    },
    children: [
      {
        id: 'org_2',
        text: '华中区域',
        attributes: {
          orgID: 2,
          orgType: 1,
          parkID: 0,
          onlineOrder: 1,
          parents: [{ id: 'org_1' }],
        },
        children: [
          {
            id: 'park_101',
            text: '未来城停车场',
            attributes: {
              orgID: 101,
              orgType: 0,
              parkID: 101,
              onlineOrder: 1,
              parents: [{ id: 'org_1' }, { id: 'org_2' }],
            },
            children: [],
          },
          {
            id: 'park_102',
            text: '江滩停车场',
            attributes: {
              orgID: 102,
              orgType: 0,
              parkID: 102,
              onlineOrder: 0,
              parents: [{ id: 'org_1' }, { id: 'org_2' }],
            },
            children: [],
          },
        ],
      },
      {
        id: 'org_3',
        text: '华南区域',
        attributes: {
          orgID: 3,
          orgType: 2,
          parkID: 0,
          onlineOrder: 1,
          parents: [{ id: 'org_1' }],
        },
        children: [
          {
            id: 'park_201',
            text: '滨海停车场',
            attributes: {
              orgID: 201,
              orgType: 0,
              parkID: 201,
              onlineOrder: 1,
              parents: [{ id: 'org_1' }, { id: 'org_3' }],
            },
            children: [],
          },
        ],
      },
    ],
  },
];

const TreeDemo = args => {
  const [selected, setSelected] = React.useState();

  return (
    <Card style={{ maxWidth: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前选择：{selected?.orgID ? `${selected.orgID} / ${selected.parkID || '组织'}` : '未选择'}
        </Font>
        <div style={{ height: 520 }}>
          <Tree
            {...args}
            onTreeSelect={node => {
              setSelected(node);
              args.onTreeSelect?.(node);
              return true;
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/Tree 组织树',
  component: Tree,
  parameters: {
    docs: {
      description: {
        component: '使用本地组织树数据演示 Tree 的组织与车场切换能力。',
      },
    },
  },
  argTypes: {
    onTreeSelect: {
      action: 'treeSelect',
    },
  },
};

export const 组织树 = args => <TreeDemo {...args} />;
组织树.args = {
  orgtree: mockTreeData,
  isPark: false,
};

export const 车场模式 = args => <TreeDemo {...args} />;
车场模式.args = {
  orgtree: mockTreeData,
  isPark: true,
};
