import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import { listComponents } from '../tools/list-components.mjs';
import { findComponentExports } from '../tools/find-component-exports.mjs';
import { getComponentApi } from '../tools/get-component-api.mjs';
import { getComponentStyle } from '../tools/get-component-style.mjs';
import { generatedMetaBundleSchema } from './schema.mjs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CURRENT_DIR, '../..');
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, 'package.json');

function readPackageVersion() {
  const content = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
  const pkg = JSON.parse(content);
  return pkg.version;
}

function isOk(result) {
  return result && result.ok === true;
}

function buildGeneratedMeta() {
  const packageVersion = readPackageVersion();
  const generatedAt = new Date().toISOString();
  const packageName = 'tt-design';
  const metadataSchemaVersion = 1;

  const componentsResult = listComponents();
  if (!isOk(componentsResult)) {
    throw new Error(`listComponents failed: ${componentsResult.error?.message}`);
  }

  const componentNames = componentsResult.data.components.map((c) => c.name);

  const componentsComponents = componentsResult.data.components;

  const exportsComponents = [];
  const apiComponents = [];
  const styleComponents = [];

  for (const name of componentNames) {
    const exportsResult = findComponentExports({ name });
    if (isOk(exportsResult)) {
      exportsComponents.push({
        name: exportsResult.data.name,
        category: exportsResult.data.category,
        sourcePath: exportsResult.data.sourcePath,
        exportedFrom: exportsResult.data.exportedFrom,
        preferredImport: exportsResult.data.preferredImport,
      });
    }

    const apiResult = getComponentApi({ name });
    if (isOk(apiResult)) {
      apiComponents.push({
        name: apiResult.data.name,
        category: apiResult.data.category,
        sourcePath: apiResult.data.sourcePath,
        defaultExport: apiResult.data.defaultExport,
        props: apiResult.data.props,
        defaults: apiResult.data.defaults,
        subcomponents: apiResult.data.subcomponents,
        hasDataComponentVersion: apiResult.data.hasDataComponentVersion,
        hasPropTypes: apiResult.data.hasPropTypes,
      });
    }

    const styleResult = getComponentStyle({ name });
    if (isOk(styleResult)) {
      styleComponents.push({
        name: styleResult.data.name,
        category: styleResult.data.category,
        sourcePath: styleResult.data.sourcePath,
        stylePath: styleResult.data.stylePath,
        blockClass: styleResult.data.blockClass,
        modifierClasses: styleResult.data.modifierClasses,
        relatedClasses: styleResult.data.relatedClasses,
        cssVariables: styleResult.data.cssVariables,
        hardcodedColors: styleResult.data.hardcodedColors,
        themeImport: styleResult.data.themeImport,
      });
    }
  }

  // Bundle uses flat keys for exports/api/styles (mirrors the generatedMetaBundleSchema).
  // writeGeneratedMetaFiles serializes each section as its own JSON file.
  const bundle = {
    version: {
      generatedAt,
      metadataSchemaVersion,
      packageName,
      packageVersion,
    },
    components: {
      generatedAt,
      metadataSchemaVersion,
      packageName,
      components: componentsComponents,
    },
    exports: {
      generatedAt,
      metadataSchemaVersion,
      packageName,
      components: exportsComponents,
    },
    api: {
      generatedAt,
      metadataSchemaVersion,
      packageName,
      components: apiComponents,
    },
    styles: {
      generatedAt,
      metadataSchemaVersion,
      packageName,
      components: styleComponents,
    },
  };

  return generatedMetaBundleSchema.parse(bundle);
}

export { buildGeneratedMeta };
