export function ok(data, sourceLocations = [], warnings = []) {
  return {
    ok: true,
    data,
    sourceLocations,
    warnings,
  };
}

export function fail(code, message, details = {}) {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
    sourceLocations: [],
    warnings: [],
  };
}

export function normalizeInfrastructureError(error) {
  return fail(
    'INTERNAL_ERROR',
    error?.message || 'Unexpected MCP infrastructure error',
  );
}
