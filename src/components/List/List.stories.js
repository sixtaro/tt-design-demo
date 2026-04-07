import React from 'react';
import List from './index';

const data = [
  '列表项内容 1',
  '列表项内容 2',
  '列表项内容 3',
];

const dataWithMeta = [
  { title: '标题一', description: '描述信息一' },
  { title: '标题二', description: '描述信息二' },
  { title: '标题三', description: '描述信息三' },
];

export default {
  title: '数据展示/List 列表',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 List 列表组件，版本：${List.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <List
    bordered
    dataSource={data}
    renderItem={(item) => <List.Item>{item}</List.Item>}
  />
);

// 带标题和描述
export const 带标题描述 = () => (
  <List
    bordered
    dataSource={dataWithMeta}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          title={item.title}
          description={item.description}
        />
      </List.Item>
    )}
  />
);
