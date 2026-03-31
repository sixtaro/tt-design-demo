export const COMPONENT_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function validateComponentName(name) {
  if (!COMPONENT_NAME_PATTERN.test(name || '')) {
    return {
      valid: false,
      error: {
        code: 'INVALID_COMPONENT_NAME',
        message: 'name must be a valid component export identifier',
        details: { name },
      },
    };
  }
  return { valid: true };
}
