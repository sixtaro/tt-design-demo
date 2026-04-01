import React, { useState } from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import Button from '@/components/Button';
import SecretInput from './index';
import { componentVersions } from '@/utils/version-config';

export default {
  title: '业务组件/SecretInput 秘密输入',
  component: SecretInput,
  parameters: {
    docs: {
      description: {
        component: '秘密输入组件，根据字符串长度自动生成掩码文本，支持输入框模式和组件包裹模式。',
      },
    },
  },
  argTypes: {
    hide: { control: 'boolean', description: '是否隐藏真实内容，显示掩码' },
    onChange: { action: 'change' },
    secretStyle: { control: 'object', description: '秘密输入框样式' },
  },
};

export const 不同长度演示 = () => {
  const [value1, setValue1] = useState('123');
  const [value2, setValue2] = useState('123456');
  const [value3, setValue3] = useState('123456789');
  const [value4, setValue4] = useState('12345678901');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 80 }}>长度 3：</span>
        <SecretInput value={value1} onChange={e => setValue1(e.target.value)} placeholder="输入3位数字" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 80 }}>长度 6：</span>
        <SecretInput value={value2} onChange={e => setValue2(e.target.value)} placeholder="输入6位数字" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 80 }}>长度 9：</span>
        <SecretInput value={value3} onChange={e => setValue3(e.target.value)} placeholder="输入9位数字" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 80 }}>长度 11：</span>
        <SecretInput value={value4} onChange={e => setValue4(e.target.value)} placeholder="输入11位数字" />
      </div>
    </div>
  );
};

export const 受控模式 = () => {
  const [value, setValue] = useState('13800138000');
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
      <SecretInput
        value={value}
        onChange={e => setValue(e.target.value)}
        hide={!showOriginal}
        placeholder="请输入内容"
        version={componentVersions.SecretInput}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" onClick={() => setShowOriginal(!showOriginal)}>
          {showOriginal ? '显示掩码' : '显示原始内容'}
        </Button>
        <Button size="small" onClick={() => setValue('')}>
          清空
        </Button>
        <Button size="small" onClick={() => setValue('test@example.com')}>
          填入邮箱
        </Button>
      </div>
      <Card size="small">
        <Font variant="small">输入值：{value}</Font>
      </Card>
    </div>
  );
};
