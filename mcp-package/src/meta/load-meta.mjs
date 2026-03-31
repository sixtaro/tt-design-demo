import fs from 'node:fs';
import path from 'node:path';

import {
  componentsFileSchema,
  exportsFileSchema,
  apiFileSchema,
  stylesFileSchema,
  versionFileSchema,
} from './schema.mjs';
import { resolveInstalledTtDesignRoot } from './resolve-package-root.mjs';

function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Read and validate all 5 metadata JSON files from the installed tt-design package.
 * @param {string} packageRoot - Absolute path to the tt-design package root.
 * @returns {{ version, components, exports, api, styles }}
 */
export function loadMetaFromPackageRoot(packageRoot) {
  const metaDir = path.join(packageRoot, 'dist/meta');

  function readAndValidate(fileName, schema) {
    try {
      return schema.parse(readJsonFile(path.join(metaDir, fileName)));
    } catch (error) {
      const errorToThrow = new Error(`Failed to parse ${fileName}: ${error.message}`);
      errorToThrow.fileName = fileName;
      errorToThrow.schemaErrors = error.errors || [];
      throw errorToThrow;
    }
  }

  return {
    version: readAndValidate('version.json', versionFileSchema),
    components: readAndValidate('components.json', componentsFileSchema),
    exports: readAndValidate('exports.json', exportsFileSchema),
    api: readAndValidate('api.json', apiFileSchema),
    styles: readAndValidate('styles.json', stylesFileSchema),
  };
}

/**
 * Locate the installed tt-design package and load its metadata.
 * @param {string} [startDir] - Directory to start searching from (defaults to process.cwd()).
 * @returns {{ packageRoot, meta }}
 */
export function loadInstalledTtDesignMeta(startDir) {
  const packageRoot = resolveInstalledTtDesignRoot(startDir);
  const meta = loadMetaFromPackageRoot(packageRoot);
  return { packageRoot, meta };
}
