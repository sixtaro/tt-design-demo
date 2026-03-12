---
name: "manage-component-versions"
description: "管理组件库版本一致性，包含版本检查、自动升级及跨文件同步。当涉及代码修改或发布准备时调用。"
---

# Skill: Version Consistency Manager

## 核心指令集
1. **`Check Versions`**: 遍历 `src/components/` 下所有组件，对比其代码版本与 `src/utils/version-config.js` 中的记录是否一致。
2. **`Bump [Type] Version`**: 
   - 根据语义化版本规范升级版本：`PATCH` (修复/微调), `MINOR` (兼容性新功能), `MAJOR` (破坏性改动)。
   - 同步修改 `version-config.js`、`src/index.js` 以及对应组件的 `*.stories.jsx`。

## 自动化触发逻辑
- **新建组件**: 必须在 `component-versions` 中新增对应键值对，初始版本默认为 `1.0.0`。
- **修改逻辑**: 检测到代码变更时，主动询问用户“是否需要升级 PATCH 版本？”。
- **保存前自检**: 确保版本信息已在配置文件、导出入口和文档中三方对齐。

## 约束
- 禁止在组件内部硬编码版本号，必须统一引用 `src/utils/version-config.js`。