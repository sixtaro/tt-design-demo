import { ok, fail } from '../utils/result.mjs';
import { validateComponentName } from '../utils/component-lookup.mjs';

/**
 * Return API metadata for a tt-design component.
 * @param {object} meta - Loaded metadata object from loadInstalledTtDesignMeta.
 * @param {{ name: string }} args
 * @returns {object} Result envelope.
 */
export function getComponentApi(meta, { name } = {}) {
  const nameValidation = validateComponentName(name);
  if (!nameValidation.valid) {
    return fail(nameValidation.error.code, nameValidation.error.message, nameValidation.error.details);
  }

  const component = meta.api.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in API metadata', { name });
  }

  const { sourceLocations, warnings, ...apiData } = component;

  return ok(apiData, sourceLocations || [], warnings || []);
}
