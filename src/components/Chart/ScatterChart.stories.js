import React from 'react';
import Chart from './index';

export default {
  title: '图表/散点图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '散点图 - 使用 scatter 类型'
      }
    }
  },
  argTypes: {
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

export const 基础散点图 = Template.bind({});
基础散点图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础散点图'
    },
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.20],
          [11.5, 7.20]
        ],
        type: 'scatter'
      }
    ]
  }
};

export const 气泡图 = Template.bind({});
气泡图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '气泡图'
    },
    xAxis: {},
    yAxis: {},
    series: [
      {
        type: 'scatter',
        data: [
          [10.0, 8.04, 10],
          [8.07, 6.95, 20],
          [13.0, 7.58, 15],
          [9.05, 8.81, 25],
          [11.0, 8.33, 18],
          [14.0, 7.66, 30],
          [13.4, 6.81, 22],
          [10.0, 6.33, 17],
          [14.0, 8.96, 28],
          [12.5, 6.82, 21],
          [9.15, 7.20, 19],
          [11.5, 7.20, 24]
        ],
        symbolSize: (data) => data[2]
      }
    ]
  }
};
