---
name: "generate-stories"
description: "Generates or updates Storybook stories for existing components. Invoke when user wants to create stories for a component or update existing ones."
---

# Stories 生成器

为 tt-design 组件库生成或更新 Storybook stories 文件。

## 功能特性

- 为现有组件生成 stories 文件
- 分析组件 props 并生成相应的 argTypes
- 生成常用的 story 示例（Default、Primary 等）
- 保持与项目现有 stories 风格一致
- 支持更新已有 stories 文件

## 使用方法

当用户要求生成或更新 stories 时：

1. 询问用户组件名称
2. 读取组件的 index.js 文件分析结构
3. 读取项目中其他组件的 stories 作为参考
4. 生成或更新 `<ComponentName>.stories.js` 文件

## Stories 文件结构

参考 Button.stories.js 的结构：

```javascript
import React from 'react';
import <ComponentName> from './index';

export default {
  title: '通用/<ComponentName>',
  component: <ComponentName>,
  parameters: {
    docs: {
      description: {
        component: `<ComponentName> 组件 - 版本: ${<ComponentName>.version}`
      }
    }
  },
  argTypes: {
    // 根据组件 props 生成
    version: {
      control: 'text',
      description: '组件版本号'
    }
  }
};

const Template = (args) => <<ComponentName> {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: <ComponentName>.version,
  children: 'Default'
};
```

## 常见的 argTypes

- **type**: select 控制（primary, default, dashed, danger, link）
- **size**: select 控制（small, middle, large）
- **children**: text 控制
- **onClick**: action 控制
- **version**: text 控制
