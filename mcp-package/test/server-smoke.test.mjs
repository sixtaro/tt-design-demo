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
    },
    'exports.json': {
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
    },
    'api.json': {
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
    },
    'styles.json': {
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
