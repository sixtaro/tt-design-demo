# TT Business Consumption Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在业务库中落地 3 个围绕 `tt-design` 的接入型 skills，并用一套本地参考快照支持组件选型、示例检索和 `antd` 绕过审查。

**Architecture:** 所有实现都发生在业务仓库，而不是 `tt-design` 仓库。3 个 skills 共享一套 `/.claude/references/tt-design/` 参考快照、统一决策状态模型、统一输出格式和统一 confidence 口径；实现顺序按“先做 preflight，再沉淀知识源，再做 RED baseline，再逐个实现 skill，最后做全量回归与边界验证”。

**Tech Stack:** Claude Code skills (`.claude/skills`), 本地 JSON 参考快照, Markdown 评测文档, git, Python 内置 JSON 校验命令

---

## Scope And Assumptions

- 所有下面的文件路径都**相对于业务仓库根目录**，不是相对于 `tt-design` 仓库。
- 用户 override 采用默认规则：**仅对当前对话 / 当前 session 生效**，不写入长期快照。
- 参考快照 freshness 默认规则：**30 天未更新视为过期**。
- `tt-check-antd-leak` 默认接受 4 类输入：
  - 原始 diff 文本
  - 文件列表 + 改动片段
  - `git diff` 输出粘贴内容
  - 目录范围
- 如果输入是 PR diff，`tt-check-antd-leak` 必须优先检查变更行，再结合周边上下文补充判断。
- 如果只拿到局部 diff，`tt-check-antd-leak` 仍可输出结果，但 `confidence` 必须降为 `low` 或 `medium`，并明确说明上下文不足。
- 本计划里的 `sourceRef` 是**本地快照里的稳定引用标识**，不是对上游 Storybook 文件路径存在性的承诺。只要它在本地快照和评测文档里自洽，就满足 MVP；如果业务库后续需要可点击跳转，再单独扩展 `sourcePath` 或 `sourceUrl` 字段。
- `sourceVersion` 是**本地快照来源标识**，不要求必须是真实 npm 版本号；MVP 只要求它可追踪且在 4 个快照文件中保持一致。

## Operator Notes

- 调用实现过程技能时，使用 `Skill` 工具，名称必须精确匹配：
  - `superpowers:writing-skills`
  - `superpowers:test-driven-development`
  - `superpowers:requesting-code-review`
  - `superpowers:verification-before-completion`
- 运行评测时，优先使用 `Agent` 工具启动**全新**子代理，每个 eval 单独一个子代理。
- 如果当前环境没有 `Agent` 工具，就在同一业务仓库中开一个全新 Claude 会话，粘贴同样的 eval prompt，并把原始输出复制回 `.claude/skill-evals/tt-design-mvp.md`。不要用同一个长上下文会话代替“fresh eval”。
- 如果既没有 `Agent` 工具、也无法开第二个新会话，就使用**当前会话中的单轮 fresh-eval 替代法**：在发起 eval 前，不追加任何额外说明，只发送 `## Eval operator prompt` + 对应 eval prompt，并把该轮回答立即记录到 `.claude/skill-evals/tt-design-mvp.md`；每个 eval 必须单独发一轮，不能把多个 eval 合并到同一条消息里。
- 如果当前环境没有 `superpowers:*` skills，就按本计划里的显式步骤手工执行，不把缺少技能当成阻塞条件：
  - 没有 `superpowers:writing-skills`：仍按本计划先做 RED baseline，再写最小 skill，再做 GREEN 复测。
  - 没有 `superpowers:test-driven-development`：严格按每个 task 的“先评测失败、再最小实现、再复测通过”顺序执行。
  - 没有 `superpowers:requesting-code-review`：改为使用一个 fresh reviewer subagent 或单独新会话，只提供目标文件和 spec 路径做 review。
  - 没有 `superpowers:verification-before-completion`：手工收集证据，至少确认 JSON 语法通过、语义校验通过、所有 eval 通过、最后 review 无未解决 blocker。
- 所有 commit 步骤都受当前执行会话里的用户授权约束：
  - **如果用户明确要求提交 commit，就执行该步中的 git 命令。**
  - **如果用户没有要求提交 commit，就跳过 commit 步骤，但不阻塞后续实现。**
- 如果业务库中已经存在同名目标文件，不要直接覆盖。先比较 schema 和职责；若不兼容，暂停并请用户决定合并策略。

## Shared Output Contract

所有 3 个 skills 都必须按**同一输出格式**回答，使用一组顶层字段，每个字段单独一行或一个独立 bullet：

```text
- conclusion: ...
- decision_state: confirmed_supported | confirmed_gap | unknown_due_to_missing_snapshot | allowed_raw_antd_fallback
- confidence: high | medium | low
- evidence_source:
  - `path/to/file` with id / keyword / import evidence
- next_action: ...
```

各 skill 再追加自己的主体字段：

- `tt-use-component`
  - `recommended_components`
  - `composition_notes`
  - `gap_note`（仅 `confirmed_gap` 时）
- `tt-find-component-example`
  - `example_sources`
  - `adaptation_notes`
  - `missing_example_note`（仅无合适示例时）
