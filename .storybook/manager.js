import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

// 获取首页地址 - 支持本地和线上部署
const getHomeUrl = () => {
  // 如果有父级窗口，尝试从父窗口获取配置
  if (window.parent && window.parent !== window) {
    try {
      const parentConfig = window.parent.APP_CONFIG;
      if (parentConfig && parentConfig.HOME_URL) {
        return parentConfig.HOME_URL;
      }
      // 父窗口是首页，直接用父窗口地址
      return window.parent.location.href;
    } catch (e) {
      // 跨域无法访问
    }
  }
  // 开发环境默认值
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  // 线上部署：Storybook 通常部署在 /storybook，首页在 /
  return window.location.hostname.includes('storybook')
    ? window.location.origin.replace('/storybook', '')
    : window.location.origin;
};

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'tt-design',
    brandUrl: getHomeUrl(),
    brandTarget: '_self',
    brandImage: undefined,
  }),
});
