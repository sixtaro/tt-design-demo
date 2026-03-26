---
name: tt-design-routing
description: 当收到 tt-design 仓库相关任务，但还需要先判断应进入哪个专项 skill 时使用。
---

# tt-design-routing

## 概述
这是 tt-design 项目技能的轻量入口，只负责按场景把请求路由到对应专项 skill。

## 场景映射
- 新增基础组件 / 业务组件 / 先补封装缺失组件 → `tt-design-create-component`
- 为已有组件新增或更新 `*.stories.js` → `tt-design-generate-storybook`
- 新增公开组件或修改公共 API / 对外行为 → `tt-design-manage-version`
- 在 Storybook 或本地服务里验证组件 / story 表现 → `tt-design-webapp-testing`
- 用户明确要求生成组件文档 → `tt-design-generate-docs`

## 使用要求
- 命中场景后，必须继续调用对应的 `tt-design-xxx` 专项 skill。
- 如果一个请求同时涉及多个场景，先进入主技能，再按需要补充调用次级技能。

## 边界说明
- 不替代 `CLAUDE.md`
- 不重复各专项 skill 的完整流程
- 不承载仓库长期规则
