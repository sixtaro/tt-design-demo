
import React from 'react';
import { SearchOutlined, SettingOutlined, HeartOutlined, StarOutlined, LoadingOutlined } from '@ant-design/icons';
import Icon from './index';

export default {
  title: '通用/Icon 图标',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    spin: { control: 'boolean' },
    version: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `tt-design 图标组件 - 版本 ${Icon.version}`,
      },
    },
  },
};

export const 基础用法 = {
  render: (args) => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
      <Icon {...args} component={SearchOutlined} />
      <Icon {...args} component={SettingOutlined} />
      <Icon {...args} component={HeartOutlined} />
      <Icon {...args} component={StarOutlined} />
    </div>
  ),
};

export const 使用AntdIcon = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>使用 Ant Design 图标组件</div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>搜索</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SettingOutlined} size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>设置</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={HeartOutlined} size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>收藏</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={StarOutlined} size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>星星</span>
        </div>
      </div>
    </div>
  ),
};

export const 使用Iconfont = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>使用 Iconfont（需先引入 iconfont.css）</div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon iconfont="iconfont icon-search" size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>搜索</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon iconfont="iconfont icon-home" size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>首页</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon iconfont="iconfont icon-user" size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>用户</span>
        </div>
      </div>
    </div>
  ),
};

export const 不同尺寸 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="small" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>small</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="default" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>default</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="large" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>large</span>
        </div>
      </div>
    </div>
  ),
};

export const 自定义颜色 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Icon component={HeartOutlined} size="large" color="#FF4433" />
        <Icon component={StarOutlined} size="large" color="#FADB14" />
        <Icon component={SearchOutlined} size="large" color="#3388FF" />
        <Icon component={SettingOutlined} size="large" color="#5CE0B6" />
      </div>
    </div>
  ),
};

export const 渐变颜色 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>线性渐变</div>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={HeartOutlined} size="large" color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>紫蓝渐变</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={StarOutlined} size="large" color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>粉紫渐变</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="large" color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>青蓝渐变</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SettingOutlined} size="large" color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>青绿渐变</span>
        </div>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: '#223355' }}>径向渐变</div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={HeartOutlined} size="large" color="radial-gradient(circle, #fa709a 0%, #fee140 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>粉黄径向</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={StarOutlined} size="large" color="radial-gradient(circle, #a18cd1 0%, #fbc2eb 100%)" />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>紫粉径向</span>
        </div>
      </div>
    </div>
  ),
};

export const 旋转和加载 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SettingOutlined} size="large" rotate={90} />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>旋转 90°</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={LoadingOutlined} size="large" spin />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>加载中</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon component={SearchOutlined} size="large" rotate={180} />
          <span style={{ fontSize: '12px', color: '#6B7A99' }}>旋转 180°</span>
        </div>
      </div>
    </div>
  ),
};

