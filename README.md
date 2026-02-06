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

5. **版本号展示**：
   - 在组件描述中显示组件版本号
   - 为 `version` 属性添加控制选项，允许在 Storybook 中调整版本号
   - 为所有故事案例添加 `version` 参数的默认值

6. **格式规范**：遵循项目中已有的代码格式和规范

### 如何使用

1. 开发完成组件后，按照上述格式提供组件信息
2. 我将为你生成对应的Storybook案例文件
3. 将生成的文件放置在组件目录中
4. 运行 `yarn storybook` 预览组件效果

## 版本管理

### 版本号规范

组件库采用 **SemVer (语义化版本)** 规范进行版本管理：

- **X (主版本号)**：不兼容的 API 变更
- **Y (次版本号)**：向下兼容的功能性新增
- **Z (修订号)**：向下兼容的问题修正

### 版本管理功能

#### 1. 整体库版本

可以通过 `ttDesign.version` 获取整体库的版本号：

```javascript
import ttDesign from 'tt-design';
console.log(ttDesign.version); // 输出: "1.0.0"
```

#### 2. 组件版本

每个组件都有独立的版本号，可以通过 `Component.version` 获取：

```javascript
import { Button } from 'tt-design';
console.log(Button.version); // 输出: "1.0.0"
```

#### 3. 组件实例版本

可以通过 `version` 属性为组件实例指定版本号，该版本号会通过 `data-component-version` 属性渲染到 DOM 中：

```javascript
import { Button } from 'tt-design';

// 使用特定版本的 Button
<Button version="1.0.0">Click Me</Button>
```

渲染后的 DOM：

```html
<button data-component-version="1.0.0">Click Me</button>
```

#### 4. 版本管理工具函数

组件库提供了一套版本管理工具函数，可通过 `versionUtils` 导入：

```javascript
import { versionUtils } from 'tt-design';

// 验证版本号格式
const isValid = versionUtils.isValidVersion('1.0.0');

// 比较版本号
const result = versionUtils.compareVersions('1.0.1', '1.0.0');

// 获取组件版本
const version = versionUtils.getComponentVersion(Button);

// 检查组件版本是否满足要求
const isSatisfied = versionUtils.checkComponentVersion(Button, '1.0.0');
```

### 版本管理最佳实践

#### 1. 版本号更新规则

- **整体库版本号**：
  - 当任何组件发生不兼容变更时，更新主版本号 (`X`)
  - 当任何组件添加新功能时，更新次版本号 (`Y`)
  - 当任何组件修复 bug 时，更新修订号 (`Z`)

- **组件版本号**：
  - 当组件发生不兼容变更时，更新主版本号 (`X`)
  - 当组件添加新功能时，更新次版本号 (`Y`)
  - 当组件修复 bug 时，更新修订号 (`Z`)

#### 2. 版本号管理流程

1. **更新版本配置**：
   - 修改 `src/utils/version-config.js` 文件中的版本号
   - 整体库版本：`libraryVersion`
   - 组件版本：`componentVersions` 对象

2. **构建和发布**：
   ```bash
   # 构建组件库
   yarn build
   
   # 更新 package.json 中的版本号
   # 发布到 npm
   npm publish
   ```

#### 3. 版本号使用建议

- 在组件使用时，建议指定版本号，确保组件行为的一致性
- 在进行版本升级时，仔细检查 API 变更，避免破坏性更新
- 使用版本管理工具函数进行版本兼容性检查

### 版本配置文件

版本号集中管理在 `src/utils/version-config.js` 文件中：

```javascript
// 整体库版本号
export const libraryVersion = '1.0.0';

// 组件版本号
export const componentVersions = {
  Button: '1.0.0',
  // 后续添加的组件版本号将在此处配置
};
```

添加新组件时，需要在 `componentVersions` 对象中添加对应的版本号，并在组件实现中引用该版本号：

```javascript
// src/components/NewComponent/index.js
import { componentVersions } from '../../utils/version-config';

const NewComponent = ({ version, ...props }) => {
  // 组件实现...
};

NewComponent.version = componentVersions.NewComponent;

export default NewComponent;
```

