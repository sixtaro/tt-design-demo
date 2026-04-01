import React, { useState } from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import Button from '@/components/Button';
import MaskedInput from './index';
import { defaultMethod as secretDefaultMethod } from '../SecretInput';
import { componentVersions } from '@/utils/version-config';

const MaskedInputDemo = ({ initialValue, ...args }) => {
  const [value, setValue] = useState(initialValue || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MaskedInput {...args} value={value} onChange={e => setValue(e.target.value)} version={componentVersions.MaskedInput} />
      <Card size="small">
        <Font variant="small">当前值：{value}</Font>
      </Card>
    </div>
  );
};

export default {
  title: '业务组件/MaskedInput 掩码输入',
  component: MaskedInput,
  parameters: {
    docs: {
      description: {
        component: '掩码输入组件，支持自定义掩码方法，聚焦时显示完整内容，失焦或点击眼睛图标时显示掩码内容。',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean', description: '是否禁用' },
    onChange: { action: 'change' },
  },
};

export const 基础用法 = args => <MaskedInputDemo {...args} />;
基础用法.args = {
  placeholder: '请输入内容',
};

export const 使用SecretInput掩码 = args => <MaskedInputDemo {...args} method={secretDefaultMethod} />;
使用SecretInput掩码.args = {
  placeholder: '使用SecretInput的掩码规则',
};

export const 自定义掩码 = args => {
  // 自定义掩码方法：只显示前2位
  const customMethod = str => {
    const len = str.length;
    if (len <= 2) return str;
    return `${str.substring(0, 2)}${'*'.repeat(len - 2)}`;
  };
  return <MaskedInputDemo {...args} method={customMethod} />;
};
自定义掩码.args = {
  placeholder: '自定义掩码（只显示前2位）',
};

export const 带初始值 = args => <MaskedInputDemo {...args} initialValue="13800138000" />;
带初始值.args = {
  placeholder: '请输入手机号',
};

export const 禁用状态 = args => <MaskedInputDemo {...args} initialValue="已禁用的内容" />;
禁用状态.args = {
  placeholder: '禁用状态',
  disabled: true,
};

export const 受控模式 = () => {
  const [value, setValue] = useState('sensitive data');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
      <MaskedInput
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="请输入敏感信息"
        version={componentVersions.MaskedInput}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" onClick={() => setValue('')}>
          清空
        </Button>
        <Button size="small" onClick={() => setValue('password123')}>
          填入密码
        </Button>
        <Button size="small" onClick={() => setValue('user@company.com')}>
          填入邮箱
        </Button>
      </div>
      <Card size="small">
        <Font variant="small">
          输入值：{value}
        </Font>
      </Card>
    </div>
  );
};