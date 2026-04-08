import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const ensureDocsPath = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const storyPath = searchParams.get('path');

  if (!storyPath) {
    searchParams.set('path', '/docs/通用-button-按钮--基础用法');
    window.location.replace(`${window.location.pathname}?${searchParams.toString()}${window.location.hash}`);
    return;
  }

  if (storyPath.startsWith('/story/')) {
    searchParams.set('path', storyPath.replace('/story/', '/docs/'));
    window.location.replace(`${window.location.pathname}?${searchParams.toString()}${window.location.hash}`);
  }
};

ensureDocsPath();

// 获取首页地址
const getHomeUrl = () => {
  // 如果有父级窗口（首页），获取父窗口配置
  if (window.parent && window.parent !== window) {
    try {
      const parentConfig = window.parent.APP_CONFIG;
      if (parentConfig && parentConfig.HOME_URL) {
        return parentConfig.HOME_URL;
      }
    } catch (e) { }
  }

  var pathname = window.location.pathname;
  var origin = window.location.origin;

  // 本地开发
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }

  // 线上：Storybook 在 /storybook，首页在 /
  // 例如 /tt-design-demo/storybook/ → /tt-design-demo/
  if (pathname.includes('/storybook')) {
    return pathname.replace('/storybook', '').replace(/\/$/, '') || '/';
  }

  return origin;
};

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'tt-design',
    brandUrl: getHomeUrl(),
    brandTarget: '_self',
    brandImage: undefined,
    locale: 'zh-CN',
  }),
});
