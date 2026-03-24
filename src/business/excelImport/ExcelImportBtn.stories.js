import React, { useEffect } from 'react';
import { message } from 'antd';
import ExcelImportBtn from './excelImportBtn';
import '@/utils';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.systemID = window.systemID ?? 1;
  window._user = window._user || {
    token: 'storybook-token',
    userID: 'storybook-user',
    userGroupID: 'storybook-group',
  };
  window._baseURL = window._baseURL || '';
  window._baseURL_prefix = window._baseURL_prefix || '';
  window.excelImport = window.excelImport || {
    setImportProcess: () => {},
  };
};

ensureBusinessStoryEnv();

const mockAxiosResponse = config => {
  const url = String(config?.url || '');

  if (url.includes('/PublicV2/home/importModel/find')) {
    return Promise.resolve({
      success: true,
      data: {
        modelKey: 'storybook_excel_import',
        items: [
          { itemName: 'name', viewName: '姓名', isNecessary: 1 },
          { itemName: 'mobile', viewName: '手机号', isNecessary: 1 },
          { itemName: 'remark', viewName: '备注', isNecessary: 0 },
        ],
      },
    });
  }

  if (url.includes('/PublicV2/home/submitimportjob')) {
    message.success('已进入本地导入演示流程');
    return Promise.resolve({
      success: true,
      data: {
        jobID: 'storybook-job-id',
      },
    });
  }

  if (url.includes('/PublicV2/home/importprocess')) {
    return Promise.resolve({
      success: true,
      data: {
        status: 2,
        failType: 0,
        message: '导入完成',
      },
    });
  }

  if (url.includes('/PublicV2/home/delimportfile')) {
    return Promise.resolve({
      success: true,
    });
  }

  return Promise.resolve({
    success: true,
    data: {},
  });
};

const installExcelImportMock = () => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const axios = require('axios').default || require('axios');
  const originalRequest = axios.request.bind(axios);

  axios.request = (firstArg, secondArg) => {
    const mergedConfig = typeof firstArg === 'string'
      ? { ...(secondArg || {}), url: firstArg }
      : firstArg;

    return mockAxiosResponse(mergedConfig);
  };

  return () => {
    axios.request = originalRequest;
  };
};

const MockProvider = ({ children }) => {
  useEffect(() => {
    const restore = installExcelImportMock();

    return () => restore();
  }, []);

  return children;
};

export default {
  title: '业务组件/ExcelImportBtn 导入按钮',
  component: ExcelImportBtn,
  parameters: {
    docs: {
      description: {
        component: '通过 Story 内部 mock 导入模板查询与任务状态接口，演示 ExcelImportBtn 的按钮与弹窗入口。',
      },
    },
  },
  argTypes: {
    onOk: {
      action: 'ok',
    },
    onCancel: {
      action: 'cancel',
    },
  },
};

const Template = args => (
  <MockProvider>
    <div style={{ padding: 24 }}>
      <ExcelImportBtn {...args} />
    </div>
  </MockProvider>
);

export const 默认入口 = Template.bind({});
默认入口.args = {
  title: '批量导入车主',
  modelId: 'storybook-model-id',
  buttonName: '导入数据',
  buttonType: 'primary',
  importParams: {
    scene: 'storybook',
  },
};

export const 文本预览模式 = Template.bind({});
文本预览模式.args = {
  title: '批量导入联系人',
  modelId: 'storybook-model-id',
  buttonName: '导入联系人',
  textPre: true,
};
