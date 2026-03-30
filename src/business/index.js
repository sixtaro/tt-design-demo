import {
  createFromIconfontCN,
  FrownOutlined,
  UserOutlined,
  QuestionOutlined,
  ApartmentOutlined,
  RedEnvelopeOutlined,
  MoneyCollectOutlined,
  WalletOutlined,
  ToolOutlined,
  PhoneOutlined,
  SettingOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FundOutlined,
  CalendarOutlined,
  CloudSyncOutlined,
  CarOutlined,
  FundProjectionScreenOutlined,
  SolutionOutlined,
  GoldOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
  setTwoToneColor,
} from '@ant-design/icons';
import { Utils } from '@/utils';
import { ConfigProvider } from 'antd';
import Selector from './Selector';
import PageLayout from './layout';
import PictureSwiper from './pictureSwiper/pictureSwiper';
import Condition from './condition/condition';
import ExcelImportBtn from './excelImport/excelImportBtn';
import BreadcrumbOrgOld from './breadcrumbOrg/breadcrumbOrg';
import BreadcrumbOrgTag from './breadcrumbOrg/breadcrumbOrgTag';
import TelWithCode from './telWithCode';

// 动态更改主题色
const updateTheme = (primaryColor, global) => {
  if (primaryColor && global) {
    window.globalThemeColor = primaryColor;
  }
  ConfigProvider.config({
    theme: {
      primaryColor: primaryColor || window.globalThemeColor || window.themeColor,
    },
  });
  setTwoToneColor(primaryColor || window.globalThemeColor || window.themeColor);
};

const { isUrl } = Utils;
let IconFont = null;

const getIconFont = () => {
  if (IconFont) {
    return IconFont;
  }
  const iconfontUrl = window.iconfontUrl;
  if (!iconfontUrl) {
    return null;
  }
  const scriptUrl = window._app ? `${window._pageURL}/${iconfontUrl}` : iconfontUrl;
  IconFont = createFromIconfontCN({
    scriptUrl,
  });
  return IconFont;
};
const iconMap = new Map([
  ['user', UserOutlined],
  ['question', QuestionOutlined],
  ['home', HomeOutlined],
]);
const icons = {
  ApartmentOutlined,
  RedEnvelopeOutlined,
  MoneyCollectOutlined,
  WalletOutlined,
  ToolOutlined,
  PhoneOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FundOutlined,
  CalendarOutlined,
  CloudSyncOutlined,
  CarOutlined,
  FundProjectionScreenOutlined,
  SolutionOutlined,
  GoldOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
};

const getIcon = (icon, props) => {
  if (!icon) {
    return;
  }
  if (typeof icon === 'string') {
    if (isUrl(icon) || /\/|\./.test(icon)) {
      return <img src={icon} alt="icon" className="icon" {...props} />;
    }
    if (icon.startsWith('icon-') || icon.startsWith('picon-')) {
      const IconFontComponent = getIconFont();
      if (IconFontComponent) {
        return <IconFontComponent className="icon" {...props} type={icon.replace('picon-', 'icon-')} />;
      }
      return <FrownOutlined {...props} />;
    }
    const findKeys = Object.keys(icons).find(i => i.toLowerCase().indexOf(icon.replace('-', '').toLowerCase()) === 0);
    if (findKeys) {
      const FindIcon = icons[findKeys];
      return <FindIcon {...props} />;
    }
    const Icon = iconMap.get(icon);
    if (Icon) {
      return <Icon {...props} />;
    }
    return <FrownOutlined />;
  }
  return icon;
};

const BreadcrumbOrg = window.projectName === 'desktop' ? BreadcrumbOrgTag : BreadcrumbOrgOld;

export { getIcon, updateTheme, Selector, PageLayout, PictureSwiper, Condition, ExcelImportBtn, BreadcrumbOrg, TelWithCode };
