import React from 'react';
import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
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
  children: 'Primary Button'
};

export const Default = Template.bind({});
Default.args = {
  type: 'default',
  children: 'Default Button'
};

export const Dashed = Template.bind({});
Dashed.args = {
  type: 'dashed',
  children: 'Dashed Button'
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  children: 'Danger Button'
};

export const Link = Template.bind({});
Link.args = {
  type: 'link',
  children: 'Link Button'
};
