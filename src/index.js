import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import {
  Selector,
  PageLayout,
  CalendarSelect,
  CarouselArrow,
  DragTable,
  HourRangeSelect,
  MaskedInput,
  SecretInput,
  VerificationCode,
  CountdownButton,
  TabsPage,
} from './business';
import A from './components/A';
import Alert from './components/Alert';
import Anchor from './components/Anchor';
import Avatar from './components/Avatar';
import Badge from './components/Badge';
import Button from './components/Button';
import Calendar from './components/Calendar';
import Card from './components/Card';
import Carousel from './components/Carousel';
import Checkbox from './components/Checkbox';
import Collapse from './components/Collapse';
import Comment from './components/Comment';
import DatePicker from './components/DatePicker';
import Descriptions from './components/Descriptions';
import Divider from './components/Divider';
import Empty from './components/Empty';
import Drawer from './components/Drawer';
import Dropdown from './components/Dropdown';
import FloatButton from './components/FloatButton';
import Form from './components/Form';
import Image from './components/Image';
import Input from './components/Input';
import List from './components/List';
import Menu from './components/Menu';
import Masonry from './components/Masonry';
import Message from './components/Message';
import Modal from './components/Modal';
import Money from './components/Money';
import Notification from './components/Notification';
import Pagination from './components/Pagination';
import Popconfirm from './components/Popconfirm';
import Popover from './components/Popover';
import Progress from './components/Progress';
import Radio from './components/Radio';
import Row from './components/Row';
import Select from './components/Select';
import Segmented from './components/Segmented';
import Skeleton from './components/Skeleton';
import Spin from './components/Spin';
import Steps from './components/Steps';
import Switch from './components/Switch';
import Tag from './components/Tag';
import Timeline from './components/Timeline';
import Tooltip from './components/Tooltip';
import Tour from './components/Tour';
import Tree from './components/Tree';
import Watermark from './components/Watermark';
import Font from './components/Font';
import Color from './components/Color';
import Icon from './components/Icon';
import BackTop from './components/BackTop';
import Cascader from './components/Cascader';
import Splitter from './components/Splitter';
import Rate from './components/Rate';
import Result from './components/Result';
import Statistic from './components/Statistic';
import CardSelect from './components/CardSelect';
import Upload from './components/Upload';
import TreeSelect from './components/TreeSelect';
import TimePicker from './components/TimePicker';
import ColorPicker from './components/ColorPicker';
import QRCode from './components/QRCode';
import Plate from './components/Plate';
import Chart from './components/Chart';
import Transfer from './components/Transfer';
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
  CalendarSelect,
  CarouselArrow,
  DragTable,
  HourRangeSelect,
  MaskedInput,
  SecretInput,
  VerificationCode,
  CountdownButton,
  TabsPage,
  A,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  Comment,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Drawer,
  Dropdown,
  FloatButton,
  Form,
  Image,
  Input,
  List,
  Menu,
  Masonry,
  Message,
  Modal,
  Money,
  Notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Row,
  Select,
  Segmented,
  Skeleton,
  Spin,
  Steps,
  Switch,
  Tag,
  Timeline,
  Tooltip,
  Tour,
  Tree,
  Watermark,
  Font,
  Color,
  Icon,
  BackTop,
  Cascader,
  Splitter,
  Rate,
  Result,
  Statistic,
  CardSelect,
  Upload,
  TreeSelect,
  TimePicker,
  ColorPicker,
  QRCode,
  Plate,
  Chart,
  Transfer,
  versionUtils,
};

const components = {
  Selector,
  PageLayout,
  CalendarSelect,
  CarouselArrow,
  DragTable,
  HourRangeSelect,
  MaskedInput,
  SecretInput,
  VerificationCode,
  CountdownButton,
  TabsPage,
  A,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  Comment,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Drawer,
  Dropdown,
  FloatButton,
  Form,
  Image,
  Input,
  List,
  Menu,
  Masonry,
  Message,
  Modal,
  Money,
  Notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Row,
  Select,
  Segmented,
  Skeleton,
  Spin,
  Steps,
  Switch,
  Tag,
  Timeline,
  Tooltip,
  Tour,
  Tree,
  Watermark,
  Font,
  Color,
  Icon,
  BackTop,
  Cascader,
  Splitter,
  Rate,
  Result,
  Statistic,
  CardSelect,
  Upload,
  TreeSelect,
  TimePicker,
  ColorPicker,
  QRCode,
  Plate,
  Chart,
  Transfer,
  ThemeProvider,
  colors,
  themeConfig,
  getTheme,
  applyTheme,
};

components.version = libraryVersion;
components.versionUtils = versionUtils;

export default components;
