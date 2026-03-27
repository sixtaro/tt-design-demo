import { buildRegistry } from '../analyzers/build-registry.mjs';
import { ok, fail, normalizeInfrastructureError } from '../utils/result.mjs';

const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function toExportedFrom(component) {
  return {
    components: component.category === 'basic' ? component.exportedFromCategory : false,
    business: component.category === 'business' ? component.exportedFromCategory : false,
    root: component.exportedFromRoot,
  };
}

export function findComponentExports({ name } = {}, { registryOverride } = {}) {
  try {
    if (!COMPONENT_NAME_PATTERN.test(name || '')) {
      return fail('INVALID_COMPONENT_NAME', 'name must be a valid component export identifier', { name });
    }

    const registry = registryOverride || buildRegistry();
    const component = registry.components.find((entry) => entry.name === name);

    if (!component) {
      return fail('COMPONENT_NOT_FOUND', 'Component not found in registry', { name });
    }

    const registryConflicts = (registry.conflicts || []).filter((conflict) => conflict.name === name);
    const componentConflicts = component.conflicts || [];
    const combinedConflicts = registryConflicts.length ? registryConflicts : componentConflicts;

    if (combinedConflicts.length) {
      return fail('COMPONENT_NAME_CONFLICT', 'Component name has registry conflicts', {
        name,
        conflicts: combinedConflicts,
      });
    }

    const warnings = [...(component.warnings || [])];

    if (!component.exportedFromRoot) {
      warnings.push(`${component.name} is not exported from src/index.js.`);
    }

    return ok(
      {
        name: component.name,
        category: component.category,
        sourcePath: component.sourcePath,
        exportedFrom: toExportedFrom(component),
        preferredImport: component.exportedFromRoot
          ? {
              module: 'tt-design',
              export: component.name,
            }
          : null,
      },
      component.exportSourceLocations || [],
      warnings,
    );
  } catch (error) {
    return normalizeInfrastructureError(error);
  }
}
