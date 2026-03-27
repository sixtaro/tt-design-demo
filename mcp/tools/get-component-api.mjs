import { analyzeApi } from '../analyzers/analyze-api.mjs';

export function getComponentApi({ name } = {}, options = {}) {
  return analyzeApi({ name }, options);
}
