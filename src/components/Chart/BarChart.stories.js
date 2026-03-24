import React from 'react';
import Chart from './index';

export default {
  title: '图表/柱状图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '柱状图 - 使用 bar 类型'
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

export const 基础柱状图 = Template.bind({});
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

export const 横向柱状图 = Template.bind({});
横向柱状图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '横向柱状图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
};

export const 堆叠柱状图 = Template.bind({});
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

export const 双向柱状图 = Template.bind({});
双向柱状图.args = {
  theme: 'geekBlue',
  option: {
    title: {
      text: '双向柱状图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Income', 'Expense']
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
        name: 'Income',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130]
      },
      {
        name: 'Expense',
        type: 'bar',
        data: [-100, -150, -120, -60, -50, -90, -100]
      }
    ]
  }
};
