import React, { useState } from 'react';
import TreeSelect from './index';

// 模拟树形数据
const mockTreeData = [
  {
    title: '浙江省',
    value: 'zhejiang',
    key: 'zhejiang',
    children: [
      {
        title: '杭州市',
        value: 'hangzhou',
        key: 'hangzhou',
        children: [
          { title: '西湖区', value: 'xihu', key: 'xihu' },
          { title: '滨江区', value: 'binjiang', key: 'binjiang' },
          { title: '萧山区', value: 'xiaoshan', key: 'xiaoshan' },
          { title: '余杭区', value: 'yuhang', key: 'yuhang' }
        ]
      },
      {
        title: '宁波市',
        value: 'ningbo',
        key: 'ningbo',
        children: [
          { title: '鄞州区', value: 'yinzhou', key: 'yinzhou' },
          { title: '北仑区', value: 'beilun', key: 'beilun' }
        ]
      }
    ]
  },
  {
    title: '江苏省',
    value: 'jiangsu',
    key: 'jiangsu',
    children: [
      {
        title: '南京市',
        value: 'nanjing',
        key: 'nanjing',
        children: [
          { title: '玄武区', value: 'xuanwu', key: 'xuanwu' },
          { title: '秦淮区', value: 'qinhuai', key: 'qinhuai' },
          { title: '鼓楼区', value: 'gulou', key: 'gulou' }
        ]
      },
      {
        title: '苏州市',
        value: 'suzhou',
        key: 'suzhou',
        children: [
          { title: '姑苏区', value: 'gusu', key: 'gusu' },
          { title: '吴中区', value: 'wuzhong', key: 'wuzhong' }
        ]
      }
    ]
  },
  {
    title: '广东省',
    value: 'guangdong',
    key: 'guangdong',
    children: [
      {
        title: '广州市',
        value: 'guangzhou',
        key: 'guangzhou',
        children: [
          { title: '天河区', value: 'tianhe', key: 'tianhe' },
          { title: '越秀区', value: 'yuexiu', key: 'yuexiu' }
        ]
      },
      {
        title: '深圳市',
        value: 'shenzhen',
        key: 'shenzhen',
        children: [
          { title: '南山区', value: 'nanshan', key: 'nanshan' },
          { title: '福田区', value: 'futian', key: 'futian' },
          { title: '罗湖区', value: 'luohu', key: 'luohu' }
        ]
      }
    ]
  }
];

// 带禁用项的数据
const mockTreeDataWithDisabled = [
  {
    title: '浙江省',
    value: 'zhejiang',
    key: 'zhejiang',
    children: [
      {
        title: '杭州市',
        value: 'hangzhou',
        key: 'hangzhou',
        children: [
          { title: '西湖区', value: 'xihu', key: 'xihu' },
          { title: '滨江区', value: 'binjiang', key: 'binjiang', disabled: true },
          { title: '萧山区', value: 'xiaoshan', key: 'xiaoshan' }
        ]
      },
      {
        title: '宁波市',
        value: 'ningbo',
        key: 'ningbo',
        disabled: true,
        children: [
          { title: '鄞州区', value: 'yinzhou', key: 'yinzhou' },
          { title: '北仑区', value: 'beilun', key: 'beilun' }
        ]
      }
    ]
  },
  {
    title: '江苏省',
    value: 'jiangsu',
    key: 'jiangsu',
    children: [
      {
        title: '南京市',
        value: 'nanjing',
        key: 'nanjing',
        children: [
          { title: '玄武区', value: 'xuanwu', key: 'xuanwu' },
          { title: '秦淮区', value: 'qinhuai', key: 'qinhuai' }
        ]
      }
    ]
  }
];

