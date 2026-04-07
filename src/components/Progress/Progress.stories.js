import React from 'react';
import Progress from './index';

export default {
  title: '反馈/Progress 进度条',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    percent: { control: { type: 'number', min: 0, max: 100 } },
    type: {
      control: 'select',
      options: ['line', 'circle', 'dashboard'],
    },
    status: {
      control: 'select',
      options: ['success', 'exception', 'normal', 'active'],
    },
    showInfo: { control: 'boolean' },
    strokeWidth: { control: 'number' },
  },
};

const Template = (args) => <Progress {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  percent: 30,
};

export const 进度条状态 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} status="success" />
  </div>
);

export const 圆形进度条 = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Progress type="circle" percent={75} />
    <Progress type="circle" percent={100} status="success" />
    <Progress type="circle" percent={70} status="exception" />
  </div>
);

export const 仪表盘 = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Progress type="dashboard" percent={75} />
    <Progress type="dashboard" percent={100} status="success" />
  </div>
);

export const 动态展示 = () => {
  const [percent, setPercent] = React.useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Progress percent={percent} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setPercent((prev) => Math.min(prev + 10, 100))}
          style={{ padding: '4px 12px', cursor: 'pointer' }}
        >
          增加
        </button>
        <button
          onClick={() => setPercent((prev) => Math.max(prev - 10, 0))}
          style={{ padding: '4px 12px', cursor: 'pointer' }}
        >
          减少
        </button>
      </div>
    </div>
  );
};
