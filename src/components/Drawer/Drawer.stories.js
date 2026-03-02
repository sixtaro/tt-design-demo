import React, { useState } from 'react';
import Drawer from './index';
import Button from '../Button';

export default {
  title: '反馈/Drawer 抽屉',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component: `Drawer 组件 - 版本: ${Drawer.version}`
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

const Template = (args) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Open Drawer
      </Button>
      <Drawer
        {...args}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Basic Drawer',
  version: Drawer.version
};

export const LeftPlacement = Template.bind({});
LeftPlacement.args = {
  title: 'Left Placement',
  placement: 'left',
  version: Drawer.version
};

export const WithMaskClosable = Template.bind({});
WithMaskClosable.args = {
  title: 'With Mask Closable',
  maskClosable: true,
  version: Drawer.version
};
