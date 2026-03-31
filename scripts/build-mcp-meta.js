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
