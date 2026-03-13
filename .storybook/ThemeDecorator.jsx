import React, { useEffect } from 'react';

const themes = {
  'geek-blue': {
    '--tt-color-primary-1': '#F0F9FF',
    '--tt-color-primary-2': '#D6EDFF',
    '--tt-color-primary-3': '#ADD8FF',
    '--tt-color-primary-4': '#85C0FF',
    '--tt-color-primary-5': '#5CA5FF',
    '--tt-color-primary-6': '#3388FF',
    '--tt-color-primary-7': '#2167D9',
    '--tt-color-primary': '#3388FF',
    '--tt-color-primary-hover': '#5CA5FF',
    '--tt-color-primary-active': '#2167D9',
  },
  'dust-red': {
    '--tt-color-primary-1': '#FFF4F0',
    '--tt-color-primary-2': '#FFDFD6',
    '--tt-color-primary-3': '#FFBCAD',
    '--tt-color-primary-4': '#FF9785',
    '--tt-color-primary-5': '#FF6F5C',
    '--tt-color-primary-6': '#FF4433',
    '--tt-color-primary-7': '#D92A21',
    '--tt-color-primary': '#FF4433',
    '--tt-color-primary-hover': '#FF6F5C',
    '--tt-color-primary-active': '#D92A21',
  },
  'mint-green': {
    '--tt-color-primary-1': '#E6FFF4',
    '--tt-color-primary-2': '#B6FAE0',
    '--tt-color-primary-3': '#87EDC9',
    '--tt-color-primary-4': '#5CE0B6',
    '--tt-color-primary-5': '#35D4A7',
    '--tt-color-primary-6': '#11C79B',
    '--tt-color-primary-7': '#06A17F',
    '--tt-color-primary': '#11C79B',
    '--tt-color-primary-hover': '#35D4A7',
    '--tt-color-primary-active': '#06A17F',
  },
  'neon-blue': {
    '--tt-color-primary-1': '#F4F0FF',
    '--tt-color-primary-2': '#DFD6FF',
    '--tt-color-primary-3': '#BCADFF',
    '--tt-color-primary-4': '#9785FF',
    '--tt-color-primary-5': '#6F5CFF',
    '--tt-color-primary-6': '#4433FF',
    '--tt-color-primary-7': '#2A21D9',
    '--tt-color-primary': '#4433FF',
    '--tt-color-primary-hover': '#6F5CFF',
    '--tt-color-primary-active': '#2A21D9',
  },
  'sunset-orange': {
    '--tt-color-primary-1': '#FFF4E6',
    '--tt-color-primary-2': '#FFD4A3',
    '--tt-color-primary-3': '#FFBD7A',
    '--tt-color-primary-4': '#FFA352',
    '--tt-color-primary-5': '#FF8629',
    '--tt-color-primary-6': '#FF6600',
    '--tt-color-primary-7': '#D94F00',
    '--tt-color-primary': '#FF6600',
    '--tt-color-primary-hover': '#FF8629',
    '--tt-color-primary-active': '#D94F00',
  },
  'golden-purple': {
    '--tt-color-primary-1': '#F5E8FF',
    '--tt-color-primary-2': '#E2C0FF',
    '--tt-color-primary-3': '#CC99FF',
    '--tt-color-primary-4': '#B371FF',
    '--tt-color-primary-5': '#9844FF',
    '--tt-color-primary-6': '#7B22FF',
    '--tt-color-primary-7': '#5A15D2',
    '--tt-color-primary': '#7B22FF',
    '--tt-color-primary-hover': '#9844FF',
    '--tt-color-primary-active': '#5A15D2',
  },
  'cyan': {
    '--tt-color-primary-1': '#EBFFFB',
    '--tt-color-primary-2': '#B6F6ED',
    '--tt-color-primary-3': '#87ECE2',
    '--tt-color-primary-4': '#5CE3DA',
    '--tt-color-primary-5': '#33D9D4',
    '--tt-color-primary-6': '#0ED0D0',
    '--tt-color-primary-7': '#09AAAF',
    '--tt-color-primary': '#0ED0D0',
    '--tt-color-primary-hover': '#33D9D4',
    '--tt-color-primary-active': '#09AAAF',
  },
};

export const themeList = [
  { value: 'geek-blue', title: '极客蓝' },
  { value: 'dust-red', title: '薄暮红' },
  { value: 'mint-green', title: '薄荷绿' },
  { value: 'neon-blue', title: '霓虹蓝' },
  { value: 'sunset-orange', title: '日暮橙' },
  { value: 'golden-purple', title: '酱紫' },
  { value: 'cyan', title: '明青' },
];

export const ThemeDecorator = (Story, context) => {
  const theme = context.globals.theme || 'geek-blue';
  const themeVars = themes[theme] || themes['geek-blue'];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    return () => {
      Object.keys(themeVars).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [theme]);

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'var(--tt-bg-white, #fff)',
    }}>
      <Story />
    </div>
  );
};
