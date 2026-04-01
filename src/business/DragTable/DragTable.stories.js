import React, { useState } from 'react';
import DragTable from './index';

export default {
  title: '业务组件/DragTable 可拖拽表格',
  component: DragTable,
  parameters: {
    docs: {
      description: {
        component: `可拖拽排序的表格组件，支持通过拖拽行来改变数据顺序 - 版本: ${DragTable.version}`,
      },
    },
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性',
    },
    onChange: {
      action: 'change',
      description: '数据顺序变化时的回调',
    },
    rowKey: {
      control: 'text',
      description: '行数据的 key',
    },
    tableProps: {
      control: false,
      description: '传递给 Ant Design Table 组件的属性',
    },
  },
};

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
];

const initialDataSource = [
  {
    key: '1',
    name: '张三',
    age: 28,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 32,
    address: '上海市浦东新区',
  },
  {
    key: '3',
    name: '王五',
    age: 25,
    address: '广州市天河区',
  },
  {
    key: '4',
    name: '赵六',
    age: 35,
    address: '深圳市南山区',
  },
  {
    key: '5',
    name: '孙七',
    age: 29,
    address: '杭州市西湖区',
  },
];

const Template = args => {
  const [dataSource, setDataSource] = useState(args.value || initialDataSource);

  const handleDataChange = newData => {
    setDataSource(newData);
    args.onChange(newData);
  };

  return <DragTable {...args} value={dataSource} onChange={handleDataChange} />;
};

export const Default = Template.bind({});
Default.args = {
  columns,
  rowKey: 'key',
  version: DragTable.version,
};

export const WithCustomRowKey = Template.bind({});
WithCustomRowKey.args = {
  columns: [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
  ],
  value: [
    {
      productId: 'p1',
      productName: 'iPhone 14',
      price: 6999,
      stock: 150,
    },
    {
      productId: 'p2',
      productName: 'iPad Air',
      price: 4599,
      stock: 80,
    },
    {
      productId: 'p3',
      productName: 'MacBook Pro',
      price: 14999,
      stock: 30,
    },
  ],
  rowKey: 'productId',
  version: DragTable.version,
};

export const WithEditableCells = args => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: '张三',
      age: 28,
      email: 'zhangsan@example.com',
    },
    {
      key: '2',
      name: '李四',
      age: 32,
      email: 'lisi@example.com',
    },
    {
      key: '3',
      name: '王五',
      age: 25,
      email: 'wangwu@example.com',
    },
  ]);

  const handleDataChange = newData => {
    setDataSource(newData);
    args.onChange(newData);
  };

  const handleCellChange = (index, field, value) => {
    const newDataSource = [...dataSource];
    newDataSource[index] = {
      ...newDataSource[index],
      [field]: value,
    };
    setDataSource(newDataSource);
    args.onChange(newDataSource);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, _, index) => (
        <input
          type="text"
          value={text}
          placeholder="请输入姓名"
          style={{ width: '100%', padding: '4px 8px', border: '1px solid var(--tt-border-color)', borderRadius: '4px' }}
          onChange={e => {
            handleCellChange(index, 'name', e.target.value);
          }}
        />
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (text, _, index) => (
        <input
          type="number"
          value={text}
          placeholder="年龄"
          style={{ width: '80px', padding: '4px 8px', border: '1px solid var(--tt-border-color)', borderRadius: '4px' }}
          onChange={e => {
            handleCellChange(index, 'age', Number(e.target.value));
          }}
        />
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text, _, index) => (
        <input
          type="email"
          value={text}
          placeholder="邮箱"
          style={{ width: '100%', padding: '4px 8px', border: '1px solid var(--tt-border-color)', borderRadius: '4px' }}
          onChange={e => {
            handleCellChange(index, 'email', e.target.value);
          }}
        />
      ),
    },
  ];

  return (
    <DragTable
      {...args}
      columns={columns}
      value={dataSource}
      onChange={handleDataChange}
      rowKey="key"
      version={DragTable.version}
    />
  );
};
