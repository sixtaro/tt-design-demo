import React from 'react';
import ConfigForm from './index';

export default {
  title: '案例/MySQL配置表单',
  component: ConfigForm,
  parameters: {
    docs: {
      description: {
        component: 'MySQL输入配置表单 - 还原设计稿的完整配置页面示例'
      }
    }
  }
};

const Template = (args) => <ConfigForm {...args} />;

export const 默认示例 = Template.bind({});
默认示例.args = {};
