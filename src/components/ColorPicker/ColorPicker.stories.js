import React, { useState } from 'react';
import ColorPicker from './index';

export default {
  title: '数据录入/ColorPicker 颜色选择器',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 ColorPicker 颜色选择器组件，支持纯色和渐变色选择，版本：${ColorPicker.version}`
      }
    }
  },
  argTypes: {
    initialColor: { control: 'text', description: '初始颜色，默认值为 #000000' },
    showIcon: { control: 'boolean', description: '是否显示图标' },
    showStatus: { control: 'boolean', description: '是否显示颜色模式/选择器' },
    initialStatus: { control: { type: 'select', options: ['pure', 'gradient'] }, description: '初始颜色模式' },
    debounceTime: { control: 'number', description: '防抖时间（毫秒）' }
  }
};

export const 基础用法 = () => {
  const [color, setColor] = useState('#1890ff');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h4>默认状态</h4>
        <ColorPicker initialColor="#1890ff" onChange={setColor} version={ColorPicker.version} />
        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>当前颜色：{color}</div>
      </div>
      <div style={{ width: 100, height: 100, background: color, borderRadius: 4 }} />
    </div>
  );
};

export const 显示图标 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4>带图标的颜色选择器</h4>
      <ColorPicker initialColor="#52c41a" showIcon version={ColorPicker.version} />
    </div>
  );
};

export const 纯色模式 = () => {
  const [color, setColor] = useState('#f5222d');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4>仅纯色模式（隐藏模式切换）</h4>
      <ColorPicker 
        initialColor="#f5222d" 
        onChange={setColor} 
        showStatus={false}
        initialStatus="pure"
        version={ColorPicker.version}
      />
      <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>当前颜色：{color}</div>
    </div>
  );
};

export const 渐变模式 = () => {
  const [color, setColor] = useState('linear-gradient(0deg, #1890ff 0%, #52c41a 100%)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4>默认渐变模式</h4>
      <ColorPicker 
        initialColor="#1890ff" 
        onChange={setColor} 
        initialStatus="gradient"
        version={ColorPicker.version}
      />
      <div style={{ marginTop: 8, fontSize: 14, color: '#666', wordBreak: 'break-all' }}>当前渐变：{color}</div>
      <div style={{ width: '100%', height: 100, background: color, borderRadius: 4 }} />
    </div>
  );
};

export const 受控组件 = () => {
  const [value, setValue] = useState('#722ed1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4>受控模式</h4>
      <ColorPicker 
        value={value} 
        onValueChange={setValue}
        version={ColorPicker.version}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => setValue('#1890ff')} style={{ padding: '4px 12px' }}>蓝色</button>
        <button onClick={() => setValue('#52c41a')} style={{ padding: '4px 12px' }}>绿色</button>
        <button onClick={() => setValue('#f5222d')} style={{ padding: '4px 12px' }}>红色</button>
      </div>
      <div style={{ width: 100, height: 100, background: value, borderRadius: 4 }} />
    </div>
  );
};
