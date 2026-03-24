import React from 'react';
import Chart from './index';

export default {
  title: '图表/桑基图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '桑基图 - 使用 sankey 类型'
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

export const 基础桑基图 = Template.bind({});
基础桑基图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础桑基图'
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        data: [
          { name: '页面访问' },
          { name: '产品详情' },
          { name: '加入购物车' },
          { name: '提交订单' },
          { name: '支付成功' }
        ],
        links: [
          { source: '页面访问', target: '产品详情', value: 100 },
          { source: '产品详情', target: '加入购物车', value: 80 },
          { source: '加入购物车', target: '提交订单', value: 60 },
          { source: '提交订单', target: '支付成功', value: 40 }
        ],
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        }
      }
    ]
  }
};
