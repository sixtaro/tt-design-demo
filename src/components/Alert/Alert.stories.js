import React from 'react';
import Alert from './index';

export default {
  title: '反馈/Alert 警告提示',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    closable: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    banner: { control: 'boolean' },
    message: { control: 'text' },
    description: { control: 'text' },
  },
};

const Template = (args) => <Alert {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  message: '成功提示的文案',
  type: 'success',
  showIcon: true,
};

export const 四种样式 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Alert message="成功提示的文案" type="success" showIcon />
    <Alert message="信息提示的文案" type="info" showIcon />
    <Alert message="警告提示的文案" type="warning" showIcon />
    <Alert message="错误提示的文案" type="error" showIcon />
  </div>
);

export const 可关闭的警告提示 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Alert message="成功提示的文案" type="success" closable showIcon />
    <Alert message="信息提示的文案" type="info" closable showIcon />
    <Alert message="警告提示的文案" type="warning" closable showIcon />
    <Alert message="错误提示的文案" type="error" closable showIcon />
  </div>
);

export const 含有辅助性文字介绍 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Alert
      message="成功提示的文案"
      description="成功提示的辅助性文字介绍"
      type="success"
      showIcon
    />
    <Alert
      message="信息提示的文案"
      description="信息提示的辅助性文字介绍"
      type="info"
      showIcon
    />
    <Alert
      message="警告提示的文案"
      description="警告提示的辅助性文字介绍"
      type="warning"
      showIcon
    />
    <Alert
      message="错误提示的文案"
      description="错误提示的辅助性文字介绍"
      type="error"
      showIcon
    />
  </div>
);

export const 横幅模式 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Alert message="成功提示的文案" type="success" banner showIcon />
    <Alert message="信息提示的文案" type="info" banner showIcon />
    <Alert message="警告提示的文案" type="warning" banner showIcon />
    <Alert message="错误提示的文案" type="error" banner showIcon />
  </div>
);
