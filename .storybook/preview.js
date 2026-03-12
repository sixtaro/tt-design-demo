import React from 'react';
import 'antd/dist/antd.less';
import '../src/style/themes/default.less';
import { ThemeDecorator, themeList } from './ThemeDecorator';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
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

