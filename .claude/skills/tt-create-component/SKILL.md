---
name: tt-create-component
description: Use when adding a new tt-design basic or business component, or wrapping a missing Ant Design 4.24 primitive for repository use.
---

# tt-create-component

## Overview
Use this for new component creation. Follow the always-on repository rules in `CLAUDE.md`; this skill only covers the wiring that is easy to miss.

## When to Use
- Add a component under `src/components/` or `src/business/`
- Wrap a missing Ant Design 4.24 primitive before using it elsewhere in the repo

## Quick Reference
- Create `index.js`, `index.less`, and adjacent `*.stories.js`
- Reuse `@/components` first in business components and stories
- Register exports in `src/components/index.js` or `src/business/index.js`
- Expose public API from `src/index.js`
- Add `componentVersions.<Name>` in `src/utils/version-config.js` when public versioning applies

## Common Mistakes
- Using raw `antd` in stories
- Forgetting export or version wiring
- Defaulting to Storybook 7 patterns in this Storybook 6 repo
