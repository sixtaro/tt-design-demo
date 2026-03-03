---
name: "component-linter"
description: "Checks components for project conventions, completeness, and consistency. Invoke when user wants to verify components meet tt-design standards."
---

# 组件检查器

检查 tt-design 组件库中的组件是否符合项目规范。

## 功能特性

- 检查组件目录结构完整性
- 验证 stories 文件是否存在且格式正确
- 检查组件是否在 src/index.js 中正确注册
- 检查版本配置是否齐全
- 验证组件代码风格一致性
- 检查 data-component-version 属性是否正确设置

## 检查清单

### 1. 目录结构
每个组件应该有：
- `src/components/<ComponentName>/` 目录
- `index.js` - 组件主文件
- `<ComponentName>.stories.js` - Storybook 文档

### 2. 组件文件 (index.js)
- 从 antd 导入对应组件
- 使用 classNames 构建 CSS 类名
- 包含 `tt-<component-name>` 类名
- 设置 `data-component-version` 属性
- 导出 `Component.version = componentVersions.Component`

### 3. Stories 文件
- 正确的 title 格式：`'分类/<ComponentName>'`
- 包含 version 参数的 argTypes
- 包含 docs.description.component
- 至少有一个 Default story

### 4. 版本配置
- 在 `version-config.js` 中有对应条目
- 版本号遵循 SemVer 规范

### 5. 注册
- 在 `src/index.js` 中有 import
- 在 `src/index.js` 的 export 列表中
- 在 components 对象中

## 使用方法

1. 可以检查单个组件或所有组件
2. 生成检查报告，列出通过和失败的项目
3. 提供修复建议

## 自动修复

对于常见问题可以尝试自动修复：
- 添加缺失的版本配置
- 注册组件到 src/index.js
- 创建基础的 stories 文件模板