export default {
  title: '数据录入/TreeSelect 树选择',
  component: TreeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 TreeSelect 树选择组件，版本：${TreeSelect.version}`
      }
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位文本' },
    disabled: { control: 'boolean', description: '是否禁用' },
    showSearch: { control: 'boolean', description: '是否支持搜索' },
    treeCheckable: { control: 'boolean', description: '是否支持多选（勾选）' },
    size: { control: { type: 'select', options: ['small', 'default', 'large'] }, description: '尺寸' },
    showSelectAll: { control: 'boolean', description: '是否显示全选（仅多选）' },
    treeDefaultExpandAll: { control: 'boolean', description: '是否默认展开所有节点' }
  }
};

// 基础用法演示
export const 基础用法 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState('xihu');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <TreeSelect
          placeholder="请选择地区"
          style={{ width: 260 }}
          treeData={mockTreeData}
          value={value1}
          onChange={setValue1}
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>有默认值（西湖区）</h4>
        <TreeSelect
          placeholder="请选择地区"
          style={{ width: 260 }}
          treeData={mockTreeData}
          value={value2}
          onChange={setValue2}
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>默认展开所有节点</h4>
        <TreeSelect
          placeholder="请选择地区"
          style={{ width: 260 }}
          treeData={mockTreeData}
          treeDefaultExpandAll
          version={TreeSelect.version}
        />
      </div>
    </div>
  );
};

// 不同尺寸 + 不同状态
export const 尺寸与状态 = () => {
  const [value, setValue] = useState('xihu');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>不同尺寸</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TreeSelect
            size="small"
            placeholder="小尺寸"
            style={{ width: 200 }}
            treeData={mockTreeData}
            version={TreeSelect.version}
          />
          <TreeSelect
            size="default"
            placeholder="默认尺寸"
            style={{ width: 260 }}
            treeData={mockTreeData}
            version={TreeSelect.version}
          />
          <TreeSelect
            size="large"
            placeholder="大尺寸"
            style={{ width: 320 }}
            treeData={mockTreeData}
            version={TreeSelect.version}
          />
        </div>
      </div>
      <div>
        <h4>禁用状态</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TreeSelect
            disabled
            placeholder="禁用状态"
            style={{ width: 260 }}
            treeData={mockTreeData}
            version={TreeSelect.version}
          />
          <TreeSelect
            disabled
            placeholder="禁用且有值"
            style={{ width: 260 }}
            treeData={mockTreeData}
            value={value}
            onChange={setValue}
            version={TreeSelect.version}
          />
        </div>
      </div>
      <div>
        <h4>带禁用选项</h4>
        <TreeSelect
          placeholder="请选择（部分选项禁用）"
          style={{ width: 260 }}
          treeData={mockTreeDataWithDisabled}
          version={TreeSelect.version}
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
        <h4>可搜索</h4>
        <TreeSelect
          showSearch
          placeholder="搜索地区（如：西湖、南山、鼓楼）"
          style={{ width: 320 }}
          treeData={mockTreeData}
          value={value}
          onChange={setValue}
          version={TreeSelect.version}
        />
      </div>
    </div>
  );
};

// 多选模式
export const 多选模式 = () => {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState(['xihu', 'xuanwu']);
  const [value3, setValue3] = useState(['xihu', 'binjiang', 'nanshan', 'tianhe', 'xuanwu', 'gusu']);
  const [value4, setValue4] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>基础多选</h4>
        <TreeSelect
          treeCheckable
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          treeData={mockTreeData}
          value={value1}
          onChange={setValue1}
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>有默认值</h4>
        <TreeSelect
          treeCheckable
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          treeData={mockTreeData}
          value={value2}
          onChange={setValue2}
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>超出数量折叠显示（maxTagCount=2）</h4>
        <TreeSelect
          treeCheckable
          maxTagCount={2}
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          treeData={mockTreeData}
          value={value3}
          onChange={setValue3}
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>多选 + 全选</h4>
        <TreeSelect
          treeCheckable
          showSelectAll
          placeholder="请选择，支持全选"
          style={{ width: 400 }}
          treeData={mockTreeData}
          value={value4}
          onChange={setValue4}
          treeDefaultExpandAll
          version={TreeSelect.version}
        />
      </div>
    </div>
  );
};

// 常态展开（树节点默认展开）
export const 常态展开 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>单选 - 默认展开所有节点</h4>
        <TreeSelect
          placeholder="请选择地区"
          style={{ width: 260 }}
          treeData={mockTreeData}
          value={value1}
          onChange={setValue1}
          treeDefaultExpandAll
          version={TreeSelect.version}
        />
      </div>
      <div>
        <h4>多选 - 默认展开所有节点</h4>
        <TreeSelect
          treeCheckable
          placeholder="请选择多个地区"
          style={{ width: 400 }}
          treeData={mockTreeData}
          value={value2}
          onChange={setValue2}
          treeDefaultExpandAll
          version={TreeSelect.version}
        />
      </div>
    </div>
  );
};

// 始终展开（用于预览下拉菜单样式）
export const 始终展开 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>下拉菜单始终展开</h4>
        <div style={{ paddingBottom: '300px' }}>
          <TreeSelect
            open={true}
            placeholder="请选择"
            style={{ width: 260 }}
            treeData={mockTreeData}
            value={value}
            onChange={setValue}
            treeDefaultExpandAll
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};
