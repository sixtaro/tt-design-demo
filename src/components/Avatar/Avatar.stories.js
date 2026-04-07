import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import Avatar from './index';

export default {
  title: '数据展示/Avatar 头像',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Avatar 头像组件，版本：${Avatar.version}`
      }
    }
  },
  argTypes: {
    shape: { control: { type: 'select', options: ['circle', 'square'] }, description: '形状' },
    size: { control: { type: 'select', options: ['large', 'default', 'small'] }, description: '大小' },
    src: { control: 'text', description: '图片地址' },
  }
};

// 基础用法
export const 基础用法 = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Avatar size={64} icon={<UserOutlined />} />
    <Avatar size="large" icon={<UserOutlined />} />
    <Avatar icon={<UserOutlined />} />
    <Avatar size="small" icon={<UserOutlined />} />
  </div>
);

// 不同类型
export const 不同类型 = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Avatar icon={<UserOutlined />} />
    <Avatar>U</Avatar>
    <Avatar size={40}>USER</Avatar>
    <Avatar src="https://joeschmoe.io/api/v1/random" />
    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
  </div>
);

// Avatar.Group
export const 头像组 = () => (
  <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
    <Avatar src="https://joeschmoe.io/api/v1/random" />
    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
    <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
    <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
    <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
  </Avatar.Group>
);
