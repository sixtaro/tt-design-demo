import moment from 'moment';
import React, { useState } from 'react';
import DatePicker from './index';

export default {
  title: '数据录入/DatePicker 日期选择器',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 DatePicker 日期选择组件，版本：${DatePicker.version}`,
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位文本' },
    disabled: { control: 'boolean', description: '是否禁用' },
    format: { control: 'text', description: '日期格式' },
  },
};

export const 基础用法 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>默认状态</h4>
          <DatePicker placeholder="请选择日期" style={{ width: 260 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>自定义格式</h4>
          <DatePicker placeholder="请选择日期" style={{ width: 260 }} format="YYYY年MM月DD日" version={DatePicker.version} />
        </div>
      </div>
    </div>
  );
};

export const 不同类型 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>日期选择</h4>
          <DatePicker placeholder="请选择日期" style={{ width: 260 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>日期范围选择</h4>
          <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 360 }} version={DatePicker.version} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>月份选择</h4>
          <DatePicker.MonthPicker placeholder="请选择月份" style={{ width: 260 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>周选择</h4>
          <DatePicker.WeekPicker placeholder="请选择周" style={{ width: 260 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>年份选择</h4>
          <DatePicker.YearPicker placeholder="请选择年份" style={{ width: 260 }} version={DatePicker.version} />
        </div>
      </div>
    </div>
  );
};

export const 状态 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>禁用状态</h4>
          <DatePicker disabled placeholder="禁用状态" style={{ width: 260 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>范围禁用</h4>
          <DatePicker.RangePicker disabled placeholder={['开始日期', '结束日期']} style={{ width: 360 }} version={DatePicker.version} />
        </div>
      </div>
    </div>
  );
};

export const 多种选择类型 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingBottom: '420px' }}>
        <div style={{ minWidth: 280 }}>
          <h4>日期选择</h4>
          <DatePicker open={true} placeholder="请选择日期" style={{ width: 280 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 280 }}>
          <h4>周选择</h4>
          <DatePicker.WeekPicker open={true} placeholder="请选择周" style={{ width: 280 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 280 }}>
          <h4>月份选择</h4>
          <DatePicker.MonthPicker open={true} placeholder="请选择月份" style={{ width: 280 }} version={DatePicker.version} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingBottom: '420px' }}>
        <div style={{ minWidth: 280 }}>
          <h4>季度选择</h4>
          <DatePicker open={true} placeholder="请选择季度" style={{ width: 280 }} picker="quarter" version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 280 }}>
          <h4>年份选择</h4>
          <DatePicker.YearPicker open={true} placeholder="请选择年份" style={{ width: 280 }} version={DatePicker.version} />
        </div>
        <div style={{ minWidth: 560 }}>
          <h4>日期范围选择</h4>
          <DatePicker.RangePicker open={true} placeholder={['开始日期', '结束日期']} style={{ width: 560 }} version={DatePicker.version} />
        </div>
      </div>
    </div>
  );
};

export const 始终展开 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>下拉面板始终展开（用于样式预览）</h4>
        <div style={{ paddingBottom: '380px' }}>
          <DatePicker open={true} placeholder="请选择日期" style={{ width: 260 }} version={DatePicker.version} />
        </div>
      </div>
    </div>
  );
};

export const 快捷操作 = () => {
  return (
    <div style={{ paddingBottom: '420px' }}>
      <DatePicker
        open={true}
        showQuickActions
        placeholder="请选择日期"
        style={{ width: 280 }}
        version={DatePicker.version}
      />
    </div>
  );
};

export const 自定义快捷操作 = () => {
  return (
    <div style={{ paddingBottom: '420px' }}>
      <DatePicker
        open={true}
        quickActions={[
          { key: 'yesterday', label: '昨天', getValue: () => moment().subtract(1, 'day') },
          { key: 'today', label: '今天', getValue: () => moment() },
          { key: 'tomorrow', label: '明天', getValue: () => moment().add(1, 'day') },
        ]}
        value={moment().subtract(1, 'day')}
        placeholder="请选择日期"
        style={{ width: 280 }}
        version={DatePicker.version}
      />
    </div>
  );
};