- `tt-check-antd-leak`
  - `findings`
  - `severity`
  - `replacement_suggestions`

`tt-check-antd-leak` 的每条 `findings` 都必须至少包含：
- `file`
- `import_text`
- `mapping_status`
- `reason`
- `suggested_tt_component`

### Minimum evidence requirements

- `tt-use-component`
  - `evidence_source` 至少包含：`scenarios.json` 中命中的 `scenario id`，必要时补充 `components.json` 的组件名。
- `tt-find-component-example`
  - `evidence_source` 至少包含：`examples.json` 中命中的 `example id` 或 `sourceRef`。
- `tt-check-antd-leak`
  - `evidence_source` 至少包含：输入代码中的 import 文本 + `antd-mapping.json` 中命中的 `mappingStatus`。
  - 如果输入是目录范围，`evidence_source` 还必须指出被扫描的目录范围。
  - 如果输入是 PR diff，`evidence_source` 还必须指出“先检查变更行，再补充上下文”的判断依据。

### Confidence rubric

- `high`
  - 快照完整且未过期
  - 命中精确的 scenario / example / mapping
  - 输入代码或 diff 上下文完整
- `medium`
  - 快照完整且未过期
  - 命中近似匹配而非精确匹配，或仅有局部代码上下文
- `low`
  - 输入是局部 diff、信息不足、或只能给出保守判断
- 只要快照缺失、格式不合法或过期，`decision_state` 必须是 `unknown_due_to_missing_snapshot`，`confidence` 不能高于 `low`

## File Structure

### Create

- `.claude/references/tt-design/CONTRACT.md`
  - 共享规则文件。定义 4 种 `decision_state`、30 天 freshness 规则、session-only override 规则、`tt-check-antd-leak` 可接受的 diff 输入格式。
- `.claude/references/tt-design/components.json`
  - `tt-design` 组件清单与最小能力描述。
- `.claude/references/tt-design/scenarios.json`
  - 业务场景到组件组合的映射，供 `tt-use-component` 优先读取。
- `.claude/references/tt-design/examples.json`
  - 示例索引与最小改造说明，供 `tt-find-component-example` 优先读取。
- `.claude/references/tt-design/antd-mapping.json`
  - `antd` 到 `tt-design` 的映射表和 `mappingStatus`，供 `tt-check-antd-leak` 使用。
- `.claude/skill-evals/tt-design-mvp.md`
  - 评测脚本与 baseline 记录文档。包含 3 个 skills 的 RED 提示词、预期失败模式、GREEN 通过条件和边界 spot-check。
- `.claude/skills/tt-use-component/SKILL.md`
  - 组件选型 skill。
- `.claude/skills/tt-find-component-example/SKILL.md`
  - 示例检索与改造 skill。
- `.claude/skills/tt-check-antd-leak/SKILL.md`
  - `antd` 绕过识别 skill。

### Modify

- 无现有文件要求；如果业务库已经有 `.claude/skills/`、`.claude/references/`、`.claude/skill-evals/` 中的同名文件，先停下来比较 schema；兼容则 merge，不兼容则请用户决定。

### Testing Surface

- `.claude/skill-evals/tt-design-mvp.md`
  - 保存可重复执行的评测提示词、baseline verbatim 记录和最终验证清单。
- 独立子代理或全新会话
  - 每次 RED / GREEN / edge-case 验证都要使用 fresh context。
  - 如果没有 fresh subagent 能力，就必须开一个全新会话执行相同 prompt，不能复用已有长上下文。

### Required implementation skills

- `@superpowers:writing-skills`
- `@superpowers:test-driven-development`
- `@superpowers:requesting-code-review`
- `@superpowers:verification-before-completion`

---

### Task 1: Run preflight discovery in the business repo

**Files:**
- Read: `.claude/`
- Read: `.claude/skills/`
- Read: `.claude/references/`
- Read: `.claude/skill-evals/`
- Modify: none
- Test: existing `.claude` layout

- [ ] **Step 1: Inspect existing `.claude` directories and note conflicts**

Run:

```bash
[ -d ".claude" ] && ls ".claude"; [ -d ".claude/skills" ] && ls ".claude/skills"; [ -d ".claude/references" ] && ls ".claude/references"; [ -d ".claude/skill-evals" ] && ls ".claude/skill-evals"
```

Expected: you know whether target paths already exist.

- [ ] **Step 2: Search for any existing tt-design reference contract or freshness rule**

Search for these strings in the business repo:

```text
tt-design
updatedAt
sourceVersion
freshness
unknown_due_to_missing_snapshot
temporary-allowed
```

Expected: either you find an existing rule set to reuse, or you confirm there is no stronger local rule and the 30-day default remains valid.

- [ ] **Step 3: Decide the snapshot sourceVersion value**

Use this rule exactly:

```text
If the business repo already has a local tt-design snapshot source identifier -> reuse it.
Otherwise -> use `tt-design-local-snapshot-YYYY-MM-DD` and keep it identical across all 4 snapshot files.
```

