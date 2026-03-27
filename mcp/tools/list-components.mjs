import { buildRegistry } from '../analyzers/build-registry.mjs';
import { ok, fail, normalizeInfrastructureError } from '../utils/result.mjs';

const VALID_CATEGORIES = new Set(['basic', 'business']);

export function listComponents({ category, keyword } = {}) {
  try {
    if (category != null && !VALID_CATEGORIES.has(category)) {
      return fail('INVALID_FILTER', 'category must be one of: basic, business', { category });
    }

    const registry = buildRegistry();
    let components = registry.components;

    if (category) {
      components = components.filter((component) => component.category === category);
    }

    if (keyword) {
      components = components.filter((component) => component.name.includes(keyword));
    }

    return ok(
      {
        components: components.map((component) => ({
          name: component.name,
          category: component.category,
          version: component.version,
          sourcePath: component.sourcePath,
          stylePath: component.stylePath,
          exportedFrom: {
            components: component.category === 'basic' ? component.exportedFromCategory : false,
            business: component.category === 'business' ? component.exportedFromCategory : false,
            root: component.exportedFromRoot,
          },
        })),
      },
      [],
      components.flatMap((component) => component.warnings || []),
    );
  } catch (error) {
    return normalizeInfrastructureError(error);
  }
}
