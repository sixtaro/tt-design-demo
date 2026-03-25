import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import '@/utils';
import ParkTreeWithSwitch from './parkTreeWithSwitch';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window._baseURL = window._baseURL || '';
  window._baseURL_prefix = window._baseURL_prefix || '';
  window._request_params = window._request_params || {};
};

ensureBusinessStoryEnv();

const mockTreeData = [
  {
    id: 'org_1',
    text: '未来集团',
    iconCls: 'org',
    attributes: {
      type: 'org',
      parkID: 0,
    },
    children: [
      {
        id: 'org_2',
        text: '华中运营部',
        iconCls: 'org',
        attributes: {
          type: 'org',
          parkID: 0,
        },
        children: [
          {
            id: 'park_node_101',
            text: '未来城停车场',
            iconCls: 'park',
            attributes: {
              type: 'park',
              parkID: 101,
            },
            children: [],
          },
          {
            id: 'park_node_102',
            text: '东湖停车场',
            iconCls: 'park',
            attributes: {
              type: 'park',
              parkID: 102,
            },
            children: [],
          },
        ],
      },
    ],
  },
];

const installTreeMock = () => {
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

    if (url.includes('group/usergrouporg/orgtree')) {
      return Promise.resolve({
        data: mockTreeData,
      });
    }

    return Promise.resolve({
      data: {},
    });
  };

  return () => {
    axios.request = originalRequest;
  };
};

const MockProvider = ({ children }) => {
  React.useEffect(() => {
    const restore = installTreeMock();
    return () => restore();
  }, []);

  return children;
};

const ParkTreeWithSwitchDemo = ({ initialValue, onChange, ...args }) => {
  const [value, setValue] = React.useState(initialValue);

  return (
    <MockProvider>
      <Card style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ParkTreeWithSwitch
            {...args}
            value={value}
            onChange={nextValue => {
              setValue(nextValue);
              onChange?.(nextValue);
            }}
            treeSelectProps={{
              style: { width: '100%' },
              placeholder: '请选择组织或车场',
              treeCheckable: true,
              allowClear: true,
              showSearch: true,
            }}
          />
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 6,
              background: 'var(--tt-bg-lighter)',
              fontSize: 12,
              overflow: 'auto',
            }}
          >
            {JSON.stringify(value || {}, null, 2)}
          </pre>
          <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
            打开部门开关后，会同步写入 `switchValue`。
          </Font>
        </div>
      </Card>
    </MockProvider>
  );
};

export default {
  title: '业务组件/ParkTreeWithSwitch 树选择开关',
  component: ParkTreeWithSwitch,
  parameters: {
    docs: {
      description: {
        component: '通过 Story 内部 mock 组织树接口，演示 ParkTreeWithSwitch 的勾选与部门开关联动。',
      },
    },
  },
  argTypes: {
    onChange: {
      action: 'change',
    },
  },
};

export const 基础用法 = args => <ParkTreeWithSwitchDemo {...args} />;
基础用法.args = {
  initialValue: undefined,
};

export const 带默认开关 = args => <ParkTreeWithSwitchDemo {...args} />;
带默认开关.args = {
  initialValue: {
    checkedValue: ['org_2', 101, 102],
    switchValue: ['org_2'],
  },
};
