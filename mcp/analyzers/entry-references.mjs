import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';

import { resolveRepoRoot } from '../utils/resolve-root.mjs';

const CATEGORY_ENTRY_FILES = {
  basic: 'src/components/index.js',
  business: 'src/business/index.js',
};

const ROOT_ENTRY_FILE = 'src/index.js';

function toSourceLocation(file, node) {
  return {
    file,
    line: node.loc?.start.line ?? null,
    column: node.loc?.start.column ?? null,
  };
}

function readEntryModule(relativePath) {
  const repoRoot = resolveRepoRoot();
  return parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'), {
    sourceType: 'module',
    plugins: ['jsx'],
  });
}

function getStringLiteralValue(node) {
  if (!node) {
    return null;
  }

  if (node.type === 'StringLiteral') {
    return node.value;
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  return null;
}

function collectReferencedImportNames(node, imports, names = []) {
  if (!node || typeof node !== 'object') {
    return names;
  }

  if (node.type === 'Identifier' && imports.has(node.name)) {
    names.push(node.name);
    return names;
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        collectReferencedImportNames(item, imports, names);
      }
      continue;
    }

    collectReferencedImportNames(value, imports, names);
  }

  return names;
}

function chooseAliasImport(localName, importNames, imports) {
  const uniqueImportNames = [...new Set(importNames)];

  if (!uniqueImportNames.length) {
    return null;
  }

  const normalizedLocalName = localName.toLowerCase();
  const exactMatch = uniqueImportNames.find((importName) => importName.toLowerCase() === normalizedLocalName);

  if (exactMatch) {
    return { ...imports.get(exactMatch), inferred: false };
  }

  const basenameMatch = uniqueImportNames.find((importName) =>
    importName.toLowerCase().startsWith(normalizedLocalName) || normalizedLocalName.startsWith(importName.toLowerCase()),
  );

  if (basenameMatch) {
    return { ...imports.get(basenameMatch), inferred: true };
  }

  return { ...imports.get(uniqueImportNames[0]), inferred: true };
}

function resolveImportPaths(baseDir, importSource) {
  const repoRoot = resolveRepoRoot();
  const normalizedImport = path.posix.normalize(importSource);
  const importBase = path.posix.normalize(path.posix.join(baseDir, normalizedImport));
  const directSourcePath = `${importBase}.js`;
  const indexSourcePath = `${importBase}/index.js`;
  const sourcePath = fs.existsSync(path.join(repoRoot, directSourcePath))
    && !fs.existsSync(path.join(repoRoot, indexSourcePath))
    ? directSourcePath
    : indexSourcePath;
  const styleCandidates = sourcePath.endsWith('/index.js')
    ? [`${importBase}/index.less`, `${importBase}/${path.posix.basename(importBase)}.less`]
    : [`${importBase}.less`, `${path.posix.dirname(importBase)}/${path.posix.basename(importBase)}.less`];
  const stylePath = styleCandidates.find((candidate) => fs.existsSync(path.join(repoRoot, candidate)))
    || styleCandidates[0];

  return {
    componentDir: path.posix.basename(path.posix.dirname(sourcePath)),
    sourcePath,
    stylePath,
  };
}

function parseEntryReferences(entryFile) {
  const ast = readEntryModule(entryFile);
  const imports = new Map();
  const exports = new Map();
  const aliases = new Map();

  for (const statement of ast.program.body) {
    if (statement.type === 'ImportDeclaration' && statement.source) {
      const importSource = getStringLiteralValue(statement.source);

      if (!importSource?.startsWith('.')) {
        continue;
      }

      for (const specifier of statement.specifiers) {
        if (specifier.type !== 'ImportDefaultSpecifier') {
          continue;
        }

        imports.set(specifier.local.name, {
          importSource,
          importLocation: toSourceLocation(entryFile, statement),
        });
      }

      continue;
    }

    if (statement.type === 'VariableDeclaration') {
      for (const declarator of statement.declarations) {
        if (declarator.id.type !== 'Identifier') {
          continue;
        }

        const referencedImportNames = collectReferencedImportNames(declarator.init, imports);
        const aliasImport = chooseAliasImport(declarator.id.name, referencedImportNames, imports);

        if (aliasImport) {
          aliases.set(declarator.id.name, {
            importSource: aliasImport.importSource,
            importLocation: toSourceLocation(entryFile, declarator),
            inferred: aliasImport.inferred,
          });
        }
      }

      continue;
    }

    if (statement.type !== 'ExportNamedDeclaration' || !statement.specifiers?.length) {
      continue;
    }

    for (const specifier of statement.specifiers) {
      if (specifier.type !== 'ExportSpecifier') {
        continue;
      }

      const localName = specifier.local.type === 'Identifier'
        ? specifier.local.name
        : specifier.local.value;
      const exportName = specifier.exported.type === 'Identifier'
        ? specifier.exported.name
        : specifier.exported.value;

      exports.set(localName, {
        exportName,
        exportLocation: toSourceLocation(entryFile, specifier),
      });
    }
  }

  return { imports, aliases, exports };
}

function getRegisteredComponentDirs() {
  const registeredDirs = new Set();

  for (const entryFile of Object.values(CATEGORY_ENTRY_FILES)) {
    const { imports, aliases, exports } = parseEntryReferences(entryFile);
    const baseDir = path.posix.dirname(entryFile);

    for (const [localName] of exports.entries()) {
      const importInfo = imports.get(localName) || aliases.get(localName);

      if (!importInfo) {
        continue;
      }

      const resolved = resolveImportPaths(baseDir, importInfo.importSource);
      registeredDirs.add(path.posix.dirname(resolved.sourcePath));
    }
  }

  const rootReferences = parseEntryReferences(ROOT_ENTRY_FILE);

  for (const [localName] of rootReferences.exports.entries()) {
    const importInfo = rootReferences.imports.get(localName) || rootReferences.aliases.get(localName);

    if (!importInfo) {
      continue;
    }

    const normalizedImport = path.posix.normalize(importInfo.importSource);

    if (!normalizedImport.startsWith('components/') && !normalizedImport.startsWith('business/')) {
      continue;
    }

    const resolved = resolveImportPaths('src', normalizedImport);
    registeredDirs.add(path.posix.dirname(resolved.sourcePath));
  }

  return registeredDirs;
}

export {
  CATEGORY_ENTRY_FILES,
  ROOT_ENTRY_FILE,
  getRegisteredComponentDirs,
  parseEntryReferences,
  resolveImportPaths,
  toSourceLocation,
};
