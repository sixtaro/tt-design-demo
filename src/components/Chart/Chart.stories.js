import React from 'react';
import Chart from './index';

export default {
  title: '图表/折线图',
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

// ========== 折线图 ==========

const LineTemplate = (args) => (
  <div style={{ height: '400px' }}>
    <Chart {...args} />
  </div>
);

export const 基础折线图 = LineTemplate.bind({});
基础折线图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础折线图'
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

export const 平滑折线图 = LineTemplate.bind({});
平滑折线图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '平滑折线图'
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
        type: 'line',
        smooth: true
      }
    ]
  }
};

export const 区域折线图 = LineTemplate.bind({});
区域折线图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '区域折线图'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        areaStyle: {}
      }
    ]
  }
};

export const 多系列折线图 = LineTemplate.bind({});
多系列折线图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '多系列折线图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
};

// ========== 柱状图 ==========

export const 基础柱状图 = LineTemplate.bind({});
Object.defineProperty(基础柱状图, 'storyName', { value: '基础柱状图' });
Object.defineProperty(基础柱状图, 'title', { value: '图表/柱状图' });
基础柱状图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础柱状图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
};

export const 堆叠柱状图 = LineTemplate.bind({});
Object.defineProperty(堆叠柱状图, 'storyName', { value: '堆叠柱状图' });
Object.defineProperty(堆叠柱状图, 'title', { value: '图表/柱状图' });
堆叠柱状图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '堆叠柱状图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['A', 'B', 'C']
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
        name: 'A',
        type: 'bar',
        stack: 'total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'B',
        type: 'bar',
        stack: 'total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'C',
        type: 'bar',
        stack: 'total',
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ]
  }
};

// ========== 饼图 ==========

export const 基础饼图 = LineTemplate.bind({});
Object.defineProperty(基础饼图, 'storyName', { value: '基础饼图' });
Object.defineProperty(基础饼图, 'title', { value: '图表/饼图' });
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
        ]
      }
    ]
  }
};

export const 环形图 = LineTemplate.bind({});
Object.defineProperty(环形图, 'storyName', { value: '环形图' });
Object.defineProperty(环形图, 'title', { value: '图表/饼图' });
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

// ========== 散点图 ==========

export const 基础散点图 = LineTemplate.bind({});
Object.defineProperty(基础散点图, 'storyName', { value: '基础散点图' });
Object.defineProperty(基础散点图, 'title', { value: '图表/散点图' });
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

// ========== 雷达图 ==========

export const 基础雷达图 = LineTemplate.bind({});
Object.defineProperty(基础雷达图, 'storyName', { value: '基础雷达图' });
Object.defineProperty(基础雷达图, 'title', { value: '图表/雷达图' });
基础雷达图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础雷达图'
    },
    tooltip: {},
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  }
};

// ========== 漏斗图 ==========

export const 基础漏斗图 = LineTemplate.bind({});
Object.defineProperty(基础漏斗图, 'storyName', { value: '基础漏斗图' });
Object.defineProperty(基础漏斗图, 'title', { value: '图表/漏斗图' });
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

// ========== 仪表盘 ==========

export const 基础仪表盘 = LineTemplate.bind({});
Object.defineProperty(基础仪表盘, 'storyName', { value: '基础仪表盘' });
Object.defineProperty(基础仪表盘, 'title', { value: '图表/仪表盘' });
基础仪表盘.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础仪表盘'
    },
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 18
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 40,
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  }
};

// ========== 热力图 ==========

export const 基础热力图 = LineTemplate.bind({});
Object.defineProperty(基础热力图, 'storyName', { value: '基础热力图' });
Object.defineProperty(基础热力图, 'title', { value: '图表/热力图' });

const heatmapData = [];
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 7; j++) {
    heatmapData.push([j, i, Math.floor(Math.random() * 100)]);
  }
}

基础热力图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '基础热力图'
    },
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%'
    },
    series: [
      {
        type: 'heatmap',
        data: heatmapData
      }
    ]
  }
};

// ========== 树图 ==========

export const 基础树图 = LineTemplate.bind({});
Object.defineProperty(基础树图, 'storyName', { value: '基础树图' });
Object.defineProperty(基础树图, 'title', { value: '图表/树图' });
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
        ]
      }
    ]
  }
};

export const 矩形树图 = LineTemplate.bind({});
Object.defineProperty(矩形树图, 'storyName', { value: '矩形树图' });
Object.defineProperty(矩形树图, 'title', { value: '图表/树图' });
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

// ========== 桑基图 ==========

export const 基础桑基图 = LineTemplate.bind({});
Object.defineProperty(基础桑基图, 'storyName', { value: '基础桑基图' });
Object.defineProperty(基础桑基图, 'title', { value: '图表/桑基图' });
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
        ]
      }
    ]
  }
};
