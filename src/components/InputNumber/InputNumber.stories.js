import React, { useState } from 'react';
import InputNumber from './index';

export default {
  title: '数据录入/InputNumber 数字输入框',
  component: InputNumber,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 InputNumber 数字输入框组件，版本：${InputNumber.version}`
      }
    }
  },
  argTypes: {
    min: { control: 'number', description: '最小值' },
    max: { control: 'number', description: '最大值' },
    step: { control: 'number', description: '步长' },
    defaultValue: { control: 'number', description: '默认值' },
    disabled: { control: 'boolean', description: '是否禁用' },
    size: { control: { type: 'select', options: ['small', 'default', 'large'] }, description: '输入框大小' },
    placeholder: { control: 'text', description: '占位文本' },
    precision: { control: 'number', description: '精度' },
    buttonMode: { control: { type: 'select', options: ['default', 'side'] }, description: '按钮模式' },
    formatter: { control: null, description: '格式化函数' },
    parser: { control: null, description: '转换函数' },
    prefix: { control: 'text', description: '前缀' },
    suffix: { control: 'text', description: '后缀' },
    addonBefore: { control: 'text', description: '前置标签' },
    addonAfter: { control: 'text', description: '后置标签' },
  }
};

// 基础用法
export const 基础用法 = () => {
  const [value, setValue] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <InputNumber placeholder="请输入数字" style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>有默认值</h4>
        <InputNumber defaultValue={100} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>受控模式</h4>
        <InputNumber
          value={value}
          onChange={setValue}
          placeholder="请输入数字"
          style={{ width: 200 }}
          version={InputNumber.version}
        />
        <span style={{ marginLeft: 12, color: 'var(--tt-color-grey-6)' }}>当前值: {value ?? '-'}</span>
      </div>
    </div>
  );
};

// 不同状态
export const 不同状态 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>禁用状态</h4>
        <InputNumber disabled defaultValue={50} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>错误状态</h4>
        <InputNumber status="error" placeholder="错误状态" style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>只读状态</h4>
        <InputNumber readOnly defaultValue={88} style={{ width: 200 }} version={InputNumber.version} />
      </div>
    </div>
  );
};

// 不同尺寸
export const 不同尺寸 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>小尺寸 - small</h4>
        <InputNumber size="small" defaultValue={10} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>默认尺寸 - default</h4>
        <InputNumber size="default" defaultValue={100} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>大尺寸 - large</h4>
        <InputNumber size="large" defaultValue={1000} style={{ width: 200 }} version={InputNumber.version} />
      </div>
    </div>
  );
};

// 范围和步长
export const 范围和步长 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>范围限制（0 - 100）</h4>
        <InputNumber min={0} max={100} defaultValue={50} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>步长 10</h4>
        <InputNumber step={10} defaultValue={0} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>小数步长 0.1</h4>
        <InputNumber step={0.1} defaultValue={0} style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>限制精度（保留2位小数）</h4>
        <InputNumber precision={2} step={0.01} defaultValue={1.23} style={{ width: 200 }} version={InputNumber.version} />
      </div>
    </div>
  );
};

// 格式化
export const 格式化显示 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>货币格式化（¥ + 千分位）</h4>
        <InputNumber
          defaultValue={1000}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
      <div>
        <h4>百分比格式化（%）</h4>
        <InputNumber
          min={0}
          max={100}
          defaultValue={50}
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace('%', '')}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
      <div>
        <h4>千分位分隔</h4>
        <InputNumber
          defaultValue={1234567}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/(,*)/g, '')}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
    </div>
  );
};

// 前缀后缀
export const 前缀后缀 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认模式 - 仅后缀</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <InputNumber defaultValue={100} suffix="元" style={{ width: 160 }} version={InputNumber.version} />
          <InputNumber defaultValue={50} suffix="px" style={{ width: 160 }} version={InputNumber.version} />
          <InputNumber defaultValue={80} suffix="%" min={0} max={100} style={{ width: 160 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>默认模式 - 仅前缀</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <InputNumber defaultValue={88} prefix="¥" style={{ width: 160 }} version={InputNumber.version} />
          <InputNumber defaultValue={66} prefix="$" style={{ width: 160 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>默认模式 - 前缀 + 后缀</h4>
        <InputNumber defaultValue={99} prefix="¥" suffix="元" style={{ width: 200 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>侧边按钮模式 - 前缀/后缀</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <InputNumber buttonMode="side" defaultValue={50} suffix="px" style={{ width: 180 }} version={InputNumber.version} />
          <InputNumber buttonMode="side" defaultValue={100} prefix="¥" suffix="元" style={{ width: 220 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>不同尺寸 + 后缀</h4>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <InputNumber size="small" defaultValue={20} suffix="px" style={{ width: 140 }} version={InputNumber.version} />
          <InputNumber size="default" defaultValue={100} suffix="px" style={{ width: 160 }} version={InputNumber.version} />
          <InputNumber size="large" defaultValue={200} suffix="px" style={{ width: 180 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>禁用状态 + 后缀</h4>
        <InputNumber disabled defaultValue={100} suffix="px" style={{ width: 200 }} version={InputNumber.version} />
      </div>
    </div>
  );
};

// 前后置标签 addonBefore/addonAfter
export const 前后置标签 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>前置标签 addonBefore</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <InputNumber addonBefore="¥" defaultValue={100} style={{ width: 220 }} version={InputNumber.version} />
          <InputNumber addonBefore="$" defaultValue={100} style={{ width: 220 }} version={InputNumber.version} />
          <InputNumber addonBefore="€" defaultValue={100} style={{ width: 220 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>后置标签 addonAfter</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <InputNumber addonAfter="元" defaultValue={100} style={{ width: 220 }} version={InputNumber.version} />
          <InputNumber addonAfter="px" defaultValue={200} style={{ width: 220 }} version={InputNumber.version} />
          <InputNumber addonAfter="%" defaultValue={50} min={0} max={100} style={{ width: 220 }} version={InputNumber.version} />
        </div>
      </div>
      <div>
        <h4>前置 + 后置标签</h4>
        <InputNumber addonBefore="¥" addonAfter="元" defaultValue={99} style={{ width: 280 }} version={InputNumber.version} />
      </div>
      <div>
        <h4>不同尺寸 + 前后置标签</h4>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <InputNumber size="small" addonBefore="¥" addonAfter="元" defaultValue={88} style={{ width: 240 }} version={InputNumber.version} />
          <InputNumber size="default" addonBefore="¥" addonAfter="元" defaultValue={99} style={{ width: 260 }} version={InputNumber.version} />
          <InputNumber size="large" addonBefore="¥" addonAfter="元" defaultValue={199} style={{ width: 280 }} version={InputNumber.version} />
        </div>
      </div>
    </div>
  );
};

// 侧边按钮模式
export const 侧边按钮模式 = () => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(50);
  const [value3, setValue3] = useState(10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>基础侧边按钮</h4>
        <InputNumber
          buttonMode="side"
          defaultValue={0}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
      <div>
        <h4>受控模式</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <InputNumber
            buttonMode="side"
            value={value1}
            onChange={setValue1}
            style={{ width: 200 }}
            version={InputNumber.version}
          />
          <span style={{ color: 'var(--tt-color-grey-6)' }}>当前值: {value1}</span>
        </div>
      </div>
      <div>
        <h4>带范围限制（0-100）</h4>
        <InputNumber
          buttonMode="side"
          min={0}
          max={100}
          value={value2}
          onChange={setValue2}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
      <div>
        <h4>自定义步长（5）</h4>
        <InputNumber
          buttonMode="side"
          step={5}
          value={value3}
          onChange={setValue3}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
      <div>
        <h4>不同尺寸</h4>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <InputNumber
            buttonMode="side"
            size="small"
            defaultValue={10}
            style={{ width: 160 }}
            version={InputNumber.version}
          />
          <InputNumber
            buttonMode="side"
            size="default"
            defaultValue={100}
            style={{ width: 180 }}
            version={InputNumber.version}
          />
          <InputNumber
            buttonMode="side"
            size="large"
            defaultValue={1000}
            style={{ width: 200 }}
            version={InputNumber.version}
          />
        </div>
      </div>
      <div>
        <h4>禁用状态</h4>
        <InputNumber
          buttonMode="side"
          disabled
          defaultValue={50}
          style={{ width: 200 }}
          version={InputNumber.version}
        />
      </div>
    </div>
  );
};
