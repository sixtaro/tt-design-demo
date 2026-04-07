# DatePicker 快捷操作设计

## 背景

需要为 `src/components/DatePicker/index.js` 中封装的单选 `DatePicker` 增加快捷操作能力，在 `picker="date"` 场景下通过 `panelRender` 重写下拉面板外壳，按 Figma 节点 `0:24128` 的视觉结构展示左侧快捷操作区域，并保持右侧 Ant Design 4.24 原生日历面板。

目标是：
- 仅在单选日期选择器生效
- 支持默认快捷项和自定义快捷项
- 点击快捷项后立即选中、触发 `onChange`、关闭下拉
- 当前值命中快捷项时左侧高亮
- 其他 `week/month/quarter/year` 模式保持现状，后续再单独设计

## 约束与上下文

- 技术栈：React 17.0.1 + Ant Design 4.24.8 + Less
- 组件封装规范：纯 JS/JSX，使用 `classnames`，样式走 `tt-` 前缀
- 样式规范：优先使用仓库 CSS 变量，避免硬编码主题色
- 现有 DatePicker 已统一封装 `popupClassName="tt-picker-dropdown"` 并在 `src/components/DatePicker/index.less` 中定义了面板样式
- 用户明确要求：实现方式应基于 `panelRender`
- 用户已确认：
  - 先按当前 Figma 设计稿实现
  - 仅 `date` 单选生效
  - API 同时支持 `showQuickActions` 和 `quickActions`
  - 点击快捷项后立即选中 + 触发 `onChange` + 关闭面板
  - 快捷项高亮与当前值联动
  - `quickActions` 每项最小结构为 `key / label / getValue`
  - `disabled` 时不展示快捷操作面板

## 对外 API 设计

在现有 `DatePicker` 基础上新增以下属性：

### `showQuickActions`

```js
showQuickActions: PropTypes.bool
```

含义：
- 为 `true` 时，在没有显式传入 `quickActions` 的前提下，显示默认快捷项
- 为 `false` 或未传时，不主动显示默认快捷项

### `quickActions`

```js
quickActions: PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    getValue: PropTypes.func.isRequired,
  })
)
```

含义：
- 允许外部传入自定义快捷项
- 每个快捷项最小结构：

```js
{
  key: 'yesterday',
  label: '昨天',
  getValue: () => moment().subtract(1, 'day'),
}
```

### 生效范围

仅在以下条件同时满足时启用快捷面板：
- 使用单选 `DatePicker`
- `picker` 为空或 `picker === 'date'`
- 组件非 `disabled`
- `quickActions?.length > 0` 或 `showQuickActions === true`

以下场景不启用：
- `RangePicker`
- `WeekPicker`
- `MonthPicker`
- `YearPicker`
- `picker="week" | "month" | "quarter" | "year"`
- `disabled === true`

### 优先级规则

1. 若 `quickActions?.length > 0`，渲染外部传入快捷项
2. 否则若 `showQuickActions === true`，渲染默认快捷项
3. 否则保持现有面板不变

### 默认快捷项

默认提供三项：
- 昨天：`moment().subtract(1, 'day')`
- 今天：`moment()`
- 明天：`moment().add(1, 'day')`

## 交互设计

### 面板布局

通过 `panelRender(panelNode)` 包裹原始面板，形成以下结构：

- 左侧：快捷操作列表
- 中间：垂直分割线
- 右侧：Ant Design 原生日历面板（保留原有交互和切换逻辑）

这意味着只重写外壳布局，不重写日历本身。

### 快捷项点击行为

点击快捷项后执行：
1. 调用对应的 `getValue()` 获取目标日期
2. 生成 `dateString`（按当前组件 `format` 或 AntD 默认格式输出）
3. 触发 `onChange(date, dateString)`
4. 同步当前展示值
5. 关闭下拉面板

对于单选日期选择器，关闭后行为应与普通选择日期保持一致。

### 高亮规则

