---
name: tt-webapp-testing
description: Use when validating a changed tt-design component or story in Storybook or a local dev server.
---

# tt-webapp-testing

## When to Use
- Smoke-test a changed story
- Check whether a UI issue reproduces
- Validate rendering and obvious interactions before completion

## Quick Reference
- Prefer `yarn storybook` on port `6006`
- Read the target component and `*.stories.js` first
- Test the nearest existing story before building temporary pages
- Check rendering, controls, docs text, and version text when relevant
- If browser automation is unavailable, stop at server startup plus code-level validation

## Common Mistakes
- Testing a throwaway page instead of Storybook
- Validating stories that use raw `antd`
