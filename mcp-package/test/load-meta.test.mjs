import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { loadMetaFromPackageRoot } from '../src/meta/load-meta.mjs';

function createFixturePackage() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tt-design-mcp-fixture-'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

test('loadMetaFromPackageRoot reads schema-valid tt-design metadata from an installed package', () => {
  const fixtureRoot = createFixturePackage();
  const packageRoot = path.join(fixtureRoot, 'node_modules/tt-design');

  writeJson(path.join(packageRoot, 'dist/meta/version.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    packageVersion: '1.0.3',
    metadataSchemaVersion: 1,
  });
  writeJson(path.join(packageRoot, 'dist/meta/components.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    metadataSchemaVersion: 1,
    components: [
      {
        name: 'Button',
        category: 'basic',
        version: '1.0.0',
        sourcePath: 'dist/esm/components/Button/index.js',
        stylePath: 'dist/esm/components/Button/index.css',
        exportedFrom: { components: true, business: false, root: true },
        warnings: [],
      },
    ],
  });
  writeJson(path.join(packageRoot, 'dist/meta/exports.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    metadataSchemaVersion: 1,
    components: [
      {
        name: 'Button',
        category: 'basic',
        sourcePath: 'dist/esm/components/Button/index.js',
        exportedFrom: { components: true, business: false, root: true },
        preferredImport: { module: 'tt-design', export: 'Button' },
        sourceLocations: [],
        warnings: [],
      },
    ],
  });
  writeJson(path.join(packageRoot, 'dist/meta/api.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    metadataSchemaVersion: 1,
    components: [
      {
        name: 'Button',
        category: 'basic',
        sourcePath: 'dist/esm/components/Button/index.js',
        defaultExport: 'Button',
        defaults: {},
        props: ['children'],
        subcomponents: [],
        hasDataComponentVersion: true,
        hasPropTypes: true,
        sourceLocations: [],
        warnings: [],
      },
    ],
  });
  writeJson(path.join(packageRoot, 'dist/meta/styles.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    metadataSchemaVersion: 1,
    components: [
      {
        name: 'Button',
        category: 'basic',
        sourcePath: 'dist/esm/components/Button/index.js',
        stylePath: 'dist/esm/components/Button/index.css',
        blockClass: 'tt-button',
        modifierClasses: [],
        relatedClasses: [],
        cssVariables: [],
        hardcodedColors: [],
        themeImport: null,
        sourceLocations: [],
        warnings: [],
      },
    ],
  });

  const result = loadMetaFromPackageRoot(packageRoot);

  assert.equal(result.version.packageVersion, '1.0.3');
  assert.equal(result.components.components[0].name, 'Button');
  assert.equal(result.exports.components[0].preferredImport.module, 'tt-design');
});

test('loadMetaFromPackageRoot throws with file name when a metadata file is malformed', () => {
  const fixtureRoot = createFixturePackage();
  const packageRoot = path.join(fixtureRoot, 'node_modules/tt-design');
  fs.mkdirSync(path.join(packageRoot, 'dist/meta'), { recursive: true });

  writeJson(path.join(packageRoot, 'dist/meta/version.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    packageName: 'tt-design',
    packageVersion: '1.0.3',
    metadataSchemaVersion: 1,
  });
  writeJson(path.join(packageRoot, 'dist/meta/components.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    components: [
      {
        name: 'Button',
        category: 'invalid-category-not-allowed',
        version: '1.0.0',
        sourcePath: 'dist/esm/components/Button/index.js',
        stylePath: null,
        exportedFrom: { components: true, business: false, root: true },
        warnings: [],
      },
    ],
  });
  writeJson(path.join(packageRoot, 'dist/meta/exports.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    components: [],
  });
  writeJson(path.join(packageRoot, 'dist/meta/api.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    components: [],
  });
  writeJson(path.join(packageRoot, 'dist/meta/styles.json'), {
    generatedAt: '2026-03-31T00:00:00.000Z',
    components: [],
  });

  let thrown = null;
  try {
    loadMetaFromPackageRoot(packageRoot);
  } catch (error) {
    thrown = error;
  }

  assert.notEqual(thrown, null);
  assert.equal(thrown.fileName, 'components.json');
  assert.ok(thrown.message.includes('components.json'));
});
