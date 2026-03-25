import fallbackSvg from './assets/fallback.svg';
import noDataSvg from './assets/presets/core/no-data.svg';

export const emptyPresets = Object.freeze({
  default: 'default',
  noData: 'noData',
  simple: 'simple',
});

const presetMap = Object.freeze({
  [emptyPresets.default]: fallbackSvg,
  [emptyPresets.noData]: noDataSvg,
});

export const getPresetImage = preset => presetMap[preset] || presetMap[emptyPresets.default];

export default presetMap;
