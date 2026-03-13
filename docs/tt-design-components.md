
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
import { 
  SearchOutlined, 
  HeartOutlined, 
  StarOutlined, 
  SettingOutlined,
  LoadingOutlined
} from '@ant-design/icons';

<Icon component={SearchOutlined} />
<Icon component={HeartOutlined} />
<Icon component={StarOutlined} />
<Icon component={SettingOutlined} />
```

##### 使用 Iconfont

```jsx
import { Icon } from 'tt-design';

<Icon iconfont="iconfont icon-search" />
<Icon iconfont="iconfont icon-home" />
<Icon iconfont="iconfont icon-user" />
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
<Icon component={SettingOutlined} size="large" rotate={270} />
```

#### 组合使用

```jsx
import { Button } from 'tt-design';
import { SearchOutlined } from '@ant-design/icons';

<Button type="primary">
  <Icon component={SearchOutlined} /> 搜索
</Button>
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

## 主题使用

tt-design 支持多种主题切换，包括极客蓝、薄暮红、薄荷绿、霓虹蓝、日暮橙、酱紫、明青等。

### 使用 ThemeProvider 组件

推荐使用 `ThemeProvider` 组件来包裹你的应用，这样所有组件都会自动应用主题色：

```jsx
import { ThemeProvider, Button, Dropdown } from 'tt-design';
import { presetThemes } from 'tt-design/theme';

function App() {
  return (
    <ThemeProvider theme={presetThemes.mintGreen}>
      <Button type="primary">主要按钮</Button>
      <Dropdown>
        {/* Dropdown 的下拉菜单也会正确应用主题色 */}
      </Dropdown>
    </ThemeProvider>
  );
}
```

### 直接使用 applyTheme 函数

如果你需要更灵活的主题切换方式，可以直接使用 `applyTheme` 函数：

```jsx
import { applyTheme } from 'tt-design';

// 使用预设主题名称
applyTheme('mintGreen');

// 或者使用主题对象
import { presetThemes } from 'tt-design/theme';
applyTheme(presetThemes.dustRed);
```

### 可用的预设主题

| 主题名称 | 中文名称 |
| --- | --- |
| `geekBlue` | 极客蓝 |
| `dustRed` | 薄暮红 |
| `mintGreen` | 薄荷绿 |
| `neonBlue` | 霓虹蓝 |
| `sunsetOrange` | 日暮橙 |
| `goldenPurple` | 酱紫 |
| `cyan` | 明青 |

### 动态切换主题

```jsx
import { useState } from 'react';
import { ThemeProvider, Button } from 'tt-design';
import { presetThemes } from 'tt-design/theme';

function ThemeSwitcher() {
  const [theme, setTheme] = useState(presetThemes.geekBlue);

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={() => setTheme(presetThemes.mintGreen)}>
        切换到薄荷绿
      </Button>
      <Button onClick={() => setTheme(presetThemes.dustRed)}>
        切换到薄暮红
      </Button>
    </ThemeProvider>
  );
}
```

### 主题 API

| 函数/组件 | 说明 | 参数 |
| --- | --- | --- |
| `ThemeProvider` | 主题提供者组件 | `theme`: 主题名称或主题对象 |
| `applyTheme` | 应用主题函数 | `themeNameOrConfig`: 主题名称或主题对象 |
| `getTheme` | 获取主题配置 | `themeName`: 主题名称 |
| `presetThemes` | 预设主题对象 | - |

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

