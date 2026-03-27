import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { resolveRepoRoot } from '../utils/resolve-root.mjs';
import { readRepoRelativeFile } from '../utils/read-source.mjs';
import { ok, fail, normalizeInfrastructureError } from '../utils/result.mjs';

const REQUIRED_ROOT_FILES = [
  'package.json',
  'src/index.js',
  'src/components/index.js',
  'src/business/index.js',
  'src/utils/version-config.js',
];

test('resolveRepoRoot finds repo root with required markers', () => {
  const repoRoot = resolveRepoRoot();

  assert.equal(fs.existsSync(path.join(repoRoot, 'package.json')), true);
  assert.equal(fs.existsSync(path.join(repoRoot, 'src/components/index.js')), true);
  assert.equal(fs.existsSync(path.join(repoRoot, 'src/business/index.js')), true);
});

test('resolveRepoRoot requires all fixed entry files from the spec', () => {
  const repoRoot = resolveRepoRoot();

  for (const relativePath of REQUIRED_ROOT_FILES) {
    assert.equal(
      fs.existsSync(path.join(repoRoot, relativePath)),
      true,
      `${relativePath} should exist`,
    );
  }
});

test('ok and fail return normalized envelope', () => {
  assert.deepEqual(ok({ value: 1 }, [{ file: 'src/index.js' }], ['warn']), {
    ok: true,
    data: { value: 1 },
    sourceLocations: [{ file: 'src/index.js' }],
    warnings: ['warn'],
  });

  assert.deepEqual(fail('BAD_INPUT', 'Nope', { field: 'name' }), {
    ok: false,
    error: {
      code: 'BAD_INPUT',
      message: 'Nope',
      details: { field: 'name' },
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('normalizeInfrastructureError returns ok:false with INTERNAL_ERROR', () => {
  assert.deepEqual(normalizeInfrastructureError(new Error('Boom')), {
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Boom',
      details: {},
    },
    sourceLocations: [],
    warnings: [],
  });
});

test('readRepoRelativeFile allows fixed entry files', () => {
  const code = readRepoRelativeFile('src/components/index.js');

  assert.match(code, /export\s*\{/);
});

test('readRepoRelativeFile rejects paths outside repository', () => {
  assert.throws(() => readRepoRelativeFile('../package.json'), {
    message: 'Access denied: path must stay within repository',
  });
});

test('readRepoRelativeFile rejects blocked path segments', () => {
  assert.throws(() => readRepoRelativeFile('node_modules/pkg/index.js'), {
    message: 'Access denied: blocked path segment',
  });
});

test('readRepoRelativeFile rejects blocked file patterns', () => {
  assert.throws(() => readRepoRelativeFile('src/components/Button/Button.stories.js', 'Button'), {
    message: 'Access denied: blocked file pattern',
  });

  assert.throws(() => readRepoRelativeFile('src/components/Button/.env.local', 'Button'), {
    message: 'Access denied: blocked file pattern',
  });
});

test('readRepoRelativeFile rejects unregistered component directories', () => {
  assert.throws(() => readRepoRelativeFile('src/business/CopyIcon/index.js', 'CopyIcon'), {
    message: 'Access denied: file is not on the MCP whitelist',
  });
});

test('readRepoRelativeFile only allows js jsx and less inside registered component directories', () => {
  const code = readRepoRelativeFile('src/components/Button/index.js', 'Button');

  assert.match(code, /Button/);
  assert.throws(() => readRepoRelativeFile('src/components/Button/index.json', 'Button'), {
    message: 'Access denied: file is not on the MCP whitelist',
  });
});

test('readRepoRelativeFile allows root-only registered component directories', () => {
  const code = readRepoRelativeFile('src/components/Font/index.js', 'Font');

  assert.match(code, /Font/);
});

test('readRepoRelativeFile rejects symlink escapes outside repository', () => {
  const repoRoot = resolveRepoRoot();
  const tempTarget = path.join(os.tmpdir(), `tt-design-mcp-${process.pid}.js`);
  const symlinkPath = path.join(repoRoot, 'src/components/Button/__mcp_symlink_escape__.js');

  fs.writeFileSync(tempTarget, 'export default 1;', 'utf8');

  try {
    fs.symlinkSync(tempTarget, symlinkPath);

    assert.throws(() => readRepoRelativeFile('src/components/Button/__mcp_symlink_escape__.js', 'Button'), {
      message: 'Access denied: path resolves outside repository',
    });
  } finally {
    fs.rmSync(symlinkPath, { force: true });
    fs.rmSync(tempTarget, { force: true });
  }
});
