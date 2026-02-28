import React from 'react';
import Form from './index';
import Input from '../Input';
import Button from '../Button';

export default {
  title: '数据录入/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component: `Form 组件 - 版本: ${Form.version}`
      }
    }
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    }
  }
};

const Template = (args) => {
  const [form] = Form.useForm();
  return (
    <Form {...args} form={form} style={{ maxWidth: 600 }}>
      <Form.Item label="Username" name="username">
        <Input placeholder="Please input username" />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input.Password placeholder="Please input password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  layout: 'vertical',
  version: Form.version
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  version: Form.version
};

export const Inline = Template.bind({});
Inline.args = {
  layout: 'inline',
  version: Form.version
};
