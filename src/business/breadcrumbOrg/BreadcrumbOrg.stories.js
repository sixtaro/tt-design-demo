import React, { useEffect } from 'react';
import { Button, Space } from 'antd';
import BreadcrumbOrg from './breadcrumbOrg';
import BreadcrumbOrgTag from './breadcrumbOrgTag';
import '@/utils';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.hasRight = window.hasRight || (() => true);
};

ensureBusinessStoryEnv();

const basePage = {
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
  displayTree: () => {
    console.log('displayTree called');
  },
};

export default {
  title: '业务组件/BreadcrumbOrg 组织面包屑',
  component: BreadcrumbOrg,
  parameters: {
    docs: {
      description: {
        component: '演示普通组织链路与桌面项目标签模式下的 BreadcrumbOrg 展示效果。',
      },
    },
  },
  argTypes: {
    page: {
      control: false,
    },
    org: {
      control: false,
    },
  },
};

export const 普通组织链路 = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <BreadcrumbOrg {...args} />
  </div>
);
普通组织链路.args = {
  page: basePage,
  extraBefore: <Button size="small">切换组织</Button>,
  extra: (
    <Space>
      <Button size="small">导出</Button>
      <Button type="primary" size="small">新增项目</Button>
    </Space>
  ),
};

export const 园区模式 = args => (
  <div style={{ padding: 24, background: '#fff' }}>
    <BreadcrumbOrg {...args} />
  </div>
);
园区模式.args = {
  page: basePage,
  isPark: true,
};

const DesktopTagDemo = () => {
  useEffect(() => {
    const previousProjectName = window.projectName;
    window.projectName = 'desktop';

    return () => {
      window.projectName = previousProjectName || 'public';
    };
  }, []);

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <BreadcrumbOrgTag page={basePage} />
    </div>
  );
};

export const 桌面标签模式 = () => <DesktopTagDemo />;
