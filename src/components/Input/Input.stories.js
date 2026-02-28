import React from 'react';
import Input from './index';

export default {
  title: '数据录入/Input',
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'password', 'number', 'email']
      }
    },
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

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Default Input',
  version: Input.version
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  placeholder: 'Password Input',
  version: Input.version
};

export const Number = Template.bind({});
Number.args = {
  type: 'number',
  placeholder: 'Number Input',
  version: Input.version
};

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  placeholder: 'Email Input',
  version: Input.version
};


export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  placeholder: 'Disabled Input',
  version: Input.version
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  defaultValue: 'Hello World',
  placeholder: 'Input with default value',
  version: Input.version
};
