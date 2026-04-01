import React, { useMemo, useRef, useState } from 'react';
import Tour from './index';
import Button from '../Button';
import Card from '../Card';

const blockStyle = {
  padding: 20,
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default {
  title: '数据展示/Tour 漫游式引导',
  component: Tour,
  parameters: {
    docs: {
      description: {
        component: `Tour 漫游式引导组件 - 版本: ${Tour.version}\n\n参考 Ant Design 5 Tour 交互，自定义实现步骤引导、高亮和遮罩效果。`
      }
    }
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right']
      }
    },
    mask: { control: 'boolean' },
    version: { control: false }
  }
};

export const 基础用法 = () => {
  const [open, setOpen] = useState(false);
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const steps = useMemo(() => ([
    {
      title: '查看核心指标',
      description: '这里会展示当前工作台的核心经营指标和变化趋势。',
      target: () => firstRef.current,
      placement: 'bottomLeft',
    },
    {
      title: '筛选数据范围',
      description: '可以按时间、区域和业务线快速切换统计范围。',
      target: () => secondRef.current,
      placement: 'right',
    },
    {
      title: '执行快捷操作',
      description: '支持导出、分享和跳转到更详细的分析页面。',
      target: () => thirdRef.current,
      placement: 'topRight',
    },
  ]), []);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" version={Button.version} onClick={() => setOpen(true)}>
        开始引导
      </Button>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        <div ref={firstRef}>
          <Card version={Card.version}>
            <div style={blockStyle}>核心指标卡片</div>
          </Card>
        </div>
        <div ref={secondRef}>
          <Card version={Card.version}>
            <div style={blockStyle}>筛选面板</div>
          </Card>
        </div>
        <div ref={thirdRef}>
          <Card version={Card.version}>
            <div style={blockStyle}>快捷操作区</div>
          </Card>
        </div>
      </div>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        steps={steps}
        version={Tour.version}
      />
    </div>
  );
};

export const 无目标卡片 = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" version={Button.version} onClick={() => setOpen(true)}>
        打开说明
      </Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        steps={[
          {
            title: '欢迎使用工作台',
            description: '当前版本新增了筛选能力、快捷看板和更多布局组件，可在左侧菜单中继续探索。',
          },
        ]}
        version={Tour.version}
      />
    </div>
  );
};

export const 自定义封面 = () => {
  const [open, setOpen] = useState(false);
  const targetRef = useRef(null);

  return (
    <div style={{ padding: 24 }}>
      <div ref={targetRef} style={{ width: 260 }}>
        <Card version={Card.version}>
          <div style={blockStyle}>运营分析面板</div>
        </Card>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button version={Button.version} onClick={() => setOpen(true)}>
          查看引导
        </Button>
      </div>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        steps={[
          {
            title: '新增分析面板',
            description: '可以在这里查看流量趋势、用户画像和实时告警。',
            target: () => targetRef.current,
            placement: 'right',
            cover: (
              <div style={{ padding: 24, background: 'linear-gradient(135deg, #EAF3FF 0%, #D7E8FF 100%)' }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--tt-text-title)' }}>分析能力升级</div>
                <div style={{ marginTop: 8, color: 'var(--tt-text-secondary)' }}>新增多种看板与下钻路径</div>
              </div>
            ),
          },
        ]}
        version={Tour.version}
      />
    </div>
  );
};
