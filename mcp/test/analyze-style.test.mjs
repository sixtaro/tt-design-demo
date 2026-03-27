import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { analyzeStyle } from '../analyzers/analyze-style.mjs';
import { getComponentStyle } from '../tools/get-component-style.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

test('analyzeStyle returns normalized Button style metadata', () => {
  const result = analyzeStyle({ name: 'Button' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Button');
  assert.equal(result.data.category, 'basic');
  assert.equal(result.data.sourcePath, 'src/components/Button/index.js');
  assert.equal(result.data.stylePath, 'src/components/Button/index.less');
  assert.equal(result.data.blockClass, 'tt-button');
  assert.ok(result.data.modifierClasses.includes('tt-button-primary'));
  assert.ok(result.data.modifierClasses.includes('tt-button-danger'));
  assert.ok(result.data.relatedClasses.includes('ant-btn-disabled'));
  assert.ok(result.data.relatedClasses.includes('tt-icon'));
  assert.ok(result.data.cssVariables.includes('--tt-color-primary'));
  assert.ok(result.data.cssVariables.includes('--tt-color-red-6'));
  assert.ok(result.data.hardcodedColors.includes('#fff'));
  assert.deepEqual(result.data.themeImport, {
    path: '../../style/themes/default.less',
    kind: 'reference',
  });
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.less' && location.line === 1));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.less' && location.line === 3));
  assert.ok(Array.isArray(result.warnings));
});

test('analyzeStyle supports direct non-index LESS files like PictureSwiper', () => {
  const result = analyzeStyle({ name: 'PictureSwiper' });

  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'PictureSwiper');
  assert.equal(result.data.category, 'business');
  assert.equal(result.data.sourcePath, 'src/business/pictureSwiper/pictureSwiper.js');
  assert.equal(result.data.stylePath, 'src/business/pictureSwiper/pictureSwiper.less');
  assert.equal(result.data.blockClass, 'picture-swiper');
  assert.equal(result.data.themeImport, null);
  assert.ok(result.data.relatedClasses.includes('swiper-title'));
  assert.ok(result.data.relatedClasses.includes('swiper-description'));
  assert.ok(result.data.relatedClasses.includes('swiper-control'));
  assert.ok(result.data.relatedClasses.includes('swiper-close'));
  assert.ok(result.data.relatedClasses.includes('swiper-change-record'));
  assert.ok(result.data.cssVariables.includes('--ant-primary-color'));
  assert.ok(result.data.hardcodedColors.includes('#fff'));
  assert.ok(result.data.hardcodedColors.includes('#ccc'));
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/business/pictureSwiper/pictureSwiper.less' && location.line === 1));
});

test('getComponentStyle returns ok with warnings when linked style file is unreadable or missing', () => {
  const result = getComponentStyle(
    { name: 'Selector' },
    {
      registryOverride: {
        components: [
          {
            name: 'Selector',
            category: 'business',
            componentDir: 'MissingSelectorFixture',
            sourcePath: 'src/business/Selector/index.js',
            stylePath: 'src/business/MissingSelectorFixture/Selector.less',
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
  assert.equal(result.data.name, 'Selector');
  assert.equal(result.data.category, 'business');
  assert.equal(result.data.stylePath, 'src/business/MissingSelectorFixture/Selector.less');
  assert.equal(result.data.blockClass, null);
  assert.deepEqual(result.data.modifierClasses, []);
  assert.deepEqual(result.data.relatedClasses, []);
  assert.deepEqual(result.data.cssVariables, []);
  assert.deepEqual(result.data.hardcodedColors, []);
  assert.equal(result.data.themeImport, null);
  assert.ok(result.warnings.some((warning) => /style file/i.test(warning)));
});

test('getComponentStyle returns INVALID_COMPONENT_NAME for malformed names', () => {
  const result = getComponentStyle({ name: '../Button' });

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

test('getComponentStyle returns COMPONENT_NOT_FOUND for missing components', () => {
  const result = getComponentStyle({ name: 'MissingComponent' });

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

test('getComponentStyle returns COMPONENT_NAME_CONFLICT when registry marks a name conflict', () => {
  const result = getComponentStyle(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            componentDir: 'Button',
            sourcePath: 'src/components/Button/index.js',
            stylePath: 'src/components/Button/index.less',
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

test('analyzeStyle preserves registry source locations and theme import location when available', () => {
  const result = analyzeStyle(
    { name: 'Button' },
    {
      registryOverride: {
        components: [
          {
            name: 'Button',
            category: 'basic',
            componentDir: 'Button',
            sourcePath: 'src/components/Button/index.js',
            stylePath: 'src/components/Button/index.less',
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
  assert.ok(result.sourceLocations.some((location) => location.file === 'src/components/Button/index.less' && location.line === 1));
});

test('analyzeStyle captures all classes from multi-line selector groups', () => {
  const fixturePath = path.resolve(TEST_DIR, '../../src/components/Button/__multiline-selector-fixture.less');

  try {
    fs.writeFileSync(fixturePath, [
      '.fixture-button {',
      '  .fixture-title,',
      '  .fixture-description,',
      '  .fixture-control,',
      '  .fixture-close {',
      '    color: #fff;',
      '  }',
      '}',
      '',
    ].join('\n'));

    const result = analyzeStyle(
      { name: 'MultiLineSelectorFixture' },
      {
        registryOverride: {
          components: [
            {
              name: 'MultiLineSelectorFixture',
              category: 'basic',
              componentDir: 'Button',
              sourcePath: 'src/components/Button/index.js',
              stylePath: 'src/components/Button/__multiline-selector-fixture.less',
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
    assert.equal(result.data.blockClass, 'fixture-button');
    assert.ok(result.data.relatedClasses.includes('fixture-title'));
    assert.ok(result.data.relatedClasses.includes('fixture-description'));
    assert.ok(result.data.relatedClasses.includes('fixture-control'));
    assert.ok(result.data.relatedClasses.includes('fixture-close'));
  } finally {
    fs.rmSync(fixturePath, { force: true });
  }
});

test('analyzeStyle ignores non-theme imports when extracting theme import metadata', () => {
  const fixturePath = path.resolve(TEST_DIR, '../../src/components/Button/__style-import-fixture.less');

  try {
    fs.writeFileSync(fixturePath, [
      "@import './mixins.less';",
      '',
      '.fixture-button {',
      '  color: var(--tt-color-primary);',
      '}',
      '',
    ].join('\n'));

    const result = analyzeStyle(
      { name: 'StyleImportFixture' },
      {
        registryOverride: {
          components: [
            {
              name: 'StyleImportFixture',
              category: 'basic',
              componentDir: 'Button',
              sourcePath: 'src/components/Button/index.js',
              stylePath: 'src/components/Button/__style-import-fixture.less',
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
    assert.equal(result.data.themeImport, null);
    assert.equal(result.data.blockClass, 'fixture-button');
    assert.ok(result.data.cssVariables.includes('--tt-color-primary'));
    assert.ok(result.sourceLocations.every((location) => location.reason !== 'theme-import'));
  } finally {
    fs.rmSync(fixturePath, { force: true });
  }
});
