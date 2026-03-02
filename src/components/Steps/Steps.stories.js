import React from 'react';
import Steps from './index';

export default {
  title: '导航/Steps 步骤条',
  component: Steps,
  parameters: {
    docs: {
      description: {
        component: `Steps 步骤条组件 - 版本: ${Steps.version}\n\n引导用户完成多步骤任务的组件，清晰展示当前进度和状态。`
      }
    }
  },
  argTypes: {
    current: {
      control: 'number'
    },
    direction: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      }
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'default']
      }
    },
    labelPlacement: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      }
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => (
  <Steps {...args}>
    <Steps.Step title="步骤 1" description="这是步骤 1 的描述" />
    <Steps.Step title="步骤 2" description="这是步骤 2 的描述" />
    <Steps.Step title="步骤 3" description="这是步骤 3 的描述" />
    <Steps.Step title="步骤 4" description="这是步骤 4 的描述" />
  </Steps>
);

export const Default = Template.bind({});
Default.args = {
  current: 0,
  direction: 'horizontal',
  version: Steps.version
};

export const Vertical = Template.bind({});
Vertical.args = {
  current: 1,
  direction: 'vertical',
  version: Steps.version
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  current: 2,
  size: 'small',
  version: Steps.version
};

export const VerticalLabel = Template.bind({});
VerticalLabel.args = {
  current: 1,
  labelPlacement: 'vertical',
  version: Steps.version
};