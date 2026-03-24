import React from 'react';
import Chart from './index';

export default {
  title: '图表/饼图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '饼图 - 使用 pie 类型'
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

export const 基础饼图 = Template.bind({});
基础饼图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础饼图'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
};

export const 环形图 = Template.bind({});
环形图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '环形图'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  }
};

export const 南丁格尔玫瑰图 = Template.bind({});
南丁格尔玫瑰图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '南丁格尔玫瑰图'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' }
        ]
      }
    ]
  }
};
