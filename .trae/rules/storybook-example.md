---
alwaysApply: false
description: 为组件创建或更新 Storybook 演示时，必须执行“先嗅探，后生成”的策略，确保文档与组件实际 Props 完全对齐。
---
# tt-design Storybook 生成规约 (Smart Stories Generator)

当你需要为组件创建或更新 Storybook 演示时，必须执行“先嗅探，后生成”的策略，确保文档与组件实际 Props 完全对齐。

## 1. 属性嗅探协议 (Prop Inspection)
在编写 `argTypes` 之前，你必须读取组件的 `index.jsx` 并分析其逻辑：
- **按需生成**：仅当组件中确实定义或使用了某个 Prop 时，才在 Story 中添加对应的 Control。
- **禁止冗余**：如果组件没有 `size` 或 `type` 属性，严禁在 Story 中出现相关的配置项。
- **自动推断**: 优先根据 `propTypes` 的定义推断 `control` 类型。

---

## 2. 智能属性映射表 (Smart Mapping)
根据组件实际拥有的属性，自动匹配最适合的 Storybook 7.x 控件：

| 属性特征 (Prop) | 匹配条件 | 控制类型 (Control) | 备注 |
| :--- | :--- | :--- | :--- |
| **枚举值** | 存在如 `size`, `type`, `placement` | `select` 或 `inline-radio` | 需列出组件支持的所有选项 |
| **布尔值** | 存在如 `loading`, `disabled`, `danger` | `boolean` | 渲染为开关 (Switch) |
| **文本内容** | 存在 `children`, `title`, `label` | `text` | 渲染为输入框 |
| **数字/范围** | 存在 `count`, `percent`, `min`, `max` | `number` 或 `range` | 渲染为数字框或滑块 |
| **回调函数** | 以 `on` 开头的属性 (如 `onClick`) | `action` | 在 Storybook Actions 面板记录日志 |

---

## 3. CSF 3.0 编写标准 (纯 JS)
- **文件命名**: `{ComponentName}.stories.jsx`。
- **自动文档**: 必须包含 `tags: ['autodocs']` 启用自动文档页。
- **版本展示**: 必须在 `parameters.docs.description.component` 中动态注入 `${[ComponentName].version}`。

---

## 4. 差异化模板示例

### 场景 A：标准原子组件 (有 size/type，如 Button)
```javascript
export default {
  title: '通用/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['primary', 'default', 'dashed', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'middle', 'large'] },
    version: { control: false } // 禁用版本手动调节
  }
};