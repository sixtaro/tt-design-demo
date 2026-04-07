# tt-design MCP npm Dual-Package Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `tt-design` and a new `tt-design-mcp` package so external users can install the component library plus an MCP server from npm without cloning this repository.

**Architecture:** Keep the current repository-local MCP implementation as the source of truth for how metadata is derived, but split the shipped product into two layers. `tt-design` will generate and publish `dist/meta/*.json`, and a new `mcp-package/` npm package will load those published metadata files from the user’s installed `tt-design` package and expose the existing four MCP tools over stdio.

**Tech Stack:** Node.js ESM, `@modelcontextprotocol/sdk`, Zod, Babel parser/traverse, Rollup build output, npm packaging, Node test runner

---

## File Map

- Modify: `package.json`
  - Add build/test scripts for metadata generation and the MCP package, and include `dist/meta` in published files.
- Create: `scripts/build-mcp-meta.js`
  - Generate `dist/meta/components.json`, `exports.json`, `api.json`, `styles.json`, and `version.json` from the current repository sources.
- Create: `scripts/verify-mcp-meta.js`
  - Validate generated metadata files before publish and in tests.
- Create: `mcp/meta/load-generated-meta.mjs`
  - Shared reader for generated metadata during local tests.
- Create: `mcp/meta/build-generated-meta.mjs`
  - Shared conversion layer from existing analyzers/tools into stable metadata JSON payloads.
- Create: `mcp/meta/schema.mjs`
  - Zod schemas for generated metadata and schema-version validation.
- Create: `mcp/test/generated-meta.test.mjs`
  - Test metadata generation and validation against current repository contents.
- Create: `mcp-package/package.json`
  - Define the publishable `tt-design-mcp` npm package.
- Create: `mcp-package/bin/cli.mjs`
  - Executable entrypoint for `npx -y tt-design-mcp`.
- Create: `mcp-package/src/server.mjs`
  - MCP server bootstrap for the published package.
- Create: `mcp-package/src/meta/schema.mjs`
  - Runtime schemas for reading `tt-design/dist/meta/*.json`.
- Create: `mcp-package/src/meta/resolve-package-root.mjs`
  - Find the consumer project’s installed `tt-design` package.
- Create: `mcp-package/src/meta/load-meta.mjs`
  - Load and validate published metadata from `tt-design`.
- Create: `mcp-package/src/utils/result.mjs`
  - Shared `ok` / `fail` helpers matching the existing MCP contract.
- Create: `mcp-package/src/tools/list-components.mjs`
  - Serve `list_components` from loaded metadata.
- Create: `mcp-package/src/tools/find-component-exports.mjs`
  - Serve `find_component_exports` from loaded metadata.
- Create: `mcp-package/src/tools/get-component-api.mjs`
  - Serve `get_component_api` from loaded metadata.
- Create: `mcp-package/src/tools/get-component-style.mjs`
  - Serve `get_component_style` from loaded metadata.
- Create: `mcp-package/test/load-meta.test.mjs`
  - Unit tests for package resolution, missing metadata, and schema mismatch errors.
- Create: `mcp-package/test/server-smoke.test.mjs`
  - End-to-end stdio smoke test for the published MCP package against a fixture install.
- Modify: `docs/mcp-usage.md`
  - Rewrite usage docs from repo-local mode to npm dual-package mode while preserving the current 4-tool explanation.
- Modify: `.mcp.json`
  - Point local repository MCP config at the new package entry once it exists, or document that this remains a dev-only config if you choose not to switch it yet.

## Task 1: Generate publishable metadata inside `tt-design`

**Files:**
- Modify: `package.json`
- Create: `scripts/build-mcp-meta.js`
- Create: `scripts/verify-mcp-meta.js`
- Create: `mcp/meta/build-generated-meta.mjs`
- Create: `mcp/meta/load-generated-meta.mjs`
- Create: `mcp/meta/schema.mjs`
- Test: `mcp/test/generated-meta.test.mjs`

- [ ] **Step 1: Write the failing metadata-generation test**

Create `mcp/test/generated-meta.test.mjs` with this test file:

```js
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

function removeGeneratedMetaDir() {
  fs.rmSync(DIST_META_DIR, { recursive: true, force: true });
}

test('buildGeneratedMeta creates schema-valid metadata files for published package consumption', () => {
  removeGeneratedMetaDir();

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
```

- [ ] **Step 2: Run the test to verify the new metadata modules do not exist yet**

Run:

```bash
yarn test:mcp --test-name-pattern "buildGeneratedMeta creates schema-valid metadata files for published package consumption"
```

