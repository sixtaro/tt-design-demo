# tt-design MCP 服务使用说明

## 适用范围
- 本文档说明如何在 Claude Code 中使用仓库内置的 tt-design MCP 服务。
- MCP 只做**仓库源码静态分析**，不会读取 `node_modules`。

## 1. 位置与配置
### 1.1 `.mcp.json`
仓库根目录提供 MCP server 注册信息：

```
.mcp.json
```

内容示例（已在仓库内维护）：
```json
{
  "mcpServers": {
    "tt-design": {
      "command": "node",
      "args": [
        "mcp/server.mjs"
      ]
    }
  }
}
```

> 若你的运行目录不是仓库根目录，请确保 Claude Code 以仓库根目录启动，或将 args 改为绝对路径。

### 1.2 Claude Code 启用
在你的本地配置文件中启用该 MCP：

```
.claude/settings.local.json
```

```json
{
  "enabledMcpjsonServers": ["tt-design"]
}
```

也可以在用户级配置中启用（效果相同）：

```
~/.claude/settings.local.json
```

```json
{
  "enabledMcpjsonServers": ["tt-design"]
}
```

> 如果配置后仍未生效，请重启 Claude Code 会话。

## 2. 启动方式
如果需要手动启动服务进行调试：

```bash
yarn mcp:dev
```

运行 MCP 测试：

```bash
yarn test:mcp
```

## 3. 可用工具（Tools）
服务提供 4 个工具，均返回统一的结果结构：

```json
{
  "ok": true,
  "data": {},
  "error": null,
  "sourceLocations": [],
  "warnings": []
}
```

### 3.1 list_components
列出组件（支持可选筛选）：

输入：
```json
{
  "category": "basic",
  "keyword": "Button"
}
```

- `category`: `basic` 或 `business`
- `keyword`: 关键字（可选）

### 3.2 find_component_exports
查询组件的导出位置与推荐导入方式：

输入：
```json
{
  "name": "Button"
}
```

### 3.3 get_component_api
读取组件 API 元信息：

输入：
```json
{
  "name": "Button"
}
```

### 3.4 get_component_style
读取组件样式元信息：

输入：
```json
{
  "name": "Button"
}
```

## 4. 注意事项
- MCP 只分析仓库源码，不会扫描 `node_modules`。
- 如果组件缺少 `propTypes` 或版本配置，结果中会出现 `warnings`。
- 组件样式分析仅覆盖当前仓库内可访问的 LESS 文件。
