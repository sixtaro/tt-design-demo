# tt-design 业务库接入技能设计

## 背景

目标不是把 skill 放在 `tt-design` 仓库里，而是把 skill 提供给业务库使用。

核心诉求是让业务项目中的 Claude 在面对页面开发、组件选型和接入审查时，优先使用 `tt-design`，而不是绕过组件库直接落到 `antd`。

本设计只覆盖最小可用方案，即一组面向业务接入方的 MVP skills。

## 目标

在业务库中提供一组围绕 `tt-design` 的接入型 skills，优先解决以下问题：

1. 业务场景出现时，快速判断应该使用哪些 `tt-design` 组件。
2. 确定组件后，快速找到最接近的示例并转成可落地参考。
3. 开发完成后，检查业务代码是否绕过 `tt-design` 直接使用了 `antd`。

## 非目标

本设计不包含以下内容：

- 不在 `tt-design` 仓库内直接部署这些业务接入型 skills。
- 不直接生成复杂整页业务代码。
- 不把 `antd` 作为默认首选方案。
- 不在未确认能力缺口时建议绕过 `tt-design`。
- 不在本次范围内处理版本升级治理、自动迁移或页面脚手架生成。

## 推荐方案

采用最小可用的三技能方案，先选型，再查示例，最后做纠偏。

### 方案内技能

#### 1. `tt-use-component`

用于业务场景下的组件选型。

- 输入：业务目标、页面类型、交互要求、已知限制。
- 输出：推荐的 `tt-design` 组件清单、组件组合方式、推荐理由、是否存在组件库缺口。
- 边界：只做选型与组合建议，不直接输出整页复杂实现。

#### 2. `tt-find-component-example`

用于在确定组件后，寻找最接近的案例或参考用法。

- 输入：组件名、目标场景、希望参考的交互模式。
- 输出：最接近的示例来源、可迁移的最小示例方向、需要按业务裁剪的部分。
- 边界：优先基于已有资料改写，不凭空发明复杂实现。

#### 3. `tt-check-antd-leak`

用于对业务代码进行接入审查，识别绕过组件库的直接使用。

- 输入：页面文件、目录范围或 PR diff。
- 输出：直接使用 `antd` 的位置、可替换的 `tt-design` 组件、无法替换时的原因。
- 边界：只做识别与替换建议，不未经确认就自动大面积改动代码。

## 技能触发链路

推荐用户使用顺序如下：

1. 用户描述业务页面或交互场景时，触发 `tt-use-component`。
2. 组件方案确定后，触发 `tt-find-component-example`。
3. 页面开发完成或需要做规范审查时，触发 `tt-check-antd-leak`。

这个链路让 skill 形成从选型到落地再到审查的闭环，但每个 skill 仍保持单一职责。

## 统一判断原则

三个 skills 共享如下判断原则：

1. 优先推荐已有 `tt-design` 组件。
2. 如果库里没有对应能力，必须明确标记为“`tt-design` 缺口”。
3. 不把业务侧直接使用 `antd` 作为默认解法。
4. 示例与建议优先来自已有参考快照和当前业务代码，而不是凭空猜测。
5. 输出应保守，不确定时宁可标记为“未确认”，也不做强推断。

## 决策状态模型

三个 skills 统一使用以下状态，避免“缺口”“未确认”“可临时直连”混淆：

### 1. `confirmed_supported`

含义：参考快照明确表明当前场景已有可用 `tt-design` 组件或组件组合。

允许行为：
- 推荐对应 `tt-design` 组件。
- 提供组合建议或示例来源。
- 在审查场景中把直接使用 `antd` 判定为可替换问题。

### 2. `confirmed_gap`

含义：参考快照明确表明当前场景没有对应 `tt-design` 封装能力。

允许行为：
- 明确输出“`tt-design` 缺口”。
- 建议补组件库或登记缺口。
- 不把缺口误报为“已有封装但未使用”。

### 3. `unknown_due_to_missing_snapshot`

含义：参考快照缺字段、过期、信息不足，无法确认是否有对应能力。

允许行为：
- 输出“未确认”。
- 要求补齐或刷新参考快照。
- 不允许直接把未知状态推断成 `tt-design` 缺口。
- 不允许直接建议业务侧绕过 `tt-design`。

### 4. `allowed_raw_antd_fallback`

含义：参考快照明确记录当前无 `tt-design` 封装，且允许业务侧临时直连 `antd`；或者用户在当前对话中明确授权临时直连。

允许行为：
- 给出带明显标记的临时 `antd` 兜底建议。
- 输出中必须说明这是临时方案，不是默认标准方案。
- 在审查场景中，这类使用不记为“可直接替换的问题”，但仍需标记为“临时例外”。

