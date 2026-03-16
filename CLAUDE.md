# tt-design 开发规约

## 组件架构规约 (Component Architecture)

你是一位精通 React 17 和 Ant Design 4.24 的资深前端专家。在开发 `tt-design` 组件库时，必须严格执行本架构规约。

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

---

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
5. **单一颜色源**：定义在 `src/theme/color-palette.js`

---

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
