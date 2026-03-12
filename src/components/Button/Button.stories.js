import React from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Button from './index';
import Icon from '../Icon';

export default {
  title: '通用/Button 按钮',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Button 组件 - 版本: ${Button.version}`
      }
    }
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['primary', 'default', 'link', 'text']
      }
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'middle', 'large']
      }
    },
    shape: {
      control: {
        type: 'select',
        options: ['default', 'circle', 'round']
      }
    },
    danger: {
      control: 'boolean'
    },
    border: {
      control: 'boolean'
    },
    version: {
      control: false
    },
    children: {
      control: 'text'
    },
    onClick: {
      action: 'clicked'
    }
  }
};

const Template = (args) => <Button {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  type: 'primary',
  version: Button.version,
  children: 'Button'
};

export const 按钮类型 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>默认按钮</div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="default" version={Button.version}>默认按钮</Button>
        <Button type="default" danger version={Button.version}>危险按钮</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>主要按钮</div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" version={Button.version}>主要按钮</Button>
        <Button type="primary" danger version={Button.version}>危险按钮</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>纯文字 / 超链接</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="text" version={Button.version}>纯文字</Button>
        <Button type="text" danger version={Button.version}>危险文字</Button>
        <Button type="link" version={Button.version}>超链接</Button>
        <Button type="link" danger version={Button.version}>危险链接</Button>
      </div>
    </div>
  ),
};

export const 按钮形状 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>默认圆角 (4px)</div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button shape="default" version={Button.version}>默认按钮</Button>
        <Button type="primary" shape="default" version={Button.version}>主要按钮</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>圆角按钮 (16px)</div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button shape="round" version={Button.version}>圆角按钮</Button>
        <Button type="primary" shape="round" version={Button.version}>主要按钮</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>圆形按钮</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button type="primary" shape="circle" icon={<Icon component={PlusOutlined} />} version={Button.version} />
        <Button shape="circle" icon={<Icon component={PlusOutlined} />} version={Button.version} />
      </div>
    </div>
  ),
};

export const 按钮尺寸 = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small" type="primary" version={Button.version}>Small</Button>
      <Button size="middle" type="primary" version={Button.version}>Middle</Button>
      <Button size="large" type="primary" version={Button.version}>Large</Button>
    </div>
  ),
};

export const 图标按钮 = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button icon={<Icon component={SearchOutlined} />} version={Button.version}>搜索</Button>
      <Button type="primary" icon={<Icon component={SearchOutlined} />} version={Button.version}>搜索</Button>
      <Button shape="circle" icon={<Icon component={SearchOutlined} />} version={Button.version} />
      <Button type="primary" shape="circle" icon={<Icon component={SearchOutlined} />} version={Button.version} />
    </div>
  ),
};

export const 禁用状态 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="default" disabled version={Button.version}>默认按钮</Button>
        <Button type="default" danger disabled version={Button.version}>危险按钮</Button>
        <Button type="primary" disabled version={Button.version}>主要按钮</Button>
        <Button type="primary" danger disabled version={Button.version}>危险按钮</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="text" disabled version={Button.version}>纯文字</Button>
        <Button type="text" danger disabled version={Button.version}>危险文字</Button>
        <Button type="link" disabled version={Button.version}>超链接</Button>
        <Button type="link" danger disabled version={Button.version}>危险链接</Button>
      </div>
    </div>
  ),
};

export const 加载状态 = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button type="default" loading version={Button.version}>加载中</Button>
      <Button type="primary" loading version={Button.version}>加载中</Button>
      <Button shape="round" loading version={Button.version}>加载中</Button>
    </div>
  ),
};

export const 无框按钮 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>无框按钮</div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button border={false} version={Button.version}>无框按钮</Button>
        <Button border={false} icon={<Icon component={SearchOutlined} />} version={Button.version}>搜索</Button>
        <Button border={false} disabled version={Button.version}>禁用状态</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>圆角无框按钮</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button border={false} shape="round" version={Button.version}>圆角无框</Button>
        <Button border={false} shape="circle" icon={<Icon component={PlusOutlined} />} version={Button.version} />
      </div>
    </div>
  ),
};

export const 多操作按钮 = {
  render: () => {
    const items = [
      { key: '1', label: '操作一' },
      { key: '2', label: '操作二' },
      { key: '3', label: '操作三' },
    ];

    return (
      <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button.Dropdown menu={{ items }} version={Button.version}>更多操作</Button.Dropdown>
        <Button.Dropdown type="primary" menu={{ items }} version={Button.version}>更多操作</Button.Dropdown>
        <Button.Dropdown shape="round" menu={{ items }} version={Button.version}>圆角按钮</Button.Dropdown>
      </div>
    );
  },
};
