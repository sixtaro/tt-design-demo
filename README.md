# tt-design

基于React 17.0.1和Antd 4.24.8的前端组件库，使用ES6规范，通过Rollup打包，支持Storybook 6.x预览。

## 安装

使用yarn安装：

```bash
yarn add tt-design
```

使用npm安装：

```bash
npm install tt-design
```

## 使用

### 导入组件

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

## 开发

### 安装依赖

```bash
yarn install
```

### 构建组件库

```bash
yarn build
```

### 启动Storybook预览

```bash
yarn storybook
```

## 组件列表

- Button

## 技术栈

- React 17.0.1
- Antd 4.24.8
- Rollup 2.77.0
- Storybook 6.5.16

## 目录结构

```
tt-design/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── index.js
│   │       └── Button.stories.js
│   └── index.js
├── dist/
├── .storybook/
│   ├── main.js
│   └── preview.js
├── rollup.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 新增组件要求

### 组件开发

1. **创建组件目录**：在`src/components/`下创建新组件目录，例如`Input`。

2. **实现组件**：在组件目录中创建`index.js`文件，实现组件功能。

3. **导出组件**：在`src/index.js`文件中导出新组件。

## 生成Storybook案例标准

### 需求

当你开发完组件后，可以请求生成Storybook案例，只需提供以下信息：

1. **组件名称**：例如 Button、Input、Modal 等
2. **组件路径**：组件文件的相对路径，例如 `src/components/Button/index.js`
3. **组件属性**：组件支持的所有属性，包括类型、默认值和描述
4. **交互事件**：组件支持的事件，例如 onClick、onChange 等

### 示例请求

```
请为以下组件生成Storybook案例：
- 组件名称：Input
- 组件路径：src/components/Input/index.js
- 组件属性：
  - type：输入框类型，可选值为 text、password、number、email
  - size：输入框大小，可选值为 small、middle、large
  - placeholder：占位文本，字符串类型
- 交互事件：
  - onChange：输入值变化时触发
```

### 生成标准

生成的Storybook案例将遵循以下标准：

1. **文件命名**：`{ComponentName}.stories.js`，例如 `Input.stories.js`

2. **文件位置**：与组件文件同目录，例如 `src/components/Input/Input.stories.js`

3. **案例结构**：
   - 默认案例
   - 不同属性组合的案例
   - 交互事件演示案例

4. **argTypes配置**：为组件的属性添加适当的控制选项，方便在Storybook中调整参数

5. **格式规范**：遵循项目中已有的代码格式和规范

### 如何使用

1. 开发完成组件后，按照上述格式提供组件信息
2. 我将为你生成对应的Storybook案例文件
3. 将生成的文件放置在组件目录中
4. 运行 `yarn storybook` 预览组件效果

