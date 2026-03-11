
import { colorPalette, defaultColors, getLessVars } from './color-palette';

const DEFAULT_THEME = 'geekBlue';

const createThemeConfig = (colorScheme) => ({
  theme: getLessVars(colorScheme),
});

export const presetThemes = Object.keys(colorPalette).reduce((themes, colorKey) => {
  if (colorKey !== 'grey') {
    themes[colorKey] = createThemeConfig(colorPalette[colorKey]);
  }
  return themes;
}, {});

export const colors = {
  ...colorPalette,
  ...defaultColors,
  primary: colorPalette[DEFAULT_THEME][6],
  primaryHover: colorPalette[DEFAULT_THEME][5],
  primaryActive: colorPalette[DEFAULT_THEME][7],
  info: colorPalette[DEFAULT_THEME][6],
};

export const themeConfig = presetThemes[DEFAULT_THEME];

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

