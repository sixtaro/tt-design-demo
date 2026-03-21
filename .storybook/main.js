const path = require('path');
const { getLessVars } = require('../src/theme/color-palette');

const STORYBOOK_THEME = 'geek-blue';

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },

  webpackFinal: async config => {
    // 添加路径别名
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // 配置 Less 解析器
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars: getLessVars(STORYBOOK_THEME),
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};
