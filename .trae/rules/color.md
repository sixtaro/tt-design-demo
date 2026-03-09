---
alwaysApply: false
description: 所有组件的文本样式必须严格遵循本规范，禁止随意设置字号、行高和颜色。
---
# tt-design 色彩规范 (Color Truth)

## 强制颜色变量表
严禁硬编码十六进制颜色，必须引用以下语义变量：

| 变量名 | 十六进制 | 适用场景 |
| :--- | :--- | :--- |
| `@tt-title-main` | `#081126` | 主标题、一级列表、加粗 |
| `@tt-link` | `#3388FF` | 链接、品牌操作色 |
| `@tt-text-main` | `#223355` | 正文、基础描述 |
| `@tt-text-secondary` | `#6B7A99` | 辅助、次级、高级文字 |
| `@tt-status-error` | `#FF4433` | 报错、删除、危险 |
| `@tt-status-warning` | `#FFAD14` | 警告、待定 |
| `@tt-status-success` | `#5CE0B6` | 成功、在线、审核通过 |

## 样式规则
- 编写 Less 时，必须在首行 `@import "../../style/themes/default.less";`。
- 类名必须以 `tt-` 为前缀。