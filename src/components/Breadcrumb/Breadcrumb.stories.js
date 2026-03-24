import React from 'react';
import { Button, Space } from 'antd';
import Breadcrumb from './index';

const createPage = (overrides = {}) => ({
  org: {
    name: '未来科技园',
    parents: [
      { orgID: 'root', name: '集团总部', orgType: 1 },
      { orgID: 'region', name: '华中大区', orgType: 1 },
      { orgID: 'park', name: '未来科技园', orgType: 0 },
    ],
  },
  tree: {
    triggerTreeSelect: orgID => {
      console.log('triggerTreeSelect', orgID);
    },
  },
  displayTree: page => {
    console.log('displayTree', page?.org?.name);
  },
  ...overrides,
});

export default {
  title: '导航/Breadcrumb 面包屑',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `Breadcrumb 面包屑组件 - 版本: ${Breadcrumb.version}\n\n显示当前页面在网站层级结构中的位置。除基础面包屑外，还提供 \`Breadcrumb.Org\` 用于组织链路与标签模式展示。`
      }
    }
  },
  argTypes: {
    separator: {
      control: 'text'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = args => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>分类</Breadcrumb.Item>
    <Breadcrumb.Item>子分类</Breadcrumb.Item>
    <Breadcrumb.Item>当前页面</Breadcrumb.Item>
  </Breadcrumb>
);

export const Default = Template.bind({});
Default.args = {
  version: Breadcrumb.version
};

export const CustomSeparator = Template.bind({});
CustomSeparator.args = {
  separator: '>',
  version: Breadcrumb.version
};

export const OrgPath = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <Breadcrumb.Org {...args} />
  </div>
);
OrgPath.args = {
  mode: 'path',
  page: createPage(),
  version: Breadcrumb.Org.version,
};
OrgPath.storyName = '组织链路';

export const OrgPark = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <Breadcrumb.Org {...args} />
  </div>
);
OrgPark.args = {
  mode: 'path',
  page: createPage(),
  isPark: true,
  version: Breadcrumb.Org.version,
};
OrgPark.storyName = '园区模式';

export const OrgTag = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <Breadcrumb.Org {...args} />
  </div>
);
OrgTag.args = {
  mode: 'tag',
  page: createPage(),
  version: Breadcrumb.Org.version,
};
OrgTag.storyName = '标签模式';

export const OrgWithExtra = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <Breadcrumb.Org {...args} />
  </div>
);
OrgWithExtra.args = {
  mode: 'path',
  page: createPage(),
  extraBefore: <Button size="small">切换组织</Button>,
  extra: (
    <Space>
      <Button size="small">导出</Button>
      <Button type="primary" size="small">新增项目</Button>
    </Space>
  ),
  version: Breadcrumb.Org.version,
};
OrgWithExtra.storyName = '带额外操作区';
