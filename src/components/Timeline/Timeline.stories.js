import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import Timeline from './index';

const { Item } = Timeline;

export default {
  title: '数据展示/Timeline 时间轴',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Timeline 时间轴组件，版本：${Timeline.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <Timeline>
    <Item>创建服务 2024-01-01</Item>
    <Item>解决初始问题 2024-01-05</Item>
    <Item>技术评审 2024-01-10</Item>
    <Item>网络异常 2024-01-15</Item>
  </Timeline>
);

// 颜色
export const 颜色 = () => (
  <Timeline>
    <Item color="green">已完成</Item>
    <Item color="green">已完成</Item>
    <Item color="red">错误</Item>
    <Item color="gray">待处理</Item>
    <Item color="blue">进行中</Item>
  </Timeline>
);

// 自定义图标
export const 自定义图标 = () => (
  <Timeline>
    <Item>创建服务</Item>
    <Item>解决初始问题</Item>
    <Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />} color="red">
      技术评审
    </Item>
    <Item>网络异常</Item>
  </Timeline>
);
