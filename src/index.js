import React from 'react';
import { ConfigProvider } from 'antd';
import Button from './components/Button';
import Input from './components/Input';
import Select from './components/Select';
import Modal from './components/Modal';
import * as versionUtils from './utils/version';
import { libraryVersion } from './utils/version-config';
import { themeConfig, colors } from './theme';

// 带有默认主题的 ConfigProvider 组件
export const ThemeProvider = ({ children, theme = themeConfig }) => {
  return (
    <ConfigProvider {...theme}>
      {children}
    </ConfigProvider>
  );
};

// 导出颜色变量和主题配置
export { colors, themeConfig };

export {
  Button,
  Input,
  Select,
  Modal,
  versionUtils
};

const components = {
  Button,
  Input,
  Select,
  Modal,
  ThemeProvider,
  colors,
  themeConfig
};

components.version = libraryVersion;
components.versionUtils = versionUtils;

export default components;
