---
name: "generate-component-document"
description: "通过分析组件源码，自动化生成标准技术文档（README.md）。包含组件说明、API 表格、使用示例及版本信息。当用户要求“生成文档”或“输出技术文档”时调用。"
---

# Skill: Component Document Generator

## 1. 执行触发点
- 用户要求为特定组件生成 README 或技术文档。
- 组件逻辑发生重大变更，需要同步更新 API 说明。

## 2. 自动化执行步骤
1. **源码嗅探 (Inspection)**:
   - 读取组件 `index.jsx`，分析其功能定位。
   - 提取 `propTypes` 中的所有属性名、类型及是否必填。
   - 嗅探组件内定义的默认值（`defaultProps`）。
2. **生成文档结构**:
   - **组件名称**: 提取组件名并作为一级标题。
   - **版本信息**: 从 `src/utils/version-config.js` 动态获取当前版本。
   - **基础介绍**: 根据源码注释或功能逻辑简述组件用途。
   - **API 表格**: 自动将嗅探到的 Props 转换为 Markdown 表格（包含：属性、说明、类型、默认值）。
   - **使用示例**: 引用 `*.stories.jsx` 中的基础场景代码。
3. **文件写入**:
   - 在 `src/components/[ComponentName]/` 目录下创建或更新 `README.md`。

## 3. 编写标准 (Documentation Standards)
- **表格一致性**: 必须包含“属性”、“说明”、“类型”、“默认值”四列。
- **视觉变量对齐**: 如果文档涉及色彩说明，必须参考 `color.md` 中的变量名。
- **解耦声明**: 明确标注该组件基于 React 17 和 AntD 4.24 构建。

## 4. 交互逻辑
- 文档生成后，主动询问用户：“API 表格已根据源码自动生成，是否需要我为您润色组件的功能描述部分？”