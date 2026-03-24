import React, { useState } from 'react';
import { Button, Space, Typography } from 'antd';
import PictureSwiper from './pictureSwiper';
import demoImage1 from '@/demos/images/demo.png';
import demoImage2 from '@/demos/images/demo2.png';
import demoImage3 from '@/demos/images/demo3.png';
import '@/utils';

const ensureBusinessStoryEnv = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.projectName = window.projectName || 'public';
  window.systemID = window.systemID ?? 1;
  window.hasRight = window.hasRight || (() => true);
};

ensureBusinessStoryEnv();

const pictureList = [
  {
    title: '入口抓拍图',
    description: '车道入口相机',
    url: demoImage1,
  },
  {
    title: '离场抓拍图',
    description: '车道出口相机',
    url: demoImage2,
  },
  {
    title: '特写图',
    description: '车牌识别结果',
    url: demoImage3,
  },
];

const PictureSwiperDemo = args => {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ minHeight: 560 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          重新打开预览
        </Button>
        <Typography.Text type="secondary">关闭预览后可再次打开，方便在 Storybook 中重复调试。</Typography.Text>
      </Space>
      <PictureSwiper
        {...args}
        visible={visible}
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};

export default {
  title: '业务组件/PictureSwiper 图片轮播',
  component: PictureSwiper,
  parameters: {
    docs: {
      description: {
        component: '使用静态图片列表演示 PictureSwiper 的轮播、缩放和滚动条能力，不触发真实接口请求。',
      },
    },
  },
  argTypes: {
    list: {
      control: false,
    },
    callbackData: {
      control: false,
    },
    record: {
      control: false,
    },
  },
};

export const 基础轮播 = args => <PictureSwiperDemo {...args} />;
基础轮播.args = {
  list: pictureList,
  defaultIndex: 1,
};

export const 带滚动与缩放 = args => <PictureSwiperDemo {...args} />;
带滚动与缩放.args = {
  list: pictureList,
  defaultIndex: 0,
  showScrollBar: true,
  showZoomBar: true,
  showSilderBar: true,
  startTime: '2026-03-24 00:00:00',
  endTime: '2026-03-24 23:59:59',
};
