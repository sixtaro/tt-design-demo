import React from 'react';
import { UserOutlined, SolutionOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import Steps from './index';

export default {
  title: '导航/Steps 步骤条',
  component: Steps,
  parameters: {
    docs: {
      description: {
        component: `Steps 步骤条组件 - 版本: ${Steps.version}\n\n引导用户完成多步骤任务的导航组件，清晰展示当前进度和状态。支持水平/垂直方向、多种尺寸、自定义图标、点状和百分比进度。`
      }
    }
  },
  argTypes: {
    current: {
      control: 'number',
      description: '当前步骤，从 0 开始'
    },
    direction: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      },
      description: '步骤条方向'
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'small']
      },
      description: '步骤条大小'
    },
    status: {
      control: {
        type: 'select',
        options: ['wait', 'process', 'finish', 'error']
      },
      description: '当前步骤的状态'
    },
    labelPlacement: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical']
      },
      description: '标签放置位置'
    },
  }
};

const sectionTitleStyle = {
  marginBottom: 16,
};

/* ========== 基础状态 ========== */
export const 基础状态 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    <div>
      <h4 style={sectionTitleStyle}>基础流程</h4>
      <Steps current={1}>
        <Steps.Step title="已完成" />
        <Steps.Step title="进行中" />
        <Steps.Step title="未开始" />
        <Steps.Step title="未开始" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>全部完成</h4>
      <Steps current={3} status="finish">
        <Steps.Step title="步骤一" />
        <Steps.Step title="步骤二" />
        <Steps.Step title="步骤三" />
        <Steps.Step title="步骤四" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>错误状态</h4>
      <Steps current={1} status="error">
        <Steps.Step title="账号信息" />
        <Steps.Step title="实名认证" description="认证失败，请重新提交" />
        <Steps.Step title="完成注册" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>带描述与图标</h4>
      <Steps current={1}>
        <Steps.Step title="登录" description="输入账号与密码" icon={<UserOutlined />} />
        <Steps.Step title="验证" description="完成人脸或短信验证" icon={<SolutionOutlined />} />
        <Steps.Step title="上传" description="提交材料附件" icon={<UploadOutlined />} />
        <Steps.Step title="完成" description="流程结束" icon={<SmileOutlined />} />
      </Steps>
    </div>
  </div>
);

/* ========== 布局模式 ========== */
export const 布局模式 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    <div>
      <h4 style={sectionTitleStyle}>上下结构</h4>
      <Steps current={1} labelPlacement="vertical">
        <Steps.Step title="已完成" description="步骤一已完成" />
        <Steps.Step title="进行中" description="当前处理节点" />
        <Steps.Step title="未开始" description="待进入" />
        <Steps.Step title="未开始" description="待进入" />
      </Steps>
    </div>
    <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
      <div>
        <h4 style={sectionTitleStyle}>垂直方向</h4>
        <Steps current={1} direction="vertical" style={{ height: 280 }}>
          <Steps.Step title="填写信息" description="请填写基本信息" />
          <Steps.Step title="实名认证" description="上传身份证件" />
          <Steps.Step title="审核中" description="等待后台审核" />
          <Steps.Step title="完成" description="注册成功" />
        </Steps>
      </div>
      <div>
        <h4 style={sectionTitleStyle}>垂直错误状态</h4>
        <Steps current={1} direction="vertical" status="error" style={{ height: 280 }}>
          <Steps.Step title="填写信息" description="已完成" />
          <Steps.Step title="实名认证" description="认证失败，请重试" />
          <Steps.Step title="审核" description="等待审核" />
          <Steps.Step title="完成" description="" />
        </Steps>
      </div>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>小尺寸</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Steps current={1} size="small">
          <Steps.Step title="已完成" />
          <Steps.Step title="进行中" />
          <Steps.Step title="未开始" />
        </Steps>
        <Steps current={1} size="small" status="error">
          <Steps.Step title="步骤一" />
          <Steps.Step title="步骤二" />
          <Steps.Step title="步骤三" />
        </Steps>
      </div>
    </div>
  </div>
);

/* ========== 交互与特殊样式 ========== */
export const 交互与特殊样式 = () => {
  const [current, setCurrent] = React.useState(0);

  const navSteps = [
    { title: '第一步' },
    { title: '第二步' },
    { title: '第三步' },
    { title: '第四步' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div>
        <h4 style={sectionTitleStyle}>导航模式</h4>
        <Steps current={current} onChange={setCurrent} type="navigation" size="small">
          {navSteps.map((item) => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: 'var(--tt-bg-light)',
            borderRadius: 8,
            textAlign: 'center',
            color: 'var(--tt-text-secondary)'
          }}
        >
          当前步骤：{navSteps[current].title}
        </div>
      </div>
      <div>
        <h4 style={sectionTitleStyle}>点状步骤条</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Steps current={1} progressDot>
            <Steps.Step title="已完成" description="描述信息" />
            <Steps.Step title="进行中" description="描述信息" />
            <Steps.Step title="未开始" description="描述信息" />
          </Steps>
          <Steps current={1} progressDot direction="vertical" style={{ height: 200 }}>
            <Steps.Step title="已完成" description="描述信息" />
            <Steps.Step title="进行中" description="描述信息" />
            <Steps.Step title="未开始" description="描述信息" />
          </Steps>
        </div>
      </div>
    </div>
  );
};

/* ========== 百分比进度 ========== */
export const 百分比进度 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    <div>
      <h4 style={sectionTitleStyle}>基础百分比</h4>
      <Steps current={1} percent={35}>
        <Steps.Step title="已完成" description="步骤一已完成" />
        <Steps.Step title="进行中" description="当前进度 35%" />
        <Steps.Step title="未开始" description="等待执行" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>高进度百分比</h4>
      <Steps current={1} percent={82}>
        <Steps.Step title="需求确认" description="已完成" />
        <Steps.Step title="开发实现" description="当前进度 82%" />
        <Steps.Step title="测试发布" description="待开始" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>错误状态 + 百分比</h4>
      <Steps current={1} status="error" percent={56}>
        <Steps.Step title="提交资料" description="已完成" />
        <Steps.Step title="审核处理" description="处理中断，当前进度 56%" />
        <Steps.Step title="完成结果" description="待处理" />
      </Steps>
    </div>
    <div>
      <h4 style={sectionTitleStyle}>小尺寸 + 百分比</h4>
      <Steps current={1} size="small" percent={48}>
        <Steps.Step title="步骤一" />
        <Steps.Step title="步骤二" />
        <Steps.Step title="步骤三" />
      </Steps>
    </div>
  </div>
);