Expected: FAIL with module resolution errors for `mcp/meta/build-generated-meta.mjs`, `mcp/meta/load-generated-meta.mjs`, or `mcp/meta/schema.mjs`.

- [ ] **Step 3: Create the metadata schema module**

Create `mcp/meta/schema.mjs`:

```js
import { z } from 'zod';

export const sourceLocationSchema = z.object({
  file: z.string(),
  line: z.number().nullable().optional(),
  column: z.number().nullable().optional(),
  reason: z.string().optional(),
});

export const exportedFromSchema = z.object({
  components: z.boolean(),
  business: z.boolean(),
  root: z.boolean(),
});

export const componentSummarySchema = z.object({
  name: z.string(),
  category: z.enum(['basic', 'business']),
  version: z.string().nullable(),
  sourcePath: z.string(),
  stylePath: z.string().nullable(),
  exportedFrom: exportedFromSchema,
  warnings: z.array(z.string()),
});

export const exportEntrySchema = z.object({
  name: z.string(),
  category: z.enum(['basic', 'business']),
  sourcePath: z.string(),
  exportedFrom: exportedFromSchema,
  preferredImport: z.object({
    module: z.string(),
    export: z.string(),
  }).nullable(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const apiComponentSchema = z.object({
  name: z.string(),
  category: z.enum(['basic', 'business']),
  sourcePath: z.string(),
  defaultExport: z.string().nullable(),
  defaults: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
  props: z.array(z.string()),
  subcomponents: z.array(z.string()),
  hasDataComponentVersion: z.boolean(),
  hasPropTypes: z.boolean(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const styleThemeImportSchema = z.object({
  path: z.string(),
  kind: z.string().nullable(),
});

export const styleComponentSchema = z.object({
  name: z.string(),
  category: z.enum(['basic', 'business']),
  sourcePath: z.string(),
  stylePath: z.string().nullable(),
  blockClass: z.string().nullable(),
  modifierClasses: z.array(z.string()),
  relatedClasses: z.array(z.string()),
  cssVariables: z.array(z.string()),
  hardcodedColors: z.array(z.string()),
  themeImport: styleThemeImportSchema.nullable(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const componentsFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(componentSummarySchema),
});

export const exportsFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(exportEntrySchema),
});

export const apiFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(apiComponentSchema),
});

export const stylesFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(styleComponentSchema),
});

export const versionFileSchema = z.object({
  generatedAt: z.string(),
  packageName: z.literal('tt-design'),
  packageVersion: z.string(),
  metadataSchemaVersion: z.literal(1),
});

export const generatedMetaBundleSchema = z.object({
  components: componentsFileSchema,
  exports: exportsFileSchema,
  api: apiFileSchema,
  styles: stylesFileSchema,
  version: versionFileSchema,
});
```

- [ ] **Step 4: Create the metadata builder from the existing analyzers and tools**

Create `mcp/meta/build-generated-meta.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listComponents } from '../tools/list-components.mjs';
import { findComponentExports } from '../tools/find-component-exports.mjs';
import { getComponentApi } from '../tools/get-component-api.mjs';
import { getComponentStyle } from '../tools/get-component-style.mjs';
import { generatedMetaBundleSchema } from './schema.mjs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CURRENT_DIR, '../..');
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, 'package.json');

function readPackageVersion() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  return packageJson.version;
}

function assertOk(result, label) {
  if (!result?.ok) {
    throw new Error(`${label} failed: ${result?.error?.code || 'UNKNOWN'} ${result?.error?.message || ''}`.trim());
  }

  return result;
}

function mapComponentNames() {
  const result = assertOk(listComponents(), 'listComponents');
  return result.data.components.map((component) => component.name);
}

export function buildGeneratedMeta() {
  const generatedAt = new Date().toISOString();
  const componentNames = mapComponentNames();

  const components = componentNames.map((name) => {
    const result = assertOk(findComponentExports({ name }), `findComponentExports(${name})`);
    const listResult = assertOk(listComponents({ keyword: name }), `listComponents(${name})`);
    const summary = listResult.data.components.find((component) => component.name === name);

    return {
      name,
      category: result.data.category,
      version: summary?.version ?? null,
      sourcePath: result.data.sourcePath,
      stylePath: summary?.stylePath ?? null,
      exportedFrom: result.data.exportedFrom,
      warnings: [...new Set([...(summary?.warnings || []), ...(result.warnings || [])])],
    };
  });

  const exportsEntries = componentNames.map((name) => {
    const result = assertOk(findComponentExports({ name }), `findComponentExports(${name})`);

    return {
      name,
      category: result.data.category,
      sourcePath: result.data.sourcePath,
      exportedFrom: result.data.exportedFrom,
      preferredImport: result.data.preferredImport,
      sourceLocations: result.sourceLocations || [],
      warnings: result.warnings || [],
    };
  });

  const apiComponents = componentNames.map((name) => {
    const result = assertOk(getComponentApi({ name }), `getComponentApi(${name})`);

    return {
      ...result.data,
      sourceLocations: result.sourceLocations || [],
      warnings: result.warnings || [],
    };
  });

  const styleComponents = componentNames.map((name) => {
    const result = assertOk(getComponentStyle({ name }), `getComponentStyle(${name})`);

    return {
      ...result.data,
      sourceLocations: result.sourceLocations || [],
      warnings: result.warnings || [],
    };
  });

  return generatedMetaBundleSchema.parse({
    components: {
      generatedAt,
      components,
    },
    exports: {
      generatedAt,
      components: exportsEntries,
    },
    api: {
      generatedAt,
      components: apiComponents,
    },
    styles: {
      generatedAt,
      components: styleComponents,
    },
    version: {
      generatedAt,
      packageName: 'tt-design',
      packageVersion: readPackageVersion(),
      metadataSchemaVersion: 1,
    },
  });
}
```

