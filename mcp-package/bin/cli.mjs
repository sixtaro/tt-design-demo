#!/usr/bin/env node
import { startServer } from '../src/server.mjs';

startServer().catch((error) => {
  console.error('tt-design-mcp failed to start');
  console.error(error);
  process.exit(1);
});
