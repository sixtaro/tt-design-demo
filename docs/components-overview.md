# tt-design 组件文档

该文档作为 `tt-design` 组件库的统一文档入口。后续新增组件或优化组件时，统一在本文件中新增或更新对应章节，不再为单个组件分散创建多个独立文档文件，除非用户明确要求拆分。

## 文档维护规则

- 文档位置固定为 `docs/components-overview.md`
- 新增组件时，在本文件中新增对应组件记录
- 优化已有组件时，直接更新本文件中的已有内容
- 文档说明、版本、导出信息应与源码、Storybook、版本配置保持一致
- 若组件暂未从根入口导出，文档中应明确标注，而不是猜测推荐引入方式

## 组件库概览

- 当前共收录 `66` 个组件
- 基础组件：`50` 个
- 业务组件：`16` 个
- 技术基座：`React 17.0.1`、`Ant Design 4.24.8`、`Rollup 2.x`、`Storybook 6.x`

## 引入说明

推荐优先使用根入口引入：

```js
import { Button, DatePicker, PageLayout } from 'tt-design';
```

如果某个组件当前未从根入口导出，本文档会在“推荐引入”列明确标记为“未提供”，这类组件在对外使用前应优先检查导出策略或补齐公共入口。

## 基础组件

| 组件名       | 版本   | 推荐引入                                   | 源码位置                               | 备注                                       |
| ------------ | ------ | ------------------------------------------ | -------------------------------------- | ------------------------------------------ |
| A            | 未配置 | `import { A } from 'tt-design'`            | `src/components/A/index.js`            | 已从基础组件入口和根入口导出               |
| Anchor       | 1.0.0  | `import { Anchor } from 'tt-design'`       | `src/components/Anchor/index.js`       | 已从基础组件入口和根入口导出               |
| BackTop      | 1.0.0  | `import { BackTop } from 'tt-design'`      | `src/components/BackTop/index.js`      | 仅根入口导出                               |
| Breadcrumb   | 1.0.1  | `import { Breadcrumb } from 'tt-design'`   | `src/components/Breadcrumb/index.js`   | 已从基础组件入口和根入口导出               |
| Button       | 1.0.0  | `import { Button } from 'tt-design'`       | `src/components/Button/index.js`       | 已从基础组件入口和根入口导出               |
| Card         | 1.0.0  | `import { Card } from 'tt-design'`         | `src/components/Card/index.js`         | 已从基础组件入口和根入口导出               |
| CardSelect   | 1.0.0  | `import { CardSelect } from 'tt-design'`   | `src/components/CardSelect/index.js`   | 已从基础组件入口和根入口导出               |
| Cascader     | 1.0.0  | `import { Cascader } from 'tt-design'`     | `src/components/Cascader/index.js`     | 已从基础组件入口和根入口导出               |
| Chart        | 1.0.0  | `import { Chart } from 'tt-design'`        | `src/components/Chart/index.js`        | 已从基础组件入口和根入口导出               |
| Checkbox     | 1.0.0  | `import { Checkbox } from 'tt-design'`     | `src/components/Checkbox/index.js`     | 已从基础组件入口和根入口导出               |
| Color        | 1.0.0  | `import { Color } from 'tt-design'`        | `src/components/Color/index.js`        | 仅根入口导出                               |
| ColorPicker  | 1.0.0  | `import { ColorPicker } from 'tt-design'`  | `src/components/ColorPicker/index.js`  | 已从基础组件入口和根入口导出               |
| DatePicker   | 1.0.2  | `import { DatePicker } from 'tt-design'`   | `src/components/DatePicker/index.js`   | 已从基础组件入口和根入口导出               |
| Divider      | 1.0.0  | `import { Divider } from 'tt-design'`      | `src/components/Divider/index.js`      | 已从基础组件入口和根入口导出               |
| Drawer       | 1.0.0  | `import { Drawer } from 'tt-design'`       | `src/components/Drawer/index.js`       | 已从基础组件入口和根入口导出               |
| Dropdown     | 1.0.0  | `import { Dropdown } from 'tt-design'`     | `src/components/Dropdown/index.js`     | 已从基础组件入口和根入口导出               |
| Empty        | 1.0.0  | `import { Empty } from 'tt-design'`        | `src/components/Empty/index.js`        | 已从基础组件入口和根入口导出               |
| FloatButton  | 1.0.0  | `import { FloatButton } from 'tt-design'`  | `src/components/FloatButton/index.js`  | 已从基础组件入口和根入口导出               |
| Font         | 1.0.0  | `import { Font } from 'tt-design'`         | `src/components/Font/index.js`         | 仅根入口导出                               |
| Form         | 1.0.0  | `import { Form } from 'tt-design'`         | `src/components/Form/index.js`         | 已从基础组件入口和根入口导出               |
| Icon         | 1.0.0  | `import { Icon } from 'tt-design'`         | `src/components/Icon/index.js`         | 仅根入口导出                               |
| Input        | 1.0.0  | `import { Input } from 'tt-design'`        | `src/components/Input/index.js`        | 已从基础组件入口和根入口导出               |
| InputNumber  | 1.1.0  | 未提供                                     | `src/components/InputNumber/index.js`  | 已注册到基础组件入口，但当前未从根入口导出 |
| Masonry      | 1.0.0  | `import { Masonry } from 'tt-design'`      | `src/components/Masonry/index.js`      | 已从基础组件入口和根入口导出               |
| Menu         | 1.0.4  | `import { Menu } from 'tt-design'`         | `src/components/Menu/index.js`         | 已从基础组件入口和根入口导出               |
| Message      | 1.0.0  | `import { Message } from 'tt-design'`      | `src/components/Message/index.js`      | 已从基础组件入口和根入口导出               |
| Modal        | 1.0.0  | `import { Modal } from 'tt-design'`        | `src/components/Modal/index.js`        | 已从基础组件入口和根入口导出               |
| Money        | 未配置 | 未提供                                     | `src/components/Money/index.js`        | 已注册到基础组件入口，但当前未从根入口导出 |
| Notification | 1.0.0  | `import { Notification } from 'tt-design'` | `src/components/Notification/index.js` | 已从基础组件入口和根入口导出               |
| Pagination   | 1.0.0  | `import { Pagination } from 'tt-design'`   | `src/components/Pagination/index.js`   | 已从基础组件入口和根入口导出               |
| Plate        | 1.0.0  | `import { Plate } from 'tt-design'`        | `src/components/Plate/index.js`        | 已从基础组件入口和根入口导出               |
| Popover      | 1.0.0  | 未提供                                     | `src/components/Popover/index.js`      | 已注册到基础组件入口，但当前未从根入口导出 |
| QRCode       | 1.0.0  | `import { QRCode } from 'tt-design'`       | `src/components/QRCode/index.js`       | 已从基础组件入口和根入口导出               |
| Radio        | 1.1.0  | `import { Radio } from 'tt-design'`        | `src/components/Radio/index.js`        | 已从基础组件入口和根入口导出               |
| Rate         | 1.0.0  | `import { Rate } from 'tt-design'`         | `src/components/Rate/index.js`         | 已从基础组件入口和根入口导出               |
| Row          | 1.0.0  | `import { Row } from 'tt-design'`          | `src/components/Row/index.js`          | 已从基础组件入口和根入口导出               |
| Select       | 1.1.0  | `import { Select } from 'tt-design'`       | `src/components/Select/index.js`       | 已从基础组件入口和根入口导出               |
| Spin         | 1.0.0  | `import { Spin } from 'tt-design'`         | `src/components/Spin/index.js`         | 已从基础组件入口和根入口导出               |
| Splitter     | 1.0.0  | `import { Splitter } from 'tt-design'`     | `src/components/Splitter/index.js`     | 已从基础组件入口和根入口导出               |
| Statistic    | 1.0.0  | `import { Statistic } from 'tt-design'`    | `src/components/Statistic/index.js`    | 已从基础组件入口和根入口导出               |
| Steps        | 1.0.0  | `import { Steps } from 'tt-design'`        | `src/components/Steps/index.js`        | 已从基础组件入口和根入口导出               |
| Switch       | 1.0.0  | `import { Switch } from 'tt-design'`       | `src/components/Switch/index.js`       | 已从基础组件入口和根入口导出               |
| Table        | 1.0.0  | `import { Table } from 'tt-design'`        | `src/components/Table/index.js`        | 已从基础组件入口和根入口导出               |
| Tabs         | 1.0.0  | `import { Tabs } from 'tt-design'`         | `src/components/Tabs/index.js`         | 已从基础组件入口和根入口导出               |
| TimePicker   | 1.0.0  | `import { TimePicker } from 'tt-design'`   | `src/components/TimePicker/index.js`   | 仅根入口导出                               |
| Tour         | 1.0.0  | `import { Tour } from 'tt-design'`         | `src/components/Tour/index.js`         | 已从基础组件入口和根入口导出               |
| Transfer     | 1.0.0  | `import { Transfer } from 'tt-design'`     | `src/components/Transfer/index.js`     | 已从基础组件入口和根入口导出               |
| TreeSelect   | 1.0.0  | `import { TreeSelect } from 'tt-design'`   | `src/components/TreeSelect/index.js`   | 仅根入口导出                               |
| Upload       | 1.0.0  | `import { Upload } from 'tt-design'`       | `src/components/Upload/index.js`       | 已从基础组件入口和根入口导出               |
| Watermark    | 1.0.0  | `import { Watermark } from 'tt-design'`    | `src/components/Watermark/index.js`    | 已从基础组件入口和根入口导出               |

