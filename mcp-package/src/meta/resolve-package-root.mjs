import fs from 'node:fs';
import path from 'node:path';

/**
 * Walk upward from startDir looking for node_modules/tt-design/package.json.
 * Returns the resolved package root, or throws if not found.
 */
export function resolveInstalledTtDesignRoot(startDir = process.cwd()) {
  let current = path.resolve(startDir);
  const root = path.parse(current).root;

  while (current !== root) {
    const candidate = path.join(current, 'node_modules/tt-design/package.json');
    if (fs.existsSync(candidate)) {
      return path.join(current, 'node_modules/tt-design');
    }
    current = path.dirname(current);
  }

  // Last chance: check the root drive
  const rootCandidate = path.join(root, 'node_modules/tt-design/package.json');
  if (fs.existsSync(rootCandidate)) {
    return path.join(root, 'node_modules/tt-design');
  }

  throw new Error(
    `Could not find 'tt-design' package. ` +
      `Make sure 'tt-design' is installed in your project.\n` +
      `Searched from: ${path.resolve(startDir)}`
  );
}
