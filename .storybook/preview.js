import React from 'react';
import 'antd/dist/antd.less';
import '../src/style/themes/default.less';
import { ThemeDecorator, themeList } from './ThemeDecorator';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  globals: {
    locale: 'zh-CN',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['通用', '导航', '数据录入', '图表', '布局', '反馈', '数据展示', '其他', '业务组件', '案例']
    }
  },
};

export const globalTypes = {
  theme: {
    name: '主题',
    description: '选择主题',
    defaultValue: 'geek-blue',
    toolbar: {
      icon: 'paintbrush',
      items: themeList,
      showName: true,
      dynamicTitle: true,
    },
  },
};

export const decorators = [ThemeDecorator];