## 业务组件

| 组件名           | 版本   | 推荐引入                                       | 源码位置                                         | 备注                                     |
| ---------------- | ------ | ---------------------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| BreadcrumbOrg    | 未配置 | 未提供                                         | `src/business/breadcrumbOrg/breadcrumbOrgTag.js` | 已注册到业务组件入口，当前未从根入口导出 |
| CalendarSelect   | 1.0.0  | `import { CalendarSelect } from 'tt-design'`   | `src/business/CalendarSelect/index.js`           | 已从根入口导出                           |
| CarouselArrow    | 1.0.0  | `import { CarouselArrow } from 'tt-design'`    | `src/business/CarouselArrow/index.js`            | 已从根入口导出                           |
| Condition        | 未配置 | 未提供                                         | `src/business/condition/condition.js`            | 已注册到业务组件入口，当前未从根入口导出 |
| DragTable        | 1.0.0  | `import { DragTable } from 'tt-design'`        | `src/business/DragTable/index.js`                | 已从根入口导出                           |
| ExcelImportBtn   | 未配置 | 未提供                                         | `src/business/excelImport/excelImportBtn.js`     | 已注册到业务组件入口，当前未从根入口导出 |
| HourRangeSelect  | 1.0.0  | `import { HourRangeSelect } from 'tt-design'`  | `src/business/HourRangeSelect/index.js`          | 已从根入口导出                           |
| MaskedInput      | 1.0.0  | `import { MaskedInput } from 'tt-design'`      | `src/business/MaskedInput/index.js`              | 已从根入口导出                           |
| PageLayout       | 未配置 | `import { PageLayout } from 'tt-design'`       | `src/business/layout/index.js`                   | 已从根入口导出                           |
| PictureSwiper    | 未配置 | 未提供                                         | `src/business/pictureSwiper/pictureSwiper.js`    | 已注册到业务组件入口，当前未从根入口导出 |
| SecretInput      | 1.0.0  | `import { SecretInput } from 'tt-design'`      | `src/business/SecretInput/index.js`              | 已从根入口导出                           |
| Selector         | 未配置 | `import { Selector } from 'tt-design'`         | `src/business/Selector/index.js`                 | 已从根入口导出                           |
| TelWithCode      | 未配置 | 未提供                                         | `src/business/telWithCode/index.js`              | 已注册到业务组件入口，当前未从根入口导出 |
| VerificationCode | 1.0.0  | `import { VerificationCode } from 'tt-design'` | `src/business/VerificationCode/index.js`         | 已从根入口导出                           |
| CountdownButton  | 未配置 | `import { CountdownButton } from 'tt-design'`  | `src/business/CountdownButton/index.js`          | 已从根入口导出                           |
| TabsPage         | 未配置 | `import { TabsPage } from 'tt-design'`         | `src/business/tabsPage/tabs.js`                  | 已从根入口导出                           |

