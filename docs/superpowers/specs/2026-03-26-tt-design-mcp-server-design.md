# tt-design MCP Server（第一阶段）设计说明

- 日期：2026-03-26
- 状态：已完成需求澄清，待书面评审
- 范围：本设计只覆盖“对外提供 MCP Server”子项目；“在仓库里消费外部 MCP 服务”放到后续阶段单独推进

## 1. 背景

`tt-design` 是一个基于 React 17.0.1 和 Ant Design 4.24.8 的组件库，当前主要通过源码目录、统一导出入口和版本配置来组织组件能力：

- 基础组件统一导出：`src/components/index.js`
- 库主入口：`src/index.js`
- 组件版本配置：`src/utils/version-config.js`

当前仓库没有面向大模型或 IDE Agent 的统一“组件知识服务”层。要让 Claude Code 等 MCP Client 更稳定地理解该组件库，需要提供一个边界清晰、只读、安全的 MCP Server，把组件的 API、样式主题、版本和导出信息从源码中提取出来。

## 2. 目标与已确认决策

### 2.1 第一阶段目标

为 `tt-design` 提供一个本地 `stdio` MCP Server，优先面向 Claude Code 暴露组件检索能力，基于源码静态分析返回以下信息：

- Props / API
- 样式 / 主题信息
- 版本信息
- 导出信息

### 2.2 已确认决策

1. 整体需求拆分为两个子项目：
   - 子项目 A：对外提供 MCP Server
   - 子项目 B：在仓库里消费外部 MCP 服务
2. 当前先只设计并实现子项目 A。
3. 第一阶段优先支持客户端：`Claude Code`
4. 第一阶段运行方式：`stdio` 本地启动
5. 第一阶段数据来源：直接基于仓库源码静态分析
6. 第一阶段必须返回的信息：
   - Props / API
   - 样式 / 主题
   - 版本 / 导出

## 3. 设计范围

### 3.1 In Scope

第一阶段 MCP Server 负责：

- 列出仓库中的基础组件和业务组件
- 查询单个组件的源码路径、样式路径、版本、导出入口
- 提取已注册组件关联文件中的参数解构、默认值、子组件挂载等 API 信息
- 提取已注册组件关联样式文件中的主类名、修饰类、主题引入、CSS 变量使用情况
- 为结果附带来源文件和行号，方便 Claude Code 溯源

### 3.2 Out of Scope

第一阶段明确不做：

- 代码修改
- 任意文件读取
- 任意路径搜索
- shell / 命令执行
- Storybook 驱动与浏览器自动化
- 运行时 React 渲染分析
- HTTP / SSE 远程暴露
- 自动生成组件代码
- 直接消费外部 MCP 服务

## 4. 总体架构

第一阶段采用“本地 stdio Server + 仓库静态分析器”的结构：

1. Claude Code 通过 MCP 启动本地 Node 进程
2. MCP Server 注册固定的只读工具
3. 工具层调用仓库分析器
4. 分析器只访问预先定义的白名单文件和目录
5. 分析结果统一组装成 JSON 并返回给 MCP Client

该架构将协议层、工具层、分析层分开，避免把仓库分析逻辑直接写进 MCP 协议注册代码中，后续也方便扩展为更多只读工具。

## 5. 目录结构

推荐把 MCP Server 放在仓库根目录的独立目录，不进入 `src/` 组件产物：

```text
mcp/
├── server.js
├── tools/
│   ├── list-components.js
│   ├── get-component-api.js
│   ├── get-component-style.js
│   └── find-component-exports.js
├── analyzers/
│   ├── components.js
│   ├── exports.js
│   ├── versions.js
│   ├── props.js
│   └── styles.js
└── utils/
    ├── paths.js
    └── result.js
```

### 5.1 模块职责

- `server.js`：初始化 MCP Server、注册工具、处理入参与输出
- `tools/*`：一文件一个工具，负责参数校验和调用分析器
- `analyzers/*`：静态分析逻辑复用层
- `utils/paths.js`：统一仓库根目录与白名单路径解析
- `utils/result.js`：统一响应格式，保证所有工具返回结构一致

第一阶段默认不引入缓存，避免因为文件变更带来额外失效复杂度；如后续确有性能瓶颈，再单独设计缓存层。

