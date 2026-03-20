---
alwaysApply: false
description: 严禁对代码进行任何 HTML 实体转义，特别是 & 符号。代码必须保持原样。
---
# 代码转义禁止规则

## 核心要求
- **严禁 HTML 实体转义**：不允许将 `&` 转义为 `&amp;`，不允许将 `<` 转义为 `&lt;`，不允许将 `>` 转义为 `&gt;`
- **保持代码原样**：写入文件的代码必须与编辑时的代码完全一致
- **使用 Write 工具**：当需要对文件进行较大修改时，优先使用 Write 工具重写整个文件，而不是多次使用 SearchReplace 工具

## LESS 文件特殊要求
- `&` 符号必须保持原样，不能转义
- 嵌套选择器中的 `&` 必须正确使用

## 示例
### ❌ 错误示例
```less
&amp;.ant-select-focused:not(.ant-select-disabled) .ant-select-selector {
  border-color: var(--tt-color-primary-6);
}
```

### ✅ 正确示例
```less
&amp;.ant-select-focused:not(.ant-select-disabled) .ant-select-selector {
  border-color: var(--tt-color-primary-6);
}
```

## 检查清单
在写入文件前，请确认：
1. 所有 `&` 符号都是原样的，没有变成 `&amp;`
2. 所有 `<` 和 `>` 符号都是原样的
3. LESS 文件中的嵌套选择器语法正确
