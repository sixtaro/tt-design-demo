import test from 'node:test';
import assert from 'node:assert/strict';

import { findComponentExports } from '../tools/find-component-exports.mjs';

test('findComponentExports returns root export metadata for Button', () => {
  const result = findComponentExports({ name: 'Button' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Button');
  assert.equal(result.data.sourcePath, 'src/components/Button/index.js');
  assert.deepEqual(result.data.exportedFrom, {
    components: true,
    business: false,
    root: true,
  });
  assert.deepEqual(result.data.preferredImport, {
    module: 'tt-design',
    export: 'Button',
  });
  assert.ok(result.sourceLocations.length >= 1);
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/index.js'));
});

test('findComponentExports warns when a component is not exported from src/index.js', () => {
  const result = findComponentExports({ name: 'InputNumber' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'InputNumber');
  assert.equal(result.data.sourcePath, 'src/components/InputNumber/index.js');
  assert.deepEqual(result.data.exportedFrom, {
    components: true,
    business: false,
    root: false,
  });
  assert.equal(result.data.preferredImport, null);
  assert.ok(result.warnings.some((warning) => warning.includes('InputNumber')));
  assert.ok(result.warnings.some((warning) => warning.includes('not exported from src/index.js')));
});

test('findComponentExports returns COMPONENT_NOT_FOUND for a missing component', () => {
  const result = findComponentExports({ name: 'MissingComponent' });

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'COMPONENT_NOT_FOUND',
      message: 'Component not found in registry',
      details: {
        name: 'MissingComponent',
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('findComponentExports rejects malformed component names', () => {
  const result = findComponentExports({ name: '../Button' });

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'INVALID_COMPONENT_NAME',
      message: 'name must be a valid component export identifier',
      details: {
        name: '../Button',
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('findComponentExports returns COMPONENT_NAME_CONFLICT when registry marks a name conflict', () => {
  const result = findComponentExports(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            sourcePath: 'src/components/Button/index.js',
            exportSourceLocations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
            exportedFromCategory: true,
            exportedFromRoot: true,
            warnings: [],
            conflicts: ['duplicate-name'],
          },
        ],
        conflicts: [],
        warnings: [],
      },
    },
  );

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'COMPONENT_NAME_CONFLICT',
      message: 'Component name has registry conflicts',
      details: {
        name: 'Button',
        conflicts: ['duplicate-name'],
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('findComponentExports returns COMPONENT_NAME_CONFLICT when registry has name conflict metadata only', () => {
  const result = findComponentExports(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            sourcePath: 'src/components/Button/index.js',
            exportSourceLocations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
            exportedFromCategory: true,
            exportedFromRoot: true,
            warnings: [],
            conflicts: [],
          },
        ],
        conflicts: [
          {
            type: 'duplicate-name',
            name: 'Button',
            category: 'basic',
            locations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
          },
        ],
        warnings: [],
      },
    },
  );

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'COMPONENT_NAME_CONFLICT',
      message: 'Component name has registry conflicts',
      details: {
        name: 'Button',
        conflicts: [
          {
            type: 'duplicate-name',
            name: 'Button',
            category: 'basic',
            locations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
          },
        ],
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('findComponentExports prefers structured registry conflict metadata when both conflict sources exist', () => {
  const result = findComponentExports(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            sourcePath: 'src/components/Button/index.js',
            exportSourceLocations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
            exportedFromCategory: true,
            exportedFromRoot: true,
            warnings: [],
            conflicts: ['duplicate-name'],
          },
        ],
        conflicts: [
          {
            type: 'duplicate-name',
            name: 'Button',
            category: 'basic',
            locations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
          },
        ],
        warnings: [],
      },
    },
  );

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'COMPONENT_NAME_CONFLICT',
      message: 'Component name has registry conflicts',
      details: {
        name: 'Button',
        conflicts: [
          {
            type: 'duplicate-name',
            name: 'Button',
            category: 'basic',
            locations: [{ file: 'src/components/index.js', line: 42, column: 2 }],
          },
        ],
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});
