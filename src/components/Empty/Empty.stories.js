import React from 'react';
import Empty from './index';
import Button from '../Button';

export default {
  title: '反馈/Empty 空状态',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Empty 组件 - 版本: ${Empty.version}`,
      },
    },
  },
  argTypes: {
    preset: {
      control: {
        type: 'select',
        options: Object.values(Empty.presets),
      },
    },
    description: {
      control: 'text',
    },
    version: {
      control: false,
    },
    image: {
      control: false,
    },
    children: {
      control: false,
    },
  },
};

const Template = args => <Empty {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  preset: Empty.presets.default,
  description: '暂无数据',
  version: Empty.version,
};

export const 预设缺省图 = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Empty preset={Empty.presets.default} description="AntD 默认空状态" version={Empty.version} />
      <Empty preset={Empty.presets.noData} description="本地预设无数据" version={Empty.version} />
      <Empty preset={Empty.presets.simple} description="AntD 简洁样式" version={Empty.version} />
    </div>
  ),
};

export const 带操作按钮 = {
  render: () => (
    <Empty preset={Empty.presets.noData} description="当前没有可展示内容" version={Empty.version}>
      <Button type="primary" version={Button.version}>
        立即新增
      </Button>
    </Empty>
  ),
};
