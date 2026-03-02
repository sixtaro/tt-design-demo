import React from 'react';
import { Button, Menu } from 'antd';
import Dropdown from './index';

export default {
  title: '导航/Dropdown 下拉菜单',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `Dropdown 下拉菜单组件 - 版本: ${Dropdown.version}\n\n点击或悬停触发的下拉菜单组件，支持多种触发方式和位置。`
      }
    }
  },
  argTypes: {
    trigger: {
      control: {
        type: 'select',
        options: ['hover', 'click', 'contextMenu']
      }
    },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']
      }
    },
    visible: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    onVisibleChange: {
      action: 'visibleChange'
    },
    version: {
      control: 'text'
    }
  }
};

const menu = (
  <Menu>
    <Menu.Item key="1">菜单项 1</Menu.Item>
    <Menu.Item key="2">菜单项 2</Menu.Item>
    <Menu.Item key="3">菜单项 3</Menu.Item>
  </Menu>
);

const Template = (args) => (
  <Dropdown overlay={menu} {...args}>
    <Button type="primary">点击触发下拉菜单</Button>
  </Dropdown>
);

export const Default = Template.bind({});
Default.args = {
  trigger: ['click'],
  placement: 'bottom',
  version: Dropdown.version
};

export const HoverTrigger = Template.bind({});
HoverTrigger.args = {
  trigger: ['hover'],
  placement: 'bottom',
  version: Dropdown.version
};

export const ContextMenuTrigger = Template.bind({});
ContextMenuTrigger.args = {
  trigger: ['contextMenu'],
  placement: 'bottom',
  version: Dropdown.version
};

export const TopPlacement = Template.bind({});
TopPlacement.args = {
  trigger: ['click'],
  placement: 'top',
  version: Dropdown.version
};