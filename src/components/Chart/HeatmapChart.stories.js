import React from 'react';
import Chart from './index';

export default {
  title: '图表/热力图',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: '热力图 - 使用 heatmap 类型'
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

const heatmapData = [];
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 7; j++) {
    heatmapData.push([j, i, Math.floor(Math.random() * 100)]);
  }
}

export const 基础热力图 = Template.bind({});
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
        data: heatmapData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
};
