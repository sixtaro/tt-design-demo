import React from 'react';
import Result from './index';
import Button from '../Button';

export default {
  title: '反馈/Result 结果',
  component: Result,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', '404', '403', '500'],
    },
    title: { control: 'text' },
    subTitle: { control: 'text' },
  },
};

const Template = (args) => <Result {...args} />;

export const 成功 = Template.bind({});
成功.args = {
  status: 'success',
  title: '成功提交',
  subTitle: '请等待审核，预计需要1-3个工作日。',
  extra: [
    <Button type="primary" key="console">返回首页</Button>,
    <Button key="buy">再创建一个</Button>,
  ],
};

export const 信息 = () => (
  <Result
    status="info"
    title="信息提示"
    subTitle="这是一条信息性提示的结果页面。"
  />
);

export const 警告 = () => (
  <Result
    status="warning"
    title="警告提示"
    subTitle="请仔细检查您的操作。"
    extra={[
      <Button type="primary" key="retry">重新操作</Button>,
    ]}
  />
);

export const 错误 = () => (
  <Result
    status="error"
    title="提交失败"
    subTitle="请检查并修改以下信息后重新提交。"
    extra={[
      <Button type="primary" key="console">返回修改</Button>,
    ]}
  />
);

export const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，您访问的页面不存在。"
    extra={[
      <Button type="primary" key="home">返回首页</Button>,
    ]}
  />
);

export const 无权限 = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，您没有权限访问此页面。"
    extra={[
      <Button type="primary" key="home">返回首页</Button>,
    ]}
  />
);

export const 服务器错误 = () => (
  <Result
    status="500"
    title="500"
    subTitle="抱歉，服务器出错了。"
    extra={[
      <Button type="primary" key="home">返回首页</Button>,
    ]}
  />
);
