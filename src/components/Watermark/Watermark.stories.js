import React from 'react';
import Watermark from './index';

const cardStyle = {
  minHeight: 220,
  padding: 24,
  borderRadius: 8,
  background: 'var(--tt-bg-white)',
  border: '1px solid var(--tt-border-color-light)',
  boxSizing: 'border-box',
};

export default {
  title: '反馈/Watermark 水印',
  component: Watermark,
  parameters: {
    docs: {
      description: {
        component: `Watermark 水印组件 - 版本: ${Watermark.version}\n\n参考 Ant Design 5 Watermark 行为，自定义实现文本水印覆盖效果。`
      }
    }
  },
  argTypes: {
    content: {
      control: 'text'
    },
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    rotate: {
      control: 'number'
    },
    zIndex: {
      control: 'number'
    },
    version: {
      control: false
    }
  }
};

export const 基础用法 = () => (
  <Watermark content="TT Design" version={Watermark.version}>
    <div style={cardStyle}>
      这是一个带水印的内容区域。
    </div>
  </Watermark>
);

export const 多行水印 = () => (
  <Watermark content={['TT Design', '内部资料']} version={Watermark.version}>
    <div style={cardStyle}>
      多行水印适合在内部系统、审批单、敏感信息展示页中使用。
    </div>
  </Watermark>
);

export const 自定义样式 = () => (
  <Watermark
    content="运营中心"
    rotate={-18}
    gap={[80, 80]}
    font={{
      color: 'rgba(22, 119, 255, 0.15)',
      fontSize: 18,
      fontWeight: 500,
      fontFamily: 'sans-serif',
    }}
    version={Watermark.version}
  >
    <div style={cardStyle}>
      支持自定义颜色、字号、字重、旋转角度和间距。
    </div>
  </Watermark>
);