## 当前需要重点关注的导出与版本项

### 已注册但未从根入口导出

- 基础组件：`InputNumber`、`Money`、`Popover`
- 业务组件：`BreadcrumbOrg`、`Condition`、`ExcelImportBtn`、`PictureSwiper`、`TelWithCode`

这些组件如果要作为公共能力正式对外使用，建议优先检查 [src/index.js](/Volumes/code/tt-design/src/index.js) 是否需要补齐导出。

### 版本尚未配置

- 基础组件：`A`、`Money`
- 业务组件：`BreadcrumbOrg`、`Condition`、`ExcelImportBtn`、`PageLayout`、`PictureSwiper`、`Selector`、`TelWithCode`、`CountdownButton`、`TabsPage`

这些组件当前在元数据中显示为“未配置”，如后续对外发布或增强公共能力，建议同步补齐 [src/utils/version-config.js](/Volumes/code/tt-design/src/utils/version-config.js)。

## 后续更新建议

- 新增基础组件时：先补组件实现、Storybook、版本，再在本文档“基础组件”表中追加一行
- 新增业务组件时：先确认是否需要从根入口导出，再在本文档“业务组件”表中追加一行
- 优化已有组件时：优先更新对应组件的版本、导出状态、备注，不重复新增第二条记录
- 如果后续需要深入到单组件 API、示例和注意事项，可以在本文档后面继续为重点组件追加独立章节

