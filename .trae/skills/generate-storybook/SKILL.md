---
name: "generate-smart-stories"
description: "通过分析组件源码，自动生成或更新 Storybook 7.x 演示文档。当用户要求“写 Story”或“更新文档”时调用。"
---

# Skill: Smart Stories Generator

## 执行触发点
- 用户要求为现有组件编写 Storybook、添加文档或更新组件属性展示。

## 技能逻辑：先嗅探，后生成
1. **源码分析**: 读取目标组件的 `index.jsx`，提取 `propTypes` 和解构出的 `props`。
2. **属性映射**: 
   - **枚举值**: 存在 `size`, `type` 等属性时映射为 `select` 或 `inline-radio`。
   - **布尔值**: 存在 `loading`, `disabled` 等时映射为 `boolean` 开关。
   - **回调函数**: 以 `on` 开头的属性映射为 `action` 记录器。
   - **文本**: `children`, `title` 等映射为 `text` 输入框。
3. **文档注入**:
   - 必须包含 `tags: ['autodocs']`。
   - 在 `parameters.docs.description.component` 中动态注入组件版本号。

## 约束
- 严禁生成组件源码中不存在的属性控制项（禁止冗余）。
- 必须使用 CSF 3.0 纯 JavaScript 格式编写。