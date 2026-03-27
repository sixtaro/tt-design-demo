import fs from 'node:fs';
import path from 'node:path';

import { getRegisteredComponentDirs } from '../analyzers/entry-references.mjs';
import { resolveRepoRoot } from './resolve-root.mjs';

const FIXED_ENTRY_FILES = new Set([
  'src/components/index.js',
  'src/business/index.js',
  'src/index.js',
  'src/utils/version-config.js',
]);

const BLOCKED_SEGMENTS = new Set(['.git', 'node_modules']);
const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.less']);

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function hasBlockedSegment(relativePath) {
  return relativePath.split('/').some((segment) => BLOCKED_SEGMENTS.has(segment));
}

function isBlockedByPattern(relativePath) {
  const baseName = path.posix.basename(relativePath);

  return (
    baseName.startsWith('.env') ||
    relativePath.endsWith('.stories.js') ||
    relativePath.endsWith('.stories.jsx')
  );
}

function isAllowedWithinComponentDir(relativePath, allowedComponentDir) {
  if (!allowedComponentDir) {
    return false;
  }

  const normalizedAllowedDir = toPosixPath(path.normalize(allowedComponentDir));
  const normalizedRelativePath = toPosixPath(path.normalize(relativePath));
  const extension = path.posix.extname(normalizedRelativePath);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return false;
  }

  const registeredDirs = getRegisteredComponentDirs();
  const allowedPrefixes = [
    `src/components/${normalizedAllowedDir}`,
    `src/business/${normalizedAllowedDir}`,
    `src/${normalizedAllowedDir}`,
  ].filter((prefix) => registeredDirs.has(prefix));

  return allowedPrefixes.some(
    (prefix) =>
      normalizedRelativePath === prefix || normalizedRelativePath.startsWith(`${prefix}/`),
  );
}

export function readRepoRelativeFile(relativePath, allowedComponentDir = null) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new Error('A repo-relative path is required');
  }

  const repoRoot = resolveRepoRoot();
  const realRepoRoot = toPosixPath(fs.realpathSync(repoRoot));
  const normalizedRelativePath = toPosixPath(path.normalize(relativePath.trim()));

  if (
    normalizedRelativePath.startsWith('../') ||
    normalizedRelativePath === '..' ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error('Access denied: path must stay within repository');
  }

  if (hasBlockedSegment(normalizedRelativePath)) {
    throw new Error('Access denied: blocked path segment');
  }

  if (isBlockedByPattern(normalizedRelativePath)) {
    throw new Error('Access denied: blocked file pattern');
  }

  const absolutePath = path.resolve(repoRoot, normalizedRelativePath);
  const relativeFromRoot = toPosixPath(path.relative(repoRoot, absolutePath));

  if (
    relativeFromRoot.startsWith('../') ||
    relativeFromRoot === '..' ||
    path.isAbsolute(relativeFromRoot)
  ) {
    throw new Error('Access denied: path resolves outside repository');
  }

  const isAllowed =
    FIXED_ENTRY_FILES.has(relativeFromRoot) ||
    isAllowedWithinComponentDir(relativeFromRoot, allowedComponentDir);

  if (!isAllowed) {
    throw new Error('Access denied: file is not on the MCP whitelist');
  }

  const realAbsolutePath = toPosixPath(fs.realpathSync(absolutePath));

  if (
    realAbsolutePath !== realRepoRoot &&
    !realAbsolutePath.startsWith(`${realRepoRoot}/`)
  ) {
    throw new Error('Access denied: path resolves outside repository');
  }

  return fs.readFileSync(absolutePath, 'utf8');
}

export { FIXED_ENTRY_FILES };