## 重点组件属性说明

以下内容基于当前源码与元数据自动整理，属性名称以实际组件实现为准。若出现 `props`、`restProps` 这类字段，表示组件支持继续透传剩余属性到下层实现。

### Button

- 推荐引入：`import { Button } from 'tt-design'`
- 常用属性：`type`、`size`、`shape`、`disabled`、`danger`、`border`、`className`、`children`
- 默认值：
  - `type: 'default'`
  - `shape: 'default'`
  - `border: true`
- 子能力：
  - `Button.Dropdown`
- 对应案例：
  - `基础用法`
  - `按钮类型`
  - `按钮形状`
  - `按钮尺寸`
  - `图标按钮`
  - `禁用状态`
  - `加载状态`
  - `无框按钮`
  - `多操作按钮`

### Input

- 推荐引入：`import { Input } from 'tt-design'`
- 常用属性：`type`、`placeholder`、`className`
- 子能力：
  - `Input.Password`
  - `Input.TextArea`
  - `Input.Search`
  - `Input.Group`
  - `Input.RichText`
- 对应案例：
  - `基础用法`
  - `带图标的输入框`
  - `带前缀和后缀`
  - `带Addon的输入框`
  - `密码输入框`
  - `文本域`
  - `搜索输入框`
  - `富文本编辑器`

### Select

- 推荐引入：`import { Select } from 'tt-design'`
- 常用属性：`searchable`、`searchPlaceholder`、`showSelectAll`、`value`、`onChange`、`mode`、`options`、`maxTagCount`、`popupClassName`
- 默认值：
  - `searchable: false`
  - `searchPlaceholder: '请输入关键字'`
  - `showSelectAll: false`
- 子能力：
  - `Select.Option`
  - `Select.OptGroup`

### DatePicker

- 推荐引入：`import { DatePicker } from 'tt-design'`
- 常用属性：`placeholder`、`disabled`、`format`、`picker`、`popupClassName`、`showQuickActions`、`quickActions`、`panelRender`
- 默认值：
  - `showToday: false`
- 子能力：
  - `DatePicker.RangePicker`
  - `DatePicker.MonthPicker`
  - `DatePicker.WeekPicker`
  - `DatePicker.YearPicker`
- 对应案例：
  - `基础用法`
  - `不同类型`
  - `状态`
  - `快捷操作`
  - `自定义快捷操作`

### Pagination

- 推荐引入：`import { Pagination } from 'tt-design'`
- 常用属性：`showTotal`、`showSizeChanger`、`showQuickJumper`、`simple`、`disabled`
- 默认值：
  - `showTotal: true`
  - `showSizeChanger: 'always'`
  - `showQuickJumper: true`
- 对应案例：
  - `默认案例`
  - `大量数据`
  - `极简模式`
  - `禁用状态`

### Menu

- 推荐引入：`import { Menu } from 'tt-design'`
- 常用属性：`mode`、`selectedKeys`、`defaultSelectedKeys`、`showIndicator`、`activeStyle`、`pagination`、`pageSize`
- 默认值：
  - `activeStyle: 'filled'`
  - `pageSize: 5`
- 子能力：
  - `Menu.Item`
  - `Menu.SubMenu`
  - `Menu.Group`
  - `Menu.Divider`
