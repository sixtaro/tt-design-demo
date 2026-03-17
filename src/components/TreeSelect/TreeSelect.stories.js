import React, { useState } from 'react';
import { FolderOpenOutlined, FileOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import TreeSelect from './index';

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

const mockTreeDataWithIcons = [
  {
    title: '公司',
    value: 'company',
    key: 'company',
    icon: <HomeOutlined />,
    children: [
      {
        title: '产品部',
        value: 'product',
        key: 'product',
        icon: <FolderOpenOutlined />,
        children: [
          { title: '产品经理', value: 'pm', key: 'pm', icon: <FileOutlined /> },
          { title: 'UI设计师', value: 'ui', key: 'ui', icon: <FileOutlined /> }
        ]
      },
      {
        title: '研发部',
        value: 'dev',
        key: 'dev',
        icon: <FolderOpenOutlined />,
        children: [
          { title: '前端开发', value: 'fe', key: 'fe', icon: <FileOutlined /> },
          { title: '后端开发', value: 'be', key: 'be', icon: <FileOutlined /> }
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

export const 基础用法 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState('xihu');
  const [value3, setValue3] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
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
        <div style={{ minWidth: 260 }}>
          <h4>有默认值</h4>
          <TreeSelect
            placeholder="请选择地区"
            style={{ width: 260 }}
            treeData={mockTreeData}
            value={value2}
            onChange={setValue2}
            version={TreeSelect.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>默认展开</h4>
          <TreeSelect
            placeholder="请选择地区"
            style={{ width: 260 }}
            treeData={mockTreeData}
            treeDefaultExpandAll
            version={TreeSelect.version}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 400 }}>
          <h4>多选基础</h4>
          <TreeSelect
            treeCheckable
            placeholder="请选择多个地区"
            style={{ width: 400 }}
            treeData={mockTreeData}
            value={value3}
            onChange={setValue3}
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 尺寸与状态 = () => {
  const [value, setValue] = useState('xihu');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>禁用状态</h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>单选禁用项</h4>
          <TreeSelect
            placeholder="请选择（部分选项禁用）"
            style={{ width: 260 }}
            treeData={mockTreeDataWithDisabled}
            version={TreeSelect.version}
          />
        </div>
        <div style={{ minWidth: 400 }}>
          <h4>多选禁用项</h4>
          <TreeSelect
            treeCheckable
            placeholder="请选择（部分选项禁用）"
            style={{ width: 400 }}
            treeData={mockTreeDataWithDisabled}
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 可搜索 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 320 }}>
          <h4>单选搜索</h4>
          <TreeSelect
            showSearch
            placeholder="搜索地区（如：西湖、南山、鼓楼）"
            style={{ width: 320 }}
            treeData={mockTreeData}
            value={value1}
            onChange={setValue1}
            version={TreeSelect.version}
          />
        </div>
        <div style={{ minWidth: 400 }}>
          <h4>多选搜索</h4>
          <TreeSelect
            treeCheckable
            showSearch
            placeholder="搜索并选择多个地区"
            style={{ width: 400 }}
            treeData={mockTreeData}
            value={value2}
            onChange={setValue2}
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 多选模式 = () => {
  const [value1, setValue1] = useState(['xihu', 'xuanwu']);
  const [value2, setValue2] = useState(['xihu', 'binjiang', 'nanshan', 'tianhe', 'xuanwu', 'gusu']);
  const [value3, setValue3] = useState([]);
  const [value4, setValue4] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 400 }}>
          <h4>有默认值</h4>
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
        <div style={{ minWidth: 400 }}>
          <h4>超出折叠（maxTagCount=2）</h4>
          <TreeSelect
            treeCheckable
            maxTagCount={2}
            placeholder="请选择多个地区"
            style={{ width: 400 }}
            treeData={mockTreeData}
            value={value2}
            onChange={setValue2}
            version={TreeSelect.version}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 400 }}>
          <h4>多选 + 全选</h4>
          <TreeSelect
            treeCheckable
            showSelectAll
            placeholder="请选择，支持全选"
            style={{ width: 400 }}
            treeData={mockTreeData}
            value={value3}
            onChange={setValue3}
            treeDefaultExpandAll
            version={TreeSelect.version}
          />
        </div>
        <div style={{ minWidth: 400 }}>
          <h4>多选 + 展开父节点（treeExpandTrigger）</h4>
          <TreeSelect
            treeCheckable
            treeExpandTrigger="click"
            placeholder="点击节点文字展开"
            style={{ width: 400 }}
            treeData={mockTreeData}
            value={value4}
            onChange={setValue4}
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 图标与自定义 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>带节点图标</h4>
          <TreeSelect
            placeholder="请选择部门"
            style={{ width: 260 }}
            treeData={mockTreeDataWithIcons}
            value={value}
            onChange={setValue}
            treeDefaultExpandAll
            version={TreeSelect.version}
          />
        </div>
        <div style={{ minWidth: 320 }}>
          <h4>带前缀图标</h4>
          <TreeSelect
            placeholder="搜索地区"
            style={{ width: 320 }}
            treeData={mockTreeData}
            showSearch
            prefixIcon={<SearchOutlined />}
            version={TreeSelect.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 始终展开 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>下拉菜单始终展开（用于样式预览）</h4>
        <div style={{ paddingBottom: '320px' }}>
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