Expected: `sourceVersion` is a consistent local provenance label, not a guessed package version.

- [ ] **Step 4: Decide conflict handling before creating files**

Use this rule exactly:

```text
If a target file does not exist -> create it.
If a target file exists and schema is compatible -> extend it.
If a target file exists and schema is incompatible -> stop and ask the user before changing it.
```

Expected: no target file will be overwritten blindly.

- [ ] **Step 5: Confirm whether commit steps are allowed in this execution session**

Use this rule exactly:

```text
If the user explicitly requested commits in the execution session -> keep commit steps.
Otherwise -> skip commit commands without blocking later tasks.
```

Expected: the engineer knows whether to run or skip every commit step later in the plan.

---

### Task 2: Seed the shared tt-design reference snapshot

**Files:**
- Create: `.claude/references/tt-design/CONTRACT.md`
- Create: `.claude/references/tt-design/components.json`
- Create: `.claude/references/tt-design/scenarios.json`
- Create: `.claude/references/tt-design/examples.json`
- Create: `.claude/references/tt-design/antd-mapping.json`
- Test: `.claude/references/tt-design/*.json`

- [ ] **Step 1: Write the contract file first**

Create `.claude/references/tt-design/CONTRACT.md` with these exact sections:

```md
# tt-design reference contract

## Decision states
- confirmed_supported
- confirmed_gap
- unknown_due_to_missing_snapshot
- allowed_raw_antd_fallback

## Freshness
- `_meta.updatedAt` is required
- `_meta.owner` is required
- `_meta.sourceVersion` is required
- snapshots older than 30 days are stale
- stale or malformed snapshot => unknown_due_to_missing_snapshot

## User override
- user authorization for raw antd applies only to the current conversation/session
- do not write session-only authorization back into snapshot files

## Diff inputs for tt-check-antd-leak
- raw diff text
- changed file list with changed hunks
- pasted git diff output
- directory range
- PR diff must inspect changed lines first, then supplement with surrounding context
- partial diff is allowed, but must lower confidence and call out missing context

## Source references
- `sourceRef` is a local curated identifier
- do not claim upstream file existence unless a separate `sourcePath` or `sourceUrl` is present
```

- [ ] **Step 2: Write `components.json` with minimal seed records**

Use this exact starter shape:

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design-local-snapshot-2026-03-25"
  },
  "components": [
    {
      "name": "Form",
      "category": "data-entry",
      "summary": "表单容器与字段联动",
      "aliases": ["表单"],
      "status": "stable",
      "keyCapabilities": ["layout", "validation", "controlled fields"]
    },
    {
      "name": "Input",
      "category": "data-entry",
      "summary": "文本输入与受控值管理",
      "aliases": ["输入框"],
      "status": "stable",
      "keyCapabilities": ["value", "onChange", "placeholder"]
    },
    {
      "name": "Select",
      "category": "data-entry",
      "summary": "下拉选择与选项过滤",
      "aliases": ["下拉选择"],
      "status": "stable",
      "keyCapabilities": ["options", "value", "onChange"]
    },
    {
      "name": "Button",
      "category": "general",
      "summary": "操作触发按钮",
      "aliases": ["按钮"],
      "status": "stable",
      "keyCapabilities": ["type", "disabled", "loading"]
    },
    {
      "name": "Table",
      "category": "data-display",
      "summary": "列表展示、列配置与行选择",
      "aliases": ["列表表格"],
      "status": "stable",
      "keyCapabilities": ["columns", "pagination", "rowSelection"]
    },
    {
      "name": "Pagination",
      "category": "navigation",
      "summary": "分页导航与页码切换",
      "aliases": ["分页器"],
      "status": "stable",
      "keyCapabilities": ["current", "pageSize", "onChange"]
    },
    {
      "name": "Modal",
      "category": "feedback",
      "summary": "弹窗承载二次确认和表单编辑",
      "aliases": ["弹窗"],
      "status": "stable",
      "keyCapabilities": ["open/close", "footer actions", "embedded forms"]
    },
    {
      "name": "Upload",
      "category": "data-entry",
      "summary": "文件上传与状态展示",
      "aliases": ["上传"],
      "status": "stable",
      "keyCapabilities": ["file list", "upload status", "custom request"]
    }
  ]
}
```

- [ ] **Step 3: Write `scenarios.json` with the 3 MVP scenarios**

Use this exact starter shape:

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design-local-snapshot-2026-03-25"
  },
  "scenarios": [
    {
      "id": "search-table-page",
      "keywords": ["筛选", "列表页", "分页", "查询"],
      "recommendedComponents": ["Form", "Input", "Select", "Button", "Table", "Pagination"],
      "compositionNotes": ["查询区与表格区分开", "分页与筛选条件联动重置页码"],
      "decisionHints": ["如果条件较多，保留展开/收起结构"]
    },
    {
      "id": "modal-edit-form",
      "keywords": ["弹窗表单", "编辑", "新建"],
      "recommendedComponents": ["Modal", "Form", "Input", "Select", "Button"],
      "compositionNotes": ["提交按钮由弹窗 footer 驱动", "表单校验失败时阻止关闭"],
      "decisionHints": ["复杂表单优先放在 Modal 内部 Form 管理"]
    },
    {
      "id": "file-upload-panel",
      "keywords": ["上传", "附件", "导入"],
      "recommendedComponents": ["Upload", "Button", "Table"],
      "compositionNotes": ["上传列表与结果列表分区展示"],
      "decisionHints": ["批量导入场景要显式展示上传状态"]
    }
  ]
}
```

