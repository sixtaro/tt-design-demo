---
alwaysApply: false
description: 为组件库 `tt-design` 创建新组件时，必须严格执行本规约。
---
# tt-design 组件创建规约 (Component Creator Rule)

当你收到“创建新组件”、“新增组件”或“添加 [Name] 组件”的任务时，必须严格执行以下自动化流程。

## 1. 自动化目录结构
每个新组件必须拥有独立的目录，路径为 `src/components/[ComponentName]/`，包含以下文件：
- `index.jsx`: 组件逻辑（纯 JS）。
- `index.less`: 组件样式（必须引用全局变量）。
- `[ComponentName].stories.jsx`: Storybook 7.x 演示。

---

## 2. 代码生成标准 (基于 React 17)

### index.jsx 模板要求：
- **命名规范**: 统一使用 `tt-[lowercase-name]` 作为 CSS 类名前缀。
- **Props 处理**: 必须合并 `className` 和 `style`，并使用 `prop-types` 进行校验。
- **版本注入**: 必须从 `../../utils/version-config` 读取版本并绑定到 `data-component-version`。
- **AntD 继承**: 采用 `import { [AntdName] as Ant[AntdName] } from 'antd'` 的别名方式，方便二次封装。

### index.less 模板要求：
```less
@import (reference) "../../style/themes/default.less";

.tt-[component-name] {
  // 默认继承或覆盖 AntD 样式
  // 示例：color: @tt-text-main;
}