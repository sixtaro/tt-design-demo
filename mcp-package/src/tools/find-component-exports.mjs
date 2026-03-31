import { ok, fail } from '../utils/result.mjs';
import { validateComponentName } from '../utils/component-lookup.mjs';

/**
 * Find how a tt-design component is exported and where it should be imported from.
 * @param {object} meta - Loaded metadata object from loadInstalledTtDesignMeta.
 * @param {{ name: string }} args
 * @returns {object} Result envelope.
 */
export function findComponentExports(meta, { name } = {}) {
  const nameValidation = validateComponentName(name);
  if (!nameValidation.valid) {
    return fail(nameValidation.error.code, nameValidation.error.message, nameValidation.error.details);
  }

  const component = meta.exports.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in registry', { name });
  }

  const warnings = [...(component.warnings || [])];

  if (!component.exportedFrom.root) {
    warnings.push(`${component.name} is not exported from tt-design root (src/index.js).`);
  }

  return ok(
    {
      name: component.name,
      category: component.category,
      sourcePath: component.sourcePath,
      exportedFrom: component.exportedFrom,
      preferredImport: component.preferredImport,
    },
    component.sourceLocations || [],
    warnings,
  );
}
