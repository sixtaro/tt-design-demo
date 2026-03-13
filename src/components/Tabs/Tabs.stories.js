import React from 'react';
import Tabs from './index';

export default {
  title: '导航/Tabs 标签页',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Tabs 组件 - 版本: ${Tabs.version}\n\n基于 Ant Design 4.x Tabs 组件封装，支持全部属性。\n\n**样式说明：**\n- 默认字体颜色：Grey-7，字号：14px\n- 横向选中：字体颜色（主题色-6）\n- 纵向 hover：背景颜色（Grey-1）\n- 纵向选中：字体颜色（主题色-6）；背景色（主题色-1）`
      }
    }
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    },
    tabPosition: {
      control: {
        type: 'select',
        options: ['top', 'right', 'bottom', 'left']
      },
      description: '标签页位置'
    },
    type: {
      control: {
        type: 'select',
        options: ['line', 'card', 'editable-card']
      },
      description: '标签页类型'
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
Default.storyName = '横向默认';

export const VerticalLeft = () => {
  return (
    <Tabs tabPosition="left" version={Tabs.version}>
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
};
VerticalLeft.storyName = '纵向左侧';

export const VerticalRight = () => {
  return (
    <Tabs tabPosition="right" version={Tabs.version}>
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
};
VerticalRight.storyName = '纵向右侧';

export const CardType = Template.bind({});
CardType.args = {
  type: 'card',
  version: Tabs.version
};
CardType.storyName = '卡片类型';
