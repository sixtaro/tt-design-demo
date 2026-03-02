import React from 'react';
import Radio from './index';

export default {
  title: '数据录入/Radio 单选框',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: `Radio 组件 - 版本: ${Radio.version}`
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

const Template = (args) => <Radio {...args}>Radio</Radio>;

export const Default = Template.bind({});
Default.args = {
  version: Radio.version
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  version: Radio.version
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  version: Radio.version
};

export const Group = () => (
  <Radio.Group options={['Apple', 'Pear', 'Orange']} version={Radio.version} />
);

export const RadioButton = () => (
  <Radio.Group optionType="button" buttonStyle="solid" options={['Apple', 'Pear', 'Orange']} version={Radio.version} />
);
