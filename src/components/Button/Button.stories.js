import React from 'react';
import Button from './index';

export default {
  title: '通用/Button 按钮',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Button 组件 - 版本: ${Button.version}`
      }
    }
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['primary', 'default', 'dashed', 'danger', 'link']
      }
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'middle', 'large']
      }
    },
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    },
    children: {
      control: 'text'
    },
    onClick: {
      action: 'clicked'
    }
  }
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  version: Button.version,
  children: 'Primary Button'
};

export const Default = Template.bind({});
Default.args = {
  type: 'default',
  version: Button.version,
  children: 'Default Button'
};

export const Dashed = Template.bind({});
Dashed.args = {
  type: 'dashed',
  version: Button.version,
  children: 'Dashed Button'
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  version: Button.version,
  children: 'Danger Button'
};

export const Link = Template.bind({});
Link.args = {
  type: 'link',
  version: Button.version,
  children: 'Link Button'
};
