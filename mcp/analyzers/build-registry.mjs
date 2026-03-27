import path from 'node:path';
import { parse } from '@babel/parser';

import {
  CATEGORY_ENTRY_FILES,
  ROOT_ENTRY_FILE,
  parseEntryReferences,
  resolveImportPaths,
  toSourceLocation,
} from './entry-references.mjs';
import { readRepoRelativeFile } from '../utils/read-source.mjs';

const VERSION_CONFIG_FILE = 'src/utils/version-config.js';
const VALID_CATEGORIES = new Set(Object.keys(CATEGORY_ENTRY_FILES));

function parseModule(relativePath) {
  return parse(readRepoRelativeFile(relativePath), {
    sourceType: 'module',
    plugins: ['jsx'],
  });
}

function getStringLiteralValue(node) {
  if (!node) {
    return null;
  }

  if (node.type === 'StringLiteral') {
    return node.value;
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  return null;
}

function parseVersionConfig() {
  const ast = parseModule(VERSION_CONFIG_FILE);
  const versions = new Map();
  let sourceLocation = null;

  for (const statement of ast.program.body) {
    if (statement.type !== 'ExportNamedDeclaration' || !statement.declaration) {
      continue;
    }

    const declaration = statement.declaration;

    if (declaration.type !== 'VariableDeclaration') {
      continue;
    }

    for (const declarator of declaration.declarations) {
      if (declarator.id.type !== 'Identifier' || declarator.id.name !== 'componentVersions') {
        continue;
      }

      sourceLocation = toSourceLocation(VERSION_CONFIG_FILE, declarator);

      if (declarator.init?.type !== 'ObjectExpression') {
        continue;
      }

      for (const property of declarator.init.properties) {
        if (property.type !== 'ObjectProperty') {
          continue;
        }

        const keyName = property.key.type === 'Identifier'
          ? property.key.name
          : getStringLiteralValue(property.key);
        const version = getStringLiteralValue(property.value);

        if (keyName && version) {
          versions.set(keyName, {
            version,
            sourceLocation: toSourceLocation(VERSION_CONFIG_FILE, property),
          });
        }
      }
    }
  }

  return { versions, sourceLocation };
}

function createComponentRecord({
  name,
  category,
  componentDir,
  sourcePath,
  stylePath,
  importLocation,
  exportLocation,
  exportedFromCategory,
  exportedFromRoot = false,
}) {
  return {
    name,
    category,
    componentDir,
    sourcePath,
    stylePath,
    sourceLocations: importLocation ? [importLocation] : [],
    exportSourceLocations: exportLocation ? [exportLocation] : [],
    exportedFromCategory,
    exportedFromRoot,
    version: null,
    conflicts: [],
    warnings: [],
  };
}

function collectCategoryComponents(category, entryFile) {
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`Unsupported category: ${category}`);
  }

  const { imports, aliases, exports } = parseEntryReferences(entryFile);
  const baseDir = path.posix.dirname(entryFile);
  const components = new Map();
  const conflicts = [];

  for (const [localName, exportInfo] of exports.entries()) {
    const importInfo = imports.get(localName) || aliases.get(localName);

    if (!importInfo) {
      continue;
    }

    const name = exportInfo.exportName;
    const resolved = resolveImportPaths(baseDir, importInfo.importSource);

    if (components.has(name)) {
      conflicts.push({
        type: 'duplicate-name',
        name,
        category,
        locations: [components.get(name).sourceLocations[0], importInfo.importLocation],
      });
      continue;
    }

    const component = createComponentRecord({
      name,
      category,
      componentDir: resolved.componentDir,
      sourcePath: resolved.sourcePath,
      stylePath: resolved.stylePath,
      importLocation: importInfo.importLocation,
      exportLocation: exportInfo.exportLocation,
      exportedFromCategory: true,
    });

    if (importInfo.inferred) {
      component.warnings.push(`${name} uses an inferred source path from a conditional alias export.`);
    }

    components.set(name, component);
  }

  return { components, conflicts };
}

