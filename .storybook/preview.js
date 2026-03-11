import React from 'react';
import 'antd/dist/antd.less';
import '../src/style/themes/default.less';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

