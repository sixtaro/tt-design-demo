import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import '@/utils';
import ImportExportIcon from './index';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.systemID = window.systemID ?? 1;
  window._user = window._user || {
    token: 'storybook-token',
    userCenterToken: 'storybook-token',
  };
  window._baseURL = window._baseURL || '';
  window._baseURL_prefix = window._baseURL_prefix || '';
};

ensureBusinessStoryEnv();

const now = new Date();
const later = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

const mockJobs = [
  {
    jobID: 'export-1',
    status: 2,
    jobType: 1,
    remark: '',
    failExcelName: '',
    finishTime: '2026-03-25 10:00:00',
    expireTime: later,
    process: 100,
    message: '导出完成',
    orginFileName: '项目台账.xlsx',
    submitTime: '2026-03-25 09:58:00',
    readFlag: 0,
    sheetName: '项目台账',
    fileName: '项目台账.xlsx',
  },
  {
    jobID: 'import-1',
    status: 1,
    jobType: 11,
    remark: '第2行手机号格式错误',
    failExcelName: '失败明细.xlsx',
    finishTime: '',
    expireTime: later,
    process: 48,
    message: '正在导入',
    orginFileName: '车主导入模板.xlsx',
    submitTime: '2026-03-25 09:59:00',
    readFlag: 0,
    sheetName: '车主导入',
    fileName: '车主导入模板.xlsx',
  },
  {
    jobID: 'import-2',
    status: 3,
    jobType: 11,
    remark: '第3行证件号缺失',
    failExcelName: '失败记录.xlsx',
    finishTime: '2026-03-25 09:30:00',
    expireTime: later,
    process: 100,
    message: '导入失败',
    orginFileName: '访客导入.xlsx',
    submitTime: '2026-03-25 09:20:00',
    readFlag: 0,
    sheetName: '访客导入',
    fileName: '访客导入.xlsx',
  },
];

const installImportExportMock = () => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const axios = require('axios').default || require('axios');
  const originalRequest = axios.request.bind(axios);

  axios.request = (firstArg, secondArg) => {
    const mergedConfig = typeof firstArg === 'string'
      ? { ...(secondArg || {}), url: firstArg }
      : firstArg;
    const url = String(mergedConfig?.url || '');

    if (url.includes('/PublicV2/home/userasyncjobs')) {
      return Promise.resolve({
        data: {
          success: true,
          data: {
            list: mockJobs,
            unReadCount: 2,
          },
        },
      });
    }

    if (
      url.includes('/PublicV2/home/readjobmsg') ||
      url.includes('/PublicV2/home/cancelexportjob') ||
      url.includes('/PublicV2/home/cancelasyncjobs') ||
      url.includes('/PublicV2/home/importprocess') ||
      url.includes('/PublicV2/home/cancalimportjobs')
    ) {
      return Promise.resolve({
        data: {
          success: true,
          message: '操作成功',
          data: {
            status: 3,
            failType: 2,
          },
        },
      });
    }

    return Promise.resolve({
      data: {
        success: true,
        data: {},
      },
    });
  };

  return () => {
    axios.request = originalRequest;
  };
};

const MockProvider = ({ children }) => {
  React.useEffect(() => {
    const restore = installImportExportMock();
    return () => restore();
  }, []);

  return children;
};

const ImportExportDemo = args => {
  return (
    <MockProvider>
      <Card style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
            点击图标可展开导入导出列表，列表数据来自 Story 内部 mock。
          </Font>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
            <ImportExportIcon {...args} getSystemID={() => 1} />
          </div>
        </div>
      </Card>
    </MockProvider>
  );
};

export default {
  title: '业务组件/ImportExportList 导入导出列表',
  component: ImportExportIcon,
  parameters: {
    docs: {
      description: {
        component: '通过 Story 内部 mock 异步任务列表接口，演示 ImportExportList 的徽标与下拉列表。',
      },
    },
  },
};

export const 基础用法 = args => <ImportExportDemo {...args} />;
基础用法.args = {
  iconName: 'home',
};