- [ ] **Step 4: Write `examples.json` and `antd-mapping.json` with enough data to support all 3 skills**

Use these exact starters:

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design-local-snapshot-2026-03-25"
  },
  "examples": [
    {
      "id": "table-basic-list",
      "component": "Table",
      "sourceType": "story",
      "sourceRef": "Table/BasicList",
      "applicableScenarios": ["列表页", "基础表格"],
      "snippetSummary": "基础 columns + dataSource + pagination 用法",
      "adaptationNotes": ["替换为真实接口数据", "分页参数与筛选条件联动"]
    },
    {
      "id": "modal-form-basic",
      "component": "Modal",
      "sourceType": "story",
      "sourceRef": "Modal/FormInsideModal",
      "applicableScenarios": ["弹窗编辑", "弹窗表单"],
      "snippetSummary": "Modal 包裹 Form 的基础提交流程",
      "adaptationNotes": ["补充字段校验", "提交成功后主动关闭并刷新列表"]
    },
    {
      "id": "upload-basic",
      "component": "Upload",
      "sourceType": "story",
      "sourceRef": "Upload/BasicUpload",
      "applicableScenarios": ["附件上传", "导入"],
      "snippetSummary": "基础上传与文件列表展示",
      "adaptationNotes": ["按业务接口改造上传响应", "补充失败重试提示"]
    }
  ]
}
```

```json
{
  "_meta": {
    "updatedAt": "2026-03-25",
    "owner": "design-system-team",
    "sourceVersion": "tt-design-local-snapshot-2026-03-25"
  },
  "mappings": [
    {
      "antdImport": "Button",
      "ttComponent": "Button",
      "mappingStatus": "wrapped",
      "notes": "默认使用 tt-design Button"
    },
    {
      "antdImport": "Table",
      "ttComponent": "Table",
      "mappingStatus": "wrapped",
      "notes": "默认使用 tt-design Table"
    },
    {
      "antdImport": "Transfer",
      "ttComponent": "",
      "mappingStatus": "unwrapped",
      "notes": "当前无 tt-design 封装，不允许默认直连"
    },
    {
      "antdImport": "Timeline",
      "ttComponent": "",
      "mappingStatus": "temporary-allowed",
      "notes": "当前可临时直连，但需标记为例外"
    }
  ]
}
```

- [ ] **Step 5: Run JSON syntax validation**

Run:

```bash
python -m json.tool ".claude/references/tt-design/components.json" >/dev/null && python -m json.tool ".claude/references/tt-design/scenarios.json" >/dev/null && python -m json.tool ".claude/references/tt-design/examples.json" >/dev/null && python -m json.tool ".claude/references/tt-design/antd-mapping.json" >/dev/null
```

Expected: command exits with status 0 and no output.

- [ ] **Step 6: Run semantic snapshot validation**

Run:

```bash
python - <<'PY'
import json
from pathlib import Path

base = Path('.claude/references/tt-design')
required_meta = {'updatedAt', 'owner', 'sourceVersion'}
checks = {
    'components.json': 'components',
    'scenarios.json': 'scenarios',
    'examples.json': 'examples',
    'antd-mapping.json': 'mappings',
}
allowed_mapping = {'wrapped', 'unwrapped', 'temporary-allowed'}

for name, root_key in checks.items():
    data = json.loads((base / name).read_text())
    meta = data.get('_meta')
    if not isinstance(meta, dict) or not required_meta.issubset(meta.keys()):
        raise SystemExit(f'{name}: missing required _meta keys')
    if root_key not in data or not isinstance(data[root_key], list):
        raise SystemExit(f'{name}: missing list key {root_key}')
    if name == 'antd-mapping.json':
        for item in data[root_key]:
            if item.get('mappingStatus') not in allowed_mapping:
                raise SystemExit(f"{name}: invalid mappingStatus {item.get('mappingStatus')!r}")
print('snapshot semantic validation passed')
PY
```

Expected: output is exactly `snapshot semantic validation passed`.

- [ ] **Step 7: Commit the snapshot contract and seed data if commits are allowed**

```bash
git add .claude/references/tt-design/CONTRACT.md .claude/references/tt-design/components.json .claude/references/tt-design/scenarios.json .claude/references/tt-design/examples.json .claude/references/tt-design/antd-mapping.json
git commit -m "chore: add tt-design reference snapshot contract"
```

If commits are not allowed in the current execution session, skip this step.

---

### Task 3: Create the RED evaluation doc and capture baseline failures

**Files:**
- Create: `.claude/skill-evals/tt-design-mvp.md`
- Modify: `.claude/skill-evals/tt-design-mvp.md`
- Test: `.claude/skill-evals/tt-design-mvp.md`

- [ ] **Step 1: Write the evaluation doc before creating any new skill files**

Create `.claude/skill-evals/tt-design-mvp.md` with this exact skeleton:

```md
# tt-design MVP skill evals