左侧快捷项高亮与当前值联动：
- 当当前 `value`（或 `defaultValue` 驱动下的内部值）与某快捷项 `getValue()` 结果为同一天时，该项高亮
- 采用 `moment(currentValue).isSame(actionValue, 'day')` 判断
- 未命中任何快捷项时，左侧全部为默认态

### disabled 行为

当 `disabled === true` 时：
- 不渲染快捷面板
- 直接保持现有禁用 DatePicker 样式与交互

### 与用户自定义 `panelRender` 的兼容

如果用户同时传入 `panelRender`：
- 先基于 AntD 原始 `panelNode` 调用用户传入的 `panelRender`
- 再将其结果作为右侧日历区域内容，由组件内部继续包裹快捷区外壳

这样可避免覆盖掉用户原有面板定制能力。

## 内部实现设计

## `src/components/DatePicker/index.js`

计划新增以下内部能力：

### 1. 快捷项合并逻辑

新增内部方法，例如：
- `getDefaultQuickActions()`：返回默认快捷项
- `getMergedQuickActions({ showQuickActions, quickActions })`：返回最终渲染项

职责：
- 决定当前应该渲染哪些快捷项
- 统一返回结构化数组

### 2. 快捷区渲染组件

新增内部渲染单元，例如 `QuickActionPanel`，职责：
- 接收快捷项列表
- 接收当前值，用于判断高亮
- 接收点击回调
- 仅负责渲染左侧快捷列表，不承载 DatePicker 逻辑

该渲染单元可放在同文件内部，避免过早拆文件。

### 3. 面板启用判断

新增启用逻辑，例如：
- `const mergedPicker = picker || 'date'`
- `const shouldShowQuickActions = !disabled && mergedPicker === 'date' && mergedQuickActions.length > 0`

### 4. open/value 轻量接管

为支持“点击快捷项后关闭面板”，单选 DatePicker 需要轻量管理面板打开状态：

- 若外部传入 `open`，则仍以外部受控为准
- 若外部未传 `open`，内部维护 `innerOpen`
- 统一通过 `mergedOpen` 与 `handleOpenChange` 传给 `AntDatePicker`

值处理同理：
- 受控模式下使用外部 `value`
- 非受控模式下使用 `innerValue`，并在快捷项点击后更新

该接管只服务于快捷操作场景，其他场景尽量保持现有透传行为。

### 5. `panelRender` 组合

新增内部 `mergedPanelRender(panelNode)`：

1. 若外部提供 `panelRender`，先执行用户逻辑得到 `customPanelNode`
2. 将 `customPanelNode || panelNode` 作为右侧内容
3. 用内部容器包裹成 Figma 对应的左右结构

此方式既满足本次需求，也最大程度兼容已有扩展。

## 样式设计

样式修改放在 `src/components/DatePicker/index.less`。

建议新增类：
- `.tt-picker-panel-with-quick-actions`
- `.tt-picker-quick-actions`
- `.tt-picker-quick-action`
- `.tt-picker-quick-action-active`
- `.tt-picker-quick-actions-divider`

### 视觉目标

按 Figma 节点 `0:24128` 还原：
- 容器白底
- 圆角 4px
- 下拉阴影与现有 dropdown 风格一致
- 左侧栏宽度约 110px
- 左侧快捷项纵向排列，高度 40px，内边距约 8px
- 选中项背景为浅蓝底，文字为主品牌蓝
- 普通项为白底深色文字
- 中间竖分割线使用浅边框色
- 右侧日历面板延续现有主题样式

### 色彩策略

尽量使用现有 token：
- 选中项背景：`var(--tt-color-primary-1)`
- 选中项文字：`var(--tt-color-primary-6)`
- 普通项文字：`var(--tt-color-grey-7)`
- 容器背景：`var(--tt-bg-white)` 或当前可用白色背景变量
- 分割线：`var(--tt-border-color-light)` 或现有等价灰阶变量

