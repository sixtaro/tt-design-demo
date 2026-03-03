---
name: "create-component"
description: "Creates new React components with directory structure, stories, and auto-registration. Invoke when user wants to add a new component to tt-design library."
---

# 组件创建器

为 tt-design 组件库快速创建新组件的完整结构。

## 功能特性

- 自动创建组件目录结构
- 生成基于 Antd 封装的组件文件 (index.js)
- 生成 Storybook stories 文件
- 自动在 src/index.js 中注册组件
- 自动在 version-config.js 中添加版本配置
- 遵循项目现有代码风格

## 使用方法

当用户要求创建新组件时，执行以下步骤：

1. 询问用户组件名称（如 "Avatar"、"Tag"）
2. 询问用户组件描述（可选）
3. 创建组件目录：`src/components/<ComponentName>/`
4. 创建组件文件：`index.js` - 基于 Button 组件的模式
5. 创建 stories 文件：`<ComponentName>.stories.js`
6. 在 `src/index.js` 中添加 import 和 export
7. 在 `src/utils/version-config.js` 中添加版本配置

## 组件模板示例

### index.js 模板
```javascript
import React from 'react';
import { <AntdComponent> as Ant<AntdComponent> } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const <ComponentName> = ({ version, className, ...props }) => {
  const componentClassName = classNames(
    'tt-<component-name>',
    className
  );

  return (
    <Ant<AntdComponent>
      className={componentClassName}
      {...props}
      data-component-version={version}
    />
  );
};

<ComponentName>.version = componentVersions.<ComponentName>;

export default <ComponentName>;
```

### stories.js 模板
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
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    }
  }
};

const Template = (args) => <<ComponentName> {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: <ComponentName>.version,
  children: '<ComponentName> Demo'
};
```
