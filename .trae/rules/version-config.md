---
alwaysApply: false
description: 为组件库 `tt-design` 管理版本时，必须严格执行本规约。
---
# tt-design 版本管理规约 (Version Manager)

## 1. 核心配置文件
所有版本信息必须统一维护在 `src/utils/version-config.js`。
**禁止**在组件内部硬编码版本号。

## 2. 自动化同步规则
每当执行以下操作时，AI 必须自动触发版本检查：
- **新建组件**: 必须在 `component-versions` 中新增对应的键值对，初始版本默认为 `1.0.0`。
- **修改组件逻辑**: 询问用户是否需要升级 `PATCH` 版本。
- **重大重构**: 提醒用户是否需要升级 `MINOR` 或 `MAJOR` 版本。

## 3. SemVer 规范执行
- **PATCH (x.x.1)**: 修复 Bug，样式微调（不影响 API）。
- **MINOR (x.1.x)**: 新增 Props，新增功能（向下兼容）。
- **MAJOR (1.x.x)**: 破坏性改动（如更改了必填 Props 键名）。

## 4. 强制对齐清单 (Consistency Check)
AI 在保存代码前必须确保以下三点对齐：
1. `src/utils/version-config.js` 包含当前组件名。
2. `src/index.js` (导出入口) 已包含该组件。
3. 组件关联的 `*.stories.jsx` 中的文档版本信息已同步。

## 5. 快捷指令 (Builder Mode)
当接收到以下指令时，执行特定逻辑：
- `Check Versions`: 扫描所有组件文件夹，列出与 config 不一致的项。
- `Bump All [version]`: 将 libraryVersion 和所有组件统一升级至指定版本。