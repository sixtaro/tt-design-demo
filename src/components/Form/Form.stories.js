import React from 'react';
import Form from './index';
import Input from '../Input';
import InputNumber from '../InputNumber';
import Select from '../Select';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import Switch from '../Switch';
import Rate from '../Rate';
import Cascader from '../Cascader';
import TreeSelect from '../TreeSelect';
import Button from '../Button';

export default {
  title: '数据录入/Form 表单',
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
      <Form.Item label="用户名" name="username">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item label="密码" name="password">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export const 基础用法 = Template.bind({});
基础用法.args = {
  layout: 'vertical',
  version: Form.version
};

export const 水平布局 = Template.bind({});
水平布局.args = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  version: Form.version
};

export const 行内布局 = Template.bind({});
行内布局.args = {
  layout: 'inline',
  version: Form.version
};

const AllComponentsTemplate = (args) => {
  const [form] = Form.useForm();

  const selectOptions = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ];

  const cascaderOptions = [
    {
      value: 'zhejiang',
      label: '浙江省',
      children: [
        {
          value: 'hangzhou',
          label: '杭州市',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'binjiang', label: '滨江区' },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波市',
          children: [
            { value: 'yinzhou', label: '鄞州区' },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏省',
      children: [
        {
          value: 'nanjing',
          label: '南京市',
          children: [
            { value: 'xuanwu', label: '玄武区' },
          ],
        },
      ],
    },
  ];

  const treeData = [
    {
      title: '节点1',
      value: 'node1',
      key: 'node1',
      children: [
        { title: '节点1-1', value: 'node1-1', key: 'node1-1' },
        { title: '节点1-2', value: 'node1-2', key: 'node1-2' },
      ],
    },
    {
      title: '节点2',
      value: 'node2',
      key: 'node2',
      children: [
        { title: '节点2-1', value: 'node2-1', key: 'node2-1' },
      ],
    },
  ];

  const handleFinish = (values) => {
    console.log('表单提交:', values);
  };

  return (
    <Form
      {...args}
      form={form}
      initialValues={{
        username: '',
        password: '',
        textarea: '',
        search: '',
        number: 0,
        select: '',
        selectMultiple: [],
        checkbox: false,
        checkboxGroup: [],
        radio: '',
        date: null,
        dateRange: null,
        time: null,
        timeRange: null,
        switch: false,
        rate: 3,
        cascader: null,
        treeSelect: null,
      }}
      onFinish={handleFinish}
      style={{ maxWidth: 800, padding: 24 }}
    >
      <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item label="文本域" name="textarea">
        <Input.TextArea rows={4} placeholder="请输入内容" />
      </Form.Item>

      <Form.Item label="搜索框" name="search">
        <Input.Search placeholder="请输入搜索内容" />
      </Form.Item>

      <Form.Item label="数字输入框" name="number">
        <InputNumber placeholder="请输入数字" min={0} max={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="下拉选择" name="select">
        <Select placeholder="请选择" options={selectOptions} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="多选下拉" name="selectMultiple">
        <Select mode="multiple" placeholder="请选择" options={selectOptions} style={{ width: '100%' }} searchable showSelectAll />
      </Form.Item>

      <Form.Item label="复选框" name="checkbox" valuePropName="checked">
        <Checkbox>同意协议</Checkbox>
      </Form.Item>

      <Form.Item label="复选框组" name="checkboxGroup">
        <Checkbox.Group options={['选项A', '选项B', '选项C']} />
      </Form.Item>

      <Form.Item label="单选框" name="radio">
        <Radio.Group options={['单选A', '单选B', '单选C']} />
      </Form.Item>

      <Form.Item label="日期选择" name="date">
        <DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="日期范围" name="dateRange">
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="时间选择" name="time">
        <TimePicker placeholder="请选择时间" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="时间范围" name="timeRange">
        <TimePicker.RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="开关" name="switch" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="评分" name="rate">
        <Rate />
      </Form.Item>

      <Form.Item label="级联选择" name="cascader">
        <Cascader placeholder="请选择地区" options={cascaderOptions} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="树形选择" name="treeSelect">
        <TreeSelect placeholder="请选择节点" treeData={treeData} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: args.layout === 'horizontal' ? 6 : 0 }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          提交
        </Button>
        <Button onClick={() => form.resetFields()}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};

export const 完整组件示例 = AllComponentsTemplate.bind({});
完整组件示例.args = {
  layout: 'vertical',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  version: Form.version
};

export const 完整组件示例_水平布局 = AllComponentsTemplate.bind({});
完整组件示例_水平布局.args = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  version: Form.version
};
