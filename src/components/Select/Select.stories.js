import React, { useState } from 'react';
import Select from './index';

const mockOptions = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' },
  { value: 'option5', label: '选项五' },
  { value: 'option6', label: '选项六' },
  { value: 'option7', label: '选项七' },
  { value: 'option8', label: '选项八' },
  { value: 'option9', label: '选项九' },
  { value: 'option10', label: '选项十' }
];

export default {
  title: '数据录入/Select 选择器',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Select 选择器组件，版本：${Select.version}`
      }
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位文本' },
    disabled: { control: 'boolean', description: '是否禁用' },
    searchable: { control: 'boolean', description: '是否可搜索' },
    showSelectAll: { control: 'boolean', description: '是否显示全选（仅多选）' },
    mode: { control: { type: 'select', options: ['default', 'multiple', 'tags'] }, description: '选择模式' },
    status: { control: { type: 'select', options: ['default', 'error'] }, description: '状态' }
  }
};

// 基础用法演示
export const 基础用法 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState('option2');
  const [value3, setValue3] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <Select
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions.slice(0, 5)}
          value={value1}
          onChange={setValue1}
          version={Select.version}
        />
      </div>
      <div>
        <h4>有默认值</h4>
        <Select
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions.slice(0, 5)}
          value={value2}
          onChange={setValue2}
          version={Select.version}
        />
      </div>
      <div>
        <h4>使用 Option 组件</h4>
        <Select
          placeholder="请选择"
          style={{ width: 260 }}
          value={value3}
          onChange={setValue3}
          version={Select.version}
        >
          <Select.Option value="option1">苹果</Select.Option>
          <Select.Option value="option2">香蕉</Select.Option>
          <Select.Option value="option3">橙子</Select.Option>
          <Select.Option value="option4">葡萄</Select.Option>
        </Select>
      </div>
    </div>
  );
};

// 状态演示
export const 不同状态 = () => {
  const [value, setValue] = useState('option1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>禁用状态</h4>
        <Select
          disabled
          placeholder="禁用状态"
          style={{ width: 260 }}
          options={mockOptions.slice(0, 5)}
          version={Select.version}
        />
      </div>
      <div>
        <h4>禁用且有值</h4>
        <Select
          disabled
          placeholder="禁用状态"
          style={{ width: 260 }}
          options={mockOptions.slice(0, 5)}
          value={value}
          onChange={setValue}
          version={Select.version}
        />
      </div>
      <div>
        <h4>错误状态</h4>
        <Select
          status="error"
          placeholder="错误状态"
          style={{ width: 260 }}
          options={mockOptions.slice(0, 5)}
          version={Select.version}
        />
      </div>
    </div>
  );
};

// 多选演示
export const 多选模式 = () => {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState(['option1', 'option3', 'option5']);
  const [value3, setValue3] = useState(['option1', 'option2', 'option3', 'option4', 'option5']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>基础多选</h4>
        <Select
          mode="multiple"
          placeholder="请选择多个选项"
          style={{ width: 400 }}
          options={mockOptions.slice(0, 8)}
          value={value1}
          onChange={setValue1}
          version={Select.version}
        />
      </div>
      <div>
        <h4>有默认值</h4>
        <Select
          mode="multiple"
          placeholder="请选择多个选项"
          style={{ width: 400 }}
          options={mockOptions.slice(0, 8)}
          value={value2}
          onChange={setValue2}
          version={Select.version}
        />
      </div>
      <div>
        <h4>超出数量折叠显示</h4>
        <Select
          mode="multiple"
          placeholder="请选择多个选项"
          style={{ width: 400 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          maxTagCount={3}
          version={Select.version}
        />
      </div>
    </div>
  );
};

// 搜索功能演示
export const 可搜索 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>单选搜索</h4>
        <Select
          searchable
          placeholder="请输入关键字搜索"
          style={{ width: 260 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Select.version}
        />
      </div>
      <div>
        <h4>多选搜索</h4>
        <Select
          mode="multiple"
          searchable
          placeholder="请选择或搜索"
          style={{ width: 400 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Select.version}
        />
      </div>
      <div>
        <h4>自定义搜索占位</h4>
        <Select
          searchable
          searchPlaceholder="搜索选项..."
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          version={Select.version}
        />
      </div>
    </div>
  );
};

// 全选功能演示
export const 多选全选 = () => {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>基础全选</h4>
        <Select
          mode="multiple"
          showSelectAll
          placeholder="请选择，支持全选"
          style={{ width: 400 }}
          options={mockOptions.slice(0, 5)}
          value={value1}
          onChange={setValue1}
          version={Select.version}
        />
      </div>
      <div>
        <h4>搜索 + 全选</h4>
        <Select
          mode="multiple"
          searchable
          showSelectAll
          placeholder="请搜索并选择，支持全选"
          style={{ width: 400 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          searchPlaceholder="请输入关键字"
          version={Select.version}
        />
      </div>
      <div>
        <h4>搜索 + 全选 + 折叠显示</h4>
        <Select
          mode="multiple"
          searchable
          showSelectAll
          maxTagCount={2}
          placeholder="请选择"
          style={{ width: 400 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          version={Select.version}
        />
      </div>
    </div>
  );
};

// 分组演示
export const 选项分组 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>选项分组</h4>
        <Select
          placeholder="请选择"
          style={{ width: 260 }}
          value={value}
          onChange={setValue}
          version={Select.version}
        >
          <Select.OptGroup label="水果">
            <Select.Option value="apple">苹果</Select.Option>
            <Select.Option value="banana">香蕉</Select.Option>
            <Select.Option value="orange">橙子</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="蔬菜">
            <Select.Option value="tomato">西红柿</Select.Option>
            <Select.Option value="potato">土豆</Select.Option>
            <Select.Option value="carrot">胡萝卜</Select.Option>
          </Select.OptGroup>
        </Select>
      </div>
    </div>
  );
};
