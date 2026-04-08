---
name: tt-design-repo-reference
description: 当需要快速了解 tt-design 当前仓库的脚本、目录、主题入口、样式产物、版本入口或对外导出边界时使用。
---

# tt-design-repo-reference

## 适用场景

- 需要快速了解当前仓库结构
- 需要确认应该查看哪个入口文件
- 需要核对主题、样式、版本和发布产物的真实位置
- 需要回答“这个仓库现在是怎么工作的”

## 当前仓库事实

### 技术栈

- React `17.0.1`
- Ant Design `4.24.8`
- Rollup `2.77.0`
- Storybook `6.x`

### 常用脚本

- `yarn build`：构建组件库
- `yarn watch`：监听构建
- `yarn storybook`：启动 Storybook
- `yarn build-storybook`：构建 Storybook 静态资源
- `yarn lint`：检查 `src/**/*.{js,jsx}`
- `yarn test:components`：运行组件测试
- `yarn build:docs`：构建文档
- `yarn mcp:dev`：启动 MCP 服务

如需完整列表，以 `package.json` 为准。

### 关键目录

- `src/components/`：基础组件
- `src/business/`：业务组件
- `src/theme/`：主题配置和主题应用逻辑
- `src/style/`：颜色与排版变量
- `.storybook/`：Storybook 配置
- `dist/`：构建产物与元数据

### 对外入口

- `src/index.js`：主导出入口
- `src/components/index.js`：基础组件汇总导出
- `src/business/index.js`：业务组件汇总导出

### 主题相关入口

- `src/theme/index.js`：`getTheme`、`applyTheme`、`themeConfig`
- `src/theme/color-palette.js`：颜色源数据与 Less 变量映射
- `src/style/color.less`：颜色变量输出层
- `src/style/themes/default.less`：字体、行高、字重和样式变量

### 样式产物

- `dist/esm/index.css`
- `dist/cjs/index.css`

业务项目接入时通常还需要自行引入 `antd/dist/antd.css`。

### 版本入口

- `src/utils/version-config.js`：库版本与组件版本
- `src/utils/version.js`：版本工具函数

## 使用提醒

- 优先回答“当前仓库真实情况”，不要沿用 README 的旧描述
- 如果发现 README 与代码不一致，以源码、构建配置和 `package.json` 为准
- 当用户要修改组件、story、版本或文档时，再切换到对应专项 skill
