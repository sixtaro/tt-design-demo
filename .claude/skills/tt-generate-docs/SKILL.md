---
name: tt-generate-docs
description: Use when the user explicitly asks for tt-design documentation for one component, multiple components, or a library overview.
---

# tt-generate-docs

## When to Use
- Generate docs for one component
- Generate docs for multiple components
- Generate a library overview or component catalog

Do not create docs proactively.

## Inputs
- Component source: `index.js`, `index.less`
- Stories: `*.stories.js`
- Versions: `src/utils/version-config.js`
- Exports: `src/components/index.js`, `src/business/index.js`, `src/index.js`
- Repo rules: `CLAUDE.md`

## Output Rules
- Do not invent props, defaults, examples, or categories
- Prefer Chinese prose and English file names unless the user says otherwise
- Keep code blocks raw; do not HTML-escape JSX or LESS
- Include version info when the component exposes `.version`

## Suggested Structure
- 单组件：简介、引入、版本、示例、API 表格、注意事项
- 多组件 / 库：技术栈、基础组件、业务组件、版本、示例、API 表格

## Common Mistakes
- 未经要求主动生成文档
- API 表格靠猜测补全
- 示例回退到原始 `antd` 而不是仓库组件
