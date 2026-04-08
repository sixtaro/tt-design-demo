# tt-design

基于 React 17.0.1 和 Ant Design 4.24.8 的企业级前端组件库，使用 Rollup 打包，支持 Storybook 6.x 预览。

## 安装

```bash
yarn add tt-design
```

或：

```bash
npm install tt-design
```

`tt-design` 依赖宿主项目提供 `react`、`react-dom`、`antd` 等 peer dependencies，建议业务项目与本库保持以下主版本：

- `react@17.0.1`
- `react-dom@17.0.1`
- `antd@4.24.8`

## 快速开始

### 引入组件

```jsx
import { Button } from 'tt-design';

function App() {
  return (
    <div>
      <Button type="primary">Primary Button</Button>
      <Button type="default">Default Button</Button>
    </div>
  );
}

export default App;
```

### 引入样式

在其他项目中接入 `tt-design` 时，建议同时引入 Ant Design 基础样式和 `tt-design` 的打包样式：

```jsx
import 'antd/dist/antd.css';
import 'tt-design/dist/esm/index.css';
```

如果你的工程明确使用 CommonJS 产物，也可以改为：

```jsx
import 'tt-design/dist/cjs/index.css';
```

说明：

- `tt-design` 会产出自己的组件样式文件
- `antd` 基础样式没有内置到 `tt-design` 的产物中，宿主项目需要自行引入

## 主题

### 推荐方式：使用 `ThemeProvider`

`ThemeProvider` 会同时处理：

- Ant Design 4 的 `ConfigProvider` 主题配置
- `--tt-*` CSS 变量注入

```jsx
import React from 'react';
import 'antd/dist/antd.css';
import 'tt-design/dist/esm/index.css';
import { ThemeProvider, Button } from 'tt-design';

function App() {
  return (
    <ThemeProvider theme="mintGreen">
      <Button type="primary">主要按钮</Button>
    </ThemeProvider>
  );
}

export default App;
```

### 运行时切换主题

如果项目需要在运行时动态切换主题，可以直接调用 `applyTheme`：

```jsx
import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import 'tt-design/dist/esm/index.css';
import { applyTheme, Button } from 'tt-design';

function App() {
  useEffect(() => {
    applyTheme('mintGreen');
  }, []);

  return <Button type="primary">主要按钮</Button>;
}

export default App;
```

### 可用主题

- `geekBlue`
- `dustRed`
- `mintGreen`
- `neonBlue`
- `sunsetOrange`
- `goldenPurple`
- `cyan`

### 主题使用说明

- `theme` 支持直接传主题名字符串，例如 `theme="mintGreen"`
- 也支持先通过 `getTheme()` 获取配置对象后再传入
- 如果没有引入 `tt-design` 的 CSS 文件，组件样式不会完整生效
- 如果没有引入 `antd/dist/antd.css`，底层 Ant Design 组件样式会缺失

## 开发命令

常用命令如下：

```bash
yarn build
yarn storybook
yarn lint
yarn test:components
```

其他仓库脚本请以 [package.json](/Volumes/code/tt-design/package.json) 为准。

## 仓库说明

- 对外接入说明优先看本 README
- 仓库长期开发规则见 [AGENTS.md](/Volumes/code/tt-design/AGENTS.md) 和 [CLAUDE.md](/Volumes/code/tt-design/CLAUDE.md)
- 面向特定任务的流程说明放在 `.agents/skills/` 与 `.claude/skills/`
