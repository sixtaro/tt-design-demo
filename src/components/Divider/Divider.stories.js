import React from 'react';
import Divider from './index';

export default {
  title: '布局/Divider 分割线',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: `Divider 分割线组件 - 版本: ${Divider.version}`
      }
    }
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      }
    },
    orientation: {
      control: {
        type: 'select',
        options: ['left', 'right', 'center']
      }
    },
    dashed: {
      control: 'boolean'
    },
    plain: {
      control: 'boolean'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => (
  <div>
    <p>上方内容</p>
    <Divider {...args} />
    <p>下方内容</p>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  version: Divider.version
};

export const WithText = () => (
  <div>
    <p>上方内容</p>
    <Divider version={Divider.version}>Text</Divider>
    <p>下方内容</p>
  </div>
);

export const LeftText = () => (
  <div>
    <p>上方内容</p>
    <Divider orientation="left" version={Divider.version}>Left Text</Divider>
    <p>下方内容</p>
  </div>
);

export const RightText = () => (
  <div>
    <p>上方内容</p>
    <Divider orientation="right" version={Divider.version}>Right Text</Divider>
    <p>下方内容</p>
  </div>
);

export const Dashed = Template.bind({});
Dashed.args = {
  dashed: true,
  version: Divider.version
};

export const Plain = () => (
  <div>
    <p>上方内容</p>
    <Divider plain version={Divider.version}>Plain Text</Divider>
    <p>下方内容</p>
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span>内容一</span>
    <Divider type="vertical" version={Divider.version} />
    <span>内容二</span>
    <Divider type="vertical" version={Divider.version} />
    <span>内容三</span>
  </div>
);
