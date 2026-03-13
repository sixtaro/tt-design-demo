
import { colorPalette, defaultColors, getLessVars } from './color-palette';

const DEFAULT_THEME = 'geekBlue';

const createThemeConfig = (colorScheme) => ({
  theme: getLessVars(colorScheme),
});

const createCSSVars = (colorScheme) => ({
  '--tt-color-primary-1': colorScheme[1],
  '--tt-color-primary-2': colorScheme[2],
  '--tt-color-primary-3': colorScheme[3],
  '--tt-color-primary-4': colorScheme[4],
  '--tt-color-primary-5': colorScheme[5],
  '--tt-color-primary-6': colorScheme[6],
  '--tt-color-primary-7': colorScheme[7],
  '--tt-color-primary': colorScheme[6],
  '--tt-color-primary-hover': colorScheme[5],
  '--tt-color-primary-active': colorScheme[7],
});

export const presetThemes = Object.keys(colorPalette).reduce((themes, colorKey) => {
  if (colorKey !== 'grey') {
    themes[colorKey] = {
      ...createThemeConfig(colorPalette[colorKey]),
      cssVars: createCSSVars(colorPalette[colorKey]),
    };
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

export const applyTheme = (themeNameOrConfig) => {
  const theme = getTheme(themeNameOrConfig);
  const cssVars = theme.cssVars || themeConfig.cssVars;
  const root = document.documentElement;
  
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  return theme;
};

export default {
  colors,
  themeConfig,
  presetThemes,
  getTheme,
  applyTheme,
};

