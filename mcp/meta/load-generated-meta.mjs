import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import {
  componentsFileSchema,
  exportsFileSchema,
  apiFileSchema,
  stylesFileSchema,
  versionFileSchema,
  generatedMetaBundleSchema,
} from './schema.mjs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CURRENT_DIR, '../..');
const DIST_META_DIR = path.join(REPO_ROOT, 'dist/meta');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function writeGeneratedMetaFiles(bundle) {
  ensureDir(DIST_META_DIR);

  writeJsonFile(path.join(DIST_META_DIR, 'version.json'), bundle.version);
  writeJsonFile(path.join(DIST_META_DIR, 'components.json'), bundle.components);
  writeJsonFile(path.join(DIST_META_DIR, 'exports.json'), bundle.exports);
  writeJsonFile(path.join(DIST_META_DIR, 'api.json'), bundle.api);
  writeJsonFile(path.join(DIST_META_DIR, 'styles.json'), bundle.styles);
}

function loadGeneratedMetaFiles() {
  const version = versionFileSchema.parse(readJsonFile(path.join(DIST_META_DIR, 'version.json')));
  const components = componentsFileSchema.parse(readJsonFile(path.join(DIST_META_DIR, 'components.json')));
  const exportsEnvelope = exportsFileSchema.parse(readJsonFile(path.join(DIST_META_DIR, 'exports.json')));
  const apiEnvelope = apiFileSchema.parse(readJsonFile(path.join(DIST_META_DIR, 'api.json')));
  const stylesEnvelope = stylesFileSchema.parse(readJsonFile(path.join(DIST_META_DIR, 'styles.json')));

  // Bundle structure mirrors the flat file schemas exactly.
  return generatedMetaBundleSchema.parse({
    version,
    components,
    exports: exportsEnvelope,
    api: apiEnvelope,
    styles: stylesEnvelope,
  });
}

export { DIST_META_DIR, writeGeneratedMetaFiles, loadGeneratedMetaFiles };