## 6. 仓库根目录与白名单数据源

### 6.1 仓库根目录解析规则

第一阶段 Server 仅支持在 `tt-design` 仓库内运行，根目录解析规则如下：

1. 默认以 `mcp/server.js` 所在位置向上回溯到仓库根目录
2. 若后续需要支持显式配置根目录，只允许传入仓库内路径，不允许传入仓库外路径
3. 若无法确认仓库根目录，Server 直接返回 `ok: false` + `INTERNAL_ERROR`，禁止退化为基于任意 `cwd` 的自由扫描

### 6.2 白名单数据源

第一阶段分析器仅允许读取以下两类位置：

1. 固定入口文件：
   - `src/components/index.js`
   - `src/business/index.js`
   - `src/index.js`
   - `src/utils/version-config.js`
2. 已注册组件目录内、与该组件直接相关的 JS / JSX / LESS 文件
   - 路径必须位于 `src/components/<ComponentDir>/` 或 `src/business/<ComponentDir>/` 下
   - 仅在组件注册表已成功建立后，才允许访问对应组件目录内文件
   - 仅用于提取该组件的 API、样式、版本关联信息，不提供自由检索能力

第一阶段默认不读取 `*.stories.js`；如后续需要把 story 作为辅助数据源，应在下一阶段单独扩展，并继续保持“仅辅助分析、不作为核心返回主体”的边界。

对四个工具的最小返回保证如下：

- `list_components`：至少返回注册表中已识别组件的名称、分类与源码路径
- `find_component_exports`：至少返回统一入口导出检查结果与 `preferredImport`
- `get_component_api`：至少返回主实现文件、是否命中支持模式、已提取字段与 `warnings`
- `get_component_style`：至少返回样式文件是否存在、已识别 class / CSS 变量摘要与 `warnings`

禁止访问：

- `.git/`
- `.env*`
- `node_modules/`
- 任意用户传入的仓库外路径

## 7. 工具设计

第一阶段只暴露 4 个只读工具。

### 7.1 `list_components`

#### 目标
列出所有可检索组件，并返回基础信息。

#### 输入
- `category?`：`basic` | `business`
- `keyword?`：按统一导出名做大小写敏感的子串过滤

空结果返回 `ok: true` 与空数组，不视为错误。

#### 输出
- 组件名
- 分类（basic / business）
- 源码路径
- 样式路径（不存在时返回 `null` 并附带 warning）
- 导出入口
- 版本号

#### 数据来源
- `src/components/index.js`
- `src/index.js`
- `src/utils/version-config.js`
- 组件目录结构

### 7.0 组件标识与名称解析规则

为避免不同目录名、导出名和默认导出名不一致导致结果漂移，第一阶段统一采用以下规则：

- Tool 输入的 `componentName` 以“统一导出名”为准
- 名称大小写敏感，例如 `Button` 与 `button` 视为不同输入
- 组件注册表优先使用 `src/components/index.js`、`src/business/index.js`、`src/index.js` 中的导出名建立映射
- 若目录名与导出名不一致，以统一导出名作为主键，目录名作为辅助元数据
- 若同名组件同时出现在基础组件与业务组件中，直接返回冲突错误，不做猜测性匹配
- 若组件未出现在注册表中，即使目录存在，也按未注册组件处理

### 7.2 `get_component_api`

#### 目标
查询单个组件 API 的静态分析结果。

#### 输入
- `componentName`：组件名（必须来自已注册组件集合，且使用统一导出名）

#### 输出
- 默认导出名
- 主实现文件路径
- 参数解构中的 props 名
- 默认值
- 子组件挂载关系，如 `Button.Dropdown`
- 是否使用 `forwardRef`
- 是否使用 `memo`
- 是否显式定义 `propTypes`
- 是否挂载 `data-component-version`
- 相关 warning

#### 说明
第一阶段不要求完整 AST 级类型系统，只做稳定、可解释、对组件检索有帮助的静态提取。

### 7.3 `get_component_style`

#### 目标
返回组件样式与主题相关信息。

#### 输入
- `componentName`：组件名（统一导出名）

#### 输出
- less 文件路径
- 主 block class，例如 `tt-button`
- modifier class 列表
- 引入的主题文件
- 使用到的 CSS 变量
- 是否存在硬编码颜色
- 相关 warning

