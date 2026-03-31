import { ok, fail } from '../utils/result.mjs';

const VALID_CATEGORIES = new Set(['basic', 'business']);

/**
 * List tt-design components with optional filters.
 * @param {object} meta - Loaded metadata object from loadInstalledTtDesignMeta.
 * @param {{ category?: string, keyword?: string }} args
 * @returns {object} Result envelope.
 */
export function listComponents(meta, { category, keyword } = {}) {
  if (category != null && !VALID_CATEGORIES.has(category)) {
    return fail('INVALID_FILTER', 'category must be one of: basic, business', { category });
  }

  let components = meta.components.components;

  if (category) {
    components = components.filter((component) => component.category === category);
  }

  if (keyword) {
    components = components.filter((component) => component.name.toLowerCase().includes(keyword.toLowerCase()));
  }

  const warnings = components.flatMap((component) => component.warnings || []);

  return ok(
    {
      components: components.map((component) => ({
        name: component.name,
        category: component.category,
        version: component.version,
        sourcePath: component.sourcePath,
        exportedFrom: component.exportedFrom,
      })),
    },
    [],
    warnings,
  );
}
