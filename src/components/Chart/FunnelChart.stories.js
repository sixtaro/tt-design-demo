import React from 'react';
import Chart from './index';

export default {
  title: '图表/漏斗图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '漏斗图 - 使用 funnel 类型'
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

export const 基础漏斗图 = Template.bind({});
基础漏斗图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础漏斗图'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 100, name: 'Show' },
          { value: 80, name: 'Click' },
          { value: 60, name: 'Visit' },
          { value: 40, name: 'Inquiry' },
          { value: 20, name: 'Order' }
        ]
      }
    ]
  }
};

export const 金字塔图 = Template.bind({});
金字塔图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '金字塔图'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Pyramid',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'ascending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        data: [
          { value: 100, name: 'Show' },
          { value: 80, name: 'Click' },
          { value: 60, name: 'Visit' },
          { value: 40, name: 'Inquiry' },
          { value: 20, name: 'Order' }
        ]
      }
    ]
  }
};
