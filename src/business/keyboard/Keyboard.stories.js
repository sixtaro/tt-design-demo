import React from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Font from '@/components/Font';
import Keyboard from './keyboard';

const KeyboardDemo = ({ initialMode = 'en', initialValue = '', ...args }) => {
  const [value, setValue] = React.useState(initialValue);
  const [mode, setMode] = React.useState(initialMode);

  const helperText = React.useMemo(() => {
    return mode === 'zh' ? '当前为中文键盘，可切回 EN。' : '当前为英文键盘，点击“字”可切换中文键盘。';
  }, [mode]);

  return (
    <Card style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="small" onClick={() => setMode('en')}>
            英文键盘
          </Button>
          <Button size="small" onClick={() => setMode('zh')}>
            中文键盘
          </Button>
          <Button size="small" onClick={() => setValue('')}>
            清空
          </Button>
        </div>
        <Font>当前输入：{value || '空'}</Font>
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          {helperText}
        </Font>
        <Keyboard
          {...args}
          mode={mode}
          onSelected={key => {
            if (key === 'Backspace') {
              setValue(currentValue => currentValue.slice(0, -1));
              return;
            }

            if (key === '字') {
              setMode('zh');
              return;
            }

            if (key === 'EN') {
              setMode('en');
              return;
            }

            setValue(currentValue => `${currentValue}${key}`);
          }}
        />
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/Keyboard 虚拟键盘',
  component: Keyboard,
  parameters: {
    docs: {
      description: {
        component: '演示 Keyboard 的英文键盘、中文键盘切换和退格输入行为。',
      },
    },
  },
  argTypes: {
    onSelected: {
      action: 'selected',
    },
  },
};

export const 基础用法 = args => <KeyboardDemo {...args} />;
基础用法.args = {
  initialMode: 'en',
  initialValue: 'A8',
};

export const 中文模式 = args => <KeyboardDemo {...args} />;
中文模式.args = {
  initialMode: 'zh',
  initialValue: '粤B',
};