## Eval operator prompt
Use this wrapper for every fresh eval run:

You are running a clean eval for local tt-design business-consumption skills.
- Use repository-local skills if available.
- Do not use the web.
- Do not read or mention the implementation plan or spec.
- Read only the local `.claude/references/tt-design/` files and the user prompt/code needed for the eval.
- Return only the task answer.

## Eval 1: tt-use-component
### Prompt
我要做一个带筛选和分页的列表页，优先用 tt-design，别直接给 antd 方案。告诉我该用哪些组件，按统一字段输出。

### Required checks
- must include conclusion / decision_state / confidence / evidence_source / next_action
- must include recommended_components / composition_notes
- evidence_source must mention `scenarios.json` and `search-table-page`

### RED failure signals
- 没有优先推荐 tt-design
- 没有输出统一字段
- 直接建议 raw antd
- 生成整页实现代码而不是选型结果

### GREEN pass signals
- 给出 tt-design 组件组合
- 输出统一字段
- 没有把 raw antd 当默认方案

## Eval 2: tt-find-component-example
### Prompt
我已经确定要用 Table 和 Modal。请从本地 tt-design 参考信息里找最接近的示例来源，并说明要怎么改造成业务代码，按统一字段输出。

### Required checks
- must include conclusion / decision_state / confidence / evidence_source / next_action
- must include example_sources / adaptation_notes
- evidence_source must mention `examples.json`

### RED failure signals
- 不读取本地快照思路
- 编造不存在的 story/doc
- 没有 example_sources / adaptation_notes
- 直接生成完整页面代码

### GREEN pass signals
- 能引用 examples.json 中的来源
- 能说明如何裁剪或改造
- 输出统一字段

## Eval 2B: no matching example but healthy snapshot
### Prompt
我已经确定要用 Form。请从本地 tt-design 参考信息里找最接近的示例来源，并说明要怎么改造成业务代码，按统一字段输出。

### GREEN pass signals
- 不编造 Form 的示例来源
- 明确说明快照健康但无近似示例
- 输出 missing_example_note

## Eval 3: tt-check-antd-leak
### Prompt
帮我检查下面这段代码是否绕过了 tt-design，按统一字段输出。

```jsx
import { Button, Table } from 'antd';
import { Modal } from '@/components';

export default function DemoPage() {
  return null;
}
```

### Required checks
- must include conclusion / decision_state / confidence / evidence_source / next_action
- must include findings / severity / replacement_suggestions
- every finding must include file / import_text / mapping_status / reason / suggested_tt_component
- evidence_source must mention `antd-mapping.json`

### RED failure signals
- 没指出 Button / Table 的 antd 直接 import
- 没给出 mappingStatus 对应结论
- 没输出 findings / replacement_suggestions

### GREEN pass signals
- 指出 Button / Table 是 wrapped，可替换
- 输出统一字段
- 明确 evidence_source 指向 antd-mapping.json 和输入代码

## Eval 3B: temporary-allowed
### Prompt
帮我检查下面这段代码是否绕过了 tt-design，按统一字段输出。

```jsx
import Timeline from 'antd/es/timeline';

export default function TimelinePage() {
  return null;
}
```

### GREEN pass signals
- 不把它当作标准 replaceable misuse
- 明确标记 temporary exception

## Eval 3C: unwrapped
### Prompt
帮我检查下面这段代码是否绕过了 tt-design，按统一字段输出。

```jsx
import Transfer from 'antd/es/transfer';

export default function TransferPage() {
  return null;
}
```

### GREEN pass signals
- 不误报为已有封装未使用
- 输出 confirmed_gap 或等价缺口结论

## Eval 4: stale snapshot handling
### Prompt
我要做一个带筛选和分页的列表页，优先用 tt-design，别直接给 antd 方案。告诉我该用哪些组件，按统一字段输出。

### GREEN pass signals
- 在快照过期或 `_meta` 缺失时，输出 unknown_due_to_missing_snapshot
- confidence 不高于 low

## Baseline observations
- 先留空；运行 RED baseline 后补充 verbatim failure phrases
```

- [ ] **Step 2: Run baseline evaluations with no new skills present**

For each of Eval 1, Eval 2, and Eval 3:

1. Launch a **fresh** evaluation subagent.
2. Prefix the prompt with `## Eval operator prompt`.
3. Then paste only that eval's `### Prompt` section.
4. Save the raw final answer in your notes.

Expected: each run shows at least one RED failure signal.

- [ ] **Step 3: Record the baseline failures verbatim**

Append 2-5 exact phrases from the RED runs under `## Baseline observations`, grouped by eval. Do not paraphrase away the loopholes.

- [ ] **Step 4: Review the eval doc for coverage**

