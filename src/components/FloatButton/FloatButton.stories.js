import React from 'react';
import FloatButton from './index';

export default {
  title: '通用/FloatButton 悬浮按钮',
  component: FloatButton,
  parameters: {
    docs: {
      description: {
        component: `FloatButton 悬浮按钮组件 - 版本: ${FloatButton.version}`
      }
    }
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['primary', 'default', 'danger']
      }
    },
    shape: {
      control: {
        type: 'select',
        options: ['circle', 'square']
      }
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'default', 'large']
      }
    },
    position: {
      control: {
        type: 'select',
        options: ['bottomRight', 'bottomLeft', 'topRight', 'topLeft']
      }
    },
    icon: {
      control: 'text'
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
  <div style={{ height: '200px', position: 'relative', border: '1px dashed #d9d9d9', padding: '16px', marginBottom: '16px' }}>
    <FloatButton absolute {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  version: FloatButton.version
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  version: FloatButton.version
};

export const Danger = Template.bind({});
Danger.args = {
  type: 'danger',
  version: FloatButton.version
};

export const Square = Template.bind({});
Square.args = {
  shape: 'square',
  version: FloatButton.version
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  version: FloatButton.version
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  version: FloatButton.version
};

export const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
  icon: '↑',
  version: FloatButton.version
};

export const AllPositions = () => (
  <div style={{ height: '300px', position: 'relative', border: '1px dashed #d9d9d9', marginBottom: '16px' }}>
    <FloatButton absolute position="topLeft" icon="TL" version={FloatButton.version} />
    <FloatButton absolute position="topRight" icon="TR" version={FloatButton.version} />
    <FloatButton absolute position="bottomLeft" icon="BL" version={FloatButton.version} />
    <FloatButton absolute position="bottomRight" icon="BR" version={FloatButton.version} />
  </div>
);
