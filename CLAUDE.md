# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述 (Project Overview)

tt-design 是一个基于 React 17.0.1 和 Ant Design 4.24.8 的企业级前端组件库，使用 Rollup 打包，支持 Storybook 6.x 进行组件预览和文档。

## 常用命令 (Common Commands)

| 命令 | 说明 |
| :--- | :--- |
| `yarn install` | 安装项目依赖 |
| `yarn build` | 使用 Rollup 构建组件库 (输出 CommonJS 和 ES Module 格式) |
| `yarn watch` | 监听文件变化并自动重新构建 |
| `yarn storybook` | 启动 Storybook 开发服务器 (端口 6006) |
| `yarn build-storybook` | 构建 Storybook 静态文件 |
| `yarn generate:colors` | 生成颜色主题文件 |
| `yarn deploy-storybook` | 部署 Storybook 到 GitHub Pages |

## Claude Code 项目技能 (Project Skills)

项目级 Claude skills 放在 `.claude/skills/` 目录下。
`CLAUDE.md` 只放始终生效的仓库规则；`.claude/skills/` 只放按场景触发的可复用流程。

## 代码架构 (Code Architecture)

### 目录结构 (Directory Structure)

```
tt-design/
├── src/
│   ├── components/          # 基础 UI 组件 (35+ 组件)
│   │   ├── Button/       # 每个组件独立目录
│   │   │   ├── index.js         # 组件实现
│   │   │   ├── index.less       # 组件样式
│   │   │   └── *.stories.js   # Storybook 案例
│   │   └── index.js           # 基础组件统一导出
│   ├── business/          # 业务组件 (15+ 组件)
│   ├── utils/             # 工具函数库
│   │   ├── version.js         # 版本管理工具
│   │   └── version-config.js  # 版本号配置
│   ├── theme/             # 主题系统
│   │   ├── color-palette.js # 颜色调色板
│   │   └── index.js         # 主题工具函数
│   ├── style/             # 全局样式
│   │   └── themes/        # 主题变量定义
│   └── index.js          # 库主入口
├── .storybook/           # Storybook 配置
├── dist/                # 构建输出目录
├── rollup.config.js     # Rollup 打包配置
└── package.json         # 项目配置
```

### 构建系统 (Build System)

- **打包工具**: Rollup 2.77.0
- **输出格式**: CommonJS (`dist/cjs/`) 和 ES Module (`dist/esm/`)
- **外部依赖**: React, ReactDOM, Ant Design, Axios, xlsx-js-style
- **别名配置**: `@` 指向 `src/` 目录
- **样式处理**: Less + PostCSS (自动压缩和提取 CSS)

### 主题系统 (Theme System)

支持 7 种预设主题: `geekBlue`, `dustRed`, `mintGreen`, `neonBlue`, `sunsetOrange`, `goldenPurple`, `cyan`

- 使用 CSS 变量 + Less 变量双重支持
- 通过 `ThemeProvider` 组件或 `applyTheme()` 函数应用主题
- 颜色定义在 `src/theme/color-palette.js`

### 版本管理 (Version Management)

- 整体库版本和组件版本分离管理
- 版本号集中配置在 `src/utils/version-config.js`
- 每个组件通过 `data-component-version` 属性暴露版本号
- 提供版本验证、比较、兼容性检查工具函数

## 组件开发规约 (Component Development Guidelines)

### 1. 环境与版本锁定 (Environment Lockdown)

* **React 版本**: 严格锁定 **17.0.1**。
* **UI 基座**: 严格锁定 **Ant Design 4.24.8**。
    * **强制联网参考**: 在封装任何组件前，必须先搜索 `Ant Design 4.24 [组件名] props`。
    * **拒绝 5.x 污染**: 严禁参考 AntD 5.x 的 Token 系统或 `items` 数组传参方式（除非 4.24 已支持）。
* **语言**: 纯 **JavaScript (JSX)**。

### 2. 组件编写标准 (Coding Standards)

#### 2.1 结构与命名
- **导出模式**: 统一使用 `export default ComponentName`。
- **类名规范**: 必须使用 `classnames` 库合并类名，主类名格式为 `tt-[component-name]`。
- **别名引用**: 封装 AntD 时使用 `Ant[Component]` 别名，例如：
  `import { Button as AntButton } from 'antd';`

#### 2.2 逻辑范式
- **受控模式**: 组件尽量支持 `value` 和 `onChange` 驱动，并兼容 `defaultValue`。
- **Ref 转发**: 复杂组件必须使用 `React.forwardRef` 暴露底层 DOM 或方法。
- **性能优化**: 针对列表或复杂渲染项，必须使用 `React.memo` 防止 React 17 下的无效重渲染。

#### 2.3 参数校验 (PropTypes)
必须引入 `prop-types` 并在组件末尾显式定义，例如：
```javascript
import PropTypes from 'prop-types';
[ComponentName].propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
};
```

#### 2.4 组件开发流程
1. 在 `src/components/` 下创建组件目录
2. 实现组件逻辑 (`index.js`) 和样式 (`index.less`)
3. 在 `src/components/index.js` 中导出组件
4. 创建 Storybook 故事文件 (`*.stories.js`)
5. 在 `src/utils/version-config.js` 中添加组件版本
6. 更新主入口文件 `src/index.js`

