import React from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Font from '@/components/Font';
import '@/utils';
import ExcelExport from './index';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.systemID = window.systemID ?? 1;
  window._user = window._user || {
    token: 'storybook-token',
    userCenterToken: 'storybook-token',
    userID: 'storybook-user',
  };
  window._baseURL = window._baseURL || '';
  window._baseURL_prefix = window._baseURL_prefix || '';
  window._request_params = window._request_params || {};
};

ensureBusinessStoryEnv();

const installExcelExportMock = () => {
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

    if (url.includes('/submitexportjob')) {
      return Promise.resolve({
        data: {
          success: true,
          data: {
            jobID: 'storybook-export-job',
          },
        },
      });
    }

    if (url.includes('/PublicV2/home/exportprocess')) {
      return Promise.resolve({
        data: {
          success: true,
          data: {
            jobID: 'storybook-export-job',
            status: 2,
            sheetName: '项目台账',
            expireTime: '2026-03-26 10:00:00',
          },
        },
      });
    }

    if (url.includes('/PublicV2/home/readjobmsg')) {
      return Promise.resolve({
        data: {
          success: true,
          message: '已读成功',
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
    const restore = installExcelExportMock();
    return () => restore();
  }, []);

  return children;
};

const rows = [
  { recordID: '1', projectName: '未来城一期', owner: '运营一组', amount: 188.8 },
  { recordID: '2', projectName: '滨江园区', owner: '运营二组', amount: 96.5 },
];

const columns = [
  { title: '项目名称', dataIndex: 'projectName' },
  { title: '负责人', dataIndex: 'owner' },
  { title: '应收金额', dataIndex: 'amount' },
];

const ExcelExportDemo = args => {
  const [visible, setVisible] = React.useState(false);
  const [jobCount, setJobCount] = React.useState(0);

  return (
    <MockProvider>
      <Card style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button type="primary" onClick={() => setVisible(true)}>
              打开导出弹窗
            </Button>
            <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
              已提交任务数：{jobCount}
            </Font>
          </div>
          <ExcelExport
            {...args}
            visible={visible}
            onClose={() => setVisible(false)}
            onExportJob={() => setJobCount(count => count + 1)}
            columns={columns}
            data={rows}
            pagination={false}
            totalNum={rows.length}
            lastParams={{ keyword: 'story' }}
            listField="list"
            totalRecordField="totalNum"
            page={{ title: '项目台账' }}
            api={{ _url: '/storybook/export-source', _type: 'get', _name: '项目台账' }}
            exportOptions={{ exportTitle: '项目台账' }}
          />
        </div>
      </Card>
    </MockProvider>
  );
};

export default {
  title: '业务组件/ExcelExport 导出弹窗',
  component: ExcelExport,
  parameters: {
    docs: {
      description: {
        component: '通过 Story 内部 mock 导出任务接口，演示 ExcelExport 的字段选择与异步导出提示。',
      },
    },
  },
};

export const 基础导出 = args => <ExcelExportDemo {...args} />;
基础导出.args = {};
