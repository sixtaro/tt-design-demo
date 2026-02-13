// 颜色变量定义
export const colors = {
  // 主色调
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  primaryActive: '#096dd9',

  // 辅助色
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',

  // 中性色
  black: '#000000',
  white: '#ffffff',

  // 灰度色阶
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e8e8e8',
  gray300: '#d9d9d9',
  gray400: '#bfbfbf',
  gray500: '#8c8c8c',
  gray600: '#595959',
  gray700: '#434343',
  gray800: '#262626',
  gray900: '#1f1f1f',

  // 文本颜色
  textPrimary: '#262626',
  textSecondary: '#595959',
  textTertiary: '#8c8c8c',
  textDisabled: '#bfbfbf',

  // 背景颜色
  bgPrimary: '#ffffff',
  bgSecondary: '#f5f5f5',
  bgTertiary: '#e8e8e8',

  // 边框颜色
  border: '#d9d9d9',
  borderLight: '#f0f0f0',
  borderDark: '#bfbfbf',

  // 状态颜色
  disabled: '#f5f5f5',
  loading: '#1890ff',
};

// Antd 主题配置
export const themeConfig = {
  token: {
    // 主色调
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,

    // 辅助色
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // 中性色
    colorBgContainer: colors.bgPrimary,
    colorBgLayout: colors.bgSecondary,
    colorTextBase: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,
    colorTextDisabled: colors.textDisabled,

    // 边框颜色
    colorBorder: colors.border,
    colorBorderSecondary: colors.borderLight,

    // 其他颜色
    colorLink: colors.primary,
    colorLinkHover: colors.primaryHover,
    colorLinkActive: colors.primaryActive,
  },
};

// 导出默认配置
export default {
  colors,
  themeConfig,
};
