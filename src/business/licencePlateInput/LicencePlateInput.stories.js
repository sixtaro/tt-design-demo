import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import { Storage } from '@/utils';
import '@/utils';
import LicencePlateInput from './licencePlateInput';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  Storage.set('userGroup', { provinceID: 42 });
};

ensureBusinessStoryEnv();

const LicencePlateInputDemo = ({ initialValue = '', onChange, onBlur, ...args }) => {
  const [value, setValue] = React.useState(initialValue);

  return (
    <Card style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        <LicencePlateInput
          {...args}
          value={value}
          onChange={nextValue => {
            setValue(nextValue);
            onChange?.(nextValue);
          }}
          onBlur={(nextValue, event) => {
            onBlur?.(nextValue, event);
          }}
        />
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前值：{value || '空'}
        </Font>
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/LicencePlateInput 车牌输入',
  component: LicencePlateInput,
  parameters: {
    docs: {
      description: {
        component: '演示 LicencePlateInput 的车牌录入、自动补全与特殊号牌模式。',
      },
    },
  },
  argTypes: {
    onChange: {
      action: 'change',
    },
    onBlur: {
      action: 'blur',
    },
  },
};

export const 基础输入 = args => <LicencePlateInputDemo {...args} />;
基础输入.args = {
  initialValue: '粤B12345',
};

export const 自动补全 = args => <LicencePlateInputDemo {...args} />;
自动补全.args = {
  initialValue: '京A12345',
  autoCompleteOptions: [
    { value: 'A12345' },
    { value: 'A88888' },
    { value: 'A99999' },
  ],
};

export const 特殊号牌 = args => <LicencePlateInputDemo {...args} />;
特殊号牌.args = {
  initialValue: '无牌001',
  canInputKeys: ['无牌'],
  hideBrief: ['未登记'],
};
