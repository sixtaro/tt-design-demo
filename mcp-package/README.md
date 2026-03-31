# tt-design-mcp

面向 `tt-design` 组件库的 MCP Server，通过 npm 包分发，供支持 MCP 的 AI 客户端（如 Claude Code）查询组件元数据。

## 功能概述

- 列出基础组件 / 业务组件
- 查询组件导出位置与推荐导入方式
- 查询组件 API 元信息（props、默认值、propTypes、forwardRef、memo）
- 查询组件样式元信息（类名、CSS 变量、主题引用）

数据来源于用户项目中已安装的 `tt-design` 包内的 `dist/meta/*.json`，无需 clone 源码仓库。

## 前置条件

1. 本机已安装 Node.js
2. 当前项目已安装 `tt-design`
3. 当前项目可安装开发依赖

## 快速接入

### 1. 安装依赖

```bash
npm install tt-design
npm install -D tt-design-mcp
```

### 2. 配置 MCP Client

如果使用 Claude Code，推荐在已安装 `tt-design` 的项目根目录执行：

```bash
claude mcp add --scope project --transport stdio tt-design -- npx tt-design-mcp
```

如果在 Windows 上使用 Claude Code，请加上 `cmd /c` 包装：

```bash
claude mcp add --scope project --transport stdio tt-design -- cmd /c npx tt-design-mcp
```

如果需要手动配置，也可以在 Claude Code 等 MCP Client 的配置中添加：

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

### 3. 验证接入

在 Claude Code 中输入：

- `请用 tt-design MCP 列出所有基础组件`
- `请用 tt-design MCP 查询 Button 的 API`
- `请用 tt-design MCP 查询 DatePicker 的样式信息`

能正常返回结果即表示接入成功。

## 可用工具

### `list_components`
列出组件，支持按分类或关键字过滤。

```
输入参数：
  category?: "basic" | "business"  # 可选，按组件分类过滤
  keyword?: string                 # 可选，按名称子串过滤

适用场景：查看当前有哪些组件，查找某类组件是否存在
```

### `find_component_exports`
查询组件导出位置和推荐导入方式。

```
输入参数：
  name: string  # 必填，组件名（大小写敏感）

适用场景：确认组件从哪里导出，推荐从哪个入口导入
```

### `get_component_api`
查询组件 API 元信息。

```
输入参数：
  name: string  # 必填，组件名

适用场景：查看 props、默认值、是否有 propTypes、是否使用 forwardRef/memo
```

### `get_component_style`
查询组件样式元信息。

```
输入参数：
  name: string  # 必填，组件名

适用场景：查看样式文件路径、主类名、修饰类、CSS 变量、主题引用
```

## 错误处理

常见错误及排查：

| 错误码 | 说明 | 排查建议 |
|--------|------|----------|
| `METADATA_LOAD_FAILED` | 未找到 `tt-design` 包 | 确认当前项目已安装 `tt-design` |
| `METADATA_FILE_INVALID` | 元数据文件损坏或格式不兼容 | 确认 `tt-design` 版本与 `tt-design-mcp` 兼容 |
| `COMPONENT_NOT_FOUND` | 组件不在元数据中 | 确认组件名大小写正确 |
| `INVALID_COMPONENT_NAME` | 组件名格式无效 | 组件名只能包含字母、数字、下划线、美元符 |

## 发布到 npm

### 首次发布

```bash
cd mcp-package

# 登录 npm（需要 npm 账号）
npm login

# 发布（需要先确认 package.json 中的 name、version、description 正确）
npm publish --access public
```

### 后续更新

```bash
cd mcp-package

# 升级版本号（遵循 SemVer）
# patch: npm version patch
# minor: npm version minor
# major: npm version major
npm version patch

# 发布
npm publish
```

### 发布前检查清单

- [ ] `package.json` 中 `name` 为 `tt-design-mcp`
- [ ] `version` 已正确升级
- [ ] `description` 描述准确
- [ ] `engines` 指定了 Node.js 版本范围（可选）
- [ ] 运行测试确认正常：
  ```bash
  npm test
  ```
- [ ] 在临时项目中验证完整接入流程

### 本地调试

在 `mcp-package` 目录下手动启动：

```bash
node bin/cli.mjs
```

运行测试：

```bash
npm test
```

## 版本说明

- `tt-design-mcp` 与 `tt-design` 通过 `metadataSchemaVersion` 保持兼容
- 当前 schema 版本为 `1`
- 升级 `tt-design` 时会同步更新元数据，schema 不变则 `tt-design-mcp` 无需升级
- schema 发生不兼容变化时会同步升级 `metadataSchemaVersion`

## 本地仓库开发模式

如果你在 `tt-design` 仓库本地开发，可使用仓库内置的源码分析型 MCP（不需要安装 `tt-design-mcp`）：

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

此模式直接从源码读取信息，适合调试和贡献者使用。

## 目录结构

```
mcp-package/
├── bin/
│   └── cli.mjs              # CLI 入口
├── src/
│   ├── meta/
│   │   ├── schema.mjs       # Zod schemas
│   │   ├── load-meta.mjs    # 加载元数据
│   │   └── resolve-package-root.mjs  # 定位 tt-design 包
│   ├── tools/
│   │   ├── list-components.mjs
│   │   ├── find-component-exports.mjs
│   │   ├── get-component-api.mjs
│   │   └── get-component-style.mjs
│   ├── utils/
│   │   ├── result.mjs            # ok/fail 结果封装
│   │   └── component-lookup.mjs   # 组件名校验
│   └── server.mjs           # MCP Server 引导
├── test/
│   ├── load-meta.test.mjs       # 元数据加载测试
│   └── server-smoke.test.mjs     # 端到端冒烟测试
└── package.json
```

## 技术栈

- Node.js ESM
- `@modelcontextprotocol/sdk` 1.18.0
- Zod 3.x
- Node.js 内置测试（`node:test`）
