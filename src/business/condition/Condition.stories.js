import React, { useState } from 'react';
import Condition from './condition';
import '@/utils';

const basicOptions = [
  {
    type: 'input',
    displayName: '关键词',
    conditionName: 'keyword',
    defaultValue: '新能源',
  },
  {
    type: 'custom',
    displayName: '状态',
    conditionName: 'status',
    defaultValue: 'all',
    items: [
      { text: '全部', value: 'all' },
      { text: '启用', value: 'enabled' },
      { text: '停用', value: 'disabled' },
    ],
  },
  {
    type: 'datetime',
    displayName: '统计时间',
    conditionName: 'dateRange',
    startTimeName: 'startTime',
    endTimeName: 'endTime',
    defaultValue: 'currentDay',
    datePeriods: ['currentDay', 'currentWeek', 'currentMonth'],
    allowClear: true,
  },
];

const advancedOptions = [
  {
    type: 'input',
    displayName: '车主姓名',
    conditionName: 'ownerName',
  },
  {
    type: 'day',
    displayName: '账期',
    conditionName: 'billingMonth',
    picker: 'month',
    defaultValue: 'currentMonth',
    datePeriods: ['currentMonth', 'lastMonth', 'currentYear'],
  },
  {
    type: 'cascader',
    displayName: '区域',
    conditionName: 'region',
    items: [
      {
        label: '湖北省',
        value: 'hubei',
        children: [
          { label: '武汉市', value: 'wuhan' },
          { label: '宜昌市', value: 'yichang' },
        ],
      },
      {
        label: '广东省',
        value: 'guangdong',
        children: [
          { label: '深圳市', value: 'shenzhen' },
          { label: '广州市', value: 'guangzhou' },
        ],
      },
    ],
    defaultValue: ['hubei', 'wuhan'],
  },
  {
    type: 'custom',
    displayName: '业务线',
    conditionName: 'bizLine',
    defaultValue: 'park',
    items: [
      { text: '停车', value: 'park' },
      { text: '门禁', value: 'access' },
      { text: '充电', value: 'charge' },
    ],
  },
];

const ConditionDemo = ({ options, ...args }) => {
  const [value, setValue] = useState({});

  return (
    <div style={{ padding: 24 }}>
      <Condition {...args} options={options} onChange={nextValue => setValue(nextValue)} />
      <pre
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 6,
          background: '#f7f8fa',
          fontSize: 12,
          overflow: 'auto',
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

export default {
  title: '业务组件/Condition 条件筛选',
  component: Condition,
  parameters: {
    docs: {
      description: {
        component: '使用静态 options 演示 Condition 的输入、快捷时间和级联筛选能力，不依赖 source.api。',
      },
    },
  },
  argTypes: {
    options: {
      control: false,
    },
    onChange: {
      action: 'change',
    },
  },
};

export const 基础用法 = args => <ConditionDemo {...args} options={basicOptions} />;
基础用法.args = {
  layout: 'default',
};

export const 更多布局 = args => <ConditionDemo {...args} options={advancedOptions} />;
更多布局.args = {
  layout: 'more',
};
