const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const targets = [
  path.join(repoRoot, 'dist/cjs'),
  path.join(repoRoot, 'dist/esm'),
  path.join(repoRoot, 'dist/meta'),
];

targets.forEach((target) => {
  fs.rmSync(target, { recursive: true, force: true });
});
