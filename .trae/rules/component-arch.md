---
alwaysApply: false
description: 为组件库 `tt-design` 编写组件时，必须严格执行本架构规约。
---
# tt-design 组件架构规约 (Component Architecture)
你是一位精通 React 17 和 Ant Design 4.24 的资深前端专家。在开发 `tt-design` 组件库时，必须严格执行本架构规约。
## 1. 环境与版本锁定 (Environment Lockdown)
* **React 版本**: 严格锁定 **17.0.1**。
* **UI 基座**: 严格锁定 **Ant Design 4.24.8**。
    * **强制联网参考**: 在封装任何组件前，必须先搜索 `Ant Design 4.24 [组件名] props`。
    * **拒绝 5.x 污染**: 严禁参考 AntD 5.x 的 Token 系统或 `items` 数组传参方式（除非 4.24 已支持）。
* **语言**: 纯 **JavaScript (JSX)**。
---
## 2. 组件编写标准 (Coding Standards)

### 2.1 结构与命名
- **导出模式**: 统一使用 `export default ComponentName`。
- **类名规范**: 必须使用 `classnames` 库合并类名，主类名格式为 `tt-[component-name]`。
- **别名引用**: 封装 AntD 时使用 `Ant[Component]` 别名，例如：
  `import { Button as AntButton } from 'antd';`

### 2.2 逻辑范式
- **受控模式**: 组件尽量支持 `value` 和 `onChange` 驱动，并兼容 `defaultValue`。
- **Ref 转发**: 复杂组件必须使用 `React.forwardRef` 暴露底层 DOM 或方法。
- **性能优化**: 针对列表或复杂渲染项，必须使用 `React.memo` 防止 React 17 下的无效重渲染。
### 2.3 参数校验 (PropTypes)
必须引入 `prop-types` 并在组件末尾显式定义，例如：
```javascript
import PropTypes from 'prop-types';
[ComponentName].propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
};