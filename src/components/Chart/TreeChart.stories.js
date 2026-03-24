import React from 'react';
import Chart from './index';

export default {
  title: '图表/树图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '树图 - 使用 tree 和 treemap 类型'
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

export const 基础树图 = Template.bind({});
基础树图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础树图'
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [
          {
            name: '公司',
            children: [
              {
                name: '技术部',
                children: [
                  { name: '前端组' },
                  { name: '后端组' },
                  { name: '测试组' }
                ]
              },
              {
                name: '产品部',
                children: [
                  { name: '产品经理' },
                  { name: 'UI设计' }
                ]
              },
              {
                name: '运营部',
                children: [
                  { name: '市场运营' },
                  { name: '用户运营' }
                ]
              }
            ]
          }
        ],
        top: '1%',
        left: '15%',
        bottom: '1%',
        right: '20%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  }
};

export const 矩形树图 = Template.bind({});
矩形树图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '矩形树图'
    },
    tooltip: {},
    series: [
      {
        type: 'treemap',
        data: [
          {
            name: '公司',
            children: [
              {
                name: '技术部',
                value: 100,
                children: [
                  { name: '前端组', value: 40 },
                  { name: '后端组', value: 35 },
                  { name: '测试组', value: 25 }
                ]
              },
              {
                name: '产品部',
                value: 60,
                children: [
                  { name: '产品经理', value: 35 },
                  { name: 'UI设计', value: 25 }
                ]
              },
              {
                name: '运营部',
                value: 50,
                children: [
                  { name: '市场运营', value: 30 },
                  { name: '用户运营', value: 20 }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
