import React from 'react';
import Spin from './index';

export default {
  title: '反馈/Spin',
  component: Spin,
  parameters: {
    docs: {
      description: {
        component: `Spin 组件 - 版本: ${Spin.version}`
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

const Template = (args) => <Spin {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: Spin.version
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  version: Spin.version
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  version: Spin.version
};

export const WithTip = Template.bind({});
WithTip.args = {
  tip: 'Loading...',
  version: Spin.version
};

export const InsideContainer = () => (
  <div style={{ padding: '50px', backgroundColor: '#f5f5f5' }}>
    <Spin version={Spin.version} />
  </div>
);