- [ ] **Step 5: Create the metadata file writer/loader**

Create `mcp/meta/load-generated-meta.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  apiFileSchema,
  componentsFileSchema,
  exportsFileSchema,
  generatedMetaBundleSchema,
  stylesFileSchema,
  versionFileSchema,
} from './schema.mjs';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CURRENT_DIR, '../..');
const DIST_META_DIR = path.join(REPO_ROOT, 'dist/meta');

function ensureMetaDir() {
  fs.mkdirSync(DIST_META_DIR, { recursive: true });
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(DIST_META_DIR, fileName), 'utf8'));
}

export function writeGeneratedMetaFiles(bundle) {
  const parsed = generatedMetaBundleSchema.parse(bundle);
  ensureMetaDir();

  fs.writeFileSync(path.join(DIST_META_DIR, 'components.json'), JSON.stringify(parsed.components, null, 2));
  fs.writeFileSync(path.join(DIST_META_DIR, 'exports.json'), JSON.stringify(parsed.exports, null, 2));
  fs.writeFileSync(path.join(DIST_META_DIR, 'api.json'), JSON.stringify(parsed.api, null, 2));
  fs.writeFileSync(path.join(DIST_META_DIR, 'styles.json'), JSON.stringify(parsed.styles, null, 2));
  fs.writeFileSync(path.join(DIST_META_DIR, 'version.json'), JSON.stringify(parsed.version, null, 2));
}

export function loadGeneratedMetaFiles() {
  return generatedMetaBundleSchema.parse({
    components: componentsFileSchema.parse(readJson('components.json')),
    exports: exportsFileSchema.parse(readJson('exports.json')),
    api: apiFileSchema.parse(readJson('api.json')),
    styles: stylesFileSchema.parse(readJson('styles.json')),
    version: versionFileSchema.parse(readJson('version.json')),
  });
}

export { DIST_META_DIR };
```

- [ ] **Step 6: Create build and verification scripts and wire them into package publishing**

Create `scripts/build-mcp-meta.js`:

```js
const { buildGeneratedMeta } = require('../mcp/meta/build-generated-meta.mjs');
const { writeGeneratedMetaFiles } = require('../mcp/meta/load-generated-meta.mjs');

async function main() {
  const bundle = buildGeneratedMeta();
  writeGeneratedMetaFiles(bundle);
}

main().catch((error) => {
  console.error('Failed to build MCP metadata');
  console.error(error);
  process.exit(1);
});
```

Create `scripts/verify-mcp-meta.js`:

```js
const { loadGeneratedMetaFiles } = require('../mcp/meta/load-generated-meta.mjs');

async function main() {
  loadGeneratedMetaFiles();
}

main().catch((error) => {
  console.error('Failed to verify MCP metadata');
  console.error(error);
  process.exit(1);
});
```

Then update `package.json` from:

```json
  "files": [
    "dist/cjs",
    "dist/esm"
  ],
  "scripts": {
    "build": "rollup -c",
    "watch": "rollup -c -w",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "generate:colors": "node scripts/generate-color-less.js",
    "deploy-storybook": "gh-pages -d storybook-static -r git@github.com:sixtaro/tt-design-demo.git",
    "mcp:dev": "node ./mcp/server.mjs",
    "test:mcp": "node --test ./mcp/test/*.test.mjs",
    "homepage": "node scripts/start-homepage.js",
    "build:docs": "node scripts/deploy-docs.js",
    "test:components": "jest --runInBand"
  },
```