function applyRootExports(registryByName, conflicts) {
  const { imports, aliases, exports } = parseEntryReferences(ROOT_ENTRY_FILE);

  for (const [localName, exportInfo] of exports.entries()) {
    const importInfo = imports.get(localName) || aliases.get(localName);
    const name = exportInfo.exportName;
    const existingComponent = registryByName.get(name);

    if (existingComponent) {
      existingComponent.exportedFromRoot = true;
      existingComponent.exportSourceLocations.push(exportInfo.exportLocation);

      if (importInfo) {
        const resolvedRootImport = resolveImportPaths('src', path.posix.normalize(importInfo.importSource));

        if (resolvedRootImport.sourcePath !== existingComponent.sourcePath) {
          const conflict = {
            type: 'duplicate-name',
            name,
            category: `${existingComponent.category},root`,
            locations: [...existingComponent.sourceLocations, importInfo.importLocation],
          };

          conflicts.push(conflict);
          existingComponent.conflicts.push('duplicate-name');
        }
      }

      if (importInfo?.inferred) {
        existingComponent.warnings.push(`${name} uses an inferred source path from a conditional alias export.`);
      }
      continue;
    }

    if (!importInfo) {
      continue;
    }

    const normalizedImport = path.posix.normalize(importInfo.importSource);
    const inferredCategory = normalizedImport.startsWith('./business/') ? 'business' : 'basic';
    const resolved = resolveImportPaths('src', normalizedImport);

    const newComponent = createComponentRecord({
      name,
      category: inferredCategory,
      componentDir: resolved.componentDir,
      sourcePath: resolved.sourcePath,
      stylePath: resolved.stylePath,
      importLocation: importInfo.importLocation,
      exportLocation: exportInfo.exportLocation,
      exportedFromCategory: false,
      exportedFromRoot: true,
    });

    if (importInfo.inferred) {
      newComponent.warnings.push(`${name} uses an inferred source path from a conditional alias export.`);
    }

    registryByName.set(name, newComponent);
  }

  const seenNames = new Set();

  for (const component of registryByName.values()) {
    if (seenNames.has(component.name)) {
      conflicts.push({
        type: 'duplicate-name',
        name: component.name,
        category: component.category,
        locations: component.sourceLocations,
      });
      component.conflicts.push('duplicate-name');
      continue;
    }

    seenNames.add(component.name);
  }
}

function applyVersions(registryByName, warnings) {
  const { versions, sourceLocation } = parseVersionConfig();

  for (const component of registryByName.values()) {
    const versionEntry = versions.get(component.name);

    if (versionEntry) {
      component.version = versionEntry.version;
      component.sourceLocations.push(versionEntry.sourceLocation);
      continue;
    }

    const warning = `Missing version entry for registered component ${component.name}`;
    warnings.push(warning);
    component.warnings.push(warning);

    if (sourceLocation) {
      component.sourceLocations.push(sourceLocation);
    }
  }
}

export function buildRegistry() {
  const registryByName = new Map();
  const conflicts = [];
  const warnings = [];

  for (const [category, entryFile] of Object.entries(CATEGORY_ENTRY_FILES)) {
    const { components, conflicts: categoryConflicts } = collectCategoryComponents(category, entryFile);

    for (const [name, component] of components.entries()) {
      if (registryByName.has(name)) {
        const existing = registryByName.get(name);
        const conflict = {
          type: 'duplicate-name',
          name,
          category: `${existing.category},${component.category}`,
          locations: [...existing.sourceLocations, ...component.sourceLocations],
        };

        conflicts.push(conflict);
        existing.conflicts.push('duplicate-name');
        component.conflicts.push('duplicate-name');
        continue;
      }

      registryByName.set(name, component);
    }

    conflicts.push(...categoryConflicts);
  }

  applyRootExports(registryByName, conflicts);
  applyVersions(registryByName, warnings);

  return {
    components: Array.from(registryByName.values()).sort((left, right) => left.name.localeCompare(right.name)),
    conflicts,
    warnings,
  };
}
