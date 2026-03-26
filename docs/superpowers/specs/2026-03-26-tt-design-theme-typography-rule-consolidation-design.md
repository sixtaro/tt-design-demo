# tt-design 颜色与字体规范收口设计

## 背景
当前仓库中与颜色、字体、字号、行高相关的信息分散在多个位置：
- `CLAUDE.md` 中有开发规则
- `other.md` 中也有一份近似的补充规范
- `src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less` 中有真实实现

这导致“规则入口”和“实现入口”并不完全一致。对于新增组件或调整样式的人来说，容易出现以下问题：
- 不确定应该以 `CLAUDE.md` 还是 `other.md` 为准
- 知道要用主题变量，但不知道颜色和字体变量的实际文件落点
- 后续继续维护时，规则可能再次分叉

因此需要把颜色与字体规范收口为一套清晰、单一、可执行的结构。

## 目标
- 让 `CLAUDE.md` 成为颜色与字体规范的唯一活跃规则入口
- 让 `other.md` 退出活跃规则角色，避免双源维护
- 明确规则层与实现层的职责边界
- 不改动现有主题实现机制，不扩大本次改动范围

## 现状梳理

### 规则层现状
`CLAUDE.md` 已经包含以下规则：
- 颜色必须使用 CSS 变量 `var(--tt-*)`
- 禁止硬编码十六进制颜色
- 禁止使用 `!important`
- 字号/行高使用 `@font-size-*` / `@line-height-*`
- 字体颜色使用 `var(--tt-text-*)`

`other.md` 中又重复表达了近似约束，并附带了色彩和排版说明，因此目前存在两份规则来源。

### 实现层现状
实际主题和样式变量已经有明确文件承载：
- `src/theme/color-palette.js`
  - 维护原始调色板与默认语义色
- `src/style/color.less`
  - 由调色板生成 less 颜色别名与 `:root` 下的 CSS 自定义属性
- `src/style/themes/default.less`
  - 引入 `color.less`，维护字号、行高、字重等 less 变量
- `src/theme/index.js`
  - 负责运行时主题配置和 CSS 变量应用

也就是说，真实实现已经存在，问题主要不在“缺实现”，而在“规范入口不够单一”。

## 方案对比

### 方案 A：`CLAUDE.md` 作为唯一活跃规则源（推荐）

#### 做法
- 继续把颜色与字体规范放在 `CLAUDE.md`
- 在相关段落中明确指向真实实现文件：
  - `src/theme/color-palette.js`
  - `src/style/color.less`
  - `src/style/themes/default.less`
- 将 `other.md` 改成归档说明，标明其内容已收口到 `CLAUDE.md` 与主题文件

#### 优点
- 规则入口单一，减少歧义
- 贴合当前仓库“`CLAUDE.md` 放长期稳定规则”的边界
- 不需要维护第二份活跃规范文档

#### 缺点
- `CLAUDE.md` 内容会略长
- 需要控制文案，避免把实现细节整段复制进去

### 方案 B：保留 `other.md` 为详细规范，`CLAUDE.md` 只做跳转

#### 做法
- `CLAUDE.md` 中只保留简短规则
- 将颜色与字体的详细规范继续保留在 `other.md`
- 把 `other.md` 当作详细附录维护

#### 优点
- 文档分层更轻
- `CLAUDE.md` 更短

#### 缺点
- 活跃规则入口变成双文件
- 实际执行时更容易只读 `CLAUDE.md` 而忽略 `other.md`
- 与“长期稳定规则放 `CLAUDE.md`”的边界不完全一致

## 最终方案
采用 **方案 A：`CLAUDE.md` 作为唯一活跃规则源，`other.md` 退役归档**。

### 设计决策 1：颜色与字体规范只保留一个规则入口
后续新增组件、调整样式或审核代码时，规则层只看 `CLAUDE.md`。

#### 规则表达应明确到以下层级
- 颜色使用：必须优先使用 `var(--tt-*)`
- 颜色来源：不得在组件内新增硬编码十六进制颜色
- 字号/行高：必须使用 `@font-size-*` / `@line-height-*`
- 字重：使用 `@font-weight-*`
- 禁止 `!important`

### 设计决策 2：明确“规则层 → 实现层”的映射关系
为了避免规范只是口号，需要在规则中明确真实实现文件：
- 颜色单一来源：`src/theme/color-palette.js`
- CSS 变量输出：`src/style/color.less`
- 字号 / 行高 / 字重变量：`src/style/themes/default.less`
- 运行时主题应用：`src/theme/index.js`

这样新增组件时，可以快速判断：
- 需要颜色变量时看 `var(--tt-*)`
- 需要字号/行高变量时看 `default.less`
- 需要找颜色定义源头时看 `color-palette.js`

### 设计决策 3：`other.md` 不再作为活跃规范源
`other.md` 不再承载需要持续维护的规则内容，而只保留简短归档说明，例如：
- 颜色与字体规范已统一收口到 `CLAUDE.md`
- 主题实现见 `src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`

其目标不是继续参与规则维护，而是防止旧入口造成混淆。

## 文件职责

### `CLAUDE.md`
- 承载长期稳定的仓库级规则
- 说明颜色和字体的使用要求
- 指向真实实现文件，但不复制完整变量表

### `src/theme/color-palette.js`
- 承载原始调色板
- 承载默认语义色配置
- 是颜色值的单一来源

### `src/style/color.less`
- 承载 less 色值别名
- 承载 `:root` 下的 CSS 自定义属性
- 是运行时 CSS 颜色变量的直接输出层

### `src/style/themes/default.less`
- 承载字号、行高、字重等 less 变量
- 提供组件样式引用入口

### `other.md`
- 仅保留归档说明
- 不再作为活跃规范源

## 最小实施范围
本次只做规则收口，不扩展为样式体系重构。

### 包含
- 更新 `CLAUDE.md` 中颜色与字体规范的说明，使其与真实实现文件关系更明确
- 将 `other.md` 改为归档说明，终止双源维护

### 不包含
- 不重构 `src/theme/color-palette.js`
- 不重构 `src/style/color.less`
- 不重构 `src/style/themes/default.less`
- 不做全仓历史组件的硬编码颜色清理
- 不调整 `src/theme/index.js` 的运行时主题逻辑

## 验收标准
完成后应满足以下状态：
- 开发者不需要同时查看 `CLAUDE.md` 和 `other.md` 才能知道颜色与字体规范
- `CLAUDE.md` 能明确回答：
  - 颜色怎么用
  - 字号/行高怎么用
  - 对应变量在哪个文件维护
- `other.md` 不再表现为第二份活跃规则文档
- 主题实现文件保持原职责不变，没有发生额外重构

## 风险与约束
- 如果 `CLAUDE.md` 文案写得过重，可能重复实现细节，因此应只描述规则和文件映射，不复制完整变量定义
- 如果 `other.md` 仍保留大量规则正文，后续仍可能被误认为活跃规范源，因此应明确退役
- 当前仓库里可能仍存在历史样式写法，但本次不负责统一清理，只负责规则入口收口

## 最终结论
本次采用以下收口策略：
- 颜色与字体规范以 `CLAUDE.md` 为唯一活跃规则入口
- `other.md` 退役为归档说明，不再参与规则维护
- 颜色、字体、主题变量的真实实现继续分别由 `src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less` 承担
- 本次不扩展为主题系统重构，只解决“规范入口分散”的问题

该方案在维护成本、执行清晰度和与现有仓库边界的一致性之间最平衡，适合作为当前仓库颜色与字体规范的收口方式。