to:

```json
  "files": [
    "dist/cjs",
    "dist/esm",
    "dist/meta"
  ],
  "scripts": {
    "build": "rollup -c && node scripts/build-mcp-meta.js && node scripts/verify-mcp-meta.js",
    "watch": "rollup -c -w",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "generate:colors": "node scripts/generate-color-less.js",
    "deploy-storybook": "gh-pages -d storybook-static -r git@github.com:sixtaro/tt-design-demo.git",
    "mcp:dev": "node ./mcp/server.mjs",
    "test:mcp": "node --test ./mcp/test/*.test.mjs",
    "build:mcp-meta": "node scripts/build-mcp-meta.js",
    "verify:mcp-meta": "node scripts/verify-mcp-meta.js",
    "homepage": "node scripts/start-homepage.js",
    "build:docs": "node scripts/deploy-docs.js",
    "test:components": "jest --runInBand",
    "prepublishOnly": "yarn build && yarn verify:mcp-meta"
  },
```

- [ ] **Step 7: Run the metadata tests and build verification**

Run:

```bash
yarn test:mcp --test-name-pattern "buildGeneratedMeta creates schema-valid metadata files for published package consumption"
yarn build:mcp-meta
yarn verify:mcp-meta
```

Expected:
- the new metadata test PASS
- `dist/meta/api.json` exists
- `dist/meta/components.json` exists
- `dist/meta/exports.json` exists
- `dist/meta/styles.json` exists
- `dist/meta/version.json` exists
- `yarn verify:mcp-meta` exits successfully

- [ ] **Step 8: Commit the metadata-generation slice**

Run:

```bash
git add package.json scripts/build-mcp-meta.js scripts/verify-mcp-meta.js mcp/meta/build-generated-meta.mjs mcp/meta/load-generated-meta.mjs mcp/meta/schema.mjs mcp/test/generated-meta.test.mjs

git commit -m "feat(mcp): publish tt-design metadata bundle"
```

## Task 2: Build the publishable `tt-design-mcp` package on top of metadata

**Files:**
- Create: `mcp-package/package.json`
- Create: `mcp-package/bin/cli.mjs`
- Create: `mcp-package/src/server.mjs`
- Create: `mcp-package/src/meta/schema.mjs`
- Create: `mcp-package/src/meta/resolve-package-root.mjs`
- Create: `mcp-package/src/meta/load-meta.mjs`
- Create: `mcp-package/src/utils/result.mjs`
- Create: `mcp-package/src/tools/list-components.mjs`
- Create: `mcp-package/src/tools/find-component-exports.mjs`
- Create: `mcp-package/src/tools/get-component-api.mjs`
- Create: `mcp-package/src/tools/get-component-style.mjs`
- Test: `mcp-package/test/load-meta.test.mjs`
- Test: `mcp-package/test/server-smoke.test.mjs`

- [ ] **Step 1: Write the failing package-loader and smoke tests**

Create `mcp-package/test/load-meta.test.mjs`:

```js
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
```

Create `mcp-package/test/server-smoke.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(TEST_DIR, '../bin/cli.mjs');

function createFixtureProject() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tt-design-mcp-project-'));
  const packageRoot = path.join(fixtureRoot, 'node_modules/tt-design/dist/meta');
  fs.mkdirSync(packageRoot, { recursive: true });

  const files = {
    'version.json': {
      generatedAt: '2026-03-31T00:00:00.000Z',
      packageName: 'tt-design',
      packageVersion: '1.0.3',
      metadataSchemaVersion: 1,
    },
    'components.json': {
      generatedAt: '2026-03-31T00:00:00.000Z',
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
    },
    'exports.json': {
      generatedAt: '2026-03-31T00:00:00.000Z',
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
    },
    'api.json': {
      generatedAt: '2026-03-31T00:00:00.000Z',
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
    },
    'styles.json': {
      generatedAt: '2026-03-31T00:00:00.000Z',
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
    },
  };

  Object.entries(files).forEach(([fileName, value]) => {
    fs.writeFileSync(path.join(packageRoot, fileName), JSON.stringify(value, null, 2));
  });

  fs.writeFileSync(path.join(fixtureRoot, 'node_modules/tt-design/package.json'), JSON.stringify({
    name: 'tt-design',
    version: '1.0.3',
  }, null, 2));

  return fixtureRoot;
}

test('published tt-design-mcp server exposes the four metadata-backed tools over stdio', async () => {
  const fixtureProject = createFixtureProject();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [CLI_PATH],
    cwd: fixtureProject,
    stderr: 'pipe',
  });
  const client = new Client({ name: 'tt-design-mcp-published-smoke', version: '1.0.0' });

  try {
    await client.connect(transport);
    const tools = await client.listTools();

    assert.deepEqual(
      tools.tools.map((tool) => tool.name).sort(),
      ['find_component_exports', 'get_component_api', 'get_component_style', 'list_components']
    );

    const listResult = await client.callTool({ name: 'list_components', arguments: { category: 'basic' } });
    assert.equal(listResult.isError, false);
    assert.equal(listResult.structuredContent.ok, true);
    assert.equal(listResult.structuredContent.data.components[0].name, 'Button');
  } finally {
    await client.close();
    await transport.close();
  }
});
```

