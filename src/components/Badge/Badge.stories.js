import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import Badge from './index';

export default {
  title: '数据展示/Badge 徽标数',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Badge 徽标数组件，版本：${Badge.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Badge count={5}>
      <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
    </Badge>
    <Badge count={0} showZero>
      <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
    </Badge>
    <Badge dot>
      <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
    </Badge>
  </div>
);

// 独立使用
export const 独立使用 = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Badge count={25} />
    <Badge count={4} />
    <Badge count={109} />
  </div>
);

// 状态点
export const 状态点 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Badge status="success" text="Success" />
    <Badge status="error" text="Error" />
    <Badge status="default" text="Default" />
    <Badge status="processing" text="Processing" />
    <Badge status="warning" text="Warning" />
  </div>
);

// Ribbon
export const Ribbon = () => (
  <Badge.Ribbon text="Hippies">
    <div style={{ width: '100%', height: 100, background: '#eee', borderRadius: 4 }} />
  </Badge.Ribbon>
);
