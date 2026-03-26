---
name: tt-design-create-component
description: 当需要新增 tt-design 基础组件或业务组件，或需要先封装缺失的 Ant Design 4.24 基础能力供仓库复用时使用。
---

# tt-design-create-component

## 概述
用于新增组件。始终遵循 `CLAUDE.md` 中的仓库规则；这个 skill 只补充那些最容易遗漏的接线事项。

## 适用场景
- 在 `src/components/` 或 `src/business/` 下新增组件
- 在仓库其他位置使用前，先补封装一个缺失的 Ant Design 4.24 基础组件

## 快速参考
- 创建 `index.js`、`index.less` 和同目录的 `*.stories.js`
- 业务组件和案例优先复用 `@/components`
- 在 `src/components/index.js` 或 `src/business/index.js` 中注册导出
- 在 `src/index.js` 暴露公共 API
- 如果组件涉及公开版本管理，在 `src/utils/version-config.js` 中补充 `componentVersions.<Name>`

## 常见错误
- 在 stories 中直接使用原始 `antd`
- 忘记补导出或版本接线
- 在当前 Storybook 6 仓库里默认套用 Storybook 7 写法
