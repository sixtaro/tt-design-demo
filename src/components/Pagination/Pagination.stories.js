import React from 'react';
import Pagination from './index';

export default {
  title: '数据展示/Pagination 分页',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Pagination 组件 - 版本: ${Pagination.version}`
      }
    }
  }
};

const Template = (args) => <Pagination {...args} />;

export const 默认案例 = Template.bind({});
默认案例.args = {
  total: 50
};

export const 大量数据 = Template.bind({});
大量数据.args = {
  total: 500,
  pageSize: 10
};

export const 极简模式 = Template.bind({});
极简模式.args = {
  total: 50,
  simple: true
};

export const 禁用状态 = Template.bind({});
禁用状态.args = {
  total: 50,
  disabled: true
};
