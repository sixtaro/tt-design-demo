import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

import { buildRegistry } from './build-registry.mjs';
import { readRepoRelativeFile } from '../utils/read-source.mjs';
import { ok, fail, normalizeInfrastructureError } from '../utils/result.mjs';
import { toSourceLocation } from './entry-references.mjs';

const traverse = traverseModule.default || traverseModule;
const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function getPropertyName(node) {
  if (!node) {
    return null;
  }

  if (node.type === 'Identifier') {
    return node.name;
  }

  if (node.type === 'StringLiteral') {
    return node.value;
  }

  return null;
}

function getLiteralValue(node) {
  if (!node) {
    return undefined;
  }

  if (node.type === 'StringLiteral' || node.type === 'BooleanLiteral' || node.type === 'NumericLiteral') {
    return node.value;
  }

  if (node.type === 'NullLiteral') {
    return null;
  }

  return undefined;
}

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

function addLocation(locations, file, node) {
  if (!node) {
    return;
  }

  const location = toSourceLocation(file, node);
  const key = getLocationKey(location);

  if (!locations.some((item) => getLocationKey(item) === key)) {
    locations.push(location);
  }
}

function isDirectReactWrapperCallee(callee, wrapperName) {
  return (
    callee.type === 'Identifier' && callee.name === wrapperName
    || callee.type === 'MemberExpression'
      && callee.object.type === 'Identifier'
      && callee.object.name === 'React'
      && callee.property.type === 'Identifier'
      && callee.property.name === wrapperName
  );
}

function getFunctionLikeNode(init, topLevelBindings = new Map()) {
  if (!init) {
    return null;
  }

  if (init.type === 'Identifier') {
    return getFunctionLikeNode(topLevelBindings.get(init.name) || null, topLevelBindings);
  }

  if (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression' || init.type === 'FunctionDeclaration') {
    return init;
  }

  if (init.type === 'CallExpression') {
    const wrapperNames = ['memo', 'forwardRef'];

    for (const wrapperName of wrapperNames) {
      if (!isDirectReactWrapperCallee(init.callee, wrapperName)) {
        continue;
      }

      const candidate = init.arguments[0];
      const unwrappedCandidate = getFunctionLikeNode(candidate, topLevelBindings);

      if (unwrappedCandidate) {
        return unwrappedCandidate;
      }
    }
  }

  return null;
}

function collectDefaultsAndProps(paramNode) {
  const defaults = {};
  const props = [];
  const defaultValueNodes = [];
  let isPartial = false;

  if (!paramNode) {
    return { defaults, props, defaultValueNodes, isPartial };
  }

  if (paramNode.type !== 'ObjectPattern') {
    return { defaults, props, defaultValueNodes, isPartial: true };
  }

  for (const property of paramNode.properties) {
    if (property.type === 'RestElement') {
      props.push(property.argument.name);
      continue;
    }

    if (property.type !== 'ObjectProperty') {
      continue;
    }

    const keyName = getPropertyName(property.key);

    if (!keyName) {
      continue;
    }

    props.push(keyName);

    if (property.value.type === 'AssignmentPattern') {
      const literalValue = getLiteralValue(property.value.right);

      if (literalValue !== undefined) {
        defaults[keyName] = literalValue;
        defaultValueNodes.push(property.value.right);
      }
    }
  }

  return { defaults, props, defaultValueNodes, isPartial };
}