- 对应案例：
  - `水平导航`
  - `侧边导航`
  - `内联展开`
  - `分组导航`
  - `折叠导航`
  - `带指示条`

### QRCode

- 推荐引入：`import { QRCode } from 'tt-design'`
- 常用属性：`value`、`size`、`level`、`bgColor`、`fgColor`、`includeMargin`、`renderAs`、`imageSettings`、`title`
- 适用场景：
  - 链接二维码
  - 文本二维码
  - SVG 导出二维码

### Watermark

- 推荐引入：`import { Watermark } from 'tt-design'`
- 常用属性：`content`、`width`、`height`、`rotate`、`gap`、`offset`、`zIndex`、`font`
- 适用场景：
  - 文本水印
  - 多行水印
  - 自定义字体颜色与字号

### Masonry

- 推荐引入：`import { Masonry } from 'tt-design'`
- 常用属性：`items`、`renderItem`、`children`、`columnCount`、`minColumnWidth`、`gap`、`itemKey`
- 适用场景：
  - 信息卡片瀑布流
  - 图片流布局
  - 仪表盘看板

### Statistic

- 推荐引入：`import { Statistic } from 'tt-design'`
- 常用属性：`title`、`value`、`precision`、`prefix`、`suffix`、`loading`、`valueStyle`、`groupSeparator`、`decimalSeparator`、`formatter`
- 子能力：
  - `Statistic.Countdown`
- 对应案例：
  - `基础用法`
  - `带前后缀`
  - `状态趋势`
  - `倒计时`
  - `加载状态`
  - `指标面板`

### Tour

- 推荐引入：`import { Tour } from 'tt-design'`
- 常用属性：`open`、`current`、`steps`、`placement`、`mask`、`gap`、`zIndex`、`onClose`、`onFinish`、`onChange`、`getPopupContainer`
- 默认能力：
  - 支持高亮目标
  - 支持遮罩层
  - 支持上一步、下一步、完成
- 对应案例：
  - `基础用法`
  - `无目标卡片`
  - `自定义封面`

### Steps

- 推荐引入：`import { Steps } from 'tt-design'`
- 版本：`1.0.0`
- 常用属性：`current`、`direction`、`size`、`status`、`labelPlacement`、`className`
- 默认值：
  - `current: 0`
  - `direction: 'horizontal'`
  - `size: 'default'`
  - `labelPlacement: 'horizontal'`
- 子能力：
  - `Steps.Step`（步骤项，支持 `title`、`description`、`icon`、`status` 等属性）
- 步骤状态说明：
  - `wait`（未开始）：灰色圆形节点 + 灰色文字 + 灰色连接线
  - `process`（进行中）：主题色填充节点 + 白色图标/数字 + 主题色文字 + 灰色连接线
  - `finish`（已完成）：主题色边框节点 + 勾选图标 + 主题色文字 + 主题色连接线
  - `error`（出错）：红色边框节点 + 红色图标/文字
- 支持的模式：
  - 水平方向（默认）
  - 垂直方向（`direction="vertical"`）
  - 导航模式（`type="navigation"`）
  - 点状步骤条（`progressDot`）
  - 小尺寸（`size="small"`）
- 基本用法：

```jsx
import { Steps } from 'tt-design';

<Steps current={1}>
  <Steps.Step title="已完成" />
  <Steps.Step title="进行中" />
  <Steps.Step title="未开始" />
  <Steps.Step title="未开始" />
</Steps>;
```

- 带描述与图标：

```jsx
<Steps current={1}>
  <Steps.Step title="填写信息" description="请填写基本信息" />
  <Steps.Step title="实名认证" description="上传身份证件" />
  <Steps.Step title="审核中" description="等待后台审核" />
</Steps>
```

- 对应案例：
  - `基础状态总览`
  - `带描述与图标`
  - `方向与标签位置`
  - `垂直方向`
  - `小尺寸`
  - `导航模式`
  - `点状步骤条`

### Anchor

- 推荐引入：`import { Anchor } from 'tt-design'`
- 版本：`1.0.0`
- 常用属性：`affix`、`bounds`、`getContainer`、`offsetTop`、`showInkInFixed`、`targetOffset`、`onChange`、`onClick`
- 默认值：
  - `affix: true`
  - `bounds: 5`
  - `offsetTop: 0`
  - `showInkInFixed: false`
