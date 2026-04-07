# DatePicker 快捷操作交互修复设计

## 背景

`DatePicker` 已支持左侧快捷操作区，相关实现位于 `src/components/DatePicker/index.js`，案例位于 `src/components/DatePicker/DatePicker.stories.js`。

当前问题出现在“快捷操作”案例：点击左侧快捷项时，下拉弹层会直接关闭，且对应日期没有按预期选中。用户确认的目标行为是：

- 点击左侧快捷项后，弹层保持打开
- 对应日期立即选中
- 左侧快捷项高亮状态同步更新

本次工作是一个**交互 bugfix**，不是新增 API。

## 现状与根因判断

现有实现已经具备以下能力：

- `showQuickActions` / `quickActions` 控制快捷项展示
- 点击快捷项时通过 `handleQuickActionClick` 触发 `handleChange`
- 通过 `quickActionPendingRef` 尝试拦截 `onOpenChange(false)`

但从交互现象与现有代码判断，问题更可能发生在 **`mousedown` 导致的焦点切换/失焦关闭** 阶段，而不是 `click` 之后：

1. 用户按下快捷项按钮
2. 焦点先从触发输入框或弹层上下文移走
3. Ant Design / rc-trigger 先执行关闭逻辑
4. 后续 `click` / `onChange` 无法稳定完成

因此，单纯在 `onOpenChange(false)` 中兜底拦截关闭，时机偏后，不足以完全覆盖真实浏览器交互。

## 修复目标

本次修复只解决以下行为：

1. 点击左侧“昨天 / 今天 / 明天”等快捷项时，弹层不关闭
2. 点击后立即触发日期选中
3. 当前值命中快捷项时，左侧 active 状态正确更新
4. 保持现有自定义 `quickActions`、`disabledDate`、`panelRender` 兼容行为
5. 不扩散到 `RangePicker`、`WeekPicker`、`MonthPicker`、`YearPicker` 等非目标场景

## 方案对比

### 方案 A：在 `mousedown` 阶段提前阻止失焦关闭（推荐）

做法：

- 在快捷项按钮上增加 `onMouseDown` 处理
- 在该阶段阻止导致弹层关闭的焦点切换
- 保留现有 `onClick -> handleQuickActionClick -> handleChange` 链路
- 继续保留当前 `quickActionPendingRef` 作为 `onOpenChange(false)` 的兜底保护

优点：

- 命中真实根因，修复时机更早
- 改动小，局部且可控
- 不需要重写整个 popup/open 管理逻辑

缺点：

- 需要小心处理按钮交互，避免破坏现有点击行为

### 方案 B：继续强化 `onOpenChange(false)` 拦截

做法：

- 扩大 `quickActionPendingRef` 的覆盖范围
- 继续从 `onOpenChange(false)` 层面阻止关闭

缺点：

- 关闭如果已经发生在 `mousedown` 阶段，该方案仍然偏晚
- 容易变成持续打补丁，稳定性不足

### 方案 C：把快捷操作场景改成完全受控弹层

做法：

- 对快捷操作场景全面接管 `open` 与交互关闭逻辑
- 由组件自己决定何时关闭或保持打开

缺点：

- 改动大
- 会放大与 AntD 原生行为的耦合风险
- 对当前 bugfix 来说属于过度设计

## 推荐方案

采用**方案 A**：在快捷项按钮的 `mousedown` 阶段提前阻止失焦关闭，再沿用现有点击选中逻辑完成日期更新。

这能以最小改动修复当前真实问题，并保留现有组件结构与大部分交互实现。

## 详细设计

### 交互行为

点击左侧快捷项后，行为应为：

1. 弹层保持打开
2. 目标日期立即写入当前值
3. 触发 `onChange(date, dateString)`
4. 右侧日历高亮对应日期
5. 左侧快捷项高亮同步切换到当前点击项

### 代码改动范围

本次改动集中在以下文件：

- `src/components/DatePicker/index.js`
- `src/components/DatePicker/index.test.js`

如 story 仅作为复现入口且无需额外展示调整，则不改 `DatePicker.stories.js`。

### `src/components/DatePicker/index.js`

保持现有结构不变，只做最小修复：

1. 在 `QuickActionPanel` 中为快捷项按钮增加 `onMouseDown` 处理
2. 在 `mousedown` 阶段提前阻止导致弹层关闭的默认失焦流程
3. 继续在 `onClick` 中调用 `onActionClick(action)`
4. 保留 `quickActionPendingRef` 兜底逻辑，避免 AntD 后续仍派发 `onOpenChange(false)` 时把弹层关掉

### 受影响边界

修复后应继续满足：

- `disabledDate` 命中的快捷项不可触发变更
- 非 `date` picker 不展示快捷项
- 外部自定义 `panelRender` 仍能与快捷区共存
- 受控 / 非受控 value 逻辑维持现有行为

## 测试设计

遵循先补失败用例再修复：

1. 在 `src/components/DatePicker/index.test.js` 增加一个更贴近真实问题的失败测试
2. 测试点至少覆盖：
   - 点击快捷项后 `onChange` 被触发
   - 弹层没有关闭
   - 当前快捷项仍可在界面中找到
3. 如有必要，补一个受控打开场景测试，验证不会向外冒出错误的 `onOpenChange(false)`

测试通过后，说明修复既覆盖用户反馈，也防止后续回归。

## 验收标准

满足以下条件即可视为完成：

1. Storybook 的“快捷操作”案例中，点击左侧快捷项不会关闭弹层
2. 点击后日期立即选中
3. 左侧 active 状态正确更新
4. 现有快捷操作相关测试全部通过
5. 新增回归测试能稳定覆盖这次问题

## 范围控制

本次仅修复左侧快捷操作点击导致的关闭与未选中问题，不包含：

- 新增快捷项 API
- 重构 DatePicker 整体 open 管理
- 给其他 picker 类型扩展快捷区
- 调整视觉样式或重新设计快捷区布局

## 风险与应对

### 风险 1：`mousedown` 拦截后影响按钮点击

应对：

- 只阻止导致失焦关闭的默认行为，不改按钮点击主链路
- 用测试验证 `onChange` 仍正常触发

### 风险 2：受控打开场景仍被外部状态关掉

应对：

- 保留当前 `quickActionPendingRef` 作为关闭兜底
- 用受控场景测试覆盖 `onOpenChange(false)` 不应错误触发

### 风险 3：修复影响非快捷区行为

应对：

- 改动限定在 `QuickActionPanel` 内部按钮交互
- 不修改非快捷区 DatePicker 的默认分支
