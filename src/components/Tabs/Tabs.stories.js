import React from 'react';
import Tabs from './index';

export default {
  title: '导航/Tabs 标签页',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Tabs 组件 - 版本: ${Tabs.version}`
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

const Template = (args) => (
  <Tabs {...args}>
    <Tabs.TabPane tab="Tab 1" key="1">
      Content of Tab Pane 1
    </Tabs.TabPane>
    <Tabs.TabPane tab="Tab 2" key="2">
      Content of Tab Pane 2
    </Tabs.TabPane>
    <Tabs.TabPane tab="Tab 3" key="3">
      Content of Tab Pane 3
    </Tabs.TabPane>
  </Tabs>
);

export const Default = Template.bind({});
Default.args = {
  version: Tabs.version
};

export const CardType = Template.bind({});
CardType.args = {
  type: 'card',
  version: Tabs.version
};
