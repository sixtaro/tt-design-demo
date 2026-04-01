import React, { useState } from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import Button from '@/components/Button';
import HourRangeSelect from './index';
import { componentVersions } from '@/utils/version-config';

const HourRangeSelectDemo = ({ initialValue, ...args }) => {
  const [value, setValue] = useState(initialValue || []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HourRangeSelect {...args} value={value} onChange={setValue} version={componentVersions.HourRangeSelect} />
      <Card size="small">
        <Font variant="small">
          当前选中：{value[0] || '未选择'} - {value[1] || '未选择'}
        </Font>
      </Card>
    </div>
  );
};

export default {
  title: '业务组件/HourRangeSelect 小时范围选择',
  component: HourRangeSelect,
  parameters: {
    docs: {
      description: {
        component: '小时范围选择组件，用于选择时间段的开始和结束小时，自动按时间顺序排列。',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean', description: '是否禁用' },
    onChange: { action: 'change' },
  },
};

export const 基础用法 = args => <HourRangeSelectDemo {...args} />;

export const 带初始值 = args => <HourRangeSelectDemo {...args} initialValue={['08:00', '18:00']} />;

export const 禁用状态 = args => <HourRangeSelectDemo {...args} disabled initialValue={['09:00', '17:00']} />;

export const 自动排序 = args => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <Font style={{ marginBottom: 8, display: 'block' }}>先选择结束时间，后选择开始时间，会自动排序</Font>
      <HourRangeSelectDemo {...args} />
    </div>
  </div>
);

export const 受控模式 = () => {
  const [value, setValue] = useState(['09:00', '18:00']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300 }}>
      <HourRangeSelect value={value} onChange={setValue} version={componentVersions.HourRangeSelect} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" onClick={() => setValue([])}>
          清空
        </Button>
        <Button size="small" onClick={() => setValue(['08:00', '20:00'])}>
          设置为 08:00 - 20:00
        </Button>
      </div>
      <Card size="small">
        <Font variant="small">
          选中范围：{value[0] || '未选择'} - {value[1] || '未选择'}
        </Font>
      </Card>
    </div>
  );
};
