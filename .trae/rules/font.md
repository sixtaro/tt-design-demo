---
alwaysApply: false
description: 所有组件的文本样式必须严格遵循本规范，禁止随意设置字号、行高和颜色，禁止使用 !important。
---
# tt-design 字体与排版规范

## 字阶与行高
| 层级 | 字号 | 行高 |
| :--- | :--- | :--- |
| 一级标题 | 32px | 48px |
| 二级标题 | 24px | 36px |
| 三级标题 | 18px | 28px |
| 四级标题 | 16px | 24px |
| 正文内容 | 14px | 22px |
| 次级文字 | 12px | 18px |

## 字重
- Regular (400): 常规正文
- Medium (500): 标题或强调
- Bold (700): 仅限英文特定场景

## 字体颜色
使用 CSS 变量：`var(--tt-text-title/body/secondary/link/danger/warning/success)`

## 样式规则
1. **字号/行高**：使用 LESS 变量 `@font-size-*` / `@line-height-*`
2. **颜色**：使用 CSS 变量 `var(--tt-*)`
3. **禁止 !important**：确保组件可被用户自定义覆盖
4. **继承字体族**：优先通过容器继承
