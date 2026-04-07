import React, { useState } from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import Segmented from './index';

export default {
  title: '数据展示/Segmented 分段控制器',
  component: Segmented,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Segmented 分段控制器组件，版本：${Segmented.version}`
      }
    }
  },
  argTypes: {
    block: { control: 'boolean', description: '将宽度调整为父元素宽度' },
    disabled: { control: 'boolean', description: '是否禁用' },
    value: { control: 'text', description: '当前选中的值' },
    defaultValue: { control: 'text', description: '默认选中的值' }
  }
};

// 基础用法
export const 基础用法 = () => (
  <Segmented
    options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
    defaultValue="Monthly"
  />
);

// 受控模式
export const 受控模式 = () => {
  const [value, setValue] = useState('Map');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Segmented
        options={['Map', 'Transit', 'Satellite']}
        value={value}
        onChange={setValue}
      />
      <span>当前选中: {value}</span>
    </div>
  );
};

// 不可用
export const 不可用 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Segmented options={['Map', 'Transit', 'Satellite']} disabled />
    <Segmented
      options={[
        'Daily',
        { label: 'Weekly', value: 'Weekly', disabled: true },
        'Monthly',
        { label: 'Quarterly', value: 'Quarterly', disabled: true },
        'Yearly',
      ]}
    />
  </div>
);

// 设置图标
export const 设置图标 = () => (
  <Segmented
    options={[
      {
        label: 'List',
        value: 'List',
        icon: <BarsOutlined />,
      },
      {
        label: 'Kanban',
        value: 'Kanban',
        icon: <AppstoreOutlined />,
      },
    ]}
  />
);

// 只设置图标
export const 只设置图标 = () => (
  <Segmented
    options={[
      {
        value: 'List',
        icon: <BarsOutlined />,
      },
      {
        value: 'Kanban',
        icon: <AppstoreOutlined />,
      },
    ]}
  />
);

// Block 分段选择器
export const Block分段选择器 = () => (
  <Segmented block options={[123, 456, 'longtext-longtext-longtext-longtext']} />
);

// 动态数据
export const 动态数据 = () => {
  const defaultOptions = ['Daily', 'Weekly', 'Monthly'];
  const [options, setOptions] = useState(defaultOptions);
  const [moreLoaded, setMoreLoaded] = useState(false);

  const handleLoadOptions = () => {
    setOptions([...defaultOptions, 'Quarterly', 'Yearly']);
    setMoreLoaded(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Segmented options={options} />
      <button
        type="button"
        disabled={moreLoaded}
        onClick={handleLoadOptions}
        style={{
          padding: '4px 16px',
          cursor: moreLoaded ? 'not-allowed' : 'pointer',
          opacity: moreLoaded ? 0.5 : 1,
        }}
      >
        {moreLoaded ? '已加载全部' : '加载更多选项'}
      </button>
    </div>
  );
};

// 自定义渲染
export const 自定义渲染 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Segmented
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Spring</div>
              <div style={{ fontSize: 12 }}>Jan-Mar</div>
            </div>
          ),
          value: 'spring',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Summer</div>
              <div style={{ fontSize: 12 }}>Apr-Jun</div>
            </div>
          ),
          value: 'summer',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Autumn</div>
              <div style={{ fontSize: 12 }}>Jul-Sept</div>
            </div>
          ),
          value: 'autumn',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Winter</div>
              <div style={{ fontSize: 12 }}>Oct-Dec</div>
            </div>
          ),
          value: 'winter',
        },
      ]}
    />
  </div>
);
