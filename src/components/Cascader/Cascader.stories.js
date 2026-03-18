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
          { value: 'xiaoshan', label: '萧山区' },
          { value: 'yuhang', label: '余杭区' },
          { value: 'fuyang', label: '富阳区' }
        ]
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [
          { value: 'yinzhou', label: '鄞州区' },
          { value: 'beilun', label: '北仑区' },
          { value: 'zhenhai', label: '镇海区' },
          { value: 'jiangbei', label: '江北区' }
        ]
      },
      {
        value: 'wenzhou',
        label: '温州市',
        children: [
          { value: 'lucheng', label: '鹿城区' },
          { value: 'longwan', label: '龙湾区' },
          { value: 'ouhai', label: '瓯海区' }
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
          { value: 'qinhuai', label: '秦淮区' },
          { value: 'jianye', label: '建邺区' },
          { value: 'gulou', label: '鼓楼区' },
          { value: 'pukou', label: '浦口区' }
        ]
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'wuzhong', label: '吴中区' },
          { value: 'xiangcheng', label: '相城区' },
          { value: 'wujiang', label: '吴江区' }
        ]
      },
      {
        value: 'wuxi',
        label: '无锡市',
        children: [
          { value: 'binhu', label: '滨湖区' },
          { value: 'liangxi', label: '梁溪区' },
          { value: 'xinwu', label: '新吴区' }
        ]
      }
    ]
  },
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          { value: 'tianhe', label: '天河区' },
          { value: 'yuexiu', label: '越秀区' },
          { value: 'haizhu', label: '海珠区' },
          { value: 'liwan', label: '荔湾区' },
          { value: 'baiyun', label: '白云区' },
          { value: 'huangpu', label: '黄埔区' }
        ]
      },
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          { value: 'nanshan', label: '南山区' },
          { value: 'futian', label: '福田区' },
          { value: 'luohu', label: '罗湖区' },
          { value: 'baoan', label: '宝安区' },
          { value: 'longgang', label: '龙岗区' }
        ]
      },
      {
        value: 'dongguan',
        label: '东莞市',
        children: [
          { value: 'guancheng', label: '莞城区' },
          { value: 'dongcheng', label: '东城区' },
          { value: 'nancheng', label: '南城区' }
        ]
      }
    ]
  }
];

const mockOptionsWithDisabled = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区', disabled: true },
          { value: 'xiaoshan', label: '萧山区' }
        ]
      },
      {
        value: 'ningbo',
        label: '宁波市',
        disabled: true,
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
    multiple: { control: 'boolean', description: '是否多选' },
    showSelectAll: { control: 'boolean', description: '是否显示全选（仅多选）' }
  }
};

export const 基础用法 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState(['zhejiang', 'hangzhou', 'xihu']);
  const [value3, setValue3] = useState(['guangdong', 'shenzhen', 'nanshan']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <Cascader
          placeholder="请选择地区"
          style={{ width: 260 }}
          options={mockOptions}
          value={value1}
          onChange={setValue1}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>有默认值（浙江杭州西湖区）</h4>
        <Cascader
          placeholder="请选择地区"
          style={{ width: 260 }}
          options={mockOptions}
          value={value2}
          onChange={setValue2}
          version={Cascader.version}
        />
      </div>
      <div>
        <h4>有默认值（广东深圳南山区）</h4>
        <Cascader
          placeholder="请选择地区"
          style={{ width: 260 }}
          options={mockOptions}
          value={value3}
          onChange={setValue3}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

export const 尺寸与状态 = () => {
  const [value, setValue] = useState(['zhejiang', 'hangzhou', 'xihu']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>不同尺寸</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Cascader
            size="small"
            placeholder="小尺寸"
            style={{ width: 200 }}
            options={mockOptions}
            version={Cascader.version}
          />
          <Cascader
            size="default"
            placeholder="默认尺寸"
            style={{ width: 260 }}
            options={mockOptions}
            version={Cascader.version}
          />
          <Cascader
            size="large"
            placeholder="大尺寸"
            style={{ width: 320 }}
            options={mockOptions}
            version={Cascader.version}
          />
        </div>
      </div>
      <div>
        <h4>禁用状态</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Cascader
            disabled
            placeholder="禁用状态"
            style={{ width: 260 }}
            options={mockOptions}
            version={Cascader.version}
          />
          <Cascader
            disabled
            placeholder="禁用且有值"
            style={{ width: 260 }}
            options={mockOptions}
            value={value}
            onChange={setValue}
            version={Cascader.version}
          />
        </div>
      </div>
      <div>
        <h4>错误状态</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Cascader
            status="error"
            placeholder="错误状态"
            style={{ width: 260 }}
            options={mockOptions}
            version={Cascader.version}
          />
          <Cascader
            status="error"
            placeholder="错误状态且有值"
            style={{ width: 260 }}
            options={mockOptions}
            value={value}
            onChange={setValue}
            version={Cascader.version}
          />
        </div>
      </div>
      <div>
        <h4>带禁用选项</h4>
        <Cascader
          placeholder="请选择（部分选项禁用）"
          style={{ width: 260 }}
          options={mockOptionsWithDisabled}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

export const 交互方式 = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>展开方式</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--tt-color-grey-5)' }}>点击展开（默认）</h5>
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
            <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--tt-color-grey-5)' }}>悬停展开</h5>
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
      </div>
      <div>
        <h4>可搜索</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Cascader
            showSearch
            placeholder="搜索地区（如：西湖、南山、鼓楼）"
            style={{ width: 320 }}
            options={mockOptions}
            value={value3}
            onChange={setValue3}
            version={Cascader.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 多选模式 = () => {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState([
    ['zhejiang', 'hangzhou', 'xihu'],
    ['jiangsu', 'nanjing', 'xuanwu']
  ]);
  const [value3, setValue3] = useState([
    ['zhejiang', 'hangzhou', 'xihu'],
    ['zhejiang', 'hangzhou', 'binjiang'],
    ['guangdong', 'shenzhen', 'nanshan'],
    ['guangdong', 'guangzhou', 'tianhe'],
    ['jiangsu', 'nanjing', 'xuanwu'],
    ['jiangsu', 'suzhou', 'gusu']
  ]);
  const [value4, setValue4] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
        <h4>超出数量折叠显示（maxTagCount=2）</h4>
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
      <div>
        <h4>多选 + 全选</h4>
        <Cascader
          multiple
          showSelectAll
          placeholder="请选择，支持全选"
          style={{ width: 400 }}
          options={mockOptions}
          value={value4}
          onChange={setValue4}
          version={Cascader.version}
        />
      </div>
    </div>
  );
};

export const 始终展开预览 = () => {
  const [value1, setValue1] = useState(['zhejiang', 'hangzhou', 'xihu']);
  const [value2, setValue2] = useState([
    ['zhejiang', 'hangzhou', 'xihu'],
    ['jiangsu', 'nanjing', 'xuanwu']
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4>单选下拉菜单始终展开</h4>
        <div style={{ paddingBottom: '220px' }}>
          <Cascader
            open={true}
            placeholder="请选择"
            style={{ width: 260 }}
            options={mockOptions}
            value={value1}
            onChange={setValue1}
            version={Cascader.version}
          />
        </div>
      </div>
      <div>
        <h4>多选下拉菜单始终展开</h4>
        <div style={{ paddingBottom: '220px' }}>
          <Cascader
            multiple
            open={true}
            placeholder="请选择"
            style={{ width: 400 }}
            options={mockOptions}
            value={value2}
            onChange={setValue2}
            version={Cascader.version}
          />
        </div>
      </div>
    </div>
  );
};
