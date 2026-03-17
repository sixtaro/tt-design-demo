import React, { useState } from 'react';
import Cascader from './index';

const mockOptions = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
          { value: 'xiaoshan', label: '萧山区' }
        ]
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [
          { value: 'yinzhou', label: '鄞州区' },
          { value: 'beilun', label: '北仑区' }
        ]
      }
    ]
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'qinhuai', label: '秦淮区' }
        ]
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'wuzhong', label: '吴中区' }
        ]
      }
    ]
  }
];

export default {
  title: '数据录入/Cascader 级联选择',
  component: Cascader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Cascader 级联选择组件，版本：${Cascader.version}`
      }
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位文本' },
    disabled: { control: 'boolean', description: '是否禁用' },
    showSearch: { control: 'boolean', description: '是否支持搜索' },
    expandTrigger: { control: { type: 'select', options: ['click', 'hover'] }, description: '次级菜单展开方式' },
    size: { control: { type: 'select', options: ['small', 'default', 'large'] }, description: '尺寸' },
    multiple: { control: 'boolean', description: '是否多选' }
  }
};

// 基础用法演示
export const 基础用法 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState(['zhejiang', 'hangzhou', 'xihu']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <Cascader
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>有默认值</h4>
        <Cascader
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

// 不同状态
export const 不同状态 = () => {
  const [value, setValue] = useState(['zhejiang', 'hangzhou', 'xihu']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>禁用状态</h4>
        <Cascader
          disabled
          placeholder="禁用状态"
          style={{ width: 260 }}
          options={mockOptions}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>禁用且有值</h4>
        <Cascader
          disabled
          placeholder="禁用状态"
          style={{ width: 260 }}
          options={mockOptions}
          value={value}
          onChange={setValue}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

// 尺寸
export const 不同尺寸 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>小尺寸</h4>
        <Cascader
          size="small"
          placeholder="请选择"
          style={{ width: 200 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>默认尺寸</h4>
        <Cascader
          size="default"
          placeholder="请选择"
          style={{ width: 260 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>大尺寸</h4>
        <Cascader
          size="large"
          placeholder="请选择"
          style={{ width: 320 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

// 展开方式
export const 展开方式 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>点击展开（默认）</h4>
        <Cascader
          expandTrigger="click"
          placeholder="点击展开"
          style={{ width: 260 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>悬停展开</h4>
        <Cascader
          expandTrigger="hover"
          placeholder="悬停展开"
          style={{ width: 260 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

// 可搜索
export const 可搜索 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>搜索模式</h4>
        <Cascader
          showSearch
          placeholder="请搜索地区"
          style={{ width: 260 }}
          options={mockOptions}
          value={value}
          onChange={setValue}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

// 多选模式
export const 多选模式 = () => {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState([
    ['zhejiang', 'hangzhou', 'xihu'],
    ['jiangsu', 'nanjing', 'xuanwu']
  ]);
  const [value3, setValue3] = useState([
    ['zhejiang', 'hangzhou', 'xihu'],
    ['zhejiang', 'hangzhou', 'binjiang'],
    ['jiangsu', 'nanjing', 'xuanwu'],
    ['jiangsu', 'suzhou', 'gusu']
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>基础多选</h4>
        <Cascader
          multiple
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>有默认值</h4>
        <Cascader
          multiple
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>超出数量折叠显示</h4>
        <Cascader
          multiple
          maxTagCount={2}
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};
