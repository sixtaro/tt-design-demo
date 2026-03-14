import React, { useState } from 'react';
import Checkbox from './index';

export default {
  title: '数据录入/Checkbox 复选框',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `Checkbox 组件 - 版本: ${Checkbox.version}`
      }
    }
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    }
  }
};

export const 基础用法 = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      version={Checkbox.version}
    >
      选项
    </Checkbox>
  );
};

export const 默认选中 = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      version={Checkbox.version}
    >
      选项
    </Checkbox>
  );
};

export const 禁用状态 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Checkbox disabled version={Checkbox.version}>
      禁用选项
    </Checkbox>
    <Checkbox disabled checked version={Checkbox.version}>
      禁用选中
    </Checkbox>
  </div>
);

export const 半选状态 = () => {
  const [checkedList, setCheckedList] = useState(['苹果', '香蕉']);
  const allChecked = checkedList.length === 3;
  const indeterminate = checkedList.length > 0 && checkedList.length < 3;

  const handleCheckAll = (e) => {
    setCheckedList(e.target.checked ? ['苹果', '香蕉', '橙子'] : []);
  };

  const handleCheckItem = (value) => {
    const index = checkedList.indexOf(value);
    const newCheckedList = [...checkedList];
    if (index === -1) {
      newCheckedList.push(value);
    } else {
      newCheckedList.splice(index, 1);
    }
    setCheckedList(newCheckedList);
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid #E9E9E9', marginBottom: '8px' }}>
        <Checkbox
          indeterminate={indeterminate}
          checked={allChecked}
          onChange={handleCheckAll}
          version={Checkbox.version}
        >
          全选
        </Checkbox>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox
          checked={checkedList.includes('苹果')}
          onChange={() => handleCheckItem('苹果')}
          version={Checkbox.version}
        >
          苹果
        </Checkbox>
        <Checkbox
          checked={checkedList.includes('香蕉')}
          onChange={() => handleCheckItem('香蕉')}
          version={Checkbox.version}
        >
          香蕉
        </Checkbox>
        <Checkbox
          checked={checkedList.includes('橙子')}
          onChange={() => handleCheckItem('橙子')}
          version={Checkbox.version}
        >
          橙子
        </Checkbox>
      </div>
    </div>
  );
};

export const 复选框组 = () => {
  const [checkedList, setCheckedList] = useState(['A']);
  return (
    <Checkbox.Group
      options={[
        { label: '选项A', value: 'A' },
        { label: '选项B', value: 'B' },
        { label: '选项C', value: 'C' },
        { label: '选项D', value: 'D', disabled: true }
      ]}
      value={checkedList}
      onChange={setCheckedList}
      version={Checkbox.version}
    />
  );
};
