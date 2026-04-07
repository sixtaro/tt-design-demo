import React from 'react';
import Popconfirm from './index';
import Button from '../Button';

export default {
  title: '反馈/Popconfirm 气泡确认框',
  component: Popconfirm,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => (
  <Popconfirm {...args}>
    <Button type="primary">删除</Button>
  </Popconfirm>
);

export const 基础用法 = Template.bind({});
基础用法.args = {
  title: '确定删除吗？',
  okText: '确定',
  cancelText: '取消',
};

export const 国际化 = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Popconfirm title="Are you sure?" okText="Yes" cancelText="No">
      <Button>删除</Button>
    </Popconfirm>
  </div>
);

export const 自定义Icon = () => (
  <Popconfirm title="确定删除吗？">
    <Button type="primary" danger>删除</Button>
  </Popconfirm>
);

export const 条件触发 = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Popconfirm title="确定删除吗？" disabled>
      <Button type="primary" disabled>删除(禁用)</Button>
    </Popconfirm>
    <Popconfirm title="确定删除吗？">
      <Button type="primary" danger>删除</Button>
    </Popconfirm>
  </div>
);
