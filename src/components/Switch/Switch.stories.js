import React, { useState } from 'react';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import Switch from './index';

export default {
  title: '数据录入/Switch 开关',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Switch 开关组件，版本：${Switch.version}`
      }
    }
  },
  argTypes: {
    checked: { control: 'boolean', description: '是否选中' },
    disabled: { control: 'boolean', description: '是否禁用' },
    loading: { control: 'boolean', description: '加载中状态' },
    size: { control: { type: 'select', options: ['default', 'small'] }, description: '开关大小' }
  }
};

// 基础用法
export const 基础用法 = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认状态</h4>
        <Switch version={Switch.version} />
      </div>
      <div>
        <h4>开启状态</h4>
        <Switch checked version={Switch.version} />
      </div>
      <div>
        <h4>受控模式</h4>
        <Switch checked={checked} onChange={setChecked} version={Switch.version} />
      </div>
    </div>
  );
};

// 不同状态
export const 不同状态 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>禁用 - 关闭</h4>
        <Switch disabled version={Switch.version} />
      </div>
      <div>
        <h4>禁用 - 开启</h4>
        <Switch disabled checked version={Switch.version} />
      </div>
      <div>
        <h4>加载中</h4>
        <Switch loading version={Switch.version} />
      </div>
      <div>
        <h4>加载中 - 开启</h4>
        <Switch loading checked version={Switch.version} />
      </div>
    </div>
  );
};

// 尺寸
export const 不同尺寸 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>默认尺寸</h4>
        <div style={{ display: 'flex', gap: 16 }}>
          <Switch version={Switch.version} />
          <Switch checked version={Switch.version} />
        </div>
      </div>
      <div>
        <h4>小尺寸</h4>
        <div style={{ display: 'flex', gap: 16 }}>
          <Switch size="small" version={Switch.version} />
          <Switch size="small" checked version={Switch.version} />
        </div>
      </div>
    </div>
  );
};

// 带文字和图标
export const 带文字和图标 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h4>带文字</h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Switch checkedChildren="开" unCheckedChildren="关" version={Switch.version} />
          <Switch checkedChildren="开" unCheckedChildren="关" checked version={Switch.version} />
        </div>
      </div>
      <div>
        <h4>带图标</h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            version={Switch.version}
          />
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked
            version={Switch.version}
          />
        </div>
      </div>
      <div>
        <h4>小尺寸带文字</h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Switch size="small" checkedChildren="1" unCheckedChildren="0" version={Switch.version} />
          <Switch size="small" checkedChildren="1" unCheckedChildren="0" checked version={Switch.version} />
        </div>
      </div>
      <div>
        <h4>带文字且禁用</h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Switch disabled checkedChildren="开" unCheckedChildren="关" version={Switch.version} />
          <Switch disabled checkedChildren="开" unCheckedChildren="关" checked version={Switch.version} />
        </div>
      </div>
    </div>
  );
};
