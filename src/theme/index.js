
import { colorPalette, defaultColors } from './color-palette';

export const colors = {
  ...colorPalette,
  ...defaultColors,
  primary: colorPalette.geekBlue[6],
  primaryHover: colorPalette.geekBlue[5],
  primaryActive: colorPalette.geekBlue[7],
  info: colorPalette.geekBlue[6],
};

const createThemeConfig = (colorScheme) => ({
  theme: {
    '@primary-color': colorScheme[6],
    '@primary-color-hover': colorScheme[5],
    '@primary-color-active': colorScheme[7],
    '@primary-color-outline': `rgba(${parseInt(colorScheme[6].slice(1, 3), 16)}, ${parseInt(colorScheme[6].slice(3, 5), 16)}, ${parseInt(colorScheme[6].slice(5, 7), 16)}, 0.2)`,
    '@primary-1': colorScheme[1],
    '@primary-2': colorScheme[2],
    '@primary-3': colorScheme[3],
    '@primary-4': colorScheme[4],
    '@primary-5': colorScheme[5],
    '@primary-6': colorScheme[6],
    '@primary-7': colorScheme[7],
    '@success-color': defaultColors.success,
    '@success-color-hover': defaultColors.successHover,
    '@success-color-active': defaultColors.successActive,
    '@warning-color': defaultColors.warning,
    '@warning-color-hover': defaultColors.warningHover,
    '@warning-color-active': defaultColors.warningActive,
    '@error-color': defaultColors.error,
    '@error-color-hover': defaultColors.errorHover,
    '@error-color-active': defaultColors.errorActive,
    '@info-color': colorScheme[6],
    '@text-color': defaultColors.text.body,
    '@text-color-secondary': defaultColors.text.secondary,
    '@heading-color': defaultColors.text.title,
    '@background-color-base': defaultColors.bg.white,
    '@background-color-light': defaultColors.bg.light,
    '@border-color-base': defaultColors.border.base,
    '@border-color-split': defaultColors.border.light,
    '@link-color': colorScheme[6],
    '@link-hover-color': colorScheme[5],
    '@link-active-color': colorScheme[7],
  },
});

export const presetThemes = {
  dustRed: createThemeConfig(colorPalette.dustRed),
  sunsetOrange: createThemeConfig(colorPalette.sunsetOrange),
  calendulaGold: createThemeConfig(colorPalette.calendulaGold),
  sunriseYellow: createThemeConfig(colorPalette.sunriseYellow),
  lime: createThemeConfig(colorPalette.lime),
  polarGreen: createThemeConfig(colorPalette.polarGreen),
  mintGreen: createThemeConfig(colorPalette.mintGreen),
  cyan: createThemeConfig(colorPalette.cyan),
  skyBlue: createThemeConfig(colorPalette.skyBlue),
  geekBlue: createThemeConfig(colorPalette.geekBlue),
  neonBlue: createThemeConfig(colorPalette.neonBlue),
  goldenPurple: createThemeConfig(colorPalette.goldenPurple),
  pulsePink: createThemeConfig(colorPalette.pulsePink),
  rosePink: createThemeConfig(colorPalette.rosePink),
};

export const themeConfig = presetThemes.geekBlue;

export const getTheme = (themeName) => {
  if (typeof themeName === 'string' && presetThemes[themeName]) {
    return presetThemes[themeName];
  }
  if (typeof themeName === 'object') {
    return themeName;
  }
  return themeConfig;
};

export default {
  colors,
  themeConfig,
  presetThemes,
  getTheme,
};

