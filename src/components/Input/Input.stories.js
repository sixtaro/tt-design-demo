import React from 'react';
import { UserOutlined, LockOutlined, SearchOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Input from './index';
import Button from '../Button';

export default {
  title: '数据录入/Input 输入框',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `Input 输入框组件 - 版本: ${Input.version}`
      }
    }
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'password', 'number', 'email']
      }
    },
    placeholder: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    defaultValue: {
      control: 'text'
    },
    version: {
      control: 'text'
    }
  }
};

export const 基础用法 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Input placeholder="请输入内容" version={Input.version} />
    <Input placeholder="请输入内容" defaultValue="默认内容" version={Input.version} />
    <Input placeholder="禁用状态" defaultValue="不可编辑" disabled version={Input.version} />
    <Input placeholder="请输入数字" type="number" version={Input.version} />
    <Input placeholder="请输入邮箱地址" type="email" version={Input.version} />
  </div>
);

export const 带图标的输入框 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Input placeholder="请输入用户名" prefix={<UserOutlined />} version={Input.version} />
    <Input placeholder="请输入密码" prefix={<LockOutlined />} type="password" version={Input.version} />
  </div>
);

export const 带前缀和后缀 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Input placeholder="请输入金额" prefix="¥" suffix="元" version={Input.version} />
    <Input placeholder="请输入网址" prefix="https://" suffix=".com" version={Input.version} />
  </div>
);

export const 带Addon的输入框 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Input
      placeholder="请输入内容"
      addonBefore="http://"
      version={Input.version}
    />
    <Input
      placeholder="请输入内容"
      addonAfter=".com"
      version={Input.version}
    />
    <Input
      placeholder="请输入域名"
      addonBefore="https://"
      addonAfter=".cn"
      version={Input.version}
    />
    <Input
      placeholder="请输入搜索内容"
      addonBefore={<SearchOutlined />}
      version={Input.version}
    />
    <Input
      placeholder="请输入验证码"
      addonAfter={<Button size="small">获取验证码</Button>}
      version={Input.version}
    />
  </div>
);

export const 密码输入框 = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <Input.Password
      placeholder="请输入密码"
      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
      version={Input.version}
    />
  );
};

export const 文本域 = () => (
  <Input.TextArea
    placeholder="请输入详细描述"
    rows={4}
    version={Input.version}
  />
);

export const 搜索输入框 = () => (
  <Input.Search
    placeholder="请输入搜索内容"
    allowClear
    enterButton="搜索"
    size="large"
    version={Input.version}
  />
);