若个别视觉值无法完全映射到现有 token，优先选择最接近仓库变量，而不是新增主题硬编码色。

## 数据与事件流

### 默认打开日期面板

1. 用户点击输入框打开面板
2. `AntDatePicker` 渲染原生日历面板
3. 内部 `panelRender` 将其包裹成“左快捷 + 右日历”布局

### 点击快捷项

1. 用户点击左侧快捷项
2. 调用对应 `getValue()` 得到 `moment` 值
3. 更新内部值（若非受控）
4. 调用外部 `onChange`
5. 设置面板关闭（若非外部受控 open）
6. 下次打开时，根据当前值重新计算高亮

### 普通日历选中

1. 用户点击右侧原生日历日期
2. 保持 AntD 默认行为
3. 当前值更新后，若命中某快捷项，下次打开左侧对应项高亮

## 测试设计

仓库当前没有现成组件测试基础设施暴露在脚本中，因此本次测试分两层：

### 1. Storybook 验证

在 `src/components/DatePicker/DatePicker.stories.js` 中新增案例：
- 快捷操作（默认项）
- 快捷操作（自定义项）
- 当前值命中快捷项高亮
- 非 `date` picker 不展示快捷区
- disabled 不展示快捷区

### 2. 单元/行为测试（若仓库已有可用测试能力则接入）

核心断言：
- `showQuickActions` 为真时渲染默认 3 项
- `quickActions` 优先级高于默认快捷项
- `picker !== 'date'` 时不渲染快捷区
- `disabled` 时不渲染快捷区
- 点击快捷项触发 `onChange`
- 点击快捷项后面板关闭
- 当前值命中时高亮状态正确
- 用户自定义 `panelRender` 时仍能组合生效

如果仓库当前不具备稳定的 React 组件测试运行条件，则以 Storybook 可视化验证作为本次验收主路径，并在后续统一补组件测试基础设施。

## 验收标准

满足以下标准即可视为完成：

1. 单选 `DatePicker` 在 `picker="date"` 场景支持快捷操作
2. `showQuickActions` 可展示默认的“昨天 / 今天 / 明天”
3. `quickActions` 可自定义快捷项，并覆盖默认项
4. 快捷区布局与 Figma 基本一致：左栏 + 分割线 + 右侧日历
5. 点击快捷项会立即选中日期、触发 `onChange`、关闭面板
6. 当前值命中快捷项时左侧高亮正确
7. `disabled`、`RangePicker`、`week/month/quarter/year` 保持现有行为
8. 兼容外部自定义 `panelRender`
9. 新增 Storybook 示例可直观看到效果

## 实施范围

本次仅包含：
- `src/components/DatePicker/index.js`
- `src/components/DatePicker/index.less`
- `src/components/DatePicker/DatePicker.stories.js`
- 如有必要，补充版本配置或导出定义中的属性说明

明确不包含：
- Week / Month / Quarter / Year 快捷操作设计
- RangePicker 快捷区设计
- 新的通用日期快捷面板抽象组件
- 对 AntD 原生日历逻辑的重写

## 风险与应对

### 风险 1：`panelRender` 与外部传入冲突

应对：
- 使用组合策略，不直接覆盖用户 `panelRender`

### 风险 2：受控 / 非受控 `open` 与 `value` 状态混用

应对：
- 仅在快捷面板启用时引入轻量合并状态逻辑
- 严格区分受控与非受控分支

### 风险 3：Figma 与现有 token 存在轻微差异

应对：
- 优先复用仓库 token，保证整体组件库一致性
- 在不破坏一致性的前提下尽量贴近设计稿

## 推荐实施顺序

1. 在 Storybook 中先补一个“目标态”案例，便于快速人工比对
2. 在 `index.js` 中完成快捷项数据合并与 `panelRender` 组合
3. 在 `index.less` 中补充快捷区布局与状态样式
4. 验证点击快捷项后的选中、联动与关闭行为
5. 补充自定义 `quickActions` 和边界示例
