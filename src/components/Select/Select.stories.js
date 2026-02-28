import React from 'react';
import Select from './index';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' }
];

export default {
  title: '数据录入/Select',
  component: Select,
  argTypes: {
    placeholder: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    defaultValue: {
      control: 'text'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Default Select',
  options: mockOptions,
  version: Select.version
};


export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  placeholder: 'Disabled Select',
  options: mockOptions,
  version: Select.version
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  defaultValue: 'option2',
  placeholder: 'Select with default value',
  options: mockOptions,
  version: Select.version
};

export const WithOptionComponent = (args) => (
  <Select placeholder="Select with Option component" {...args}>
    <Select.Option value="option1">Option 1</Select.Option>
    <Select.Option value="option2">Option 2</Select.Option>
    <Select.Option value="option3">Option 3</Select.Option>
  </Select>
);
WithOptionComponent.args = {
  version: Select.version
};
