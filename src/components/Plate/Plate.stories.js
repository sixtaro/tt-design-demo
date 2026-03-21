import React, { useState } from 'react';
import Plate from './index';

export default {
  title: '数据录入/Plate 车牌输入',
  component: Plate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `新版车牌输入组件 - 版本: ${Plate.version}`,
      },
    },
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['search', 'input', 'single-input'],
      },
      description: '组件类型',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    copy: {
      control: 'boolean',
      description: '是否显示复制按钮',
    },
    popoverToTop: {
      control: 'boolean',
      description: '悬浮键盘是否置顶',
    },
    value: {
      control: 'text',
      description: '车牌值',
    },
    plateColorValueFromOutside: {
      control: {
        type: 'select',
        options: [-2, -1, 0, 1, 2, 3, 4, 5, 6],
      },
      description: '外部传入车牌颜色：-2-非黄牌 -1-未知 0/4-黄色 1-蓝色 2-白色 3-黑色 5-绿色 6-黄绿色',
    },
  },
};

const Template = args => {
  const [value, setValue] = useState(args.value || '');
  return <Plate {...args} value={value} onChange={setValue} />;
};

export const 基础用法 = Template.bind({});
基础用法.args = {
  type: 'input',
  value: '',
  version: Plate.version,
};

export const 搜索模式 = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>搜索模式：输入8位时显示为绿色</div>
        <Plate type="search" value={value} onChange={setValue} />
      </div>
    );
  },
};

export const 录入模式 = {
  render: () => {
    const [value, setValue] = useState('');
    const [colorOptions, setColorOptions] = useState([]);
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>录入模式：可根据输入内容自动识别车牌颜色</div>
        <Plate type="input" value={value} onChange={setValue} onColorOptionsChange={setColorOptions} />
        {colorOptions.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--tt-text-secondary)' }}>可选颜色值：{colorOptions.join(', ')}</div>
        )}
      </div>
    );
  },
};

export const 单输入模式 = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>单输入模式：无外部颜色控件</div>
        <Plate type="single-input" value={value} onChange={setValue} />
      </div>
    );
  },
};

export const 预设车牌值 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>无onChange事件，仅展示预设车牌值</div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>蓝牌（普通燃油车）</div>
        <Plate type="search" value="京A12345" />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>绿牌（新能源）</div>
        <Plate type="search" value="京AD12345" />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>黄牌</div>
        <Plate type="input" value="京A12345" plateColorValueFromOutside={0} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>白牌</div>
        <Plate type="input" value="京A12345" plateColorValueFromOutside={2} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>黑牌（港澳）</div>
        <Plate type="input" value="粤Z1234港" plateColorValueFromOutside={3} />
      </div>
    </div>
  ),
};

export const 虚拟车牌 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>虚拟车牌（U/电开头，支持13位）</div>
      <div style={{ marginBottom: '16px' }}>
        <Plate type="search" value="U123456789012" />
      </div>
      <div>
        <Plate type="search" value="电123456789012" />
      </div>
    </div>
  ),
};

export const 禁用状态 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>禁用状态（有值）</div>
        <Plate disabled type="search" value="京A12345" />
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--tt-text-body)' }}>禁用状态（无值）</div>
        <Plate disabled type="search" />
      </div>
    </div>
  ),
};

export const 隐藏复制功能 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>不显示复制按钮</div>
      <Plate copy={false} type="search" value="京A12345" />
    </div>
  ),
};

export const 隐藏省份选项 = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--tt-text-body)' }}>隐藏部分省份选项（隐藏：京、津、沪、渝）</div>
      <Plate hideBrief={['京', '津', '沪', '渝']} type="search" />
    </div>
  ),
};
