import React from 'react';
import ParkingManagementPage from './index';

export default {
  title: '案例/停车管理云平台页面',
  component: ParkingManagementPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '基于 Figma 设计稿静态还原的停车管理云平台运营管理页面。',
      },
    },
  },
};

const Template = (args) => <ParkingManagementPage {...args} />;

export const 默认示例 = Template.bind({});
默认示例.args = {};