#### 2.5 Storybook 案例约定
- **优先使用组件库组件**：Storybook 案例中的 UI 组件优先从 `src/components` / `@/components` 引入，禁止直接在案例里使用 Ant Design 组件。
- **缺失先封装再使用**：如果组件库中暂无所需组件，必须先按本仓库规范封装对应的 Ant Design 4.24 组件，再在案例中引用封装后的组件。
- **遵循现有 Storybook 6 风格**：新增案例统一使用 `*.stories.js` 和当前仓库已存在的 metadata / CSF 写法，禁止默认套用 Storybook 7 专属模式。
- **案例保持一致性**：后续新增基础组件和业务组件案例时，统一遵循该规则。

#### 2.6 代码写入与转义
- **严禁 HTML 实体转义**：代码中的 `&`、`<`、`>` 必须保持原样，不能写成 HTML 实体
- **LESS 特别注意**：嵌套选择器中的 `&` 必须保持原样

## 颜色与字体规范入口

颜色与字体规范以 `CLAUDE.md` 为唯一活跃规则入口。
实现映射：颜色单一来源见 `src/theme/color-palette.js`，CSS 变量输出层见 `src/style/color.less`，字号 / 行高 / 字重变量见 `src/style/themes/default.less`，运行时主题应用见 `src/theme/index.js`。

## 色彩规范

所有组件的色彩样式必须严格遵循本规范，禁止硬编码颜色和使用 `!important`。

### 强制使用 CSS 自定义属性
严禁硬编码十六进制颜色或使用 LESS 变量，必须使用 CSS 变量：

| CSS 变量 | 说明 |
| :--- | :--- |
| `var(--tt-color-primary-1~7)` | 主题色阶 |
| `var(--tt-color-primary/success/warning/error/info)` | 语义化颜色 |
| `var(--tt-text-title/body/secondary)` | 文本颜色 |
| `var(--tt-bg-white/light/lighter)` | 背景颜色 |
| `var(--tt-border-color/light/dark)` | 边框颜色 |
| `var(--tt-color-grey-0~9)` | 灰色色阶 |
| `var(--tt-color-red-0~10)` | 红色色阶 |

### 组件样式标准约定

#### 通用状态
| 状态 | 颜色规范 |
| :--- | :--- |
| **默认字体** | `var(--tt-color-grey-7)` |
| **悬停状态边框** | `var(--tt-color-primary-6)` |
| **错误状态边框** | `var(--tt-color-red-6)` |

### 样式规则
1. **必须使用 CSS 变量**：所有颜色使用 `var(--tt-*)`
2. **禁止 !important**：确保组件可被用户自定义覆盖
3. **引用主题文件**：首行 `@import (reference) '../../style/themes/default.less';`
4. **类名前缀**：以 `tt-` 为前缀
5. **相关文件**：颜色单一来源定义在 `src/theme/color-palette.js`，CSS 变量输出层见 `src/style/color.less`
6. **Portal 样式隔离**：对于使用 Portal 渲染的下拉框、弹窗等组件（如 Select、Modal），必须使用 Ant Design 的 `dropdownClassName` / `modalClassName` 等属性传入自定义类名（如 `tt-xxx-dropdown`），并在 LESS 文件中用该类名包裹样式，禁止使用全局选择器

## 字体与排版规范

所有组件的文本样式必须严格遵循本规范，禁止随意设置字号、行高和颜色，禁止使用 `!important`。

### 字阶与行高
| 层级 | 字号 | 行高 |
| :--- | :--- | :--- |
| 一级标题 | 32px | 48px |
| 二级标题 | 24px | 36px |
| 三级标题 | 18px | 28px |
| 四级标题 | 16px | 24px |
| 正文内容 | 14px | 22px |
| 次级文字 | 12px | 18px |

### 字重
- Regular (400): 常规正文
- Medium (500): 标题或强调
- Bold (700): 仅限英文特定场景

### 字体颜色
使用 CSS 变量：`var(--tt-text-title/body/secondary/link/danger/warning/success)`

### 样式规则
1. **字号/行高**：使用 LESS 变量 `@font-size-*` / `@line-height-*`
2. **颜色**：使用 CSS 变量 `var(--tt-*)`
3. **禁止 !important**：确保组件可被用户自定义覆盖
4. **继承字体族**：优先通过容器继承
5. **相关文件**：字号 / 行高 / 字重变量定义在 `src/style/themes/default.less`，运行时主题应用见 `src/theme/index.js`

## CSS Class 命名规范 (BEM)

组件库采用 **BEM (Block Element Modifier)** 命名规范，使用 `tt-` 前缀代表 tt-design。

- **Block (块)**：`tt-{component-name}` (例: `tt-button`)
- **Element (元素)**：`tt-{component-name}-{element-name}` (例: `tt-button-icon`)
- **Modifier (修饰符)**：`tt-{component-name}-{modifier-name}` (例: `tt-button-primary`)

## 组件列表 (Components)

### 基础组件 (Basic Components)
A, Button, Input, Select, Modal, Checkbox, Radio, Switch, Table, Form, DatePicker, TimePicker, Pagination, Message, Notification, Drawer, Tabs, Card, Spin, FloatButton, Divider, Row, Menu, Dropdown, Breadcrumb, Steps, Font, Color, Icon, BackTop, Cascader, Rate, CardSelect, TreeSelect, InputNumber, Money, Popover, ColorPicker

### 业务组件 (Business Components)
Selector, PageLayout, breadcrumbOrg, condition, excelExport, excelImport, importExportList, keyboard, layout, licencePlateInput, parkTreeWithSwitch, pictureSwiper, telWithCode, track, tree, upload
