---
name: tt-design-generate-storybook
description: 当需要为已有的 tt-design 基础组件或业务组件新增、更新 `*.stories.js` 案例文件时使用。
---

# tt-design-generate-storybook

## 适用场景
- 为已有组件新增 story
- 组件 props 或行为变化后刷新 stories
- 修正已经偏离仓库规范的 story

## 快速参考
- 先读取组件入口和最近的现有 story
- 遵循仓库当前的 Storybook 6 `*.stories.js` 风格
- 优先复用附近已有的 metadata 模式；仅当相邻 stories 已使用时，才补 docs 描述和 tags
- 只为真实存在的 props 添加 controls
- 常见映射：枚举 → `select`，布尔 → `boolean`，`on*` → `action`，`version` → 隐藏
- 示例布局优先使用仓库组件，不要在 stories 中直接引入原始 `antd`

## 常见错误
- 为了让 controls 更丰富而凭空新增 props
- 组件 API 改了，但 docs / version 文案没同步
