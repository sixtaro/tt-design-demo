
import React from 'react';
import Font from './index';

export default {
  title: '通用/Font 字体',
  component: Font,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'small'],
    },
    version: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `tt-design 字体与排版组件 - 版本 ${Font.version}`,
      },
    },
  },
};

export const 基础用法 = {
  render: (args) => (
    <div style={{ padding: '24px' }}>
      <Font {...args}>这是一段基础文本</Font>
    </div>
  ),
};

export const 所有变体 = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Font variant="h1">一级标题 32px / 48px</Font>
      <Font variant="h2">二级标题 24px / 36px</Font>
      <Font variant="h3">三级标题 18px / 28px</Font>
      <Font variant="h4">四级标题 16px / 24px</Font>
      <Font variant="body">正文内容 14px / 22px</Font>
      <Font variant="small">次级文字 12px / 18px</Font>
    </div>
  ),
};

export const 字阶展示 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>层级</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>字号</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>行高</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>示例</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>一级标题</td>
            <td style={{ padding: '12px' }}>32px</td>
            <td style={{ padding: '12px' }}>48px</td>
            <td style={{ padding: '12px' }}><Font variant="h1">文章标题</Font></td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>二级标题</td>
            <td style={{ padding: '12px' }}>24px</td>
            <td style={{ padding: '12px' }}>36px</td>
            <td style={{ padding: '12px' }}><Font variant="h2">章节标题</Font></td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>三级标题</td>
            <td style={{ padding: '12px' }}>18px</td>
            <td style={{ padding: '12px' }}>28px</td>
            <td style={{ padding: '12px' }}><Font variant="h3">系统名称</Font></td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>四级标题</td>
            <td style={{ padding: '12px' }}>16px</td>
            <td style={{ padding: '12px' }}>24px</td>
            <td style={{ padding: '12px' }}><Font variant="h4">分组标题</Font></td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px' }}>正文内容</td>
            <td style={{ padding: '12px' }}>14px</td>
            <td style={{ padding: '12px' }}>22px</td>
            <td style={{ padding: '12px' }}><Font variant="body">基础描述文字</Font></td>
          </tr>
          <tr>
            <td style={{ padding: '12px' }}>次级文字</td>
            <td style={{ padding: '12px' }}>12px</td>
            <td style={{ padding: '12px' }}>18px</td>
            <td style={{ padding: '12px' }}><Font variant="small">说明补充文字</Font></td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

