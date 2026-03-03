---
name: "version-manager"
description: "Manages component and library versions in tt-design. Invoke when user wants to update versions, check version status, or sync versions across files."
---

# 版本管理工具

管理 tt-design 组件库的版本配置。

## 功能特性

- 查看当前所有组件的版本
- 更新单个组件版本
- 批量更新组件版本
- 更新库版本（libraryVersion）
- 同步组件版本到 stories 文件
- 检查版本配置完整性

## 版本配置文件

项目使用 `src/utils/version-config.js` 集中管理版本：

```javascript
export const libraryVersion = '1.0.0';

export const componentVersions = {
  Button: '1.0.0',
  Input: '1.0.0',
  // ... 其他组件
};
```

## 使用方法

### 查看版本
列出所有组件和库的当前版本。

### 更新组件版本
1. 询问用户要更新的组件名称
2. 询问新版本号（遵循 SemVer）
3. 更新 `version-config.js`
4. 可选：同步到 stories 文件

### 批量更新
将所有组件版本更新到同一个版本号。

### 更新库版本
更新 `libraryVersion` 并同步相关文件。

### 检查完整性
验证：
- 所有组件都有版本配置
- 所有 stories 都引用了版本
- src/index.js 中的组件列表与 version-config.js 一致

## SemVer 规范

版本号格式：`MAJOR.MINOR.PATCH`
- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正
