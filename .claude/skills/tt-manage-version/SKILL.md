---
name: tt-manage-version
description: Use when adding a public tt-design component or changing public API behavior that may require version updates.
---

# tt-manage-version

## When to Use
- Add a public component
- Change public API or externally visible behavior
- Audit version drift between code, exports, and stories

## Source of Truth
- `src/utils/version-config.js` → `libraryVersion`, `componentVersions`

## Checklist
- Add or update `componentVersions.<Name>`
- Keep `Component.version` aligned in component code
- Update story version text or props only where the local story pattern already exposes version information
- Keep exports aligned in `src/components/index.js`, `src/business/index.js`, and `src/index.js` as needed
- Use `PATCH` / `MINOR` / `MAJOR` only when the release intent actually matches

## Common Drift Points
- Missing `componentVersions` entry
- Component exported from one index file but not another
- Story docs still showing stale version text
