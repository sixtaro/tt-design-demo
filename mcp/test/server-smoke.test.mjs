import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '../..');
const SERVER_PATH = path.resolve(REPO_ROOT, 'mcp/server.mjs');

function waitForProcessQuiet(serverProcess, stdoutChunks, quietWindowMs = 150) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      clearTimeout(timer);
      serverProcess.off('error', onError);
      serverProcess.off('exit', onExit);
      serverProcess.stdout.off('data', onStdout);
    };

    const finish = (callback) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const onError = (error) => {
      finish(() => reject(error));
    };

    const onExit = (code, signal) => {
      finish(() => reject(new Error(`Server exited before protocol traffic (code: ${code}, signal: ${signal})`)));
    };

    const onStdout = (chunk) => {
      stdoutChunks.push(chunk);
      finish(() => reject(new Error('Server emitted stdout before protocol traffic')));
    };

    const timer = setTimeout(() => {
      finish(() => resolve());
    }, quietWindowMs);

    serverProcess.on('error', onError);
    serverProcess.on('exit', onExit);
    serverProcess.stdout.on('data', onStdout);
  });
}

function createClient() {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER_PATH],
    cwd: REPO_ROOT,
    stderr: 'pipe',
  });

  const stderrChunks = [];
  if (transport.stderr) {
    transport.stderr.on('data', (chunk) => {
      stderrChunks.push(String(chunk));
    });
  }

  const client = new Client({
    name: 'tt-design-mcp-smoke-test',
    version: '1.0.0',
  });

  return {
    client,
    transport,
    getStderr: () => stderrChunks.join(''),
  };
}

test('stdio MCP server keeps stdout protocol-clean and stays alive long enough for SDK round-trip calls', async () => {
  const stdoutChunks = [];
  const serverProcess = spawn(process.execPath, [SERVER_PATH], {
    cwd: REPO_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  serverProcess.stdout.setEncoding('utf8');

  try {
    await once(serverProcess, 'spawn');
    await waitForProcessQuiet(serverProcess, stdoutChunks);

    assert.equal(serverProcess.exitCode, null);
    assert.equal(serverProcess.killed, false);
    assert.equal(stdoutChunks.join(''), '');
  } finally {
    if (serverProcess.exitCode === null && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }

    if (!serverProcess.closed) {
      await once(serverProcess, 'close');
    }
  }

  const { client, transport, getStderr } = createClient();

  try {
    await client.connect(transport);

    assert.notEqual(transport.pid, null);
    assert.equal(getStderr().includes('MCP server is running'), false);

    const toolsResult = await client.listTools();
    const toolNames = toolsResult.tools.map((tool) => tool.name).sort();

    assert.deepEqual(toolNames, [
      'find_component_exports',
      'get_component_api',
      'get_component_style',
      'list_components',
    ]);

    const result = await client.callTool({
      name: 'list_components',
      arguments: {
        category: 'basic',
        keyword: 'Button',
      },
    });

    assert.equal(result.isError, false);
    assert.equal(typeof result.structuredContent, 'object');
    assert.equal(result.structuredContent.ok, true);
    assert.ok(Array.isArray(result.structuredContent.data.components));
    assert.ok(result.structuredContent.data.components.some((component) => component.name === 'Button'));
    assert.ok(result.content.some((item) => item.type === 'text'));
  } finally {
    await client.close();
    await transport.close();
  }
});

test('repository metadata build produces files required by the published tt-design-mcp package', () => {
  const metaRoot = path.resolve(REPO_ROOT, 'dist/meta');

  assert.equal(fs.existsSync(path.join(metaRoot, 'components.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'exports.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'api.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'styles.json')), true);
  assert.equal(fs.existsSync(path.join(metaRoot, 'version.json')), true);
});
