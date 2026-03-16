import React, { useState } from 'react';
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

const Template = (args) => {
  const [checked, setChecked] = useState(args.checked || false);
  return <Radio {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)}>单选选项</Radio>;
};

export const 默认状态 = Template.bind({});
默认状态.args = {
  version: Radio.version
};

export const 选中状态 = Template.bind({});
选中状态.args = {
  checked: true,
  version: Radio.version
};

export const 禁用状态 = Template.bind({});
禁用状态.args = {
  disabled: true,
  version: Radio.version
};

export const 禁用选中状态 = Template.bind({});
禁用选中状态.args = {
  disabled: true,
  checked: true,
  version: Radio.version
};

const GroupTemplate = (args) => {
  const [value, setValue] = useState(args.defaultValue);
  return (
    <Radio.Group 
      {...args} 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const 单选框组 = GroupTemplate.bind({});
单选框组.args = {
  options: ['苹果', '梨', '橙子'],
  defaultValue: '苹果',
  version: Radio.version
};

export const 单选框组对象选项 = GroupTemplate.bind({});
单选框组对象选项.args = {
  options: [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' }
  ],
  defaultValue: '2',
  version: Radio.version
};

export const 按钮形式单选框 = GroupTemplate.bind({});
按钮形式单选框.args = {
  optionType: 'button',
  buttonStyle: 'solid',
  options: ['苹果', '梨', '橙子'],
  defaultValue: '苹果',
  version: Radio.version
};

export const 禁用的按钮单选框 = GroupTemplate.bind({});
禁用的按钮单选框.args = {
  optionType: 'button',
  buttonStyle: 'solid',
  options: ['苹果', '梨', '橙子'],
  defaultValue: '梨',
  disabled: true,
  version: Radio.version
};
