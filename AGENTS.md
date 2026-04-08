# AGENTS.md

This file provides guidance to Codex when working in this repository.

## 作用边界

- `AGENTS.md` 只放始终生效的仓库规则
- 仓库参考信息与操作清单放在 `.agents/skills/`
- 对外使用说明放在 `README.md`

如需了解目录、脚本、主题入口、版本入口等参考信息，优先查看 `tt-design-repo-reference` skill。

## 环境与技术边界

- React 版本严格锁定为 `17.0.1`
- Ant Design 基座严格锁定为 `4.24.8`
- 语言使用纯 JavaScript / JSX
- 在封装任何 Ant Design 组件前，必须先参考 Ant Design 4.24 文档
- 严禁引入 Ant Design 5.x 的 Token 体系或 5.x 专属 API 写法，除非确认 4.24 已支持

## 组件开发硬规则

### 导出与命名

- 统一使用 `export default ComponentName`
- 封装 AntD 时使用 `Ant[Component]` 别名，例如 `Button as AntButton`
- 必须使用 `classnames` 合并类名
- 主类名前缀统一为 `tt-`
- CSS class 命名遵循 BEM：
  - Block：`tt-{component-name}`
  - Element：`tt-{component-name}-{element-name}`
  - Modifier：`tt-{component-name}-{modifier-name}`

### 逻辑约定

- 组件尽量支持 `value` / `onChange` 的受控模式，并兼容 `defaultValue`
- 复杂组件必须使用 `React.forwardRef`
- 列表或复杂渲染项必须考虑 `React.memo`，避免 React 17 下无效重渲染

### PropTypes

- 必须引入 `prop-types`
- 组件末尾必须显式定义 `propTypes`
- 对外暴露版本时，保留 `version: PropTypes.string`

## Storybook 规则

- Storybook 案例中的 UI 组件优先从 `src/components` 或 `@/components` 引入
- 禁止在 story 中直接使用原始 `antd` 组件作为展示主体
- 缺失能力应先按仓库规范封装组件，再在 story 中引用
- 保持当前仓库的 Storybook 6 `*.stories.js` 风格，不要默认套用 Storybook 7 写法

## 样式与主题规则

### 基础要求

- 所有颜色必须优先使用 `var(--tt-*)` CSS 变量
- 禁止硬编码十六进制颜色作为常规实现方案
- 禁止使用 `!important`
- 样式文件首行引用：
  `@import (reference) '../../style/themes/default.less';`
- 颜色单一来源在 `src/theme/color-palette.js`
- 运行时主题应用入口在 `src/theme/index.js`

### 通用样式约束

- 默认文本颜色使用 `var(--tt-color-grey-7)`
- 悬停状态边框使用 `var(--tt-color-primary-6)`
- 错误状态边框使用 `var(--tt-color-red-6)`
- 字号、行高、字重优先使用 `src/style/themes/default.less` 中的变量
- 字体颜色使用 `var(--tt-text-title/body/secondary/link/danger/warning/success)`

### Portal 类组件

- 对 Select、Modal、Dropdown 等 Portal 渲染组件，必须通过 `dropdownClassName`、`popupClassName`、`modalClassName` 等入口注入 `tt-` 前缀的自定义类名
- Portal 内容样式必须挂在自定义类名下，禁止直接写全局覆盖选择器

## 版本与公开 API

- 新增公开组件或修改公共 API / 对外行为时，必须检查 `src/utils/version-config.js`
- 组件对外导出、版本配置和主入口暴露需要保持一致

## 代码写入要求

- 代码中的 `&`、`<`、`>` 保持原样，禁止写成 HTML 实体
- LESS 嵌套选择器中的 `&` 必须保持原样