- [ ] **Step 2: Run the package tests to verify they fail because the package does not exist yet**

Run:

```bash
node --test mcp-package/test/*.test.mjs
```

Expected: FAIL with missing-file or module-resolution errors under `mcp-package/src` and `mcp-package/bin`.

- [ ] **Step 3: Create the package manifest and CLI entrypoint**

Create `mcp-package/package.json`:

```json
{
  "name": "tt-design-mcp",
  "version": "1.0.0",
  "description": "MCP server for querying tt-design component metadata",
  "type": "module",
  "bin": {
    "tt-design-mcp": "./bin/cli.mjs"
  },
  "files": [
    "bin",
    "src"
  ],
  "scripts": {
    "test": "node --test ./test/*.test.mjs"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.18.0",
    "zod": "^3.23.8"
  }
}
```

Create `mcp-package/bin/cli.mjs`:

```js
#!/usr/bin/env node
import { startServer } from '../src/server.mjs';

startServer().catch((error) => {
  console.error('tt-design-mcp failed to start');
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 4: Create the runtime metadata schemas and loader**

Create `mcp-package/src/meta/schema.mjs`:

```js
import { z } from 'zod';

const sourceLocationSchema = z.object({
  file: z.string(),
  line: z.number().nullable().optional(),
  column: z.number().nullable().optional(),
  reason: z.string().optional(),
});

const exportedFromSchema = z.object({
  components: z.boolean(),
  business: z.boolean(),
  root: z.boolean(),
});

export const componentsFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(z.object({
    name: z.string(),
    category: z.enum(['basic', 'business']),
    version: z.string().nullable(),
    sourcePath: z.string(),
    stylePath: z.string().nullable(),
    exportedFrom: exportedFromSchema,
    warnings: z.array(z.string()),
  })),
});

export const exportsFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(z.object({
    name: z.string(),
    category: z.enum(['basic', 'business']),
    sourcePath: z.string(),
    exportedFrom: exportedFromSchema,
    preferredImport: z.object({
      module: z.string(),
      export: z.string(),
    }).nullable(),
    sourceLocations: z.array(sourceLocationSchema),
    warnings: z.array(z.string()),
  })),
});

export const apiFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(z.object({
    name: z.string(),
    category: z.enum(['basic', 'business']),
    sourcePath: z.string(),
    defaultExport: z.string().nullable(),
    defaults: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
    props: z.array(z.string()),
    subcomponents: z.array(z.string()),
    hasDataComponentVersion: z.boolean(),
    hasPropTypes: z.boolean(),
    sourceLocations: z.array(sourceLocationSchema),
    warnings: z.array(z.string()),
  })),
});

export const stylesFileSchema = z.object({
  generatedAt: z.string(),
  components: z.array(z.object({
    name: z.string(),
    category: z.enum(['basic', 'business']),
    sourcePath: z.string(),
    stylePath: z.string().nullable(),
    blockClass: z.string().nullable(),
    modifierClasses: z.array(z.string()),
    relatedClasses: z.array(z.string()),
    cssVariables: z.array(z.string()),
    hardcodedColors: z.array(z.string()),
    themeImport: z.object({
      path: z.string(),
      kind: z.string().nullable(),
    }).nullable(),
    sourceLocations: z.array(sourceLocationSchema),
    warnings: z.array(z.string()),
  })),
});

export const versionFileSchema = z.object({
  generatedAt: z.string(),
  packageName: z.literal('tt-design'),
  packageVersion: z.string(),
  metadataSchemaVersion: z.literal(1),
});
```

Create `mcp-package/src/meta/resolve-package-root.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

