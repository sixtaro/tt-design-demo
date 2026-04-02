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
- 案例命名统一使用中文，避免 `Default`、`Basic`、`WithXxx` 这类英文 story 名
- 案例分类尽量收敛，不要为单个细小差异拆过多 story；优先合并成 1 个“总览/组合”案例
- 每个分类里的例子要更丰富：优先在同一个 story 中并排或分组展示多个状态、尺寸、方向、组合场景
- 总体原则是“分类少、信息密度高”：减少 story 数量，但提升每个 story 的可对比性和业务感

## 常见错误
- 为了让 controls 更丰富而凭空新增 props
- 组件 API 改了，但 docs / version 文案没同步
- 一个组件拆出太多零散案例，导致 Storybook 目录层级很碎
- story 名仍然使用英文，和仓库现有中文展示风格不一致
- 每个 story 只放一个很薄的例子，导致需要来回切换多个案例才能看完整组件能力
