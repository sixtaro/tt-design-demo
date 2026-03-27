import { analyzeStyle } from '../analyzers/analyze-style.mjs';

export function getComponentStyle({ name } = {}, options = {}) {
  return analyzeStyle({ name }, options);
}
