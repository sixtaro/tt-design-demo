import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRegistry } from '../analyzers/build-registry.mjs';
import { getRegisteredComponentDirs } from '../analyzers/entry-references.mjs';
import { listComponents } from '../tools/list-components.mjs';
import { readRepoRelativeFile } from '../utils/read-source.mjs';

function getComponent(registry, name) {
  return registry.components.find((component) => component.name === name);
}

test('buildRegistry maps Button as basic with index source, style, and version', () => {
  const registry = buildRegistry();
  const button = getComponent(registry, 'Button');

  assert.ok(button);
  assert.equal(button.category, 'basic');
  assert.equal(button.componentDir, 'Button');
  assert.equal(button.sourcePath, 'src/components/Button/index.js');
  assert.equal(button.stylePath, 'src/components/Button/index.less');
  assert.equal(button.version, '1.0.0');
  assert.equal(button.exportedFromCategory, true);
  assert.equal(button.exportedFromRoot, true);
  assert.ok(Array.isArray(button.sourceLocations));
  assert.ok(Array.isArray(button.exportSourceLocations));
});

test('buildRegistry maps PageLayout as business with layout index source', () => {
  const registry = buildRegistry();
  const pageLayout = getComponent(registry, 'PageLayout');

  assert.ok(pageLayout);
  assert.equal(pageLayout.category, 'business');
  assert.equal(pageLayout.componentDir, 'layout');
  assert.equal(pageLayout.sourcePath, 'src/business/layout/index.js');
  assert.equal(pageLayout.stylePath, 'src/business/layout/index.less');
  assert.equal(pageLayout.exportedFromCategory, true);
  assert.equal(pageLayout.exportedFromRoot, true);
});

test('buildRegistry keeps direct-file layouts like PictureSwiper', () => {
  const registry = buildRegistry();
  const pictureSwiper = getComponent(registry, 'PictureSwiper');

  assert.ok(pictureSwiper);
  assert.equal(pictureSwiper.category, 'business');
  assert.equal(pictureSwiper.componentDir, 'pictureSwiper');
  assert.equal(pictureSwiper.sourcePath, 'src/business/pictureSwiper/pictureSwiper.js');
  assert.equal(pictureSwiper.stylePath, 'src/business/pictureSwiper/pictureSwiper.less');
  assert.equal(pictureSwiper.exportedFromCategory, true);
  assert.equal(pictureSwiper.exportedFromRoot, false);
});

test('buildRegistry exposes conflict metadata structure', () => {
  const registry = buildRegistry();

  assert.ok(Array.isArray(registry.conflicts));
});

test('buildRegistry includes root-only exports that are missing from category index files', () => {
  const registry = buildRegistry();
  const font = getComponent(registry, 'Font');
  const timePicker = getComponent(registry, 'TimePicker');

  assert.ok(font);
  assert.equal(font.category, 'basic');
  assert.equal(font.sourcePath, 'src/components/Font/index.js');
  assert.equal(font.stylePath, 'src/components/Font/index.less');
  assert.equal(font.exportedFromCategory, false);
  assert.equal(font.exportedFromRoot, true);

  assert.ok(timePicker);
  assert.equal(timePicker.category, 'basic');
  assert.equal(timePicker.sourcePath, 'src/components/TimePicker/index.js');
  assert.equal(timePicker.exportedFromCategory, false);
  assert.equal(timePicker.exportedFromRoot, true);
});

test('buildRegistry stores componentDir in the format required by readRepoRelativeFile', () => {
  const registry = buildRegistry();
  const button = getComponent(registry, 'Button');
  const code = readRepoRelativeFile(button.sourcePath, button.componentDir);

  assert.equal(button.componentDir, 'Button');
  assert.match(code, /Button/);
});

test('buildRegistry does not register private business imports that are not exported', () => {
  const registry = buildRegistry();

  assert.equal(getComponent(registry, 'BreadcrumbOrgOld'), undefined);
  assert.equal(getComponent(registry, 'BreadcrumbOrgTag'), undefined);
  assert.ok(getComponent(registry, 'BreadcrumbOrg'));
});

test('buildRegistry adds a warning when export path is inferred from a conditional alias', () => {
  const registry = buildRegistry();
  const breadcrumbOrg = getComponent(registry, 'BreadcrumbOrg');

  assert.ok(breadcrumbOrg);
  assert.ok(breadcrumbOrg.warnings.some((warning) => warning.includes('BreadcrumbOrg')));
  assert.ok(breadcrumbOrg.warnings.some((warning) => warning.includes('inferred')));
});

test('getRegisteredComponentDirs includes exported component directories from shared entry parsing', () => {
  const registeredDirs = getRegisteredComponentDirs();

  assert.equal(registeredDirs.has('src/components/Button'), true);
  assert.equal(registeredDirs.has('src/components/Font'), true);
  assert.equal(registeredDirs.has('src/business/pictureSwiper'), true);
});

test('listComponents filters by category and keyword and returns repo-relative paths', () => {
  const result = listComponents({ category: 'business', keyword: 'Picture' });

  assert.equal(result.ok, true);
  assert.ok(Array.isArray(result.warnings));
  assert.ok(result.warnings.some((warning) => warning.includes('PictureSwiper')));
  assert.equal(result.data.components.length, 1);
  assert.deepEqual(result.data.components[0], {
    name: 'PictureSwiper',
    category: 'business',
    version: null,
    sourcePath: 'src/business/pictureSwiper/pictureSwiper.js',
    stylePath: 'src/business/pictureSwiper/pictureSwiper.less',
    exportedFrom: {
      components: false,
      business: true,
      root: false,
    },
  });
});

test('listComponents rejects invalid category with INVALID_FILTER', () => {
  const result = listComponents({ category: 'invalid' });

  assert.deepEqual(result, {
    ok: false,
    error: {
      code: 'INVALID_FILTER',
      message: 'category must be one of: basic, business',
      details: {
        category: 'invalid',
      },
    },
    sourceLocations: [],
    warnings: [],
  });
});