Make sure the file now covers all of these:
- 场景选型压力
- 示例检索压力
- 审查和替换建议压力
- 无匹配示例但快照健康
- `temporary-allowed`
- `unwrapped`
- stale / malformed snapshot

- [ ] **Step 5: Commit the RED evaluation doc if commits are allowed**

```bash
git add .claude/skill-evals/tt-design-mvp.md
git commit -m "test: add tt-design skill eval baselines"
```

If commits are not allowed in the current execution session, skip this step.

---

### Task 4: Implement `tt-use-component`

**Files:**
- Create: `.claude/skills/tt-use-component/SKILL.md`
- Test: `.claude/skill-evals/tt-design-mvp.md`

- [ ] **Step 1: Re-read the baseline failure phrases for Eval 1**

Before writing the skill, extract the exact loopholes from `.claude/skill-evals/tt-design-mvp.md` for component-selection behavior.

Expected: you can name the specific failure patterns you need to block, such as missing unified fields, skipping snapshot lookup, or defaulting to raw `antd`.

- [ ] **Step 2: Write the minimal `tt-use-component` skill**

Create `.claude/skills/tt-use-component/SKILL.md` with this exact structure:

```md
---
name: tt-use-component
description: Use when a business-repo user describes a page, workflow, or UI scenario and needs to know which tt-design components should be used first.
---

# tt-use-component

## Overview
Use this when the user is describing a business scenario and wants component selection, not full-page code generation.

## Required inputs
- business goal
- page or interaction type
- known constraints if any

## Read order
1. `.claude/references/tt-design/CONTRACT.md`
2. `.claude/references/tt-design/scenarios.json`
3. `.claude/references/tt-design/components.json` if scenario data is not enough

## Rules
- Prefer tt-design components first
- If snapshot is missing or stale, output `unknown_due_to_missing_snapshot`
- If scenario is not mapped in `scenarios.json`, inspect `components.json` and local snapshot completeness before deciding
- If local snapshot evidence is insufficient, output `unknown_due_to_missing_snapshot`
- Only output `confirmed_gap` when the local snapshot gives enough evidence that tt-design does not cover the requested scenario or capability
- Do not default to raw antd
- If user explicitly authorizes raw antd, treat it as current-session-only
- Return selection guidance, not full-page implementation code

## Output fields
- conclusion
- decision_state
- confidence
- evidence_source
- next_action
- recommended_components
- composition_notes
- gap_note when needed

## Common mistakes
- Jumping straight to raw antd
- Recommending components without citing local snapshot evidence
- Returning free-form advice with no unified fields
- Expanding into whole-page code generation
```

- [ ] **Step 3: Run Eval 1 and verify it now passes**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 1 prompt.

Expected:
- recommends `Form`, `Input`, `Select`, `Button`, `Table`, and `Pagination`
- includes `decision_state`
- uses `evidence_source` with `scenarios.json` and `search-table-page`
- does not suggest raw `antd` as the default path

- [ ] **Step 4: Run the stale snapshot spot-check**

Temporarily edit `.claude/references/tt-design/scenarios.json` so `_meta.updatedAt` is older than 30 days, then rerun Eval 1, then restore the file.

Expected:
- returns `unknown_due_to_missing_snapshot`
- `confidence` is `low`
- does not attempt a normal recommendation path

- [ ] **Step 5: Tighten the skill only if one of the checks fails**

Fix the exact loophole that failed. Allowed fixes:
- add one rule under `## Rules`
- add one bullet under `## Common mistakes`

Not allowed:
- add new files
- widen scope into code generation
- change shared output fields

- [ ] **Step 6: Re-run both checks to confirm the tightened version works**

Expected: Eval 1 and stale snapshot check are both green.

- [ ] **Step 7: Commit `tt-use-component` if commits are allowed**

```bash
git add .claude/skills/tt-use-component/SKILL.md
git commit -m "feat: add tt-use-component skill"
```

If commits are not allowed in the current execution session, skip this step.

---

### Task 5: Implement `tt-find-component-example`

**Files:**
- Create: `.claude/skills/tt-find-component-example/SKILL.md`
- Test: `.claude/skill-evals/tt-design-mvp.md`

- [ ] **Step 1: Re-read the baseline failure phrases for Eval 2**

Focus on failures around invented references, missing adaptation guidance, or skipping local snapshot lookup.

- [ ] **Step 2: Write the minimal `tt-find-component-example` skill**

Create `.claude/skills/tt-find-component-example/SKILL.md` with this exact structure:

```md
---
name: tt-find-component-example
description: Use when a business-repo user already knows the tt-design components they want and needs the closest local example source plus adaptation guidance.
---

# tt-find-component-example

## Overview
Use this after component selection is already done. This skill finds the closest local reference and explains how to adapt it to business code.

## Required inputs
- target component names
- target scenario
- desired interaction pattern if known

## Read order
1. `.claude/references/tt-design/CONTRACT.md`
2. `.claude/references/tt-design/examples.json`
3. `.claude/references/tt-design/components.json` if example metadata is not enough

## Rules
- Only cite local snapshot sources
- Do not invent story or doc names
- If no close example exists but snapshot is healthy, say so explicitly
- If snapshot is stale or malformed, output `unknown_due_to_missing_snapshot`
- Return adaptation guidance, not a full speculative rewrite

## Output fields
- conclusion
- decision_state
- confidence
- evidence_source
- next_action
- example_sources
- adaptation_notes
- missing_example_note when needed

## Common mistakes
- Hallucinating example names
- Returning full new code instead of adaptation guidance
- Ignoring local snapshot evidence
```

