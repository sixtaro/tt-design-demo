import React, { useState } from 'react';
import CardSelect from './index';

export default {
  title: '数据录入/CardSelect 卡片单复选',
  component: CardSelect,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['corner', 'border', 'radio'],
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
    },
    mode: {
      control: 'select',
      options: ['multiple', 'single'],
    },
  },
};

const mockData = [
  { key: '1', title: '选项 1', description: '第一个选项的描述信息' },
  { key: '2', title: '选项 2', description: '第二个选项的描述信息' },
  { key: '3', title: '选项 3', description: '第三个选项的描述信息' },
  { key: '4', title: '选项 4', description: '第四个选项的描述信息' },
];

export const 基本用法 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['1']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    onChange={(keys, action, key) => {
      console.log('选中状态变化:', { keys, action, key });
    }}
    type="corner"
  />
);

// 受控模式
export const 受控模式 = () => {
  const [value, setValue] = useState(['1']);

  return (
    <CardSelect
      data={mockData}
      value={value}
      renderItem={record => (
        <>
          <div className="tt-card-select-title">{record.title}</div>
          {record.description && <div className="tt-card-select-description">{record.description}</div>}
        </>
      )}
      onChange={keys => {
        setValue(keys);
        console.log('选中状态:', keys);
      }}
      type="corner"
      position="right"
    />
  );
};

// 边框类型
export const 边框类型 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['2']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    type="border"
  />
);

// 侧边 Radio 类型（左侧）
export const 侧边Radio类型 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['1']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    type="radio"
    position="left"
  />
);

// 禁用状态
export const 禁用状态 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['1']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    disabled
    type="corner"
  />
);

// 网格布局
export const 网格布局 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['1']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    type="corner"
    grid
  />
);

// 多选模式
export const 多选模式 = () => (
  <CardSelect
    data={mockData}
    defaultValue={['1', '3']}
    renderItem={record => (
      <>
        <div className="tt-card-select-title">{record.title}</div>
        {record.description && <div className="tt-card-select-description">{record.description}</div>}
      </>
    )}
    mode="multiple"
    onChange={(value, action, key) => {
      console.log('多选模式选中变化:', { value, action, key });
    }}
    type="border"
  />
);
