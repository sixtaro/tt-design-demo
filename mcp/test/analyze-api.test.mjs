import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { analyzeApi } from '../analyzers/analyze-api.mjs';
import { getComponentApi } from '../tools/get-component-api.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test('analyzeApi returns normalized Button API metadata', () => {
  const result = analyzeApi({ name: 'Button' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Button');
  assert.equal(result.data.category, 'basic');
  assert.equal(result.data.sourcePath, 'src/components/Button/index.js');
  assert.equal(result.data.defaultExport, 'Button');
  assert.deepEqual(result.data.defaults, {
    type: 'default',
    shape: 'default',
    border: true,
  });
  assert.ok(result.data.props.includes('className'));
  assert.ok(result.data.subcomponents.includes('Button.Dropdown'));
  assert.equal(result.data.hasDataComponentVersion, true);
  assert.equal(result.data.hasPropTypes, false);
  assert.ok(result.warnings.some((warning) => /propTypes/i.test(warning)));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js'));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && typeof location.line === 'number'));
});

test('analyzeApi supports direct non-index component source files like PictureSwiper', () => {
  const result = analyzeApi({ name: 'PictureSwiper' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'PictureSwiper');
  assert.equal(result.data.category, 'business');
  assert.equal(result.data.sourcePath, 'src/business/pictureSwiper/pictureSwiper.js');
  assert.equal(result.data.defaultExport, 'PictureSwiper');
  assert.equal(result.data.hasPropTypes, false);
  assert.ok(Array.isArray(result.data.props));
  assert.ok(Array.isArray(result.warnings));
  assert.ok(result.warnings.length >= 1);
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/business/pictureSwiper/pictureSwiper.js'));
});

test('getComponentApi returns ok with warnings for partially supported patterns', () => {
  const result = getComponentApi({ name: 'PictureSwiper' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'PictureSwiper');
  assert.notEqual(result.warnings.some((warning) => /ANALYSIS_NOT_SUPPORTED/.test(warning)), true);
});

test('getComponentApi returns INVALID_COMPONENT_NAME for malformed names', () => {
  const result = getComponentApi({ name: '../Button' });

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

test('getComponentApi returns COMPONENT_NOT_FOUND for missing components', () => {
  const result = getComponentApi({ name: 'MissingComponent' });

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

test('getComponentApi returns COMPONENT_NAME_CONFLICT when registry marks a name conflict', () => {
  const result = getComponentApi(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            componentDir: 'Button',
            sourcePath: 'src/components/Button/index.js',
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

test('analyzeApi preserves registry source locations', () => {
  const result = analyzeApi(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            componentDir: 'Button',
            sourcePath: 'src/components/Button/index.js',
            sourceLocations: [{ file: 'src/index.js', line: 12, column: 0 }],
            warnings: [],
            conflicts: [],
          },
        ],
        conflicts: [],
        warnings: [],
      },
    },
  );

  assert.equal(result.ok, true);
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/index.js' && location.line === 12));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js'));
});

test('analyzeApi includes declaration location for identifier default exports', () => {
  const result = analyzeApi({ name: 'Button' });

  assert.equal(result.ok, true);
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && location.line === 8));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && location.line === 122));
});

test('analyzeApi records source locations for extracted default values', () => {
  const result = analyzeApi({ name: 'Button' });

  assert.equal(result.ok, true);
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && location.line === 9));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && location.line === 14));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.js' && location.line === 17));
});

test('analyzeApi unwraps memo and forwardRef wrappers when extracting props', () => {
  const fixturePath = path.resolve(TEST_DIR, '../../src/components/Button/__memo-forward-ref-fixture.js');

  try {
    fs.writeFileSync(fixturePath, [
      "import React, { memo, forwardRef } from 'react';",
      '',
      'const Wrapped = memo(forwardRef(({ size = \"md\", disabled = false, ...props }, ref) => (',
      '  <button ref={ref} disabled={disabled} data-component-version=\"1.0.0\" {...props}>{size}</button>',
      ')));',
      '',
      'Wrapped.propTypes = {};',
      '',
      'export default Wrapped;',
      '',
    ].join('\n'));

    const result = analyzeApi(
      { name: 'WrappedFixture' },
      {
        registryOverride: {
          components: [
            {
              name: 'WrappedFixture',
              category: 'basic',
              componentDir: 'Button',
              sourcePath: 'src/components/Button/__memo-forward-ref-fixture.js',
              sourceLocations: [],
              warnings: [],
              conflicts: [],
            },
          ],
          conflicts: [],
          warnings: [],
        },
      },
    );

    assert.equal(result.ok, true);
    assert.equal(result.data.defaultExport, 'Wrapped');
    assert.deepEqual(result.data.defaults, { size: 'md', disabled: false });
    assert.ok(result.data.props.includes('size'));
    assert.ok(result.data.props.includes('disabled'));
    assert.ok(result.data.props.includes('props'));
    assert.equal(result.data.hasDataComponentVersion, true);
  } finally {
    fs.rmSync(fixturePath, { force: true });
  }
});

test('analyzeApi unwraps memo wrappers that reference a separately declared component', () => {
  const fixturePath = path.resolve(TEST_DIR, '../../src/components/Button/__memo-identifier-wrapper-fixture.js');

  try {
    fs.writeFileSync(fixturePath, [
      "import React, { memo } from 'react';",
      '',
      'const Inner = ({ size = \"md\", disabled = false, ...props }) => (',
      '  <button disabled={disabled} data-component-version=\"1.0.0\" {...props}>{size}</button>',
      ');',
      '',
      'const Wrapped = memo(Inner);',
      '',
      'export default Wrapped;',
      '',
    ].join('\n'));

    const result = analyzeApi(
      { name: 'WrappedIdentifierFixture' },
      {
        registryOverride: {
          components: [
            {
              name: 'WrappedIdentifierFixture',
              category: 'basic',
              componentDir: 'Button',
              sourcePath: 'src/components/Button/__memo-identifier-wrapper-fixture.js',
              sourceLocations: [],
              warnings: [],
              conflicts: [],
            },
          ],
          conflicts: [],
          warnings: [],
        },
      },
    );

    assert.equal(result.ok, true);
    assert.equal(result.data.defaultExport, 'Wrapped');
    assert.deepEqual(result.data.defaults, { size: 'md', disabled: false });
    assert.ok(result.data.props.includes('size'));
    assert.ok(result.data.props.includes('disabled'));
    assert.ok(result.data.props.includes('props'));
    assert.equal(result.data.hasDataComponentVersion, true);
  } finally {
    fs.rmSync(fixturePath, { force: true });
  }
});
