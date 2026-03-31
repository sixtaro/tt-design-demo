import { ok, fail } from '../utils/result.mjs';
import { validateComponentName } from '../utils/component-lookup.mjs';

/**
 * Return style metadata for a tt-design component.
 * @param {object} meta - Loaded metadata object from loadInstalledTtDesignMeta.
 * @param {{ name: string }} args
 * @returns {object} Result envelope.
 */
export function getComponentStyle(meta, { name } = {}) {
  const nameValidation = validateComponentName(name);
  if (!nameValidation.valid) {
    return fail(nameValidation.error.code, nameValidation.error.message, nameValidation.error.details);
  }

  const component = meta.styles.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in style metadata', { name });
  }

  const { sourceLocations, warnings, ...styleData } = component;

  return ok(styleData, sourceLocations || [], warnings || []);
}
