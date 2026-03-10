---
name: "create-new-component"
description: "自动化创建 React 17 标准组件，包含目录初始化、样式、Storybook 及全局导出。当用户要求“新增组件”或“创建 [Name] 组件”时调用。"
---

# Skill: Component Scaffold Generator

## 执行触发点
- 用户要求创建新组件、添加组件或初始化组件目录。

## 自动化执行步骤
1. **目录初始化**: 在 `src/components/` 下创建以 `[ComponentName]` 命名的文件夹。
2. **生成逻辑文件 (index.jsx)**:
   - 严格使用 React 17.0.1 语法。
   - 自动注入 `propTypes` 校验。
   - 从 `../../utils/version-config` 注入组件版本。
   - 默认主类名设为 `tt-[lowercase-name]`，并使用 `classnames` 合并。
   - 采用 `import { [AntdName] as Ant[AntdName] } from 'antd'` 的别名方式封装。
3. **生成样式文件 (index.less)**:
   - 自动添加首行引用：`@import (reference) "../../style/themes/default.less";`。
   - 初始化的根选择器必须以 `tt-` 为前缀。
4. **生成演示文件 ([ComponentName].stories.jsx)**:
   - 遵循 Storybook 7.x 规范。
   - 自动添加 `tags: ['autodocs']`。
5. **全局注册**: 
   - 将新组件自动添加到 `src/index.js` 的导出列表中。

## 交互要求
- 完成后列出所有创建的文件路径，并询问用户是否需要立即预览 Storybook。