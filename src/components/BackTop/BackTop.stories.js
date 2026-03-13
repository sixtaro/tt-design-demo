import React from 'react';
import BackTop from './index';

export default {
  title: '其他/BackTop 回到顶部',
  component: BackTop,
  parameters: {
    docs: {
      description: {
        component: `BackTop 回到顶部组件 - 版本: ${BackTop.version}`
      }
    }
  },
  argTypes: {
    visibilityHeight: {
      control: 'number',
      description: '滚动高度达到此值才显示'
    },
    duration: {
      control: 'number',
      description: '回到顶部所需时间（ms）'
    },
    tooltipTitle: {
      control: 'text',
      description: 'Tooltip 提示文字'
    },
    version: {
      control: 'text'
    },
    onClick: {
      action: 'clicked'
    }
  }
};

const Template = (args) => (
  <div style={{ height: '600px', overflow: 'auto', border: '1px solid #e8e8e8', padding: '16px' }} id="backTopContainer">
    <p>向下滚动页面以查看回到顶部按钮</p>
    <div style={{ height: '2000px' }}>
      <p>内容区域，向下滚动...</p>
      <p>继续向下...</p>
      <p>再向下...</p>
    </div>
    <BackTop target={() => document.getElementById('backTopContainer')} {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  visibilityHeight: 200,
  version: BackTop.version
};

export const CustomTooltip = Template.bind({});
CustomTooltip.args = {
  visibilityHeight: 200,
  tooltipTitle: '返回顶部',
  version: BackTop.version
};

export const FastDuration = Template.bind({});
FastDuration.args = {
  visibilityHeight: 200,
  duration: 300,
  version: BackTop.version
};
