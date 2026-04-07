import React from 'react';
import Tooltip from './index';

export default {
  title: '数据展示/Tooltip 文字提示',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Tooltip 文字提示组件，版本：${Tooltip.version}`
      }
    }
  },
  argTypes: {
    placement: {
      control: { type: 'select', options: ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'] },
      description: '气泡位置'
    },
    trigger: { control: { type: 'select', options: ['hover', 'focus', 'click'] }, description: '触发行为' },
  }
};

// 基础用法
export const 基础用法 = () => (
  <Tooltip title="提示文字">
    <span style={{ cursor: 'pointer' }}>鼠标移入显示提示</span>
  </Tooltip>
);

// 位置
export const 位置 = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Tooltip placement="top" title="顶部提示">
      <span style={{ cursor: 'pointer' }}>上</span>
    </Tooltip>
    <Tooltip placement="bottom" title="底部提示">
      <span style={{ cursor: 'pointer' }}>下</span>
    </Tooltip>
    <Tooltip placement="left" title="左侧提示">
      <span style={{ cursor: 'pointer' }}>左</span>
    </Tooltip>
    <Tooltip placement="right" title="右侧提示">
      <span style={{ cursor: 'pointer' }}>右</span>
    </Tooltip>
  </div>
);
