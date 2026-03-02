import React from 'react';
import Switch from './index';

export default {
  title: '数据录入/Switch 开关',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `Switch 组件 - 版本: ${Switch.version}`
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

const Template = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: Switch.version
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  version: Switch.version
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  version: Switch.version
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  version: Switch.version
};
