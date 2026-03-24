import React, { useEffect } from 'react';
import PageLayout from './index';
import { Storage } from '@/utils';
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

const pageLayoutRows = [
  {
    recordID: '1',
    projectName: '未来园区一期',
    owner: '运营一组',
    status: '启用',
    payAmount: 188.8,
    updatedAt: '2026-03-20 10:00:00',
  },
  {
    recordID: '2',
    projectName: '滨江园区二期',
    owner: '运营二组',
    status: '草稿',
    payAmount: 96.5,
    updatedAt: '2026-03-21 15:30:00',
  },
  {
    recordID: '3',
    projectName: '智慧停车示范区',
    owner: '平台组',
    status: '启用',
    payAmount: 294.3,
    updatedAt: '2026-03-23 09:18:00',
  },
];

const totalPayAmount = Number(pageLayoutRows.reduce((sum, item) => sum + item.payAmount, 0).toFixed(2));

const basePageConfig = {
  layout: 'table',
  param: {},
  api: {
    _result: {
      success: true,
      data: {
        list: pageLayoutRows,
        totalNum: pageLayoutRows.length,
        totalRecord: {
          payAmount: totalPayAmount,
        },
      },
    },
  },
  columns: [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      filter: {
        type: 'input',
      },
    },
    {
      title: '负责人',
      dataIndex: 'owner',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filter: {
        items: [
          { text: '启用', value: '启用' },
          { text: '草稿', value: '草稿' },
        ],
      },
    },
    {
      title: '应收金额',
      dataIndex: 'payAmount',
      total: true,
      sorter: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
    },
  ],
  table: {
    rowKey: 'recordID',
  },
};

const pageConfigWithCondition = {
  ...basePageConfig,
  conditionOptions: [
    {
      type: 'input',
      displayName: '关键词',
      conditionName: 'keyword',
    },
    {
      type: 'custom',
      displayName: '状态',
      conditionName: 'status',
      defaultValue: 'all',
      items: [
        { text: '全部', value: 'all' },
        { text: '启用', value: '启用' },
        { text: '草稿', value: '草稿' },
      ],
    },
  ],
};

const PageLayoutDemo = ({ storyConfig, pageID, ...args }) => {
  useEffect(() => {
    const originalFetch = window.fetch?.bind(window);

    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input?.url;

      if (String(url).startsWith('/pageLayoutLocalPreview')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: false }),
        });
      }

      return originalFetch ? originalFetch(input, init) : Promise.reject(new Error('Fetch is not available'));
    };

    Storage.set(pageID.toLowerCase(), storyConfig, '8h', 'pageID');

    return () => {
      if (originalFetch) {
        window.fetch = originalFetch;
      }
      Storage.remove(pageID.toLowerCase(), 'pageID');
    };
  }, [pageID, storyConfig]);

  return (
    <div style={{ minHeight: 520 }}>
      <PageLayout pageID={pageID} {...args} />
    </div>
  );
};

export default {
  title: '业务组件/PageLayout 页面布局',
  component: PageLayout,
  parameters: {
    docs: {
      description: {
        component: '通过 Story 内部写入 Storage 缓存配置，演示 PageLayout 在无后端场景下的本地页面渲染能力。',
      },
    },
  },
  argTypes: {
    storyConfig: {
      control: false,
    },
    pageID: {
      control: 'text',
    },
    page: {
      control: false,
    },
  },
};

export const 本地缓存表格 = args => <PageLayoutDemo {...args} />;
本地缓存表格.args = {
  pageID: 'storybook_page_layout_table',
  storyConfig: basePageConfig,
};

export const 带静态筛选栏 = args => <PageLayoutDemo {...args} />;
带静态筛选栏.args = {
  pageID: 'storybook_page_layout_condition',
  storyConfig: pageConfigWithCondition,
};
