---
name: tt-design-manage-version
description: 当新增公开的 tt-design 组件，或修改了可能需要更新版本号的公共 API / 对外行为时使用。
---

# tt-design-manage-version

## 适用场景
- 新增公开组件
- 修改公共 API 或对外可见行为
- 排查代码、导出和 stories 之间的版本漂移

## 版本事实来源
- `src/utils/version-config.js` → `libraryVersion`、`componentVersions`

## 检查清单
- 新增或更新 `componentVersions.<Name>`
- 保持组件代码中的 `Component.version` 一致
- 只有当本地 story 模式本来就暴露版本信息时，才同步更新 story 中的版本文案或 props
- 视需要保持 `src/components/index.js`、`src/business/index.js`、`src/index.js` 中的导出一致
- 只有在发布意图确实匹配时，才使用 `PATCH` / `MINOR` / `MAJOR`

## 常见漂移点
- 缺少 `componentVersions` 条目
- 组件只在某一个入口文件导出，其他入口漏掉
- story 文档里仍然显示旧版本文案