### 7.4 `find_component_exports`

#### 目标
返回组件在统一入口中的导出情况。

#### 输入
- `componentName`：组件名（统一导出名）

#### 输出
- 是否在 `src/components/index.js` 导出
- 是否在 `src/business/index.js` 导出
- 是否在 `src/index.js` 导出
- `preferredImport`，格式为 `{ module: "tt-design", export: "Button" }`
- 对应源码路径

## 8. 分析器设计

### 8.1 `components.js`
负责建立组件注册表：

- 基础组件 / 业务组件分类
- 组件目录名与组件名映射
- `index.js` / `index.less` 是否存在

### 8.2 `exports.js`
负责解析统一导出关系：

- `src/components/index.js`
- `src/business/index.js`
- `src/index.js`

输出每个组件的导出入口与推荐 import 方式，并检查三类入口之间的一致性。第一阶段统一推荐从 `tt-design` 顶层命名导入；若组件已在基础或业务入口导出，但未在 `src/index.js` 暴露，则返回 `warnings`，不推荐子路径导入。

### 8.3 `versions.js`
负责解析 `src/utils/version-config.js`：

- libraryVersion
- componentVersions 映射

### 8.4 `props.js`
负责分析组件实现文件：

- 默认导出组件名
- 参数解构字段
- 默认值
- 子组件挂载
- `forwardRef` / `memo` / `propTypes` / `data-component-version`

第一阶段支持的代码模式：

- 函数组件或箭头函数组件
- props 在函数参数处解构
- props 默认值直接写在参数解构中
- `Component.SubComponent = SubComponent` 形式的子组件挂载
- `Component.propTypes = {}` 形式的显式 `propTypes`
- `Component.version = ...` 与 JSX 中 `data-component-version={...}` 的静态识别

版本信息优先级：以 `src/utils/version-config.js` 中的组件版本为主；`Component.version` 与 `data-component-version` 仅作为一致性检查与补充证据，出现冲突时返回 `warnings`，不覆盖版本配置结果。
- 单层 `React.memo(Component)`、`memo(Component)`、`React.forwardRef(...)`、`forwardRef(...)` 包裹

第一阶段不强制支持的模式：

- 多层高阶包装的任意组合推导
- props 在函数体内二次解构后再分析默认值
- 跨文件拼装 `propTypes`
- 动态计算得到的子组件挂载关系

遇到超出支持范围的实现时，返回 `ok: true` 并附带 `warnings`，而不是回退为任意源码解析或直接失败。

### 8.5 `styles.js`
负责分析样式文件：

- 主类名
- BEM 风格修饰类
- 主题文件引入
- `var(--tt-*)` CSS 变量使用情况
- 硬编码颜色

第一阶段支持的样式识别规则：

- 识别 `index.less` 中最外层 `tt-*` block class
- 识别同文件内出现的 `tt-*` class，其中以 `tt-block-element` 视为 element，以 `tt-block-modifier` 或通过 `&-xxx` 展开的同前缀 class 视为 modifier；无法稳定区分时统一降级为 relatedClasses 并给 warning
- 识别 `@import (reference)` 的主题文件引入
- 识别 `var(--tt-*)` 形式的 CSS 变量使用
- 识别十六进制颜色值、`rgb/rgba` 作为硬编码颜色

第一阶段不强制支持：

- 复杂 Less mixin 展开后的语义推断
- 跨文件合并样式依赖
- 运行时动态拼接 class 的真实覆盖结果

遇到无法稳定判定的样式模式时，以 `warnings` 告知，而不是扩大读取范围或返回整份样式源码。

## 9. 统一返回格式

所有工具统一返回：

```json
{
  "ok": true,
  "data": {},
  "sourceLocations": [
    {
      "file": "src/index.js",
      "line": 61
    }
  ],
  "warnings": []
}
```

### 字段说明

- `ok`：工具调用是否成功
- `data`：业务数据
- `sourceLocations`：结果来源定位，允许返回多条；第一阶段保持顶层数组结构，每条允许包含 `{ file, line?, endLine?, reason? }`。当无法精确定位到单行时，允许只返回文件级定位，并通过 `reason` 或 `warnings` 说明原因
- `warnings`：非阻断问题，例如：
  - 组件存在但未在主入口导出
  - 未检测到 `propTypes`
  - 未检测到样式文件
  - 存在硬编码颜色
  - 缺失版本配置

