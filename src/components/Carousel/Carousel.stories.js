import React from 'react';
import Carousel from './index';

export default {
  title: '数据展示/Carousel 走马灯',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Carousel 走马灯组件，版本：${Carousel.version}`
      }
    }
  },
  argTypes: {
    autoplay: { control: 'boolean', description: '自动切换' },
    dotPosition: { control: { type: 'select', options: ['top', 'bottom', 'left', 'right'] }, description: '指示点位置' },
    effect: { control: { type: 'select', options: ['scrollx', 'fade'] }, description: '切换效果' },
  }
};

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

// 基础用法
export const 基础用法 = () => (
  <Carousel>
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

// 自动切换
export const 自动切换 = () => (
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

// 渐显
export const 渐显 = () => (
  <Carousel effect="fade">
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);