export function resolveInstalledTtDesignRoot(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);
  const filesystemRoot = path.parse(currentDir).root;

  while (true) {
    const candidate = path.join(currentDir, 'node_modules/tt-design/package.json');

    if (fs.existsSync(candidate)) {
      return path.dirname(candidate);
    }

    if (currentDir === filesystemRoot) {
      break;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Unable to find installed tt-design package from current working directory');
}
```

Create `mcp-package/src/meta/load-meta.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

import {
  apiFileSchema,
  componentsFileSchema,
  exportsFileSchema,
  stylesFileSchema,
  versionFileSchema,
} from './schema.mjs';
import { resolveInstalledTtDesignRoot } from './resolve-package-root.mjs';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function loadMetaFromPackageRoot(packageRoot) {
  const metaRoot = path.join(packageRoot, 'dist/meta');
  const version = versionFileSchema.parse(readJson(path.join(metaRoot, 'version.json')));

  return {
    version,
    components: componentsFileSchema.parse(readJson(path.join(metaRoot, 'components.json'))),
    exports: exportsFileSchema.parse(readJson(path.join(metaRoot, 'exports.json'))),
    api: apiFileSchema.parse(readJson(path.join(metaRoot, 'api.json'))),
    styles: stylesFileSchema.parse(readJson(path.join(metaRoot, 'styles.json'))),
  };
}

export function loadInstalledTtDesignMeta(startDir = process.cwd()) {
  const packageRoot = resolveInstalledTtDesignRoot(startDir);
  return {
    packageRoot,
    meta: loadMetaFromPackageRoot(packageRoot),
  };
}
```

- [ ] **Step 5: Create result helpers and metadata-backed tool modules**

Create `mcp-package/src/utils/result.mjs`:

```js
export function ok(data, sourceLocations = [], warnings = []) {
  return {
    ok: true,
    data,
    sourceLocations,
    warnings,
  };
}

export function fail(code, message, details = {}) {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
    sourceLocations: [],
    warnings: [],
  };
}
```

Create `mcp-package/src/tools/list-components.mjs`:

```js
import { ok, fail } from '../utils/result.mjs';

const VALID_CATEGORIES = new Set(['basic', 'business']);

export function listComponents(meta, { category, keyword } = {}) {
  if (category != null && !VALID_CATEGORIES.has(category)) {
    return fail('INVALID_FILTER', 'category must be one of: basic, business', { category });
  }

  let components = meta.components.components;

  if (category) {
    components = components.filter((component) => component.category === category);
  }

  if (keyword) {
    components = components.filter((component) => component.name.includes(keyword));
  }

  return ok(
    { components },
    [],
    [...new Set(components.flatMap((component) => component.warnings || []))]
  );
}
```

Create `mcp-package/src/tools/find-component-exports.mjs`:

```js
import { ok, fail } from '../utils/result.mjs';

const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function findComponentExports(meta, { name } = {}) {
  if (!COMPONENT_NAME_PATTERN.test(name || '')) {
    return fail('INVALID_COMPONENT_NAME', 'name must be a valid component export identifier', { name });
  }

  const component = meta.exports.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in metadata', { name });
  }

  return ok(
    {
      name: component.name,
      category: component.category,
      sourcePath: component.sourcePath,
      exportedFrom: component.exportedFrom,
      preferredImport: component.preferredImport,
    },
    component.sourceLocations,
    component.warnings
  );
}
```

Create `mcp-package/src/tools/get-component-api.mjs`:

```js
import { ok, fail } from '../utils/result.mjs';

const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function getComponentApi(meta, { name } = {}) {
  if (!COMPONENT_NAME_PATTERN.test(name || '')) {
    return fail('INVALID_COMPONENT_NAME', 'name must be a valid component export identifier', { name });
  }

  const component = meta.api.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in metadata', { name });
  }

  return ok(component, component.sourceLocations, component.warnings);
}
```

Create `mcp-package/src/tools/get-component-style.mjs`:

```js
import { ok, fail } from '../utils/result.mjs';

const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function getComponentStyle(meta, { name } = {}) {
  if (!COMPONENT_NAME_PATTERN.test(name || '')) {
    return fail('INVALID_COMPONENT_NAME', 'name must be a valid component export identifier', { name });
  }

  const component = meta.styles.components.find((entry) => entry.name === name);

  if (!component) {
    return fail('COMPONENT_NOT_FOUND', 'Component not found in metadata', { name });
  }

  return ok(component, component.sourceLocations, component.warnings);
}
```

- [ ] **Step 6: Create the published MCP server bootstrap**

Create `mcp-package/src/server.mjs`:

```js
import { pathToFileURL } from 'node:url';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { loadInstalledTtDesignMeta } from './meta/load-meta.mjs';
import { fail } from './utils/result.mjs';
import { listComponents } from './tools/list-components.mjs';
import { findComponentExports } from './tools/find-component-exports.mjs';
import { getComponentApi } from './tools/get-component-api.mjs';
import { getComponentStyle } from './tools/get-component-style.mjs';

