import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildGeneratedMeta } from '../meta/build-generated-meta.mjs';
import { writeGeneratedMetaFiles, loadGeneratedMetaFiles } from '../meta/load-generated-meta.mjs';
import { generatedMetaBundleSchema } from '../meta/schema.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '../..');
const DIST_META_DIR = path.join(REPO_ROOT, 'dist/meta');

test('buildGeneratedMeta creates schema-valid metadata files for published package consumption', () => {
  const bundle = buildGeneratedMeta();
  const parsedBundle = generatedMetaBundleSchema.parse(bundle);

  assert.equal(parsedBundle.version.metadataSchemaVersion, 1);
  assert.equal(parsedBundle.version.packageName, 'tt-design');
  assert.equal(typeof parsedBundle.version.packageVersion, 'string');
  assert.ok(parsedBundle.components.components.some((component) => component.name === 'Button'));
  assert.ok(parsedBundle.exports.components.some((entry) => entry.name === 'Button'));
  assert.ok(parsedBundle.api.components.some((component) => component.name === 'Button'));
  assert.ok(parsedBundle.styles.components.some((component) => component.name === 'Button'));

  writeGeneratedMetaFiles(bundle);

  const files = fs.readdirSync(DIST_META_DIR).sort();
  assert.deepEqual(files, [
    'api.json',
    'components.json',
    'exports.json',
    'styles.json',
    'version.json',
  ]);

  const loadedBundle = loadGeneratedMetaFiles();
  assert.deepEqual(loadedBundle, parsedBundle);
});