function analyzeComponentSource(component, file) {
  const code = readRepoRelativeFile(component.sourcePath, component.componentDir);
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const sourceLocations = [];
  addExistingLocations(sourceLocations, component.sourceLocations || []);
  const warnings = [...(component.warnings || [])];
  const topLevelBindings = new Map();
  let defaultExport = null;
  let componentFunction = null;
  let componentDeclarationNode = null;
  const subcomponentAssignments = [];
  let hasDataComponentVersion = false;
  let hasPropTypes = false;

  traverse(ast, {
    VariableDeclarator(path) {
      if (path.parentPath.parent.type !== 'Program') {
        return;
      }

      if (path.node.id.type === 'Identifier') {
        topLevelBindings.set(path.node.id.name, path.node.init || null);
      }
    },
    FunctionDeclaration(path) {
      if (path.parent.type !== 'Program' || !path.node.id?.name) {
        return;
      }

      topLevelBindings.set(path.node.id.name, path.node);
    },
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;

      if (declaration.type === 'Identifier') {
        defaultExport = declaration.name;
        addLocation(sourceLocations, file, path.node);
      } else {
        componentDeclarationNode = declaration;
        addLocation(sourceLocations, file, declaration);
      }
    },
    AssignmentExpression(path) {
      const { left } = path.node;

      if (
        left.type === 'MemberExpression'
        && !left.computed
        && left.object.type === 'Identifier'
        && left.property.type === 'Identifier'
      ) {
        const objectName = left.object.name;
        const propertyName = left.property.name;

        if (propertyName === 'propTypes') {
          hasPropTypes = true;
          addLocation(sourceLocations, file, path.node);
        }

        if (propertyName !== 'propTypes') {
          subcomponentAssignments.push({
            objectName,
            propertyName,
            node: path.node,
          });
        }
      }
    },
    ClassProperty(path) {
      if (path.node.static && getPropertyName(path.node.key) === 'propTypes') {
        hasPropTypes = true;
        addLocation(sourceLocations, file, path.node);
      }
    },
    ClassPrivateProperty() {},
    JSXAttribute(path) {
      if (path.node.name?.type === 'JSXIdentifier' && path.node.name.name === 'data-component-version') {
        hasDataComponentVersion = true;
        addLocation(sourceLocations, file, path.node);
      }
    },
  });

  if (defaultExport) {
    componentFunction = getFunctionLikeNode(topLevelBindings.get(defaultExport), topLevelBindings);
  }

  if (!defaultExport) {
    const exportDefaultNode = ast.program.body.find((node) => node.type === 'ExportDefaultDeclaration');

    if (exportDefaultNode?.declaration.type === 'FunctionDeclaration' && exportDefaultNode.declaration.id?.name) {
      defaultExport = exportDefaultNode.declaration.id.name;
      componentFunction = exportDefaultNode.declaration;
      addLocation(sourceLocations, file, exportDefaultNode.declaration);
    }
  }

  if (!componentDeclarationNode && defaultExport && topLevelBindings.get(defaultExport)) {
    componentDeclarationNode = topLevelBindings.get(defaultExport);
    addLocation(sourceLocations, file, componentDeclarationNode);
  }

  const subcomponents = subcomponentAssignments
    .filter((assignment) => defaultExport && assignment.objectName === defaultExport)
    .map((assignment) => {
      addLocation(sourceLocations, file, assignment.node);
      return `${assignment.objectName}.${assignment.propertyName}`;
    });

  const { defaults, props, defaultValueNodes, isPartial } = collectDefaultsAndProps(componentFunction?.params?.[0] || null);

  for (const node of defaultValueNodes) {
    addLocation(sourceLocations, file, node);
  }

  if (isPartial) {
    warnings.push(`API analysis for ${component.name} is partial because props are not destructured in the component signature.`);
  }

  if (!defaultExport) {
    warnings.push(`Unable to resolve default export name for ${component.name}.`);
  }

  if (!hasPropTypes) {
    warnings.push(`${component.name} does not declare propTypes.`);
  }

  return ok(
    {
      name: component.name,
      category: component.category,
      sourcePath: component.sourcePath,
      defaultExport,
      defaults,
      props: [...new Set(props)],
      subcomponents: [...new Set(subcomponents)].sort(),
      hasDataComponentVersion,
      hasPropTypes,
    },
    sourceLocations,
    warnings,
  );
}

export function analyzeApi({ name } = {}, { registryOverride } = {}) {
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

    return analyzeComponentSource(component, component.sourcePath);
  } catch (error) {
    return normalizeInfrastructureError(error);
  }
}
