import React from 'react';
import Table from './index';

export default {
  title: '数据展示/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Table 组件 - 版本: ${Table.version}`
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

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  }
];

const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
];

const Template = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  columns,
  dataSource,
  version: Table.version
};

export const WithPagination = Template.bind({});
WithPagination.args = {
  columns,
  dataSource,
  pagination: { pageSize: 2 },
  version: Table.version
};

export const Loading = Template.bind({});
Loading.args = {
  columns,
  dataSource,
  loading: true,
  version: Table.version
};
