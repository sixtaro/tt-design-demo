#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { listComponents } from './tools/list-components.mjs';
import { findComponentExports } from './tools/find-component-exports.mjs';
import { getComponentApi } from './tools/get-component-api.mjs';
import { getComponentStyle } from './tools/get-component-style.mjs';
import { normalizeInfrastructureError } from './utils/result.mjs';

const envelopeOutputSchema = {
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.unknown()).optional(),
    })
    .optional(),
  sourceLocations: z.array(
    z.object({
      file: z.string(),
      line: z.number().optional(),
      column: z.number().optional(),
    }),
  ),
  warnings: z.array(z.string()),
};

function toToolResult(result) {
  return {
    isError: result.ok === false,
    structuredContent: result,
    content: [
      {
        type: 'text',
        text: JSON.stringify(result),
      },
    ],
  };
}

async function invokeTool(handler, args) {
  try {
    return toToolResult(await handler(args));
  } catch (error) {
    return toToolResult(normalizeInfrastructureError(error));
  }
}

export function createServer() {
  const server = new McpServer(
    {
      name: 'tt-design-mcp',
      version: '1.0.0',
    },
    {
      instructions: 'Use the tt-design component inspection tools to query component registry, exports, API metadata, and styles.',
    },
  );

  server.registerTool(
    'list_components',
    {
      description: 'List tt-design components with optional category and keyword filters.',
      inputSchema: {
        category: z.enum(['basic', 'business']).optional(),
        keyword: z.string().min(1).optional(),
      },
      outputSchema: envelopeOutputSchema,
    },
    async (args = {}) => invokeTool(listComponents, args),
  );

  server.registerTool(
    'find_component_exports',
    {
      description: 'Find where a tt-design component is exported and how it should be imported.',
      inputSchema: {
        name: z.string().min(1),
      },
      outputSchema: envelopeOutputSchema,
    },
    async (args) => invokeTool(findComponentExports, args),
  );

  server.registerTool(
    'get_component_api',
    {
      description: 'Inspect a tt-design component source file and return normalized API metadata.',
      inputSchema: {
        name: z.string().min(1),
      },
      outputSchema: envelopeOutputSchema,
    },
    async (args) => invokeTool(getComponentApi, args),
  );

  server.registerTool(
    'get_component_style',
    {
      description: 'Inspect a tt-design component style file and return normalized style metadata.',
      inputSchema: {
        name: z.string().min(1),
      },
      outputSchema: envelopeOutputSchema,
    },
    async (args) => invokeTool(getComponentStyle, args),
  );

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
    console.error('tt-design MCP server failed to start');
    console.error(error);
    process.exit(1);
  });
}