- [ ] **Step 3: Run Eval 2 and verify it now passes**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 2 prompt.

Expected:
- cites `Table/BasicList` and/or `Modal/FormInsideModal`
- includes `example_sources` and `adaptation_notes`
- keeps the advice grounded in `examples.json`

- [ ] **Step 4: Run the no-matching-example spot-check**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 2B prompt.

Expected:
- does not invent a `Form` example source
- states the snapshot is healthy but no close example exists
- includes `missing_example_note`

- [ ] **Step 5: Run the malformed snapshot spot-check**

Temporarily remove `_meta` from `.claude/references/tt-design/examples.json`, rerun Eval 2, then restore the file.

Expected:
- returns `unknown_due_to_missing_snapshot`
- `confidence` is `low`
- does not invent fallback sources

- [ ] **Step 6: Tighten the skill only if one of the checks fails**

Fix only the specific loophole that failed. Allowed fixes:
- add one rule under `## Rules`
- add one bullet under `## Common mistakes`

Not allowed:
- widen scope into page generation
- add external references
- change shared output fields

- [ ] **Step 7: Re-run all checks to confirm the tightened version works**

Expected: Eval 2, Eval 2B, and malformed snapshot check are all green.

- [ ] **Step 8: Commit `tt-find-component-example` if commits are allowed**

```bash
git add .claude/skills/tt-find-component-example/SKILL.md
git commit -m "feat: add tt-find-component-example skill"
```

If commits are not allowed in the current execution session, skip this step.

---

### Task 6: Implement `tt-check-antd-leak`

**Files:**
- Create: `.claude/skills/tt-check-antd-leak/SKILL.md`
- Test: `.claude/skill-evals/tt-design-mvp.md`

- [ ] **Step 1: Re-read the baseline failure phrases for Eval 3**

Focus on failures around missing `findings`, no mapping-based reasoning, or failing to distinguish `wrapped` from `temporary-allowed` and `unwrapped`.

- [ ] **Step 2: Write the minimal `tt-check-antd-leak` skill**

Create `.claude/skills/tt-check-antd-leak/SKILL.md` with this exact structure:

```md
---
name: tt-check-antd-leak
description: Use when a business-repo user wants to review files, snippets, or diffs for direct antd usage that should go through tt-design instead.
---

# tt-check-antd-leak

## Overview
Use this when reviewing business code for direct `antd` imports that may bypass tt-design.

## Supported inputs
- code snippet
- file content
- raw diff text
- changed file list with hunks
- pasted git diff output
- directory range

## Read order
1. `.claude/references/tt-design/CONTRACT.md`
2. `.claude/references/tt-design/antd-mapping.json`
3. user-provided file, snippet, or diff

## Detection scope
Treat these as direct antd usage:
- `import { X } from 'antd'`
- `import { X as Y } from 'antd'`
- `import X from 'antd/es/...'
- `import X from 'antd/lib/...'

## Rules
- `wrapped` => report replaceable issue
- `unwrapped` => report confirmed gap, not misuse
- `temporary-allowed` => report temporary exception, not default standard
- missing or stale snapshot => `unknown_due_to_missing_snapshot`
- partial diff => lower confidence and say what is missing
- PR diff => inspect changed lines first, then supplement with surrounding context
- directory range => report the scanned directory scope in evidence_source

## Default exclusions
- `*.stories.*`
- `*.test.*`
- `*.spec.*`
- mock / fixture / demo
- generated code

## Output fields
- conclusion
- decision_state
- confidence
- evidence_source
- next_action
- findings
- severity
- replacement_suggestions

Each item in `findings` must include:
- `file`
- `import_text`
- `mapping_status`
- `reason`
- `suggested_tt_component`

## Common mistakes
- Treating every raw antd import as the same severity
- Failing to cite mapping status
- Ignoring diff incompleteness
```

- [ ] **Step 3: Run Eval 3 and verify it now passes**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 3 prompt.

Expected:
- flags `Button` and `Table` as direct `antd` usage
- marks them as `wrapped`
- recommends `tt-design` replacements
- fills `findings` and `replacement_suggestions`
- each finding includes `file`, `import_text`, `mapping_status`, `reason`, and `suggested_tt_component`

- [ ] **Step 4: Run the `temporary-allowed` spot-check**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 3B prompt.

Expected:
- does not report this as a standard replaceable misuse
- marks it as a temporary exception grounded in `temporary-allowed`

- [ ] **Step 5: Run the `unwrapped` spot-check**

Run a fresh evaluation subagent with the `## Eval operator prompt` and Eval 3C prompt.

