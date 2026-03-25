import React from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Font from '@/components/Font';
import CopyIcon from './index';

const CopyIconDemo = ({ text, time, ...args }) => {
  const [status, setStatus] = React.useState('点击图标复制');

  return (
    <Card style={{ maxWidth: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Font>待复制内容：{text}</Font>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CopyIcon
            {...args}
            text={text}
            time={time}
            onDone={result => setStatus(result ? '复制成功' : '复制失败')}
            onRestore={() => setStatus('点击图标复制')}
          />
          <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
            {status}
          </Font>
        </div>
        <Button size="small" onClick={() => navigator?.clipboard?.writeText?.(text)}>
          使用浏览器剪贴板复制
        </Button>
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/CopyIcon 复制图标',
  component: CopyIcon,
  parameters: {
    docs: {
      description: {
        component: '演示 CopyIcon 的复制成功态与自动恢复行为。',
      },
    },
  },
  argTypes: {
    onDone: {
      action: 'done',
    },
    onRestore: {
      action: 'restore',
    },
  },
};

export const 基础用法 = args => <CopyIconDemo {...args} />;
基础用法.args = {
  text: 'TT-DESIGN-STORYBOOK',
  time: 1500,
};

export const 长文本复制 = args => <CopyIconDemo {...args} />;
长文本复制.args = {
  text: '湖北省武汉市洪山区未来城智慧停车项目-长文本演示',
  time: 2000,
};
