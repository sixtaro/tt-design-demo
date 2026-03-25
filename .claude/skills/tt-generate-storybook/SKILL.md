---
name: tt-generate-storybook
description: Use when adding or updating a tt-design `*.stories.js` file for an existing component or business component.
---

# tt-generate-storybook

## When to Use
- Add a new story for an existing component
- Refresh stories after props or behavior changed
- Normalize a story that drifted from repository conventions

## Quick Reference
- Read the component entry and the nearest existing story first
- Match the repository's Storybook 6 `*.stories.js` style
- Reuse the nearest local metadata pattern, including docs description and tags only when the neighboring stories already use them
- Add controls only for real props
- Typical mapping: enum → `select`, boolean → `boolean`, `on*` → `action`, `version` → hidden
- Use repo components for demo layout; do not import raw `antd` in stories

## Common Mistakes
- Inventing props just to make controls richer
- Leaving docs/version text stale after API changes
