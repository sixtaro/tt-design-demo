import React from 'react';
import Masonry from './index';

const mockItems = [
  { key: '1', title: '卡片一', content: '用于展示简短摘要信息。', height: 120 },
  { key: '2', title: '卡片二', content: '这一项内容稍微长一些，用于模拟真实业务卡片的高度变化。', height: 180 },
  { key: '3', title: '卡片三', content: '支持不同高度组合。', height: 140 },
  { key: '4', title: '卡片四', content: '瀑布流适合图文混排和灵活布局。', height: 220 },
  { key: '5', title: '卡片五', content: '可以快速搭建内容看板。', height: 160 },
  { key: '6', title: '卡片六', content: '也适合文件、图片、资讯列表。', height: 200 },
];

const dashboardItems = [
  { key: 'a', title: '经营概览', desc: '展示核心经营指标和变化趋势。', height: 180, background: 'var(--tt-bg-light)' },
  { key: 'b', title: '今日预警', desc: '异常订单、设备离线与超时任务。', height: 140, background: 'var(--tt-color-grey-1)' },
  { key: 'c', title: '用户分析', desc: '用户活跃、转化与新增分布。', height: 240, background: 'var(--tt-bg-white)' },
  { key: 'd', title: '工单动态', desc: '待处理、处理中和已完成工单。', height: 160, background: 'var(--tt-color-primary-1)' },
  { key: 'e', title: '区域排行', desc: '按区域维度展示业务排名。', height: 210, background: 'var(--tt-bg-light)' },
  { key: 'f', title: '资源使用率', desc: '统计资源占用和峰值情况。', height: 130, background: 'var(--tt-bg-white)' },
];

const galleryItems = [
  { key: 'g1', title: '园区入口', ratio: 160 },
  { key: 'g2', title: '控制中心', ratio: 220 },
  { key: 'g3', title: '充电区域', ratio: 180 },
  { key: 'g4', title: '设备机房', ratio: 260 },
  { key: 'g5', title: '服务大厅', ratio: 150 },
  { key: 'g6', title: '访客区域', ratio: 210 },
];

const createCardStyle = (height, background) => ({
  minHeight: height,
  padding: 16,
  borderRadius: 8,
  boxSizing: 'border-box',
  border: '1px solid var(--tt-border-color-light)',
  background,
  color: 'var(--tt-text-title)',
});

export default {
  title: '布局/Masonry 瀑布流',
  component: Masonry,
  parameters: {
    docs: {
      description: {
        component: `Masonry 瀑布流组件 - 版本: ${Masonry.version}\n\n参考新版布局能力，自定义实现自适应瀑布流排布。`
      }
    }
  },
  argTypes: {
    columnCount: {
      control: 'number'
    },
    minColumnWidth: {
      control: 'number'
    },
    gap: {
      control: 'number'
    },
    version: {
      control: false
    }
  }
};

export const 基础用法 = () => (
  <Masonry
    items={mockItems}
    renderItem={(item) => (
      <div style={createCardStyle(item.height, 'var(--tt-bg-white)')}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{item.title}</div>
        <div style={{ color: 'var(--tt-text-secondary)' }}>{item.content}</div>
      </div>
    )}
    version={Masonry.version}
  />
);

export const 固定列数 = () => (
  <Masonry
    columnCount={3}
    items={mockItems}
    renderItem={(item, index) => (
      <div
        style={createCardStyle(
          item.height,
          index % 2 === 0 ? 'var(--tt-bg-light)' : 'var(--tt-color-grey-1)'
        )}
      >
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{item.title}</div>
        <div style={{ color: 'var(--tt-text-secondary)' }}>{item.content}</div>
      </div>
    )}
    version={Masonry.version}
  />
);

export const 自定义子节点 = () => (
  <Masonry minColumnWidth={220} gap={20} version={Masonry.version}>
    <div style={createCardStyle(120, 'var(--tt-bg-light)')}>快捷入口</div>
    <div style={createCardStyle(240, 'var(--tt-color-grey-1)')}>图表摘要</div>
    <div style={createCardStyle(160, 'var(--tt-bg-white)')}>最新动态</div>
    <div style={createCardStyle(280, 'var(--tt-color-primary-1)')}>分析报告</div>
    <div style={createCardStyle(140, 'var(--tt-bg-white)')}>待办事项</div>
  </Masonry>
);

export const 仪表盘看板 = () => (
  <Masonry
    items={dashboardItems}
    minColumnWidth={260}
    gap={20}
    renderItem={(item) => (
      <div style={createCardStyle(item.height, item.background)}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{item.title}</div>
        <div style={{ color: 'var(--tt-text-secondary)' }}>{item.desc}</div>
      </div>
    )}
    version={Masonry.version}
  />
);

export const 图片流布局 = () => (
  <Masonry
    items={galleryItems}
    minColumnWidth={220}
    gap={18}
    renderItem={(item, index) => (
      <div style={createCardStyle(item.ratio + 72, 'var(--tt-bg-white)')}>
        <div
          style={{
            height: item.ratio,
            borderRadius: 6,
            marginBottom: 12,
            background: index % 2 === 0
              ? 'linear-gradient(180deg, #EAF3FF 0%, #CFE2FF 100%)'
              : 'linear-gradient(180deg, #F4F7FB 0%, #E1E8F0 100%)'
          }}
        />
        <div style={{ fontWeight: 500 }}>{item.title}</div>
      </div>
    )}
    version={Masonry.version}
  />
);

export const 紧凑列宽 = () => (
  <Masonry
    items={mockItems.concat(dashboardItems.slice(0, 4))}
    minColumnWidth={180}
    gap={12}
    renderItem={(item) => (
      <div style={createCardStyle(item.height || 160, 'var(--tt-bg-white)')}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{item.title}</div>
        <div style={{ color: 'var(--tt-text-secondary)' }}>{item.content || item.desc}</div>
      </div>
    )}
    version={Masonry.version}
  />
);
