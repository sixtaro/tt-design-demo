---
alwaysApply: false
description: 所有组件的文本样式必须严格遵循本规范，禁止随意设置字号、行高和颜色。
---
# tt-design 字体与排版规范 (Font Rule)
所有组件的文本样式必须严格遵循本规范，禁止随意设置字号、行高和颜色。
## 1. 字体族 (Font Family)
* **默认字体**: 优先使用“思源黑体”，统计数字优先使用 "HarmonyOS Sans"。
* **平台适配**: 
    - **MacOS**: HarmonyOS Sans (英文/数字), 思源黑体 Regular & Medium (中文)。
    - **Windows**: HarmonyOS Sans (英文/数字), 思源黑体 Regular & Medium (中文)。

## 2. 字阶与行高 (Font Size & Line Height)
组件开发必须使用以下阶梯定义文本样式，确保阅读舒适度。**基准正文字号为 14px，行高 22px**。

| 层级 | 字号 (px) | 行高 (px) | 适用场景 |
| :--- | :--- | :--- | :--- |
| **一级标题** | 32 | 48 | 文章标题 / Banner 文字 |
| **二级标题** | 24 | 36 | 文章标题 / Banner 文字 |
| **三级标题** | 18 | 28 | 系统名称 |
| **四级标题** | 16 | 24 | 分组标题 |
| **正文内容** | 14 | 22 | 正文内容 |
| **次级文字** | 12 | 18 | 说明、补充类文字 |

## 3. 字重 (Font Weight)
中文仅允许使用以下两种字重，严禁随意设置数值：
* **Regular (400)**: 用于常规正文和说明。
* **Medium (500)**: 用于标题或需要强调的文本。
* **Bold (700)**: 仅限英文在特定加粗场景使用。

## 4. 字体颜色 (Font Color)
严禁硬编码颜色，必须引用 `color.md` 中的语义变量：

* **@tt-title-main**: `#081126` (Grey-9) - 主标题。
* **@tt-text-main**: `#223355` (Grey-8) - 正文。
* **@tt-text-secondary**: `#6B7A99` (Grey-7) - 辅助文字、叙述列表表头。
* **@tt-text-placeholder**: `#A8B4C8` (Grey-6) - 预设文字。
* **@tt-link**: `#3388FF` (DB60) - 链接文字。
* **@tt-status-error**: `#FF4433` (Red-6) - 危险提示。
* **@tt-status-warning**: `#FFAD14` (Gold-6) - 警示提示。
* **@tt-status-success**: `#35D4A7` (MintGreen-6) - 成功提示。

## 5. 样式实现要求 (Less)
1. **变量引用**: 编写 Less 时应定义 `@font-size-base: 14px;` 等变量。
2. **继承规则**: 优先通过容器继承字体族设置，不要在每个原子组件中重复声明 `font-family`。
3. **行高计算**: 始终保持行高与字号的比例符合上述表格，以确保最佳显示效果。