import React from 'react';
import Menu from './index';

export default {
  title: '导航/Menu 导航',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component: `Menu 导航组件 - 版本: ${Menu.version}\n\n用于网站导航的菜单组件，支持水平、垂直和内联三种模式。`
      }
    }
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical', 'inline']
      }
    },
    theme: {
      control: {
        type: 'select',
        options: ['light', 'dark']
      }
    },
    selectedKeys: {
      control: 'array'
    },
    defaultSelectedKeys: {
      control: 'array'
    },
    openKeys: {
      control: 'array'
    },
    defaultOpenKeys: {
      control: 'array'
    },
    onSelect: {
      action: 'selected'
    },
    onOpenChange: {
      action: 'openChange'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => (
  <Menu {...args}>
    <Menu.Item key="1">菜单项 1</Menu.Item>
    <Menu.Item key="2">菜单项 2</Menu.Item>
    <Menu.SubMenu key="sub1" title="子菜单">
      <Menu.Item key="3">子菜单项 1</Menu.Item>
      <Menu.Item key="4">子菜单项 2</Menu.Item>
    </Menu.SubMenu>
    <Menu.Item key="5">菜单项 3</Menu.Item>
  </Menu>
);

export const Default = Template.bind({});
Default.args = {
  mode: 'horizontal',
  version: Menu.version
};

export const Vertical = Template.bind({});
Vertical.args = {
  mode: 'vertical',
  version: Menu.version
};

export const Inline = Template.bind({});
Inline.args = {
  mode: 'inline',
  version: Menu.version
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  mode: 'horizontal',
  theme: 'dark',
  version: Menu.version
};