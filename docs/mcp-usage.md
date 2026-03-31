# tt-design MCP 接入与使用说明

## 简介

`tt-design MCP` 是面向 `tt-design` 组件库的源码静态分析服务，供开发者、产品经理、UI 设计师通过支持 MCP 的客户端查询组件库信息。

当前版本主要能力包括：

- 列出基础组件 / 业务组件
- 查询组件导出位置与推荐导入方式
- 查询组件 API 元信息
- 查询组件样式元信息

> 当前版本通过 npm 包分发，会从用户项目的 `node_modules/tt-design/dist/meta` 中读取元数据。

## 适用对象

### 开发者
适合在开发前快速了解组件现状，例如：

- 是否已有类似组件
- 组件从哪里导出
- 组件有哪些 props
- 样式文件在哪里
- 是否有版本配置 / propTypes

### 产品经理
适合快速了解组件库覆盖范围，例如：

- 当前有哪些日期、表格、上传、选择器类组件
- 某一类能力是否已有封装
- 基础组件和业务组件分别有哪些

### UI 设计师
适合在设计前确认组件库已有能力，例如：

- 某类组件是否已有现成封装
- 某组件样式入口在哪
- 哪些组件已经在库里沉淀

## 前置条件

使用前请确认：

1. 本机已安装 Node.js
2. 当前项目已安装 `tt-design`
3. 当前项目可安装开发依赖 `tt-design-mcp`
4. 使用支持 MCP 的客户端（如 Claude Code）

> 说明：当前发布版本会从用户项目的 `node_modules/tt-design/dist/meta` 中读取元数据，不再要求本地 clone `tt-design` 仓库。

## 快速接入

### 1. 安装 npm 包

```bash
npm install tt-design
npm install -D tt-design-mcp
```

### 2. Claude Code 中使用

在 MCP 配置中添加：

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

## 是否需要手动启动

正常使用时不需要手动启动，Claude Code 会按需通过 `npx -y tt-design-mcp` 拉起 MCP 服务。

只有在调试服务本身时，才需要手动运行：

```bash
yarn mcp:dev
```

运行测试：

```bash
yarn test:mcp
```

## 如何确认接入成功

配置完成后，直接在 Claude Code 中输入：

- `请用 tt-design MCP 列出所有基础组件`
- `请用 tt-design MCP 查看 Button 的 API`
- `请用 tt-design MCP 查看 DatePicker 的样式信息`

如果能正常返回结果，说明接入成功。

## 推荐使用流程

### 开发者流程
1. 先确认仓库里是否已有类似组件
2. 查询目标组件 API、导出入口、样式入口
3. 再决定是复用、扩展还是新增组件
4. 开发完成后再结合 Storybook / 本地验证

推荐问法：

- `先用 tt-design MCP 看看库里有没有类似 DatePicker 的组件`
- `帮我查 Button 的导出方式和 API`
- `帮我看 Table 的样式入口和版本信息`

### 产品经理流程
1. 先让 Claude 列出某一类现有组件
2. 再让 Claude 总结能力覆盖情况
3. 最后确认是否需要新增组件需求

推荐问法：

- `请列出 tt-design 中所有上传相关组件`
- `当前组件库里有哪些日期和时间选择组件`
- `请按基础组件和业务组件分别总结现有能力`

### UI 设计师流程
1. 先确认设计对象是否已在组件库中存在
2. 再查看相近组件及其样式入口
3. 设计时优先复用现有组件能力

推荐问法：

- `请列出库里现有的 Tabs、Drawer、Card 相关组件`
- `帮我看 Button 和 FloatButton 的差异`
- `帮我查 DatePicker 的样式入口`

## 当前可用工具

当前 `tt-design MCP` 提供 4 个工具：

### `list_components`
列出组件，支持按分类或关键字过滤。

适合：

- 看当前有哪些组件
- 查某类组件是否存在

### `find_component_exports`
查询组件导出位置和推荐导入方式。

适合：

- 确认某组件从哪里导出
- 确认业务组件 / 基础组件 / 根入口是否暴露

### `get_component_api`
查询组件 API 元信息。

适合：

- 看 props
- 看默认值
- 看是否有 `propTypes`
- 看是否有版本信息

### `get_component_style`
查询组件样式元信息。

适合：

- 查样式文件
- 查样式结构
- 查组件样式入口

## 使用限制

当前版本有以下限制：

1. 只分析 `node_modules/tt-design/dist/meta` 中的元数据文件
2. 不会扫描 `node_modules` 中的其他内容
3. 不会扫描 `.git`
4. 不会读取 `.env`
5. 主要面向组件元数据查询
6. 不替代 Storybook 预览和 Figma 设计工具

因此：

- 它适合"查现状、做分析、辅助决策"
- 不适合直接替代视觉设计或运行时预览

## 常见问题

### Q1：我已经配置了，但没有生效
请检查：

- 当前项目是否已安装 `tt-design`
- 当前项目是否已安装 `tt-design-mcp`
- `node_modules/tt-design/dist/meta` 是否存在
- 是否重启了 Claude Code

### Q2：产品经理 / UI 设计师能直接用吗
可以，但前提是：

- 本机具备可运行环境
- 当前项目已安装 `tt-design` 和 `tt-design-mcp`
- 已配置 MCP 客户端

如果没有本地开发环境，当前版本不适合直接给非技术角色独立使用。

### Q3：为什么查询结果和预期不一致
当前 MCP 依赖 `tt-design` 构建产物中的元数据。如果组件未完整导出、未配置版本、未声明 `propTypes`，结果中可能会出现 warning。

### Q4：本地仓库开发模式还支持吗
支持。在 `tt-design` 仓库本地开发时，可使用仓库内置的 MCP 配置：

```json
{
  "mcpServers": {
    "tt-design": {
      "command": "node",
      "args": ["mcp/server.mjs"]
    }
  }
}
```

此模式直接从源码读取元数据，适合调试和贡献者使用。

## 建议的日常问法模板

### 通用模板
- `请用 tt-design MCP 列出所有基础组件`
- `请用 tt-design MCP 查询 [组件名] 的 API`
- `请用 tt-design MCP 查询 [组件名] 的导出位置`
- `请用 tt-design MCP 查询 [组件名] 的样式信息`

### 示例
- `请用 tt-design MCP 查询 Button 的 API`
- `请用 tt-design MCP 查询 DatePicker 的样式信息`
- `请用 tt-design MCP 列出 business 组件`
- `请用 tt-design MCP 查一下 Select 是怎么导出的`
