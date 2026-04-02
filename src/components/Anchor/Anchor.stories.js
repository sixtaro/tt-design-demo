import React from 'react';
import Anchor from './index';

export default {
  title: '导航/Anchor 锚点',
  component: Anchor,
  parameters: {
    docs: {
      description: {
        component: `Anchor 锚点组件 - 版本: ${Anchor.version}\n\n用于跳转到页面指定位置的导航组件，支持一级/二级锚点、自定义偏移量等。`
      }
    }
  },
  argTypes: {
    affix: {
      control: 'boolean',
      description: '是否固定模式'
    },
    offsetTop: {
      control: 'number',
      description: '距离窗口顶部偏移量'
    },
    targetOffset: {
      control: 'number',
      description: '锚点滚动偏移量'
    },
    showInkInFixed: {
      control: 'boolean',
      description: '固定模式下是否显示小圆点'
    },
  }
};

/* ========== 基础用法 ========== */
export const 基础用法 = () => (
  <div style={{ display: 'flex', gap: 64 }}>
    <div>
      <h4 style={{ marginBottom: 16 }}>一级锚点</h4>
      <div id="anchor-basic-demo" style={{ height: 200, overflowY: 'auto', padding: '0 8px' }}>
        {['基础用法', '自定义偏移', '固定模式', 'API 说明'].map((item, i) => (
          <div key={i} id={`basic-part-${i}`} style={{ height: 120, padding: 16, background: 'var(--tt-bg-light)', borderRadius: 8, marginBottom: 12 }}>
            <h3>{item}</h3>
            <p style={{ color: 'var(--tt-text-secondary)' }}>这是 {item} 的内容区域</p>
          </div>
        ))}
      </div>
      <Anchor
        getContainer={() => document.getElementById('anchor-basic-demo')}
        targetOffset={0}
        onClick={(e) => e.preventDefault()}
      >
        <Anchor.Link href="#basic-part-0" title="基础用法" />
        <Anchor.Link href="#basic-part-1" title="自定义偏移" />
        <Anchor.Link href="#basic-part-2" title="固定模式" />
        <Anchor.Link href="#basic-part-3" title="API 说明" />
      </Anchor>
    </div>
  </div>
);

/* ========== 带子级锚点 ========== */
export const 带子级锚点 = () => (
  <div style={{ display: 'flex', gap: 64 }}>
    <div>
      <h4 style={{ marginBottom: 16 }}>一级 + 二级锚点</h4>
      <div id="anchor-nested-demo" style={{ height: 280, overflowY: 'auto', padding: '0 8px' }}>
        {[
          { title: '组件概览', children: ['组件列表', '版本信息'] },
          { title: '快速上手', children: ['安装', '使用方式'] },
          { title: '主题定制', children: ['颜色变量', '字体规范'] },
        ].map((section, i) => (
          <div key={i}>
            <div id={`nested-part-${i}`} style={{ height: 80, padding: 16, background: 'var(--tt-bg-light)', borderRadius: 8, marginBottom: 8 }}>
              <h3>{section.title}</h3>
            </div>
            {section.children.map((child, j) => (
              <div key={j} id={`nested-part-${i}-${j}`} style={{ height: 60, padding: 12, background: 'var(--tt-bg-lighter)', borderRadius: 8, marginBottom: 8, marginLeft: 16 }}>
                <span style={{ color: 'var(--tt-text-secondary)' }}>{child}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Anchor
        getContainer={() => document.getElementById('anchor-nested-demo')}
        targetOffset={0}
        onClick={(e) => e.preventDefault()}
      >
        <Anchor.Link href="#nested-part-0" title="组件概览">
          <Anchor.Link href="#nested-part-0-0" title="组件列表" />
          <Anchor.Link href="#nested-part-0-1" title="版本信息" />
        </Anchor.Link>
        <Anchor.Link href="#nested-part-1" title="快速上手">
          <Anchor.Link href="#nested-part-1-0" title="安装" />
          <Anchor.Link href="#nested-part-1-1" title="使用方式" />
        </Anchor.Link>
        <Anchor.Link href="#nested-part-2" title="主题定制">
          <Anchor.Link href="#nested-part-2-0" title="颜色变量" />
          <Anchor.Link href="#nested-part-2-1" title="字体规范" />
        </Anchor.Link>
      </Anchor>
    </div>
  </div>
);