- 子能力：
  - `Anchor.Link`（锚点链接，支持 `href`、`title`、`target`、`children` 等属性）
- 锚点层级说明：
  - 一级锚点：14px 字号 + 24px 行高 + 7px 圆点 + 8px 间距，选中时 Medium 字重 + 主题色
  - 二级锚点：12px 字号 + 22px 行高 + 7px 圆点 + 16px 间距，选中时主题色
- 基本用法：

```jsx
import { Anchor } from 'tt-design';

<Anchor>
  <Anchor.Link href="#section-1" title="基础用法" />
  <Anchor.Link href="#section-2" title="自定义偏移" />
  <Anchor.Link href="#section-3" title="API 说明" />
</Anchor>;
```

- 带子级锚点：

```jsx
<Anchor>
  <Anchor.Link href="#overview" title="组件概览">
    <Anchor.Link href="#list" title="组件列表" />
    <Anchor.Link href="#version" title="版本信息" />
  </Anchor.Link>
</Anchor>
```

- 对应案例：
  - `基础用法`
  - `带子级锚点`

### Transfer

- 推荐引入：`import { Transfer } from 'tt-design'`
- 版本：`1.0.0`
- 常用属性：`dataSource`、`targetKeys`、`selectedKeys`、`onChange`、`onSelectChange`、`render`、`showSearch`、`filterOption`、`titles`、`operations`、`footer`、`disabled`、`oneWay`、`pagination`、`showSelectAll`、`selectAllLabels`、`status`、`locale`
- 默认值：
  - `dataSource: []`
  - `targetKeys: []`
  - `showSearch: false`
  - `disabled: false`
  - `oneWay: false`
  - `pagination: false`
  - `showSelectAll: true`
  - `locale: { itemUnit: '项', itemsUnit: '项', searchPlaceholder: '请输入关键字', notFoundContent: '暂无数据' }`
- 基本用法：

```jsx
import { Transfer } from 'tt-design';

const mockData = Array.from({ length: 12 }).map((_, i) => ({
  key: `item-${i + 1}`,
  title: `选项 ${i + 1}`,
  description: `描述内容 ${i + 1}`,
}));

const [targetKeys, setTargetKeys] = useState([]);

<Transfer dataSource={mockData} targetKeys={targetKeys} onChange={setTargetKeys} render={item => item.title} version={Transfer.version} />;
```

- 带搜索：

```jsx
<Transfer
  dataSource={mockData}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  render={item => item.title}
  showSearch
  filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
  version={Transfer.version}
/>
```

- 对应案例：
  - `基础用法`
  - `带搜索`
  - `分页模式`
  - `不同状态`
  - `单向穿梭`
  - `自定义标题`
  - `自定义渲染`
  - `自定义底部`
  - `含禁用项`

## 组件属性索引

下表用于快速查找“某个组件当前暴露了哪些属性”，便于后续继续补完整 API 文档。

