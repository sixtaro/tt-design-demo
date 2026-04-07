import React, { useRef } from 'react';
import VerificationCode from './index';

// 公共 API 配置
const API_CONFIG = {
  GET_CAPTCHA: '/PublicV2/slidecaptchaimage',
  CHECK_CAPTCHA: '/PublicV2/checkcaptcha',
};

export default {
  title: '业务组件/VerificationCode',
  component: VerificationCode,
  parameters: {
    docs: {
      description: {
        component: 'VerificationCode 是一个滑动验证组件，支持滑动拼图和旋转图片两种验证方式。',
      },
    },
  },
  argTypes: {
    defaultShowPic: {
      description: '是否默认显示图片',
      type: 'boolean',
    },
    type: {
      description: '验证类型，可选值：slide（滑动拼图）、rotate（旋转图片）',
      options: ['slide', 'rotate'],
      control: { type: 'select' },
    },
    api: {
      description: '获取验证码图片的接口地址',
      type: 'string',
    },
    checkApi: {
      description: '验证验证码的接口地址',
      type: 'string',
    },
    onSuccess: {
      description: '验证成功时的回调',
      type: 'function',
    },
    onChange: {
      description: '验证过程中的回调',
      type: 'function',
    },
    onCancel: {
      description: '关闭时的回调',
      type: 'function',
    },
  },
};

// 基础使用案例
export const Basic = () => {
  const verificationRef = useRef();

  const handleSuccess = (code, data) => {
    console.log('验证成功', code, data);
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto' }}>
      <VerificationCode
        ref={verificationRef}
        api={API_CONFIG.GET_CAPTCHA}
        checkApi={API_CONFIG.CHECK_CAPTCHA}
        onSuccess={handleSuccess}
        defaultShowPic={true}
        type="slide"
      />
    </div>
  );
};

Basic.storyName = '基础使用';
Basic.parameters = {
  docs: {
    description: {
      story: '基础滑动验证组件，显示完整的验证界面。',
    },
  },
};

// 手动刷新案例
export const ManualRefresh = () => {
  const verificationRef = useRef();

  const handleRefresh = () => {
    console.log('手动刷新');
    // 可以在这里添加自定义刷新逻辑
    verificationRef.current.refresh();
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto' }}>
      <VerificationCode
        ref={verificationRef}
        api={API_CONFIG.GET_CAPTCHA}
        checkApi={API_CONFIG.CHECK_CAPTCHA}
        defaultShowPic={true}
        type="slide"
        handleManualRefresh={handleRefresh}
      />
    </div>
  );
};

ManualRefresh.storyName = '自定义刷新';
ManualRefresh.parameters = {
  docs: {
    description: {
      story: '自定义刷新逻辑的验证组件，可以在刷新时添加额外处理。',
    },
  },
};
