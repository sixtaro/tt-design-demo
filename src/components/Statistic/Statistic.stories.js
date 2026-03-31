import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined } from '@ant-design/icons';
import Statistic from './index';

const cardStyle = {
  minWidth: 220,
  padding: 20,
  borderRadius: 12,
  border: '1px solid var(--tt-border-color-light)',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
  boxSizing: 'border-box',
};

const panelStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 20,
};

const captionStyle = {
  marginTop: 12,
  color: 'var(--tt-text-secondary)',
  fontSize: 12,
  lineHeight: '18px',
};

export default {
  title: '数据展示/Statistic 统计数值',
  component: Statistic,
  parameters: {
    docs: {
      description: {
        component: `Statistic 统计数值组件 - 版本: ${Statistic.version}\n\n基于 Ant Design 4.24 Statistic 封装，用于展示关键业务指标和倒计时。`
      }
    }
  },
  argTypes: {
    title: {
      control: 'text'
    },
    value: {
      control: 'number'
    },
    precision: {
      control: 'number'
    },
    loading: {
      control: 'boolean'
    },
    version: {
      control: false
    }
  }
};

const StatisticCard = ({ children, caption, style }) => (
  <div style={{ ...cardStyle, ...style }}>
    {children}
    {caption ? <div style={captionStyle}>{caption}</div> : null}
  </div>
);

const Template = (args) => (
  <StatisticCard caption="适合用于展示单个核心指标。">
    <Statistic {...args} />
  </StatisticCard>
);

export const 基础用法 = Template.bind({});
基础用法.args = {
  title: '今日成交额',
  value: 112893,
  version: Statistic.version
};

export const 带前后缀 = Template.bind({});
带前后缀.args = {
  title: '转化率',
  value: 93.7,
  precision: 1,
  prefix: <LikeOutlined />,
  suffix: '%',
  version: Statistic.version
};

export const 状态趋势 = () => (
  <div style={panelStyle}>
    <StatisticCard caption="相比上周，核心指标持续提升。">
      <Statistic
        title="较上周增长"
        value={11.28}
        precision={2}
        valueStyle={{ color: 'var(--tt-color-primary-6)' }}
        prefix={<ArrowUpOutlined />}
        suffix="%"
        version={Statistic.version}
      />
    </StatisticCard>
    <StatisticCard caption="需要结合来源分析回落原因。">
      <Statistic
        title="较上周下降"
        value={9.3}
        precision={1}
        valueStyle={{ color: 'var(--tt-color-red-6)' }}
        prefix={<ArrowDownOutlined />}
        suffix="%"
        version={Statistic.version}
      />
    </StatisticCard>
  </div>
);

export const 倒计时 = () => (
  <StatisticCard
    caption="适合用于活动结束、任务截止等时间敏感场景。"
    style={{ maxWidth: 320 }}
  >
    <Statistic.Countdown
      title="活动结束倒计时"
      value={Date.now() + 1000 * 60 * 60 * 24}
      format="HH:mm:ss"
      version={Statistic.version}
    />
  </StatisticCard>
);

export const 加载状态 = Template.bind({});
加载状态.args = {
  title: '实时指标同步中',
  value: 0,
  loading: true,
  version: Statistic.version
};

export const 指标面板 = () => (
  <div style={panelStyle}>
    <StatisticCard caption="支付链路实时汇总。">
      <Statistic title="今日成交额" value={112893} prefix="¥" version={Statistic.version} />
    </StatisticCard>
    <StatisticCard caption="新用户注册转化表现。">
      <Statistic
        title="转化率"
        value={93.7}
        precision={1}
        suffix="%"
        valueStyle={{ color: 'var(--tt-color-primary-6)' }}
        version={Statistic.version}
      />
    </StatisticCard>
    <StatisticCard caption="需重点关注波动趋势。">
      <Statistic
        title="同比变化"
        value={15.2}
        precision={1}
        prefix={<ArrowUpOutlined />}
        suffix="%"
        valueStyle={{ color: 'var(--tt-color-primary-6)' }}
        version={Statistic.version}
      />
    </StatisticCard>
    <StatisticCard caption="适合直接放在运营看板顶部。">
      <Statistic title="待处理工单" value={128} suffix="个" version={Statistic.version} />
    </StatisticCard>
  </div>
);