| 组件名         | 属性索引                                                                                                                                                                                                                                                               | 默认值摘要                                                                                     | 子能力                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Button         | `type`、`size`、`children`、`version`、`className`、`shape`、`disabled`、`danger`、`border`、`props`                                                                                                                                                                   | `type='default'`；`shape='default'`；`border=true`                                             | `Button.Dropdown`                                        |
| Input          | `type`、`placeholder`、`version`、`className`、`props`                                                                                                                                                                                                                 | 无显式默认值                                                                                   | `Password`、`TextArea`、`Search`、`Group`、`RichText`    |
| Select         | `version`、`className`、`searchable`、`searchPlaceholder`、`showSelectAll`、`children`、`value`、`onChange`、`mode`、`popupClassName`、`options`、`maxTagCount`、`onDropdownVisibleChange`、`props`                                                                    | `searchable=false`；`searchPlaceholder='请输入关键字'`；`showSelectAll=false`                  | `Option`、`OptGroup`                                     |
| DatePicker     | `placeholder`、`disabled`、`format`、`version`、`className`、`popupClassName`、`showQuickActions`、`quickActions`、`picker`、`panelRender`、`showToday`、`props`                                                                                                       | `showToday=false`                                                                              | `RangePicker`、`MonthPicker`、`WeekPicker`、`YearPicker` |
| Pagination     | `version`、`className`、`showTotal`、`showSizeChanger`、`showQuickJumper`、`props`                                                                                                                                                                                     | `showTotal=true`；`showSizeChanger='always'`；`showQuickJumper=true`                           | 无                                                       |
| Menu           | `version`、`className`、`showIndicator`、`activeStyle`、`pagination`、`pageSize`、`children`、`mode`、`selectedKeys`、`defaultSelectedKeys`、`props`                                                                                                                   | `activeStyle='filled'`；`pageSize=5`                                                           | `Item`、`SubMenu`、`Group`、`Divider`                    |
| QRCode         | `value`、`size`、`level`、`bgColor`、`fgColor`、`includeMargin`、`renderAs`、`imageSettings`、`className`、`style`、`title`、`version`、`props`                                                                                                                        | 默认值由组件内部提供二维码尺寸和容错等级                                                       | 无                                                       |
| Watermark      | `content`、`width`、`height`、`rotate`、`gap`、`offset`、`zIndex`、`font`、`className`、`style`、`children`、`version`、`props`                                                                                                                                        | 默认值由组件内部提供内容、尺寸、旋转角度和字体配置                                             | 无                                                       |
| Masonry        | `items`、`renderItem`、`children`、`columnCount`、`minColumnWidth`、`gap`、`itemKey`、`className`、`style`、`version`、`props`                                                                                                                                         | 默认值由组件内部提供列宽、间距和 `itemKey`                                                     | 无                                                       |
| Statistic      | `version`、`className`、`title`、`value`、`precision`、`prefix`、`suffix`、`loading`、`valueStyle`、`groupSeparator`、`decimalSeparator`、`formatter`、`props`                                                                                                         | 无显式默认值                                                                                   | `Statistic.Countdown`                                    |
| Tour           | `open`、`defaultOpen`、`current`、`defaultCurrent`、`steps`、`placement`、`mask`、`gap`、`zIndex`、`className`、`style`、`onClose`、`onFinish`、`onChange`、`getPopupContainer`、`scrollIntoViewOptions`、`version`                                                    | 默认值由组件内部提供 `mask`、`gap`、`zIndex` 等                                                | 无                                                       |
| Steps          | `current`、`direction`、`size`、`status`、`labelPlacement`、`className`、`children`、`version`                                                                                                                                                                         | `current=0`；`direction='horizontal'`；`size='default'`；`labelPlacement='horizontal'`         | `Step`                                                   |
| Anchor         | `affix`、`bounds`、`getContainer`、`offsetTop`、`showInkInFixed`、`targetOffset`、`onChange`、`onClick`、`version`、`className`、`children`                                                                                                                            | `affix=true`；`bounds=5`；`offsetTop=0`；`showInkInFixed=false`                                | `Link`                                                   |
| Transfer       | `dataSource`、`targetKeys`、`selectedKeys`、`onChange`、`onSelectChange`、`render`、`showSearch`、`filterOption`、`titles`、`operations`、`footer`、`disabled`、`oneWay`、`pagination`、`showSelectAll`、`selectAllLabels`、`status`、`locale`、`version`、`className` | `showSearch=false`；`disabled=false`；`oneWay=false`；`pagination=false`；`showSelectAll=true` | 无                                                       |
| CalendarSelect | 当前元数据暂未解析出 props                                                                                                                                                                                                                                             | 无                                                                                             | 无                                                       |
| DragTable      | `value`、`onChange`、`tableProps`、`columns`、`rowKey`、`version`、`className`、`restProps`                                                                                                                                                                            | 无                                                                                             | 无                                                       |
| PageLayout     | 当前元数据暂未解析出 props                                                                                                                                                                                                                                             | 无                                                                                             | `PageLayout.ModalLayout`                                 |
| Selector       | 当前元数据暂未解析出 props                                                                                                                                                                                                                                             | 无                                                                                             | 无                                                       |
| CountdownButton| `interval`、`countdownKey`、`buttonText`、`api`、`onSuccess`、`onError`、`onSend`、`type`、`className`、`version`、`restProps`                                                                                                                                     | `interval=60`；`countdownKey='smsTime'`；`buttonText='发送验证码'`                             | 无                                                       |
| TabsPage       | 当前元数据暂未解析出 props                                                                                                                                                                                                                                             | 无                                                                                             | 无                                                       |