## 知识来源设计

由于 skills 部署在业务库中，而不是 `tt-design` 仓库中，因此需要在业务库内维护一份轻量参考快照。

推荐目录：

`/.claude/references/tt-design/`

MVP 阶段要求至少包含 4 个文件。

### 1. `components.json`

用途：提供组件清单和最小能力描述。

建议字段：

- `_meta.updatedAt`
- `_meta.owner`
- `_meta.sourceVersion`
- `components[].name`
- `components[].category`
- `components[].summary`
- `components[].aliases`
- `components[].status`（如 `stable` / `deprecated`）
- `components[].keyCapabilities`

示例：

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design@1.0.0"
  },
  "components": [
    {
      "name": "Table",
      "category": "data-display",
      "summary": "表格展示与基础交互",
      "aliases": ["列表表格"],
      "status": "stable",
      "keyCapabilities": ["columns", "pagination", "rowSelection"]
    }
  ]
}
```

### 2. `scenarios.json`

用途：提供业务场景到组件组合的映射。

建议字段：

- `_meta.updatedAt`
- `_meta.owner`
- `_meta.sourceVersion`
- `scenarios[].id`
- `scenarios[].keywords`
- `scenarios[].recommendedComponents`
- `scenarios[].compositionNotes`
- `scenarios[].decisionHints`

示例：

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design@1.0.0"
  },
  "scenarios": [
    {
      "id": "search-table-page",
      "keywords": ["筛选", "列表页", "分页"],
      "recommendedComponents": ["Form", "Input", "Select", "Button", "Table", "Pagination"],
      "compositionNotes": ["查询区与表格区分开", "分页与表格状态联动"],
      "decisionHints": ["如果有高级条件，优先保留展开收起结构"]
    }
  ]
}
```

### 3. `examples.json`

用途：提供可检索的示例索引。它不只是 story 名称索引，还需要附带最小迁移信息，才能支撑 `tt-find-component-example`。

建议字段：

- `_meta.updatedAt`
- `_meta.owner`
- `_meta.sourceVersion`
- `examples[].id`
- `examples[].component`
- `examples[].sourceType`（`story` / `doc`）
- `examples[].sourceRef`
- `examples[].applicableScenarios`
- `examples[].snippetSummary`
- `examples[].adaptationNotes`

示例：

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design@1.0.0"
  },
  "examples": [
    {
      "id": "table-basic-list",
      "component": "Table",
      "sourceType": "story",
      "sourceRef": "Table/BasicList",
      "applicableScenarios": ["列表页", "基础表格"],
      "snippetSummary": "基础 columns + dataSource + pagination 用法",
      "adaptationNotes": ["业务页需替换为真实接口数据", "分页参数与筛选条件联动"]
    }
  ]
}
```

### 4. `antd-mapping.json`

用途：提供 `antd` 到 `tt-design` 的封装映射与允许状态。

建议字段：

- `_meta.updatedAt`
- `_meta.owner`
- `_meta.sourceVersion`
- `mappings[].antdImport`
- `mappings[].ttComponent`
- `mappings[].mappingStatus`
- `mappings[].notes`

其中 `mappingStatus` 只允许以下值：

- `wrapped`：已有 `tt-design` 封装
- `unwrapped`：当前没有封装，不允许默认直连
- `temporary-allowed`：当前没有封装，但允许业务侧临时直连

示例：

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design@1.0.0"
  },
  "mappings": [
    {
      "antdImport": "Button",
      "ttComponent": "Button",
      "mappingStatus": "wrapped",
      "notes": "业务侧默认应使用 tt-design Button"
    }
  ]
}
```

## 参考快照维护要求

为了让 skill 结果稳定，四个文件都需要包含 `_meta` 字段。

最少要求：

- `updatedAt`：最后更新时间
- `owner`：维护方
- `sourceVersion`：对应的 `tt-design` 版本或来源标识

读取时遵循以下规则：

1. 如果 `_meta` 缺失，统一视为 `unknown_due_to_missing_snapshot`。
2. 如果快照超过维护窗口未更新，统一视为 `unknown_due_to_missing_snapshot`。
3. 默认维护窗口建议为 30 天；如果业务库后续有更明确约束，以业务库约束为准。
4. 结果应保守，宁可少推荐，也不根据过期快照做强推断。

## 读取策略

三个 skills 统一采用以下读取顺序：

1. 先验证参考快照是否完整且未过期。
2. 按任务类型读取对应快照文件。
3. 再结合当前业务代码上下文做判断。
4. 最后归一到四种决策状态之一。

