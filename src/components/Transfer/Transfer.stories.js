import React, { useState } from 'react';
import Transfer from './index';
import Button from '../Button';

const mockData = Array.from({ length: 12 }).map((_, i) => ({
  key: `item-${i + 1}`,
  title: `选项 ${i + 1}`,
  description: `描述内容 ${i + 1}`,
}));

const mockDataDisabled = Array.from({ length: 10 }).map((_, i) => ({
  key: `item-${i + 1}`,
  title: `选项 ${i + 1}`,
  description: `描述内容 ${i + 1}`,
  disabled: i % 4 === 3,
}));

export default {
  title: '数据录入/Transfer 穿梭框',
  component: Transfer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Transfer 穿梭框组件，版本：${Transfer.version}`
      }
    }
  },
  argTypes: {
    disabled: { control: 'boolean', description: '是否禁用' },
    showSearch: { control: 'boolean', description: '是否显示搜索框' },
    oneWay: { control: 'boolean', description: '是否单向穿梭' },
    pagination: { control: 'boolean', description: '是否启用分页' },
    showSelectAll: { control: 'boolean', description: '是否显示全选' },
    status: { control: { type: 'select', options: ['default', 'error'] }, description: '状态' }
  }
};

// 基础用法
export const 基础用法 = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <div>
      <h4>基础穿梭框</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        render={item => item.title}
        version={Transfer.version}
      />
    </div>
  );
};

// 带搜索
export const 带搜索 = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <div>
      <h4>带搜索功能的穿梭框</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        render={item => item.title}
        showSearch
        filterOption={(inputValue, item) =>
          item.title.indexOf(inputValue) !== -1 || item.description.indexOf(inputValue) !== -1
        }
        version={Transfer.version}
      />
    </div>
  );
};

// 分页
export const 分页模式 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div>
      <h4>分页穿梭框</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={item => item.title}
        pagination
        version={Transfer.version}
      />
    </div>
  );
};

// 不同状态
export const 不同状态 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>禁用状态</h4>
        <Transfer
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={setTargetKeys}
          render={item => item.title}
          disabled
          version={Transfer.version}
        />
      </div>
      <div>
        <h4>错误状态</h4>
        <Transfer
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={setTargetKeys}
          render={item => item.title}
          status="error"
          version={Transfer.version}
        />
      </div>
    </div>
  );
};

// 单向穿梭
export const 单向穿梭 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div>
      <h4>单向穿梭（仅允许从左到右）</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={item => item.title}
        oneWay
        version={Transfer.version}
      />
    </div>
  );
};

// 自定义标题与操作文案
export const 自定义标题 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div>
      <h4>自定义标题和操作按钮文案</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={item => item.title}
        titles={['源列表', '目标列表']}
        operations={['添加', '移除']}
        version={Transfer.version}
      />
    </div>
  );
};

// 自定义渲染
export const 自定义渲染 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div>
      <h4>自定义渲染每一项</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={item => (
          <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>{item.title}</span>
            <span style={{ color: 'var(--tt-text-secondary)', fontSize: 12 }}>{item.description}</span>
          </span>
        )}
        showSearch
        version={Transfer.version}
      />
    </div>
  );
};

// 自定义底部
export const 自定义底部 = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div>
      <h4>自定义底部</h4>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={item => item.title}
        footer={({ direction }) => (
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--tt-color-grey-2)', textAlign: 'center' }}>
            {direction === 'left' ? `左侧 ${mockData.length - targetKeys.length} 项` : `右侧 ${targetKeys.length} 项`}
          </div>
        )}
        version={Transfer.version}
      />
    </div>
  );
};

// 含禁用项
export const 含禁用项 = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  return (
    <div>
      <h4>部分选项禁用</h4>
      <Transfer
        dataSource={mockDataDisabled}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={setTargetKeys}
        onSelectChange={(source, target) => setSelectedKeys([...source, ...target])}
        render={item => (
          <span>
            {item.title}
            {item.disabled ? ' (已禁用)' : ''}
          </span>
        )}
        showSearch
        version={Transfer.version}
      />
    </div>
  );
};
