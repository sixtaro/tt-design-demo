---
name: tt-design-webapp-testing
description: 当需要在 Storybook 或本地开发服务中验证变更后的 tt-design 组件或案例表现时使用。
---

# tt-design-webapp-testing

## 适用场景
- 对改动后的 story 做冒烟验证
- 检查某个 UI 问题是否可复现
- 在宣告完成前，验证渲染结果和明显交互

## 快速参考
- 优先使用 `yarn storybook`，端口为 `6006`
- 先读取目标组件和对应的 `*.stories.js`
- 优先验证最近的现有 story，而不是临时搭页面
- 重点检查渲染、controls、docs 文案，以及相关版本文案
- 如果没有浏览器自动化能力，就停在服务成功启动 + 代码级验证

## 常见错误
- 不走 Storybook，而是单独验证临时页面
- 验证的 stories 里直接用了原始 `antd`