按 skill 的推荐读取范围如下：

- `tt-use-component`：优先读取 `scenarios.json`，必要时补读 `components.json`。
- `tt-find-component-example`：优先读取 `examples.json`，必要时补读 `components.json`。
- `tt-check-antd-leak`：优先读取 `antd-mapping.json`，再结合业务代码中的实际 import 结果。

## 统一输出格式约定

三个 skills 统一使用以下字段：

- `conclusion`：一句话结论
- `decision_state`：四种状态之一
- `confidence`：`high` / `medium` / `low`
- `evidence_source`：本次结论依赖的快照文件、代码位置或上下文依据
- `next_action`：下一步建议

在此基础上，每个 skill 再增加自己的主体字段。

### `tt-use-component`

额外字段：

- `recommended_components`
- `composition_notes`
- `gap_note`（仅在 `confirmed_gap` 时必填）

### `tt-find-component-example`

额外字段：

- `example_sources`
- `adaptation_notes`
- `missing_example_note`（仅在无合适示例时填写）

### `tt-check-antd-leak`

额外字段：

- `findings`
- `severity`（`high` / `medium` / `low`）
- `replacement_suggestions`

`findings` 建议至少包含：

- `file`
- `import_text`
- `mapping_status`
- `reason`
- `suggested_tt_component`

## `tt-check-antd-leak` 的识别范围

MVP 阶段，以下模式都算直接使用 `antd`：

1. `import { Button } from 'antd'`
2. `import { Button as AntButton } from 'antd'`
3. `import Button from 'antd/es/button'`
4. `import Button from 'antd/lib/button'`

MVP 阶段不强制覆盖更复杂的间接 re-export 绕过；如果后续业务库里此类问题频繁出现，再单独扩展规则。

## `tt-check-antd-leak` 的结论规则

当扫描到直接 `antd` import 时，按 `antd-mapping.json` 做如下处理：

- `mappingStatus = wrapped`
  - 判定为高优先级接入问题
  - 应给出对应 `tt-design` 替换建议

- `mappingStatus = unwrapped`
  - 不判定为“已有封装却未使用”
  - 输出为 `confirmed_gap` 或补库建议

- `mappingStatus = temporary-allowed`
  - 不判定为必须立即替换的问题
  - 输出为临时例外，并提醒不是标准长期方案

- 查不到映射或快照过期
  - 输出为 `unknown_due_to_missing_snapshot`
  - 不直接认定为缺口，也不直接认定为误用

## `tt-check-antd-leak` 的默认排除范围

以下文件默认不作为业务接入违规范围：

- `*.stories.*`
- `*.test.*` / `*.spec.*`
- mock / fixture / demo 目录
- 第三方生成代码目录

如果用户传入的是 PR diff，则优先检查变更行，再结合文件上下文补充判断。

## 验收标准

### `tt-use-component`

- 用户仅描述业务场景时，也能得到 `tt-design` 组件推荐。
- 输出中必须包含 `decision_state`、`confidence`、`recommended_components`。
- 在 `confirmed_gap` 下，必须明确缺口，而不是直接给默认 `antd` 方案。
- 在 `unknown_due_to_missing_snapshot` 下，必须明确“未确认”，而不是误判为缺口。

### `tt-find-component-example`

- 能从 `examples.json` 中定位最接近的示例来源。
- 输出应是“最接近的来源 + 如何改造成业务代码”，而不是重新发明整套实现。
- 在没有合适示例时，必须明确是“无匹配示例”还是“参考快照信息不足”。

### `tt-check-antd-leak`

- 能识别文件或 diff 中直接使用 `antd` 的 import。
- 当 `mappingStatus = wrapped` 时，能给出对应替换建议。
- 当 `mappingStatus = unwrapped` 时，能输出缺口而不是误报为误用。
- 当快照不足时，能输出 `unknown_due_to_missing_snapshot`。

## 推荐落地顺序

1. 先在业务库准备 `/.claude/references/tt-design/` 参考快照。
2. 首先实现 `tt-use-component`。
3. 然后实现 `tt-find-component-example`。
4. 最后实现 `tt-check-antd-leak`。

## 原因

当前最高优先级是业务接入方的组件选型，因此 `tt-use-component` 最先落地能最快产生价值。

同时，选型 skill 会倒逼参考快照先沉淀出稳定结构，这能为示例检索和后续审查类 skill 提供统一知识来源。

## 后续规划

当这套 MVP 跑顺后，可以再扩展更强的业务接入能力，例如：

- 生成常见页面区块组合
- 做主题与样式接入校验
- 提供升级与迁移建议

但这些内容不应进入本次最小可用设计范围。