const envelopeOutputSchema = {
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }).optional(),
  sourceLocations: z.array(z.object({
    file: z.string(),
    line: z.number().optional(),
    column: z.number().optional(),
    reason: z.string().optional(),
  })),
  warnings: z.array(z.string()),
};

function toToolResult(result) {
  return {
    isError: result.ok === false,
    structuredContent: result,
    content: [{ type: 'text', text: JSON.stringify(result) }],
  };
}

function createMetaErrorResult(error) {
  return fail('METADATA_LOAD_FAILED', error.message, {
    cwd: process.cwd(),
  });
}

export function createServer() {
  const server = new McpServer(
    {
      name: 'tt-design-mcp',
      version: '1.0.0',
    },
    {
      instructions: 'Use the tt-design component inspection tools to query component metadata from the installed tt-design npm package.',
    }
  );

  const loadMeta = () => {
    try {
      return loadInstalledTtDesignMeta().meta;
    } catch (error) {
      return error;
    }
  };

  server.registerTool('list_components', {
    description: 'List tt-design components with optional category and keyword filters.',
    inputSchema: {
      category: z.enum(['basic', 'business']).optional(),
      keyword: z.string().min(1).optional(),
    },
    outputSchema: envelopeOutputSchema,
  }, async (args = {}) => {
    const meta = loadMeta();
    return toToolResult(meta instanceof Error ? createMetaErrorResult(meta) : listComponents(meta, args));
  });

  server.registerTool('find_component_exports', {
    description: 'Find where a tt-design component is exported and how it should be imported.',
    inputSchema: {
      name: z.string().min(1),
    },
    outputSchema: envelopeOutputSchema,
  }, async (args = {}) => {
    const meta = loadMeta();
    return toToolResult(meta instanceof Error ? createMetaErrorResult(meta) : findComponentExports(meta, args));
  });

  server.registerTool('get_component_api', {
    description: 'Inspect published tt-design component API metadata.',
    inputSchema: {
      name: z.string().min(1),
    },
    outputSchema: envelopeOutputSchema,
  }, async (args = {}) => {
    const meta = loadMeta();
    return toToolResult(meta instanceof Error ? createMetaErrorResult(meta) : getComponentApi(meta, args));
  });

  server.registerTool('get_component_style', {
    description: 'Inspect published tt-design component style metadata.',
    inputSchema: {
      name: z.string().min(1),
    },
    outputSchema: envelopeOutputSchema,
  }, async (args = {}) => {
    const meta = loadMeta();
    return toToolResult(meta instanceof Error ? createMetaErrorResult(meta) : getComponentStyle(meta, args));
  });

  return server;
}

export async function startServer() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}

const isEntrypoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  startServer().catch((error) => {
    console.error('tt-design-mcp failed to start');
    console.error(error);
    process.exit(1);
  });
}
```

- [ ] **Step 7: Run the published-package tests**

Run:

```bash
node --test mcp-package/test/*.test.mjs
```

Expected:
- `loadMetaFromPackageRoot reads schema-valid tt-design metadata from an installed package` PASS
- `published tt-design-mcp server exposes the four metadata-backed tools over stdio` PASS

- [ ] **Step 8: Commit the published package slice**

Run:

```bash
git add mcp-package/package.json mcp-package/bin/cli.mjs mcp-package/src/server.mjs mcp-package/src/meta/schema.mjs mcp-package/src/meta/resolve-package-root.mjs mcp-package/src/meta/load-meta.mjs mcp-package/src/utils/result.mjs mcp-package/src/tools/list-components.mjs mcp-package/src/tools/find-component-exports.mjs mcp-package/src/tools/get-component-api.mjs mcp-package/src/tools/get-component-style.mjs mcp-package/test/load-meta.test.mjs mcp-package/test/server-smoke.test.mjs

git commit -m "feat(mcp): add published tt-design-mcp package"
```

## Task 3: Update local integration points and docs for npm distribution

**Files:**
- Modify: `docs/mcp-usage.md`
- Modify: `.mcp.json`
- Modify: `package.json`
- Test: `mcp/test/server-smoke.test.mjs`
- Test: `mcp-package/test/server-smoke.test.mjs`

- [ ] **Step 1: Write the failing documentation and config expectations into the existing smoke flow**

Append this test to `mcp/test/server-smoke.test.mjs`:

```js
test('repository metadata build produces files required by the published tt-design-mcp package', async () => {
  const metaRoot = path.resolve(REPO_ROOT, 'dist/meta');

  assert.equal(fs.existsSync(path.join(metaRoot, 'components.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'exports.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'api.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'styles.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'version.json')), true);
});
```

Also update the imports at the top of `mcp/test/server-smoke.test.mjs` from:

```js
import path from 'node:path';
```

to:

```js
import fs from 'node:fs';
import path from 'node:path';
```

- [ ] **Step 2: Run the smoke test to verify metadata files are not yet guaranteed by the current build**

Run:

```bash
yarn test:mcp --test-name-pattern "repository metadata build produces files required by the published tt-design-mcp package"
```

Expected: FAIL before Task 1 wiring is complete, because `dist/meta/*.json` do not yet exist in a clean environment.

- [ ] **Step 3: Rewrite the user-facing docs for the npm dual-package workflow**

Replace the setup portions of `docs/mcp-usage.md` so that they describe npm installation instead of cloning the repository. The new doc should include these exact sections and snippets:

```md
## 前置条件

使用前请确认：

1. 本机已安装 Node.js
2. 当前项目已安装 `tt-design`
3. 当前项目可安装开发依赖 `tt-design-mcp`
4. 使用支持 MCP 的客户端（如 Claude Code）

> 说明：当前发布版本会从用户项目的 `node_modules/tt-design/dist/meta` 中读取元数据，不再要求本地 clone `tt-design` 仓库。
```

```md
## 快速接入

### 1. 安装 npm 包

```bash
npm install tt-design
npm install -D tt-design-mcp
```

### 2. Claude Code 中使用

在 MCP 配置中添加：

```json
{
  "mcpServers": {
    "tt-design": {
      "command": "npx",
      "args": ["-y", "tt-design-mcp"]
    }
  }
}
```
```

```md
## 是否需要手动启动

正常使用时不需要手动启动，Claude Code 会按需通过 `npx -y tt-design-mcp` 拉起 MCP 服务。
```

```md
### Q1：我已经配置了，但没有生效
请检查：

- 当前项目是否已安装 `tt-design`
- 当前项目是否已安装 `tt-design-mcp`
- `node_modules/tt-design/dist/meta` 是否存在
- 是否重启了 Claude Code
```

Update the rest of the document consistently so it no longer says the service requires a local clone of the repository.

- [ ] **Step 4: Update local repository MCP config to point at the package entrypoint for dev parity**

Replace `.mcp.json` with:

```json
{
  "mcpServers": {
    "tt-design": {
      "command": "node",
      "args": [
        "mcp-package/bin/cli.mjs"
      ]
    }
  }
}
```

This keeps local development aligned with the same package entrypoint external users will execute.

- [ ] **Step 5: Run the full verification matrix**

Run:

```bash
yarn build
yarn test:mcp
node --test mcp-package/test/*.test.mjs
```

Expected:
- `yarn build` succeeds and writes `dist/meta/*.json`
- existing repo-local MCP tests still pass unless intentionally superseded by updated expectations
- published-package tests pass

- [ ] **Step 6: Review the final diff and create the integration commit**

Run:

```bash
git diff -- package.json scripts/build-mcp-meta.js scripts/verify-mcp-meta.js mcp/meta mcp/test mcp-package docs/mcp-usage.md .mcp.json
```

Expected: diff is limited to metadata generation, the new `mcp-package`, docs, and config updates for npm distribution.

Then run:

```bash
git add package.json scripts/build-mcp-meta.js scripts/verify-mcp-meta.js mcp/meta mcp/test mcp-package docs/mcp-usage.md .mcp.json

git commit -m "docs(mcp): switch tt-design MCP to npm distribution workflow"
```

## Self-Review

- **Spec coverage:** Task 1 implements `dist/meta/*.json`, schema versioning, and publish-time validation. Task 2 implements the standalone `tt-design-mcp` npm package, runtime package resolution, metadata loading, the four MCP tools, and error handling for missing metadata. Task 3 updates docs, local config, and end-to-end verification for the npm dual-package workflow.
- **Placeholder scan:** No `TODO`, `TBD`, or “similar to Task N” placeholders remain. Every code-changing step includes exact file paths, code, and commands.
- **Type consistency:** The plan uses one metadata schema version (`1`) consistently across generated files, runtime validation, and tests. The four tool names stay unchanged throughout the plan, matching the approved spec.
