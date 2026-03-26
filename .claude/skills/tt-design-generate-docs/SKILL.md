---
name: tt-design-generate-docs
description: 当用户明确要求为 tt-design 的单个组件、多个组件或整套组件库生成文档时使用。
---

# tt-design-generate-docs

## 适用场景
- 为单个组件生成文档
- 为多个组件生成文档
- 生成组件库概览或组件目录

不要主动生成文档，只有用户明确提出时才执行。

## 输入来源
- 组件源码：`index.js`、`index.less`
- 案例文件：`*.stories.js`
- 版本信息：`src/utils/version-config.js`
- 导出入口：`src/components/index.js`、`src/business/index.js`、`src/index.js`
- 仓库规则：`CLAUDE.md`

## 输出规则
- 不要臆造 props、默认值、示例或分类
- 除非用户另有要求，优先使用中文说明、英文文件名
- 代码块保持原始内容，不要对 JSX 或 LESS 做 HTML 转义
- 当组件暴露 `.version` 时，文档中要包含版本信息

## 建议结构
- 单组件：简介、引入、版本、示例、API 表格、注意事项
- 多组件 / 整库：技术栈、基础组件、业务组件、版本、示例、API 表格

## 常见错误
- 用户未要求时主动产出文档
- 靠猜测补全 API 表格
- 示例退回使用原始 `antd`，而不是仓库内组件
