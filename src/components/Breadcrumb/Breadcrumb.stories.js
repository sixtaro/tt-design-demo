import React from 'react';
import Breadcrumb from './index';

export default {
  title: '导航/Breadcrumb 面包屑',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `Breadcrumb 面包屑组件 - 版本: ${Breadcrumb.version}\n\n显示当前页面在网站层级结构中的位置，帮助用户了解并导航回之前的页面。`
      }
    }
  },
  argTypes: {
    separator: {
      control: 'text'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>分类</Breadcrumb.Item>
    <Breadcrumb.Item>子分类</Breadcrumb.Item>
    <Breadcrumb.Item>当前页面</Breadcrumb.Item>
  </Breadcrumb>
);

export const Default = Template.bind({});
Default.args = {
  version: Breadcrumb.version
};

export const CustomSeparator = Template.bind({});
CustomSeparator.args = {
  separator: '>',
  version: Breadcrumb.version
};
