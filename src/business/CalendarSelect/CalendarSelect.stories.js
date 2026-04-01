import React, { useState } from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import Button from '@/components/Button';
import CalendarSelect from './index';
import { componentVersions } from '@/utils/version-config';

const CalendarSelectDemo = ({ initialValue, ...args }) => {
  const [value, setValue] = useState(initialValue || []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CalendarSelect {...args} value={value} onChange={setValue} version={componentVersions.CalendarSelect} />
      <Card size="small">
        <Font variant="small">当前选中：{value.length > 0 ? value.join('、') : '无'}</Font>
      </Card>
    </div>
  );
};

export default {
  title: '业务组件/CalendarSelect 日历选择',
  component: CalendarSelect,
  parameters: {
    docs: {
      description: {
        component: '日历选择组件，支持间断选择多个日期，用于 Form 表单场景。',
      },
    },
  },
  argTypes: {
    width: { control: { type: 'number' }, description: '组件宽度' },
    disabled: { control: 'boolean', description: '是否禁用' },
    onChange: { action: 'change' },
  },
};

export const 基础用法 = args => <CalendarSelectDemo {...args} />;
基础用法.args = {
  width: 300,
};

export const 带初始值 = args => <CalendarSelectDemo {...args} initialValue={['2026-04-05', '2026-04-10', '2026-04-15']} />;
带初始值.args = {
  width: 300,
};

export const 禁用状态 = args => <CalendarSelectDemo {...args} disabled initialValue={['2026-04-01', '2026-04-02']} />;
禁用状态.args = {
  width: 300,
};

export const 不同宽度 = () => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
    <div>
      <Font style={{ marginBottom: 8, display: 'block' }}>宽度 280px</Font>
      <CalendarSelectDemo width={280} />
    </div>
    <div>
      <Font style={{ marginBottom: 8, display: 'block' }}>宽度 350px</Font>
      <CalendarSelectDemo width={350} />
    </div>
  </div>
);

export const 受控模式 = () => {
  const [value, setValue] = useState(['2026-04-08', '2026-04-18']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300 }}>
      <CalendarSelect value={value} onChange={setValue} width={300} version={componentVersions.CalendarSelect} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" onClick={() => setValue([])}>
          清空
        </Button>
        <Button size="small" onClick={() => setValue(['2026-04-01', '2026-04-15', '2026-04-30'])}>
          重置
        </Button>
      </div>
      <Card size="small">
        <Font variant="small">选中日期：{value.join('、')}</Font>
      </Card>
    </div>
  );
};
