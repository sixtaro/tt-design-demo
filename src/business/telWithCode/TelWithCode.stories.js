import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import TelWithCode from './index';

const TelWithCodeDemo = ({ initialValue, ...args }) => {
  const [value, setValue] = React.useState(initialValue);

  return (
    <Card style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        <TelWithCode {...args} value={value} onChange={setValue} />
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前值：{value || '空'}
        </Font>
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/TelWithCode 区号电话',
  component: TelWithCode,
  parameters: {
    docs: {
      description: {
        component: '演示 TelWithCode 的受控输入与区号切换行为。',
      },
    },
  },
  argTypes: {
    onChange: {
      action: 'change',
    },
  },
};

export const 基础受控 = args => <TelWithCodeDemo {...args} />;
基础受控.args = {
  initialValue: '13800138000',
  placeholder: '请输入手机号',
};

export const 香港号码 = args => <TelWithCodeDemo {...args} />;
香港号码.args = {
  initialValue: '85298765432',
  placeholder: '请输入手机号',
};
