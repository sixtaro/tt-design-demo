import React from 'react';
import QRCode from './index';

export default {
  title: '数据展示/QRCode 二维码',
  component: QRCode,
  parameters: {
    docs: {
      description: {
        component: `QRCode 二维码组件 - 版本: ${QRCode.version}\n\n基于 qrcode.react 封装，用于展示链接、文本和业务标识二维码。`
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: '二维码内容'
    },
    size: {
      control: 'number',
      description: '二维码尺寸'
    },
    level: {
      control: {
        type: 'select',
        options: ['L', 'M', 'Q', 'H']
      }
    },
    bgColor: {
      control: 'color'
    },
    fgColor: {
      control: 'color'
    },
    includeMargin: {
      control: 'boolean'
    },
    renderAs: {
      control: {
        type: 'select',
        options: ['canvas', 'svg']
      }
    },
    imageSettings: {
      control: false
    },
    version: {
      control: false
    }
  }
};

const Template = (args) => <QRCode {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  value: 'https://tt-design.demo/qrcode/basic',
  size: 160,
  version: QRCode.version
};

export const 自定义颜色 = Template.bind({});
自定义颜色.args = {
  value: 'TT-Design-QRCode',
  size: 180,
  fgColor: '#1677FF',
  bgColor: '#F5F9FF',
  includeMargin: true,
  version: QRCode.version
};

export const SVG输出 = Template.bind({});
SVG输出.args = {
  value: 'https://tt-design.demo/qrcode/svg',
  renderAs: 'svg',
  size: 168,
  version: QRCode.version
};
