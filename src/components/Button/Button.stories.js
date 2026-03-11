
import React from 'react';
import { SearchOutlined, UploadOutlined, ReloadOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
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
        options: ['primary', 'default', 'dashed', 'danger', 'link', 'text']
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
        options: ['default', 'circle', 'square', 'round']
      }
    },
    variant: {
      control: {
        type: 'select',
        options: ['filled', 'outline']
      }
    },
    version: {
      control: false,
      description: '组件版本号，会渲染为 data-component-version 属性'
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
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" version={Button.version}>主要按钮</Button>
        <Button version={Button.version}>默认按钮</Button>
        <Button type="dashed" version={Button.version}>虚线按钮</Button>
        <Button type="danger" version={Button.version}>危险按钮</Button>
        <Button type="link" version={Button.version}>链接按钮</Button>
        <Button type="text" version={Button.version}>纯文字</Button>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7A99' }}>超链接按钮 (link 类型 - 有下划线</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="link" version={Button.version}>超链接按钮</Button>
        <Button type="link" shape="circle" version={Button.version}>圆形超链接</Button>
      </div>
    </div>
  ),
};

export const 圆形按钮 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>圆形按钮</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6B7A99' }}>图标+文字</div>
            <Button type="default" shape="circle" icon={<Icon component={PlusOutlined} />} version={Button.version}>新增</Button>
            <Button type="danger" shape="circle" icon={<Icon component={PlusOutlined} />} version={Button.version}>停用</Button>
            <Button type="link" shape="circle" version={Button.version}>编辑</Button>
            <Button type="text" shape="circle" version={Button.version}>对象标识名称</Button>
            <Button shape="circle" icon={<Icon component={DownOutlined} />} version={Button.version} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7A99' }}>禁用状态</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button shape="circle" disabled version={Button.version}>禁用按钮</Button>
          <Button shape="circle" loading version={Button.version}>加载中</Button>
          <Button type="danger" shape="circle" disabled version={Button.version}>禁用危险</Button>
        </div>
      </div>
    </div>
  ),
};

export const 方形按钮 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>方形按钮</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6B7A99' }}>图标+文字</div>
          <Button type="primary" icon={<Icon component={UploadOutlined} />} version={Button.version}>上传</Button>
          <Button type="primary" icon={<Icon component={UploadOutlined} />} version={Button.version}>保存</Button>
          <Button type="primary" version={Button.version}>上传</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6B7A99' }}>图标+文字</div>
          <Button icon={<Icon component={UploadOutlined} />} version={Button.version}>上传</Button>
          <Button version={Button.version}>上传</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6B7A99' }}>无框</div>
          <Button type="text" icon={<Icon component={ReloadOutlined} />} version={Button.version}>刷新</Button>
          <Button type="text" icon={<Icon component={UploadOutlined} />} version={Button.version} />
        </div>
      </div>
    </div>
  ),
};

export const 按钮尺寸 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button size="small" type="primary" version={Button.version}>Small</Button>
        <Button size="middle" type="primary" version={Button.version}>Middle</Button>
        <Button size="large" type="primary" version={Button.version}>Large</Button>
      </div>
    </div>
  ),
};

export const 禁用状态 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" disabled version={Button.version}>主要按钮</Button>
        <Button disabled version={Button.version}>默认按钮</Button>
        <Button type="dashed" disabled version={Button.version}>虚线按钮</Button>
        <Button type="danger" disabled version={Button.version}>危险按钮</Button>
        <Button type="link" disabled version={Button.version}>链接按钮</Button>
      </div>
    </div>
  ),
};

export const 加载状态 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" loading version={Button.version}>加载中</Button>
        <Button loading version={Button.version}>加载中</Button>
        <Button type="dashed" loading version={Button.version}>加载中</Button>
      </div>
    </div>
  ),
};

export const 图标按钮 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" icon={<Icon component={SearchOutlined} />} version={Button.version}>搜索</Button>
        <Button icon={<Icon component={SearchOutlined} />} version={Button.version}>搜索</Button>
        <Button type="primary" shape="circle" icon={<Icon component={SearchOutlined} />} version={Button.version} />
        <Button shape="circle" icon={<Icon component={SearchOutlined} />} version={Button.version} />
        <Button type="primary" icon={<Icon component={SearchOutlined} />} version={Button.version} />
        <Button icon={<Icon component={SearchOutlined} />} version={Button.version} />
      </div>
    </div>
  ),
};

export const 按钮组合 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button type="primary" version={Button.version}>保存</Button>
        <Button version={Button.version}>取消</Button>
      </div>
    </div>
  ),
};

export const 按钮变体 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>面性按钮 (filled)</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="primary" variant="filled" version={Button.version}>主要按钮</Button>
          <Button type="default" variant="filled" version={Button.version}>默认按钮</Button>
          <Button type="danger" variant="filled" version={Button.version}>危险按钮</Button>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>线性按钮 (outline)</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="primary" variant="outline" version={Button.version}>主要按钮</Button>
          <Button type="danger" variant="outline" version={Button.version}>危险按钮</Button>
        </div>
      </div>
    </div>
  ),
};

export const 按钮形状 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>圆形按钮 (circle) - 圆角 16px</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="primary" shape="circle" version={Button.version}>圆形按钮</Button>
          <Button type="default" shape="circle" version={Button.version}>圆形按钮</Button>
          <Button type="danger" shape="circle" version={Button.version}>圆形按钮</Button>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>方形按钮 (square) - 圆角 4px</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="primary" shape="square" version={Button.version}>方形按钮</Button>
          <Button type="default" shape="square" version={Button.version}>方形按钮</Button>
          <Button type="danger" shape="square" version={Button.version}>方形按钮</Button>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>线性按钮 + 形状组合</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="primary" variant="outline" shape="circle" version={Button.version}>圆形线性</Button>
          <Button type="primary" variant="outline" shape="square" version={Button.version}>方形线性</Button>
          <Button type="danger" variant="outline" shape="circle" version={Button.version}>危险圆形</Button>
        </div>
      </div>
    </div>
  ),
};