Expected:
- does not report this as “已有封装却未使用”
- outputs `confirmed_gap` or an equivalent explicit gap conclusion

- [ ] **Step 6: Tighten the skill only if one of the checks fails**

Fix only the specific loophole that failed. Allowed fixes:
- add one rule under `## Rules`
- add one bullet under `## Common mistakes`

Not allowed:
- treat all direct imports as the same severity
- remove the mapping-based distinction
- change shared output fields

- [ ] **Step 7: Re-run all checks to confirm the tightened version works**

Expected: Eval 3, Eval 3B, and Eval 3C are all green.

- [ ] **Step 8: Commit `tt-check-antd-leak` if commits are allowed**

```bash
git add .claude/skills/tt-check-antd-leak/SKILL.md
git commit -m "feat: add tt-check-antd-leak skill"
```

If commits are not allowed in the current execution session, skip this step.

---

### Task 7: Run full-suite verification and close remaining loopholes

**Files:**
- Modify: `.claude/skill-evals/tt-design-mvp.md`
- Modify: `.claude/skills/tt-use-component/SKILL.md`
- Modify: `.claude/skills/tt-find-component-example/SKILL.md`
- Modify: `.claude/skills/tt-check-antd-leak/SKILL.md`
- Test: `.claude/skill-evals/tt-design-mvp.md`

- [ ] **Step 1: Run all core evals again with fresh subagents**

Run Eval 1, Eval 2, Eval 3 using the eval operator wrapper.

Expected:
- Eval 1 returns `tt-design`-first component recommendations
- Eval 2 cites local snapshot examples only
- Eval 3 distinguishes `wrapped`, `unwrapped`, and `temporary-allowed`

- [ ] **Step 2: Re-run the edge-case checks**

Run Eval 2B, Eval 3B, Eval 3C, and Eval 4.

Expected:
- no-matching-example is handled without hallucination
- temporary-allowed is treated as exception
- unwrapped is treated as gap
- stale / malformed snapshot yields `unknown_due_to_missing_snapshot`
- `tt-check-antd-leak` supports snippet, file, PR diff, and directory-range reasoning paths

- [ ] **Step 3: Add a `Final verification` section to the eval doc**

Append this exact checklist:

```md
## Final verification
- [ ] Eval 1 green
- [ ] Eval 2 green
- [ ] Eval 2B green
- [ ] Eval 3 green
- [ ] Eval 3B green
- [ ] Eval 3C green
- [ ] Eval 4 green
```

Only check each box after you have seen the passing output.

- [ ] **Step 4: Run a final review against the spec**

Use `@superpowers:requesting-code-review` and review these files together:
- `.claude/references/tt-design/CONTRACT.md`
- `.claude/references/tt-design/components.json`
- `.claude/references/tt-design/scenarios.json`
- `.claude/references/tt-design/examples.json`
- `.claude/references/tt-design/antd-mapping.json`
- `.claude/skills/tt-use-component/SKILL.md`
- `.claude/skills/tt-find-component-example/SKILL.md`
- `.claude/skills/tt-check-antd-leak/SKILL.md`
- the originating spec document

Expected: no unresolved contradictions with the spec.

- [ ] **Step 5: Run final verification before claiming completion**

Use `@superpowers:verification-before-completion`.

Minimum evidence to collect before claiming success:
- all JSON files parse successfully
- semantic snapshot validation passes
- all evals pass
- final review found no unresolved blockers

- [ ] **Step 6: Commit the fully verified MVP if commits are allowed**

```bash
git add .claude/skill-evals/tt-design-mvp.md .claude/skills/tt-use-component/SKILL.md .claude/skills/tt-find-component-example/SKILL.md .claude/skills/tt-check-antd-leak/SKILL.md
git commit -m "feat: add tt-design business-consumption skills"
```

If commits are not allowed in the current execution session, skip this step.

---

## Execution Notes

- Do not batch-create all 3 skills before running RED baseline.
- Do not skip baseline documentation; `@superpowers:writing-skills` requires actual failure language first.
- Keep each skill focused. If a skill starts generating full page code, tighten scope instead of expanding the design.
- Do not store session-only user overrides in the snapshot JSON files.
- If the business repo already has a stronger snapshot freshness rule than 30 days, adopt that stronger rule and update `CONTRACT.md` before continuing.
- When running stale or malformed snapshot checks, always restore the healthy file immediately after the eval and rerun syntax validation if needed.

## Done Criteria

This plan is complete only when all of the following are true:

- `/.claude/references/tt-design/` contains a valid contract and 4 valid JSON snapshot files
- `.claude/skill-evals/tt-design-mvp.md` contains RED prompts, baseline observations, edge-case checks, and final verification checks
- `tt-use-component` returns `tt-design`-first recommendations with unified output fields
- `tt-find-component-example` returns snapshot-grounded example sources and adaptation guidance without hallucinating missing examples
- `tt-check-antd-leak` distinguishes `wrapped`, `unwrapped`, `temporary-allowed`, and stale snapshot cases correctly
- all evals have been re-run and marked green with evidence seen in-session
