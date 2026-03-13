import React from 'react';
import { UserOutlined, LockOutlined, SearchOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Input from './index';

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

const Template = (args) => <Input {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  placeholder: '请输入内容',
  version: Input.version
};

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

export const 带搜索图标的输入框 = () => (
  <Input.Search
    placeholder="请输入搜索内容"
    allowClear
    enterButton="搜索"
    size="large"
    version={Input.version}
  />
);

export const 文本域 = () => (
  <Input.TextArea
    placeholder="请输入详细描述"
    rows={4}
    version={Input.version}
  />
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

export const 禁用状态 = Template.bind({});
禁用状态.args = {
  disabled: true,
  placeholder: '禁用状态',
  defaultValue: '不可编辑',
  version: Input.version
};

export const 带默认值 = Template.bind({});
带默认值.args = {
  defaultValue: '默认内容',
  placeholder: '请输入内容',
  version: Input.version
};

export const 数字输入 = Template.bind({});
数字输入.args = {
  type: 'number',
  placeholder: '请输入数字',
  version: Input.version
};

export const 邮箱输入 = Template.bind({});
邮箱输入.args = {
  type: 'email',
  placeholder: '请输入邮箱地址',
  version: Input.version
};
