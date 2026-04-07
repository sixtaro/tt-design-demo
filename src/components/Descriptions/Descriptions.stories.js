import React from 'react';
import Descriptions from './index';

const { Item } = Descriptions;

export default {
  title: '数据展示/Descriptions 描述列表',
  component: Descriptions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Descriptions 描述列表组件，版本：${Descriptions.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <Descriptions title="用户信息">
    <Item label="用户名">张三</Item>
    <Item label="电话">1810000000</Item>
    <Item label="住址">北京市海淀区</Item>
    <Item label="备注">无</Item>
  </Descriptions>
);

// 带边框
export const 带边框 = () => (
  <Descriptions title="用户信息" bordered>
    <Item label="用户名">张三</Item>
    <Item label="电话">1810000000</Item>
    <Item label="住址">北京市海淀区</Item>
    <Item label="备注">无</Item>
    <Item label="地址">北京市朝阳区</Item>
  </Descriptions>
);

// 垂直布局
export const 垂直布局 = () => (
  <Descriptions title="用户信息" layout="vertical" bordered>
    <Item label="用户名">张三</Item>
    <Item label="电话">1810000000</Item>
    <Item label="住址">北京市海淀区</Item>
  </Descriptions>
);
