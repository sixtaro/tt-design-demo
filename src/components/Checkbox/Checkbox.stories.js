import React from 'react';
import Checkbox from './index';

export default {
  title: '数据录入/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `Checkbox 组件 - 版本: ${Checkbox.version}`
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

const Template = (args) => <Checkbox {...args}>Checkbox</Checkbox>;

export const Default = Template.bind({});
Default.args = {
  version: Checkbox.version
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  version: Checkbox.version
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  version: Checkbox.version
};

export const Indeterminate = () => (
  <Checkbox indeterminate version={Checkbox.version}>
    Indeterminate
  </Checkbox>
);

export const Group = () => (
  <Checkbox.Group options={['Apple', 'Pear', 'Orange']} version={Checkbox.version} />
);
