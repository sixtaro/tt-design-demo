
import React from 'react';
import Color from './index';
import { colorPalette, themeColorNames } from './color-data';

export default {
  title: '通用/Color 颜色',
  component: Color,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    version: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `tt-design 颜色展示组件 - 版本 ${Color.version}`,
      },
    },
  },
};

export const 基础用法 = {
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <Color {...args} name="极客蓝" hex="#3388FF" />
    </div>
  ),
};

export const 主题色系 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {Object.keys(themeColorNames).map((prefix) => (
          <div key={prefix} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: 500, color: '#223355', fontSize: '14px' }}>{themeColorNames[prefix]}</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {colorPalette[prefix].map((hex, index) => (
                <Color key={index} name={`${index + 1}`} hex={hex} size="small" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

const neutralColors = [
  { name: 'Grey-9', hex: '#000000' },
  { name: 'Grey-8', hex: '#081126' },
  { name: 'Grey-7', hex: '#223355' },
  { name: 'Grey-6', hex: '#6B7A99' },
  { name: 'Grey-5', hex: '#A8B4C8' },
  { name: 'Grey-4', hex: '#CED4E0' },
  { name: 'Grey-3', hex: '#DDE1EB' },
  { name: 'Grey-2', hex: '#E9ECF2' },
  { name: 'Grey-1', hex: '#F5F7FA' },
  { name: 'Grey-0', hex: '#FFFFFF' },
];

export const 中性色系 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {neutralColors.map((color) => (
          <Color key={color.name} name={color.name} hex={color.hex} />
        ))}
      </div>
    </div>
  ),
};

const semanticColors = [
  { name: '主标题', variable: '@tt-title-main', hex: '#081126' },
  { name: '链接', variable: '@tt-link', hex: '#3388FF' },
  { name: '正文', variable: '@tt-text-main', hex: '#223355' },
  { name: '辅助文字', variable: '@tt-text-secondary', hex: '#6B7A99' },
  { name: '危险', variable: '@tt-status-error', hex: '#FF4433' },
  { name: '警告', variable: '@tt-status-warning', hex: '#FFAD14' },
  { name: '成功', variable: '@tt-status-success', hex: '#5CE0B6' },
];

export const 语义化颜色 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {semanticColors.map((color) => (
          <div key={color.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Color name={color.name} hex={color.hex} />
            <div style={{ fontSize: '12px', color: '#6B7A99', fontFamily: 'monospace' }}>{color.variable}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

