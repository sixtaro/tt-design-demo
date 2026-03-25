import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Selector, PageLayout } from './business';
import A from './components/A';
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
import FloatButton from './components/FloatButton';
import Divider from './components/Divider';
import Empty from './components/Empty';
import Row from './components/Row';
import Menu from './components/Menu';
import Dropdown from './components/Dropdown';
import Breadcrumb from './components/Breadcrumb';
import Steps from './components/Steps';
import Font from './components/Font';
import Color from './components/Color';
import Icon from './components/Icon';
import BackTop from './components/BackTop';
import Cascader from './components/Cascader';
import Rate from './components/Rate';
import CardSelect from './components/CardSelect';
import Upload from './components/Upload';
import TreeSelect from './components/TreeSelect';
import TimePicker from './components/TimePicker';
import ColorPicker from './components/ColorPicker';
import Plate from './components/Plate';
import Chart from './components/Chart';
import * as versionUtils from './utils/version';
import { libraryVersion } from './utils/version-config';
import { themeConfig, colors, getTheme, applyTheme } from './theme';

// 带有默认主题的 ConfigProvider 组件
export const ThemeProvider = ({ children, theme = themeConfig }) => {
  const themeConfigObj = getTheme(theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ConfigProvider {...themeConfigObj}>{children}</ConfigProvider>;
};

// 导出颜色变量和主题配置
export { colors, themeConfig, getTheme, applyTheme };

export {
  Selector,
  PageLayout,
  A,
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
  FloatButton,
  Divider,
  Empty,
  Row,
  Menu,
  Dropdown,
  Breadcrumb,
  Steps,
  Font,
  Color,
  Icon,
  BackTop,
  Cascader,
  Rate,
  CardSelect,
  Upload,
  TreeSelect,
  TimePicker,
  ColorPicker,
  Plate,
  Chart,
  versionUtils,
};

const components = {
  Selector,
  PageLayout,
  A,
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
  FloatButton,
  Divider,
  Empty,
  Row,
  Menu,
  Dropdown,
  Breadcrumb,
  Steps,
  Font,
  Color,
  Icon,
  BackTop,
  Cascader,
  Rate,
  CardSelect,
  Upload,
  TreeSelect,
  TimePicker,
  ColorPicker,
  Plate,
  Chart,
  ThemeProvider,
  colors,
  themeConfig,
  getTheme,
  applyTheme,
};

components.version = libraryVersion;
components.versionUtils = versionUtils;

export default components;
