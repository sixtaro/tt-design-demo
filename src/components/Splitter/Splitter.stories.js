import React from 'react';
import Splitter from './index';

const panelStyle = {
  padding: 16,
  color: 'var(--tt-text-title)',
  fontSize: 14,
  lineHeight: '22px',
};

const blockStyle = {
  height: '100%',
  borderRadius: 6,
  padding: 16,
  boxSizing: 'border-box',
};

export default {
  title: '布局/Splitter 分隔面板',
  component: Splitter,
  parameters: {
    docs: {
      description: {
        component: `Splitter 分隔面板组件 - 版本: ${Splitter.version}\n\n参考 Ant Design 5 Splitter 交互，自定义实现可拖拽分隔布局。`
      }
    }
  },
  argTypes: {
    layout: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      }
    },
    version: {
      control: false
    }
  }
};

export const 基础用法 = () => (
  <div style={{ height: 280 }}>
    <Splitter version={Splitter.version}>
      <Splitter.Panel size="30%" min="20%">
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          左侧面板
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
          右侧面板
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export const 三栏布局 = () => (
  <div style={{ height: 320 }}>
    <Splitter version={Splitter.version}>
      <Splitter.Panel size={220} min={180}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          资源树
        </div>
      </Splitter.Panel>
      <Splitter.Panel size="40%" min="25%">
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
          列表区域
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={240}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-primary-1)' }}>
          详情区域
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export const 上下分隔 = () => (
  <div style={{ height: 360 }}>
    <Splitter layout="vertical" version={Splitter.version}>
      <Splitter.Panel size="45%" min="30%">
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          上方面板
        </div>
      </Splitter.Panel>
      <Splitter.Panel min="30%">
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
          下方面板
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export const 嵌套工作台 = () => (
  <div style={{ height: 420 }}>
    <Splitter version={Splitter.version}>
      <Splitter.Panel size={220} min={180}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          左侧导航
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={420}>
        <Splitter layout="vertical" version={Splitter.version}>
          <Splitter.Panel size="28%" min="22%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
              顶部筛选区
            </div>
          </Splitter.Panel>
          <Splitter.Panel min="40%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-primary-1)' }}>
              主内容区
            </div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel size={280} min={220}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          右侧属性面板
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export const 编辑器布局 = () => (
  <div style={{ height: 460 }}>
    <Splitter layout="vertical" version={Splitter.version}>
      <Splitter.Panel size={68} min={56} max={96}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
          顶部工具栏
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={260}>
        <Splitter version={Splitter.version}>
          <Splitter.Panel size={240} min={180}>
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
              组件物料区
            </div>
          </Splitter.Panel>
          <Splitter.Panel min={320}>
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-primary-1)' }}>
              画布编辑区
            </div>
          </Splitter.Panel>
          <Splitter.Panel size={300} min={220}>
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
              配置面板
            </div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel size={120} min={96}>
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          底部日志区
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export const 双向嵌套分析台 = () => (
  <div style={{ height: 460 }}>
    <Splitter version={Splitter.version}>
      <Splitter.Panel size="22%" min="18%">
        <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
          维度树
        </div>
      </Splitter.Panel>
      <Splitter.Panel min="52%">
        <Splitter layout="vertical" version={Splitter.version}>
          <Splitter.Panel size="38%" min="28%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
              查询条件区
            </div>
          </Splitter.Panel>
          <Splitter.Panel min="36%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-primary-1)' }}>
              图表分析区
            </div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel size="24%" min="18%">
        <Splitter layout="vertical" version={Splitter.version}>
          <Splitter.Panel size="50%" min="35%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-bg-light)' }}>
              指标说明
            </div>
          </Splitter.Panel>
          <Splitter.Panel min="30%">
            <div style={{ ...blockStyle, ...panelStyle, background: 'var(--tt-color-grey-1)' }}>
              告警信息
            </div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  </div>
);
