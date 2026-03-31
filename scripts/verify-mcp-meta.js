const { loadGeneratedMetaFiles } = require('../mcp/meta/load-generated-meta.mjs');

async function main() {
  loadGeneratedMetaFiles();
}

main().catch((error) => {
  console.error('Failed to verify MCP metadata');
  console.error(error);
  process.exit(1);
});
