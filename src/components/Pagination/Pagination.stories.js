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
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    }
  }
};

const Template = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
  total: 50,
  version: Pagination.version
};

export const WithCurrent = Template.bind({});
WithCurrent.args = {
  current: 3,
  total: 50,
  version: Pagination.version
};

export const WithPageSize = Template.bind({});
WithPageSize.args = {
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  version: Pagination.version
};
