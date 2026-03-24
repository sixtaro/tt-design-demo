import React from 'react';
import Selector from './index';
import '@/utils';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.systemID = window.systemID ?? 1;
  window._user = window._user || {
    userID: 'storybook-user',
    userGroupID: 'storybook-group',
    UserConfig: {
      pageSize: 5,
      tableSize: 'middle',
    },
  };
  window._baseURL = window._baseURL || '';
  window._baseURL_prefix = window._baseURL_prefix || '';
  window._request_params = window._request_params || {};
  window.hasRight = window.hasRight || (() => true);
  window.isMac = false;
  window.excelImport = window.excelImport || {
    setImportProcess: () => {},
  };
};

ensureBusinessStoryEnv();

const selectorRows = [
  {
    id: '1',
    plateNo: '鄂A12345',
    owner: '张三',
    status: 'enabled',
    amount: 128.5,
    updatedAt: '2026-03-20 10:12:00',
  },
  {
    id: '2',
    plateNo: '鄂A54321',
    owner: '李四',
    status: 'disabled',
    amount: 88,
    updatedAt: '2026-03-20 14:30:00',
  },
  {
    id: '3',
    plateNo: '粤B88888',
    owner: '王五',
    status: 'enabled',
    amount: 236.2,
    updatedAt: '2026-03-21 09:05:00',
  },
  {
    id: '4',
    plateNo: '沪C66666',
    owner: '赵六',
    status: 'enabled',
    amount: 59.9,
    updatedAt: '2026-03-22 16:40:00',
  },
  {
    id: '5',
    plateNo: '京D52000',
    owner: '钱七',
    status: 'disabled',
    amount: 420,
    updatedAt: '2026-03-23 08:18:00',
  },
  {
    id: '6',
    plateNo: '浙E10086',
    owner: '孙八',
    status: 'enabled',
    amount: 76.3,
    updatedAt: '2026-03-23 18:22:00',
  },
];

const normalizeArrayValue = value => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return [String(value)];
};

const selectorApi = {
  _result: params => {
    const keyword = String(params.plateNo || '').trim().toLowerCase();
    const statusList = normalizeArrayValue(params.status);
    let list = selectorRows.slice();

    if (keyword) {
      list = list.filter(item => `${item.plateNo}${item.owner}`.toLowerCase().includes(keyword));
    }

    if (statusList.length) {
      list = list.filter(item => statusList.includes(String(item.status)));
    }

    if (params.sortColumn === 'amount' && params.order) {
      list = list.slice().sort((prev, next) => {
        return params.order === 'asc' ? prev.amount - next.amount : next.amount - prev.amount;
      });
    }

    const currentPage = Number(params.currentPage || 1);
    const pageSize = Number(params.rows || 5);
    const start = (currentPage - 1) * pageSize;

    return {
      success: true,
      data: {
        list: list.slice(start, start + pageSize),
        totalNum: list.length,
        totalRecord: {
          amount: Number(list.reduce((sum, item) => sum + item.amount, 0).toFixed(2)),
        },
      },
    };
  },
};

const columns = [
  {
    title: '车牌号',
    dataIndex: 'plateNo',
    filter: {
      type: 'input',
    },
  },
  {
    title: '车主',
    dataIndex: 'owner',
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: {
      items: [
        { text: '启用', value: 'enabled' },
        { text: '停用', value: 'disabled' },
      ],
    },
    render: text => (text === 'enabled' ? '启用' : '停用'),
  },
  {
    title: '应收金额',
    dataIndex: 'amount',
    sorter: true,
    total: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
  },
];

export default {
  title: '业务组件/Selector 选择器',
  component: Selector,
  parameters: {
    docs: {
      description: {
        component: '离线演示 Selector 的本地数据列表、筛选、排序和分页能力，不依赖真实后端接口。',
      },
    },
  },
  argTypes: {
    api: {
      control: false,
    },
    columns: {
      control: false,
    },
    data: {
      control: false,
    },
    dataSource: {
      control: false,
    },
    table: {
      control: false,
    },
    onFilterChange: {
      action: 'filter-change',
    },
  },
};

const Template = args => (
  <div style={{ minHeight: 420 }}>
    <Selector {...args} />
  </div>
);

export const 基础列表 = Template.bind({});
基础列表.args = {
  api: selectorApi,
  columns,
  data: selectorRows,
  dataSource: selectorRows,
  pagination: {
    pageSize: 5,
  },
  table: {
    rowKey: 'id',
  },
  showSerialNumber: true,
};

export const 带行选择 = Template.bind({});
带行选择.args = {
  api: selectorApi,
  columns,
  data: selectorRows,
  dataSource: selectorRows,
  pagination: {
    pageSize: 5,
  },
  table: {
    rowKey: 'id',
    rowSelection: {},
  },
  showSerialNumber: true,
};
