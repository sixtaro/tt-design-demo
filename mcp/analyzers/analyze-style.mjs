import { buildRegistry } from './build-registry.mjs';
import { ok, fail, normalizeInfrastructureError } from '../utils/result.mjs';
import { readRepoRelativeFile } from '../utils/read-source.mjs';

const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const CLASS_TOKEN_PATTERN = /\.([A-Za-z_-][A-Za-z0-9_-]*)|&([.-][A-Za-z0-9_-]+)/g;
const CSS_VARIABLE_PATTERN = /var\(\s*(--[^)\s]+)\s*\)/g;
const HARDCODED_COLOR_PATTERN = /#(?:[0-9a-fA-F]{3,8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

function getLocationKey(location) {
  return `${location.file}:${location.line ?? 'null'}:${location.column ?? 'null'}`;
}

function addExistingLocations(locations, newLocations = []) {
  for (const location of newLocations) {
    if (!location) {
      continue;
    }

    const key = getLocationKey(location);

    if (!locations.some((item) => getLocationKey(item) === key)) {
      locations.push(location);
    }
  }
}

function addLocation(locations, file, line, column = 0, reason = undefined) {
  const location = { file, line, column };

  if (reason) {
    location.reason = reason;
  }

  const key = getLocationKey(location);

  if (!locations.some((item) => getLocationKey(item) === key)) {
    locations.push(location);
  }
}

function getThemeImport(line) {
  const match = line.match(/@import\s*(\(([^)]+)\))?\s*['\"]([^'\"]+)['\"]/);

  if (!match || !/(?:^|\/)style\/themes\/[^/]+\.less$/.test(match[3])) {
    return null;
  }

  const kind = match[2]
    ? match[2]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .join(',')
    : null;

  return {
    path: match[3],
    kind,
  };
}

function pushUnique(list, value) {
  if (value && !list.includes(value)) {
    list.push(value);
  }
}

function sortValues(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function scanSelectorClasses(selectorSource, contextClass) {
  const matches = [];
  let nextContextClass = contextClass;
  let match;

  while ((match = CLASS_TOKEN_PATTERN.exec(selectorSource)) !== null) {
    if (match[1]) {
      matches.push(match[1]);
      nextContextClass = match[1];
      continue;
    }

    const suffix = match[2];

    if (!suffix || suffix.startsWith(':')) {
      continue;
    }

    if (suffix.startsWith('.')) {
      matches.push(suffix.slice(1));
      continue;
    }

    if (suffix.startsWith('-') && contextClass) {
      matches.push(`${contextClass}${suffix}`);
      nextContextClass = `${contextClass}${suffix}`;
    }
  }

  CLASS_TOKEN_PATTERN.lastIndex = 0;
  return { matches, nextContextClass };
}

function classifyClasses(allClasses, blockClass) {
  const modifierClasses = [];
  const relatedClasses = [];

  for (const className of allClasses) {
    if (className === blockClass) {
      continue;
    }

    if (blockClass && className.startsWith(`${blockClass}-`)) {
      modifierClasses.push(className);
      continue;
    }

    relatedClasses.push(className);
  }

  return {
    modifierClasses: sortValues(modifierClasses),
    relatedClasses: sortValues(relatedClasses),
  };
}

function analyzeStyleSource(component) {
  const sourceLocations = [];
  addExistingLocations(sourceLocations, component.sourceLocations || []);
  const warnings = [...(component.warnings || [])];
  const stylePath = component.stylePath || null;

  const baseData = {
    name: component.name,
    category: component.category,
    sourcePath: component.sourcePath,
    stylePath,
    blockClass: null,
    modifierClasses: [],
    relatedClasses: [],
    cssVariables: [],
    hardcodedColors: [],
    themeImport: null,
  };

  if (!stylePath) {
    warnings.push(`${component.name} does not have a linked style file in the registry.`);
    return ok(baseData, sourceLocations, warnings);
  }

  let code;

  try {
    code = readRepoRelativeFile(stylePath, component.componentDir);
  } catch (error) {
    warnings.push(`${component.name} style file could not be read at ${stylePath}: ${error.message}`);
    return ok(baseData, sourceLocations, warnings);
  }

  const allClasses = [];
  const cssVariables = [];
  const hardcodedColors = [];
  let blockClass = null;
  let themeImport = null;
  let contextClass = null;
  let selectorBuffer = '';
  let selectorStartLine = null;

  for (const [index, line] of code.split(/\r?\n/).entries()) {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    if (!themeImport) {
      const importInfo = getThemeImport(line);

      if (importInfo) {
        themeImport = importInfo;
        addLocation(sourceLocations, stylePath, lineNumber, 0, 'theme-import');
      }
    }

    let variableMatch;
    while ((variableMatch = CSS_VARIABLE_PATTERN.exec(line)) !== null) {
      pushUnique(cssVariables, variableMatch[1]);
    }
    CSS_VARIABLE_PATTERN.lastIndex = 0;

    let colorMatch;
    while ((colorMatch = HARDCODED_COLOR_PATTERN.exec(line)) !== null) {
      pushUnique(hardcodedColors, colorMatch[0]);
    }
    HARDCODED_COLOR_PATTERN.lastIndex = 0;

    if (!trimmedLine || trimmedLine.startsWith('@import')) {
      continue;
    }

    if (selectorStartLine === null) {
      selectorStartLine = lineNumber;
    }

    selectorBuffer = selectorBuffer ? `${selectorBuffer}\n${line}` : line;

    if (!selectorBuffer.includes('{')) {
      continue;
    }

    const selectorSource = selectorBuffer.slice(0, selectorBuffer.indexOf('{'));
    const scanned = scanSelectorClasses(selectorSource, contextClass);
    contextClass = scanned.nextContextClass;

    for (const className of scanned.matches) {
      pushUnique(allClasses, className);

      if (!blockClass) {
        blockClass = className;
        addLocation(sourceLocations, stylePath, selectorStartLine, 0, 'block-class');
      }
    }

    selectorBuffer = selectorBuffer.slice(selectorBuffer.indexOf('{') + 1);
    selectorStartLine = selectorBuffer.trim() ? lineNumber : null;
  }

  const { modifierClasses, relatedClasses } = classifyClasses(allClasses, blockClass);

  return ok(
    {
      ...baseData,
      blockClass,
      modifierClasses,
      relatedClasses,
      cssVariables: sortValues(cssVariables),
      hardcodedColors: sortValues(hardcodedColors),
      themeImport,
    },
    sourceLocations,
    warnings,
  );
}

export function analyzeStyle({ name } = {}, { registryOverride } = {}) {
  try {
    if (!COMPONENT_NAME_PATTERN.test(name || '')) {
      return fail('INVALID_COMPONENT_NAME', 'name must be a valid component export identifier', { name });
    }

    const registry = registryOverride || buildRegistry();
    const component = registry.components.find((entry) => entry.name === name);

    if (!component) {
      return fail('COMPONENT_NOT_FOUND', 'Component not found in registry', { name });
    }

    const registryConflicts = (registry.conflicts || []).filter((conflict) => conflict.name === name);
    const componentConflicts = component.conflicts || [];
    const combinedConflicts = registryConflicts.length ? registryConflicts : componentConflicts;

    if (combinedConflicts.length) {
      return fail('COMPONENT_NAME_CONFLICT', 'Component name has registry conflicts', {
        name,
        conflicts: combinedConflicts,
      });
    }

    return analyzeStyleSource(component);
  } catch (error) {
    return normalizeInfrastructureError(error);
  }
}
