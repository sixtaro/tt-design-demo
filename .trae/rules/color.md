---
alwaysApply: false
description: 所有组件的色彩样式必须严格遵循本规范，禁止硬编码颜色和使用 !important。
---
# tt-design 色彩规范

## 强制使用 CSS 自定义属性
严禁硬编码十六进制颜色或使用 LESS 变量，必须使用 CSS 变量：

| CSS 变量 | 说明 |
| :--- | :--- |
| `var(--tt-color-primary-1~7)` | 主题色阶 |
| `var(--tt-color-primary/success/warning/error/info)` | 语义化颜色 |
| `var(--tt-text-title/body/secondary)` | 文本颜色 |
| `var(--tt-bg-white/light/lighter)` | 背景颜色 |
| `var(--tt-border-color/light/dark)` | 边框颜色 |

## 样式规则
1. **必须使用 CSS 变量**：所有颜色使用 `var(--tt-*)`
2. **禁止 !important**：确保组件可被用户自定义覆盖
3. **引用主题文件**：首行 `@import (reference) '../../style/themes/default.less';`
4. **类名前缀**：以 `tt-` 为前缀
5. **单一颜色源**：定义在 `src/theme/color-palette.js`
