import React from 'react';
import Chart from './index';

export default {
  title: '图表/Chart',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: `Chart 图表组件 - 版本: ${Chart.version}\n\n基于 ECharts 5.4.1 封装的通用图表组件，支持所有 ECharts 图表类型。`
      }
    }
  },
  argTypes: {
    loading: {
      control: 'boolean'
    },
    autoResize: {
      control: 'boolean'
    },
    theme: {
      control: {
        type: 'select',
        options: ['geekBlue', 'dustRed', 'mintGreen', 'neonBlue', 'sunsetOrange', 'goldenPurple', 'cyan']
      }
    }
  }
};

const Template = (args) => (
  <div style={{ height: '400px' }}>
    <Chart {...args} />
  </div>
);

export const 基础示例 = Template.bind({});
基础示例.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础示例'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  }
};
