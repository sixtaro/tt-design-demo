import React, { useState } from 'react';
import Rate from './index';

export default {
  title: '数据录入/Rate 评分',
  component: Rate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Rate 评分组件，版本：${Rate.version}`
      }
    }
  },
  argTypes: {
    count: { control: 'number', description: 'star 总数' },
    defaultValue: { control: 'number', description: '默认值' },
    value: { control: 'number', description: '当前值' },
    allowHalf: { control: 'boolean', description: '是否允许半选' },
    allowClear: { control: 'boolean', description: '是否允许再次点击后清除' },
    disabled: { control: 'boolean', description: '是否禁用' },
    tooltips: { control: 'object', description: '自定义每项的提示信息' },
  }
};

// 基础用法
export const 基础用法 = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <Rate defaultValue={3} version={Rate.version} />
      </div>
      <div>
        <h4>受控模式</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Rate value={value} onChange={setValue} version={Rate.version} />
          <span style={{ color: 'var(--tt-color-grey-6)' }}>当前评分: {value}</span>
        </div>
      </div>
    </div>
  );
};

// 不同状态
export const 不同状态 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>只读状态</h4>
        <Rate disabled defaultValue={4} version={Rate.version} />
      </div>
      <div>
        <h4>半选状态</h4>
        <Rate allowHalf defaultValue={2.5} version={Rate.version} />
      </div>
      <div>
        <h4>只读半选</h4>
        <Rate disabled allowHalf defaultValue={3.5} version={Rate.version} />
      </div>
    </div>
  );
};

// 自定义数量和文本
export const 自定义配置 = () => {
  const [value, setValue] = useState(0);

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>自定义 star 数量（10个）</h4>
        <Rate count={10} defaultValue={5} version={Rate.version} />
      </div>
      <div>
        <h4>带文字描述</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Rate tooltips={desc} onChange={setValue} value={value} version={Rate.version} />
          {value > 0 && <span className="ant-rate-text">{desc[value - 1]}</span>}
        </div>
      </div>
      <div>
        <h4>允许清除</h4>
        <Rate allowClear defaultValue={3} version={Rate.version} />
        <span style={{ marginLeft: 8, color: 'var(--tt-color-grey-6)', fontSize: '12px' }}>再次点击已选中的 star 可清除</span>
      </div>
      <div>
        <h4>不允许清除</h4>
        <Rate allowClear={false} defaultValue={3} version={Rate.version} />
      </div>
    </div>
  );
};
