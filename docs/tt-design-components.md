
# tt-design 组件库技术文档

&gt; 基于 React 17.0.1 和 Ant Design 4.24.8 构建

---

## 通用组件

### Button 按钮

#### 组件说明

按钮用于触发一个操作，如提交表单。基于 Ant Design 的 Button 组件封装，支持所有 Ant Design Button 的属性。

#### 版本信息

- 组件版本：1.0.0
- 库版本：1.0.0

#### 基础用法

```jsx
import { Button } from 'tt-design';

<Button type="primary">主要按钮</Button>
<Button>默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="danger">危险按钮</Button>
<Button type="link">链接按钮</Button>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `primary` \| `default` \| `dashed` \| `danger` \| `link` | `default` |
| size | 按钮大小 | `small` \| `middle` \| `large` | `middle` |
| version | 组件版本号，会渲染为 `data-component-version` 属性 | string | - |
| className | 自定义类名 | string | - |
| children | 按钮内容 | ReactNode | - |
| onClick | 点击事件回调 | function | - |

---

### Icon 图标

#### 组件说明

图标组件，支持多种图标使用方式：Ant Design 图标组件、Iconfont、自定义类型。提供统一的尺寸、颜色、旋转和加载动画控制。

#### 版本信息

- 组件版本：1.0.0
- 库版本：1.0.0

#### 基础用法

##### 使用 Ant Design 图标

```jsx
import { Icon } from 'tt-design';
import { SearchOutlined, HeartOutlined } from '@ant-design/icons';

<Icon component={SearchOutlined} />
<Icon component={HeartOutlined} />
```

##### 使用 Iconfont

```jsx
import { Icon } from 'tt-design';

<Icon iconfont="iconfont icon-search" />
```

#### 不同尺寸

```jsx
<Icon component={SearchOutlined} size="small" />
<Icon component={SearchOutlined} size="default" />
<Icon component={SearchOutlined} size="large" />
```

#### 自定义颜色

```jsx
<Icon component={HeartOutlined} size="large" color="#FF4433" />
<Icon component={StarOutlined} size="large" color="#FADB14" />
<Icon component={SearchOutlined} size="large" color="#3388FF" />
<Icon component={SettingOutlined} size="large" color="#5CE0B6" />
```

#### 旋转和加载

```jsx
<Icon component={SettingOutlined} size="large" rotate={90} />
<Icon component={LoadingOutlined} size="large" spin />
<Icon component={SearchOutlined} size="large" rotate={180} />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | Ant Design 图标组件 | elementType | - |
| iconfont | Iconfont 类名 | string | - |
| type | 自定义类型 | string | - |
| size | 尺寸 | `small` \| `default` \| `large` | `default` |
| color | 颜色 | string | - |
| spin | 是否旋转动画 | boolean | false |
| rotate | 旋转角度（度） | number | - |
| className | 自定义类名 | string | - |
| version | 组件版本号，会渲染为 `data-component-version` 属性 | string | - |

---

## 关于本组件库

### 技术栈

- React: 17.0.1
- Ant Design: 4.24.8
- Less: 用于样式编写

### 规范说明

- 所有组件均遵循 `color.md` 和 `font.md` 设计规范
- 类名前缀：`tt-`
- 组件版本号统一通过 `src/utils/version-config.js` 管理

