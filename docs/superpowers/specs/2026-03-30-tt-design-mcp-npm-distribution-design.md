# tt-design MCP npm 双包分发设计说明

- 日期：2026-03-30
- 状态：已完成方案确认，待书面评审
- 范围：本设计只覆盖 `tt-design` 组件库与 `tt-design-mcp` 独立 MCP 包的 npm 双包分发方案，不覆盖远程托管 MCP 服务

## 1. 背景

当前仓库内的 MCP Server 采用“本地源码静态分析型”实现，运行时直接依赖 `tt-design` 仓库目录与源码结构，适合在本仓库内由 Claude Code 启动使用，但不适合对外通过 npm 分发给其他开发者直接安装和接入。

当前实现存在以下对外分发障碍：

- MCP Server 假定自己运行在 `tt-design` 仓库内部
- 数据来源依赖源码目录和本地仓库结构
- 使用者需要 clone 仓库并安装依赖
- 不适合仅通过 npm 安装组件库后直接配合 MCP 使用

目标是把当前 MCP 能力改造成对外可发布、可通过 npm 安装、可由外部用户在本地项目中直接接入的产品形态。

## 2. 目标与已确认决策

### 2.1 目标

为 `tt-design` 建立 npm 双包分发模式，使外部用户可以安装组件库并通过独立的 MCP Server 包查询组件信息，无需 clone `tt-design` 仓库。

### 2.2 已确认决策

1. 采用 npm 双包模式：
   - `tt-design`：组件库本体
   - `tt-design-mcp`：独立 MCP Server 包
2. `tt-design-mcp` 通过 `npx -y tt-design-mcp` 启动
3. `tt-design-mcp` 启动后自动读取用户项目中已安装的 `tt-design` 包内元数据
4. `tt-design` 在发布时额外产出 `dist/meta/*.json`
5. 第一阶段不做远程托管 MCP 服务
6. 第一阶段不做源码 fallback，找不到包或元数据时直接返回明确错误
7. 现有 4 个工具能力保持延续：
   - `list_components`
   - `find_component_exports`
   - `get_component_api`
   - `get_component_style`

## 3. 设计范围

### 3.1 In Scope

本阶段负责：

- 为 `tt-design` 增加可随 npm 包发布的 MCP 元数据产物
- 新增独立 npm 包 `tt-design-mcp`
- 让 `tt-design-mcp` 在用户项目中自动定位已安装的 `tt-design`
- 基于 `dist/meta/*.json` 提供只读查询能力
- 建立版本兼容策略与错误返回规则
- 建立对外安装、接入、测试、发布流程

### 3.2 Out of Scope

本阶段明确不做：

- 远程托管 MCP 服务
- HTTP / SSE 暴露
- 在线文档查询服务
- 自动回退到仓库源码扫描
- 允许任意路径传入和自由文件搜索
- 在用户机器上重新做完整源码 AST 扫描
- 额外新增超出当前 4 个工具范围的新功能

## 4. 总体方案

### 4.1 产品形态

最终对外以两个 npm 包存在：

#### `tt-design`
组件库本体，继续面向业务项目提供 React 组件能力，同时在构建与发布流程中新增 MCP 所需的静态元数据产物。

#### `tt-design-mcp`
独立 MCP Server 包，不再依赖 `tt-design` 仓库目录，而是在运行时从当前用户项目安装的 `tt-design` 包中读取元数据，并对外提供固定的只读工具。

### 4.2 用户接入方式

外部用户安装：

```bash
npm install tt-design
npm install -D tt-design-mcp
```

MCP Client 配置示例：

```json
{
  "mcpServers": {
    "tt-design": {
      "command": "npx",
      "args": ["-y", "tt-design-mcp"]
    }
  }
}
```

该模式下，用户无需 clone 本仓库，只需在自己的项目中安装 npm 包并配置 MCP Client。

## 5. 元数据设计

### 5.1 设计原则

MCP 所需信息不再在用户机器上通过源码实时扫描生成，而是在 `tt-design` 发布前一次性生成并随包发布。这样可以降低外部使用门槛，减少运行时复杂度，并使组件库版本与 MCP 查询结果天然对齐。

### 5.2 发布产物

`tt-design` 发布时新增以下文件：

```text
dist/meta/components.json
dist/meta/exports.json
dist/meta/api.json
dist/meta/styles.json
dist/meta/version.json
```

### 5.3 各文件最小内容

#### `components.json`
至少包含：

- 组件名
- 组件分类（`basic` / `business`）
- 源码入口摘要
- 样式入口摘要
- 推荐导入方式
- 组件版本号

#### `exports.json`
至少包含：

- 根入口导出信息
- 基础组件入口导出信息
- 业务组件入口导出信息
- 推荐导入路径

#### `api.json`
至少包含：

- props 名称
- 默认值摘要
- `propTypes` 信息
- `forwardRef` 使用情况
- `memo` 使用情况
- 子组件挂载关系

#### `styles.json`
至少包含：

- 样式文件路径摘要
- 主类名
- 修饰类摘要
- 主题文件引用
- CSS 变量使用摘要

#### `version.json`
至少包含：

- `packageVersion`
- `metadataSchemaVersion`
- `generatedAt`

### 5.4 数据边界

元数据只服务于当前 MCP 的只读查询能力，不承担运行时代码生成或自由检索职责。元数据内容应聚焦于组件检索、导出查询、API 摘要与样式摘要，不引入额外的无关运行时数据。

## 6. `tt-design-mcp` 读取链路

### 6.1 启动逻辑

`tt-design-mcp` 启动后执行以下步骤：

