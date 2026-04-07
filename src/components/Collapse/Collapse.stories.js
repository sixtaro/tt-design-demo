import React, { useState } from 'react';
import Collapse from './index';

const { Panel } = Collapse;

export default {
  title: '数据展示/Collapse 折叠面板',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Collapse 折叠面板组件，版本：${Collapse.version}`
      }
    }
  }
};

const text = '这是一段内容文本，用于展示折叠面板的展开与收起效果。';

// 基础用法
export const 基础用法 = () => (
  <Collapse defaultActiveKey={['1']}>
    <Panel header="面板一" key="1">
      <p>{text}</p>
    </Panel>
    <Panel header="面板二" key="2">
      <p>{text}</p>
    </Panel>
    <Panel header="面板三" key="3">
      <p>{text}</p>
    </Panel>
  </Collapse>
);

// 手风琴
export const 手风琴 = () => (
  <Collapse accordion>
    <Panel header="面板一" key="1">
      <p>{text}</p>
    </Panel>
    <Panel header="面板二" key="2">
      <p>{text}</p>
    </Panel>
    <Panel header="面板三" key="3">
      <p>{text}</p>
    </Panel>
  </Collapse>
);

// 受控模式
export const 受控模式 = () => {
  const [activeKey, setActiveKey] = useState(['1']);
  return (
    <Collapse activeKey={activeKey} onChange={setActiveKey}>
      <Panel header="面板一" key="1">
        <p>{text}</p>
      </Panel>
      <Panel header="面板二" key="2">
        <p>{text}</p>
      </Panel>
    </Collapse>
  );
};
