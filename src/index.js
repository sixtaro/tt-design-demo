import React from 'react';
import { ConfigProvider } from 'antd';
import Button from './components/Button';
import Input from './components/Input';
import Select from './components/Select';
import Modal from './components/Modal';
import Checkbox from './components/Checkbox';
import Radio from './components/Radio';
import Switch from './components/Switch';
import Table from './components/Table';
import Form from './components/Form';
import DatePicker from './components/DatePicker';
import Pagination from './components/Pagination';
import Message from './components/Message';
import Notification from './components/Notification';
import Drawer from './components/Drawer';
import Tabs from './components/Tabs';
import Card from './components/Card';
import Spin from './components/Spin';
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
  Checkbox,
  Radio,
  Switch,
  Table,
  Form,
  DatePicker,
  Pagination,
  Message,
  Notification,
  Drawer,
  Tabs,
  Card,
  Spin,
  versionUtils
};

const components = {
  Button,
  Input,
  Select,
  Modal,
  Checkbox,
  Radio,
  Switch,
  Table,
  Form,
  DatePicker,
  Pagination,
  Message,
  Notification,
  Drawer,
  Tabs,
  Card,
  Spin,
  ThemeProvider,
  colors,
  themeConfig
};

components.version = libraryVersion;
components.versionUtils = versionUtils;

export default components;