1. 以当前工作区为起点定位 `node_modules/tt-design/package.json`
2. 定位 `tt-design/dist/meta/version.json`
3. 校验 `metadataSchemaVersion`
4. 读取其余 `dist/meta/*.json`
5. 将元数据加载到内存中供工具查询使用

### 6.2 工具与数据文件映射

- `list_components` → `components.json`
- `find_component_exports` → `components.json` + `exports.json`
- `get_component_api` → `api.json`
- `get_component_style` → `styles.json`

### 6.3 错误策略

第一阶段不做源码 fallback，遇到以下情况时直接返回明确错误：

- 当前项目未安装 `tt-design`
- 已安装 `tt-design`，但缺少 `dist/meta`
- `metadataSchemaVersion` 不兼容
- 元数据文件损坏或缺失
- 用户查询不存在的组件

错误必须清晰说明：

- 失败原因
- 发现的 `tt-design` 版本（若有）
- 当前 MCP 支持的 schema 范围
- 建议用户升级哪个包或补齐哪类安装

## 7. 工具设计延续

本阶段延续现有 4 个工具，不在对外协议层新增额外工具，避免客户端侧出现不必要的接入变化。

### 7.1 `list_components`
返回组件列表、分类、推荐导入方式、样式入口与版本摘要。

### 7.2 `find_component_exports`
返回组件导出入口与推荐导入方式。

### 7.3 `get_component_api`
返回组件 API 摘要，包括 props、默认值、`propTypes`、`forwardRef`、`memo`、子组件挂载信息。

### 7.4 `get_component_style`
返回组件样式文件与主题摘要，包括主类名、修饰类、主题引用和 CSS 变量使用情况。

## 8. 仓库组织方案

### 8.1 当前推荐结构

第一阶段不做大规模 monorepo 改造，优先采用最小改动方案：

```text
/tt-design
├── mcp/                  # 当前仓库内开发版 MCP，可继续保留作参考
├── mcp-package/          # 新的独立 npm 包目录（包名为 tt-design-mcp）
│   ├── package.json
│   ├── bin/
│   └── src/
├── dist/
│   ├── cjs/
│   ├── esm/
│   └── meta/
└── package.json
```

### 8.2 采用该结构的原因

- 能复用当前仓库内已有 MCP 逻辑与测试思路
- 改动范围可控
- 不需要立即把整个仓库迁移成 monorepo
- 后续若需要，再逐步演进到 `packages/*` 结构也不晚

## 9. 版本兼容策略

### 9.1 双包独立发版

- `tt-design` 独立发版
- `tt-design-mcp` 独立发版

二者的兼容关系不靠包版本号猜测，而通过元数据 schema 显式约束。

### 9.2 Schema 规则

在 `dist/meta/version.json` 中引入：

- `packageVersion`
- `metadataSchemaVersion`

初始约定：

- `metadataSchemaVersion = 1`
- `tt-design-mcp@1.x` 兼容 schema 1

只要元数据结构不变，`tt-design` 的组件迭代不需要推动 `tt-design-mcp` 主版本升级；只有元数据结构发生不兼容变化时，才需要提升 schema 版本并同步提升 MCP 主版本。

## 10. 发布流程

### 10.1 `tt-design` 发布流程

1. 构建组件库产物
2. 生成 `dist/meta/*.json`
3. 校验元数据完整性与结构合法性
4. 确认 npm `files` 中包含 `dist/meta`
5. 发布到 npm

### 10.2 `tt-design-mcp` 发布流程

1. 构建 MCP 包
2. 在 fixture 项目中安装 `tt-design` 并验证读取链路
3. 验证 4 个工具能正常返回数据
4. 发布到 npm

## 11. 测试策略

### 11.1 元数据生成测试

验证 `tt-design` 在构建或发布前能稳定生成：

- 完整的 `dist/meta/*.json`
- 可被解析的 JSON 结构
- 与当前组件库结构一致的组件索引

### 11.2 MCP 单测

验证 `tt-design-mcp` 对以下场景的处理：

- 正常读取元数据
- 未安装 `tt-design`
- 缺少 `dist/meta`
- schema 不兼容
- 查询不存在组件

### 11.3 端到端 Smoke Test

在临时项目中：

1. 安装 `tt-design`
2. 安装 `tt-design-mcp`
3. 启动 MCP Server
4. 验证查询 `Button`、`DatePicker` 等组件时能返回正确结果

## 12. 风险与控制

### 12.1 元数据漂移风险

若元数据生成规则与组件实现演进脱节，MCP 查询结果可能失真。

控制方式：

- 将元数据生成并入正式发布流程
- 在发布前强制校验 meta 完整性
- 通过 schema version 明确兼容边界

### 12.2 用户环境差异风险

外部用户项目的包管理器、目录结构、工作目录可能不同。

控制方式：

- 运行时按当前项目依赖解析 `tt-design`
- 不依赖固定 git 仓库路径
- 错误信息明确指出缺失位置与修复建议

### 12.3 维护成本风险

如果同时维护“仓库源码型 MCP”和“对外 npm 型 MCP”，容易出现双轨逻辑漂移。

控制方式：

- 协议层和结果格式尽量共用
- 数据源层拆分为“源码分析版”和“元数据读取版”
- 逐步把对外主路径收敛到 npm 模式

## 13. 成功标准

本方案落地后，外部用户应能完成以下流程：

```bash
npm install tt-design
npm install -D tt-design-mcp
```

然后配置 MCP Client：

```json
{
  "mcpServers": {
    "tt-design": {
      "command": "npx",
      "args": ["-y", "tt-design-mcp"]
    }
  }
}
```

配置完成后，无需 clone `tt-design` 仓库，即可直接查询：

- 所有基础组件
- 单个组件导出信息
- 单个组件 API 摘要
- 单个组件样式摘要

这就是本阶段方案成功的判断标准。
