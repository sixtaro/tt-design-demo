import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_ROOT_FILES = [
  'package.json',
  'src/index.js',
  'src/components/index.js',
  'src/business/index.js',
  'src/utils/version-config.js',
];

function hasRequiredRootFiles(candidateRoot) {
  return REQUIRED_ROOT_FILES.every((relativePath) =>
    fs.existsSync(path.join(candidateRoot, relativePath)),
  );
}

export function resolveRepoRoot() {
  const currentFilePath = fileURLToPath(import.meta.url);
  let currentDir = path.dirname(currentFilePath);
  const filesystemRoot = path.parse(currentDir).root;

  while (currentDir && currentDir !== filesystemRoot) {
    if (hasRequiredRootFiles(currentDir)) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  if (hasRequiredRootFiles(filesystemRoot)) {
    return filesystemRoot;
  }

  throw new Error('Unable to confirm repository root for MCP infrastructure');
}

export { REQUIRED_ROOT_FILES };