### 错误约定

失败时统一返回：

```json
{
  "ok": false,
  "error": {
    "code": "COMPONENT_NOT_FOUND",
    "message": "Component 'Foo' is not registered.",
    "details": {}
  },
  "sourceLocations": [],
  "warnings": []
}
```

标准错误码：

- `INVALID_COMPONENT_NAME`
- `INVALID_FILTER`
- `COMPONENT_NOT_FOUND`
- `COMPONENT_NAME_CONFLICT`
- `ANALYSIS_NOT_SUPPORTED`
- `INTERNAL_ERROR`

约定如下：

- 组件不存在、名称非法或发生冲突时，返回 `ok: false`
- 可部分解析但存在信息缺失时，返回 `ok: true + warnings`
- 不回退为任意路径访问
- 不返回超大源码原文

## 10. 数据流

```text
MCP Request
→ Tool Router
→ Tool Handler
→ Analyzer(s)
→ Normalized Result
→ MCP Response
```

关键约束：

- 组件名必须先在组件注册表中命中
- Tool 层不接受任意文件路径
- Analyzer 层只读取白名单位置
- 所有结果都尽量附带来源位置

## 11. 安全边界

第一阶段 MCP Server 必须坚持“组件知识服务”定位，而不是“仓库万能代理”。

### 11.1 必须禁止的能力

- 任意文件系统浏览
- 任意命令执行
- 用户自定义路径传入
- 读取敏感文件
- 把整段源码无上限回传给模型

### 11.2 必须保留的安全特征

- 全部工具只读
- 固定白名单目录
- 参数收敛到“组件名”等可控字段
- 结果结构统一、可审计、可溯源

## 12. 验证方案

第一阶段采用最小闭环验证：

### 12.1 分析器单测
基于真实仓库样本验证：

- `Button`：包含子组件与复杂样式
- `Input`：典型表单组件
- `Empty`：简单组件
- 至少 1 个业务组件：验证分类逻辑

### 12.2 Tool 集成测试
直接调用工具处理函数，验证：

- 返回结构稳定
- `warnings` 生成正确
- 路径与版本映射正确
- 名称冲突时返回 `COMPONENT_NAME_CONFLICT`
- 未注册但目录存在时返回 `COMPONENT_NOT_FOUND`
- 缺失版本配置或样式文件时返回 `ok: true + warnings`

### 12.3 MCP 冒烟测试
本地启动 server 后验证：

- `node mcp/server.js` 可在仓库根目录直接启动
- Server 以当前仓库根目录作为默认工作目录解析白名单路径
- `list_components`
- `find_component_exports`
- `get_component_api`
- `get_component_style`

能够被 Claude Code 通过本地 stdio MCP 配置正常调用。

## 13. 实施顺序

推荐按以下顺序落地：

1. 搭建 MCP Server 骨架并跑通 `stdio`
2. 实现组件注册表解析、版本解析、导出解析
3. 先落地 `list_components` 与 `find_component_exports`
4. 再落地 `get_component_api` 与 `get_component_style`
5. 补充测试与 Claude Code 本地 stdio 接入说明

## 14. 后续第二阶段方向

本设计只覆盖“提供 MCP Server”。后续“消费外部 MCP 服务”建议作为独立子项目推进，职责与当前 Server 分离：

- 当前 Server：继续作为 `tt-design` 的只读组件知识服务
- 后续消费端：用于文档生成、story 生成、规范检查、版本建议等开发辅助场景

这样可以避免把“对外提供能力”和“内部消费外部服务”混在同一个进程中，保持职责清晰。

## 15. 设计结论

第一阶段推荐实现：

- **类型**：本地 `stdio` MCP Server
- **客户端优先级**：Claude Code
- **数据来源**：仓库源码静态分析
- **能力边界**：只读组件检索
- **核心工具**：`list_components`、`get_component_api`、`get_component_style`、`find_component_exports`
- **返回内容**：Props/API、样式/主题、版本/导出
- **安全策略**：白名单路径、禁止任意路径与命令执行、结果可溯源
- **代码位置**：仓库根目录 `mcp/`，不进入 `src/` 打包产物
