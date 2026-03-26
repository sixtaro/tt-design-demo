# TT Design Theme Typography Rule Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将颜色与字体规范收口为单一入口：`CLAUDE.md` 作为唯一活跃规则源，`other.md` 退役为归档说明。

**Architecture:** 本次只做规则入口收口，不改主题运行时实现。`CLAUDE.md` 负责描述开发规则和规则到实现文件的映射；`other.md` 只保留归档说明；`src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`、`src/theme/index.js` 保持现有职责不变。

**Tech Stack:** Markdown, `CLAUDE.md`, `other.md`, Python 内置文本校验, git scoped diff

---

## Scope And Assumptions

- 本计划只修改 2 个现有文件：`CLAUDE.md` 与 `other.md`。
- 本计划**不**修改 `src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`、`src/theme/index.js`。
- 当前工作区已有其他未完成改动；执行本计划时不要顺手修改与本任务无关的文件。
- 本计划不要求提交 commit；除非用户单独授权，否则执行时停在本地已验证的文件改动。
## Operator Notes

- 先读取 spec：`docs/superpowers/specs/2026-03-26-tt-design-theme-typography-rule-consolidation-design.md`
- 由于这是文档/规则收口任务，验证采用“文本断言 + scoped diff”，不需要引入新的测试框架。
- 本计划的验证目标只有 4 个：`CLAUDE.md` 映射完整、`CLAUDE.md` 明确唯一活跃入口、`other.md` 完成归档退役、改动不超出 spec。

## File Structure

### Modify
- `CLAUDE.md:131`
  - 明确颜色与字体规范的唯一活跃规则入口地位，并补充到真实实现文件的映射：`src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`、`src/theme/index.js`。
- `other.md:1`
  - 移除活跃规则正文，替换成简短归档说明，明确它不再是颜色与字体规范的活跃规范源。

### Reference
- `docs/superpowers/specs/2026-03-26-tt-design-theme-typography-rule-consolidation-design.md`
  - 本计划的来源 spec。
- `src/theme/color-palette.js:2`
  - 颜色单一来源。
- `src/style/color.less:254`
  - CSS 自定义属性输出层。
- `src/style/themes/default.less:4`
  - 字号、行高、字重变量入口。
- `src/theme/index.js:12`
  - 运行时主题变量应用逻辑；本计划不改动它。

### Testing Surface
- `CLAUDE.md`
  - 通过 Python 文本断言验证是否包含 4 个实现文件引用，并明确自己是颜色与字体规范的唯一活跃规则入口。
- `other.md`
  - 通过 Python 文本断言验证是否已退役为归档说明，且不再保留旧规则标题。

---

### Task 1: Add explicit theme and typography file mapping to `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md:131`
- Test: `CLAUDE.md`
- Reference: `docs/superpowers/specs/2026-03-26-tt-design-theme-typography-rule-consolidation-design.md`

- [ ] **Step 1: Write the failing verification for `CLAUDE.md` rule mapping and ownership statement**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('CLAUDE.md').read_text()
required = [
    'src/theme/color-palette.js',
    'src/style/color.less',
    'src/style/themes/default.less',
    'src/theme/index.js',
    '唯一活跃规则入口',
    'other.md',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('CLAUDE.md missing references or ownership text: ' + ', '.join(missing))
print('claude rule mapping ok')
PY
```

Expected: FAIL, because the current `CLAUDE.md` does not fully spell out all required implementation mappings or the single-entry ownership statement.

- [ ] **Step 2: Add the color implementation mapping to `CLAUDE.md`**

Add a short bullet block under the color rules equivalent to:

```md
- 颜色单一来源：`src/theme/color-palette.js`
- CSS 变量输出层：`src/style/color.less`
```

Keep the existing color rules unchanged:
- 继续要求使用 `var(--tt-*)`
- 继续禁止硬编码十六进制颜色
- 不复制完整变量表

- [ ] **Step 3: Add the typography and runtime-theme mapping to `CLAUDE.md`**

Add a short bullet block under the typography rules equivalent to:

```md
- 字号 / 行高 / 字重变量：`src/style/themes/default.less`
- 运行时主题应用：`src/theme/index.js`
```

Keep the existing typography rules unchanged:
- 继续要求使用 `@font-size-*` / `@line-height-*`
- 继续要求颜色优先使用 `var(--tt-*)`
- 不复制实现细节

- [ ] **Step 4: Add the single-entry statement to `CLAUDE.md`**

Add one explicit sentence equivalent to:

```md
`CLAUDE.md` 是颜色与字体规范的唯一活跃规则入口；不要再以 `other.md` 作为并行规范源。
```

- [ ] **Step 5: Re-run the `CLAUDE.md` verification and make sure it passes**

Run the same command from Step 1.

Expected: PASS with output exactly:

```text
claude rule mapping ok
```

- [ ] **Step 6: Inspect the scoped diff for `CLAUDE.md` only**

Run:

```bash
git diff -- CLAUDE.md
```

Expected: diff only clarifies rule wording and file mappings; it must not introduce unrelated rule changes.

---

### Task 2: Replace `other.md` with an archive note

**Files:**
- Modify: `other.md:1`
- Test: `other.md`
- Reference: `docs/superpowers/specs/2026-03-26-tt-design-theme-typography-rule-consolidation-design.md`

- [ ] **Step 1: Write the failing verification for `other.md` archive state**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('other.md').read_text()
required = [
    '归档说明',
    '不再作为活跃规范源',
    '`CLAUDE.md`',
    '`src/theme/color-palette.js`',
    '`src/style/color.less`',
    '`src/style/themes/default.less`',
    '`src/theme/index.js`',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('other.md missing archive markers: ' + ', '.join(missing))
legacy = [
    '# tt-design 组件架构规约',
    '# tt-design 色彩规范',
    '## 2. 组件编写标准',
    '## 字阶与行高',
]
present_legacy = [item for item in legacy if item in text]
if present_legacy:
    raise SystemExit('other.md still contains legacy rule sections: ' + ', '.join(present_legacy))
print('other archive note ok')
PY
```

Expected: FAIL, because `other.md` still contains the old active rule content.

- [ ] **Step 2: Replace `other.md` frontmatter with archive wording only for color and typography**

Overwrite the frontmatter and top-level note so it only says the file is archived and that color / typography rules have been consolidated.

Required constraints:
- must mention `CLAUDE.md`
- must mention `src/theme/color-palette.js`
- must mention `src/style/color.less`
- must mention `src/style/themes/default.less`
- must mention `src/theme/index.js`
- must **not** expand the archive claim to all component-writing rules

- [ ] **Step 3: Replace the legacy body with a short archive note**

The resulting body should be equivalent to:

```md
# 归档说明

本文件不再作为颜色与字体规范的活跃规范源。

当前请以 `CLAUDE.md` 作为颜色与字体规范的唯一活跃入口。

主题与样式实现文件如下：
- `src/theme/color-palette.js`
- `src/style/color.less`
- `src/style/themes/default.less`
- `src/theme/index.js`
```

Do not keep any of the previous long-form rule sections in `other.md`.

- [ ] **Step 4: Re-run the `other.md` archive verification and make sure it passes**

Run the same command from Step 1.

Expected: PASS with output exactly:

```text
other archive note ok
```

- [ ] **Step 5: Inspect the scoped diff for `other.md` only**

Run:

```bash
git diff -- other.md
```

Expected: the diff removes the old parallel rule body and replaces it with a short archive note only.

---

### Task 3: Run final verification for the consolidation

**Files:**
- Modify: `CLAUDE.md:131`
- Modify: `other.md:1`
- Test: `CLAUDE.md`
- Test: `other.md`
- Reference: `docs/superpowers/specs/2026-03-26-tt-design-theme-typography-rule-consolidation-design.md`

- [ ] **Step 1: Run both verification commands back-to-back**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('CLAUDE.md').read_text()
required = [
    'src/theme/color-palette.js',
    'src/style/color.less',
    'src/style/themes/default.less',
    'src/theme/index.js',
    '唯一活跃规则入口',
    'other.md',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('CLAUDE.md missing references or ownership text: ' + ', '.join(missing))
print('claude rule mapping ok')
PY
python - <<'PY'
from pathlib import Path
text = Path('other.md').read_text()
required = [
    '归档说明',
    '不再作为活跃规范源',
    '`CLAUDE.md`',
    '`src/theme/color-palette.js`',
    '`src/style/color.less`',
    '`src/style/themes/default.less`',
    '`src/theme/index.js`',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('other.md missing archive markers: ' + ', '.join(missing))
legacy = [
    '# tt-design 组件架构规约',
    '# tt-design 色彩规范',
    '## 2. 组件编写标准',
    '## 字阶与行高',
]
present_legacy = [item for item in legacy if item in text]
if present_legacy:
    raise SystemExit('other.md still contains legacy rule sections: ' + ', '.join(present_legacy))
print('other archive note ok')
PY
```

Expected:

```text
claude rule mapping ok
other archive note ok
```

- [ ] **Step 2: Run whitespace and scoped diff checks**

Run:

```bash
git diff --check -- CLAUDE.md other.md && git diff -- CLAUDE.md other.md
```

Expected:
- `git diff --check` prints no output
- the remaining diff only touches the planned wording in `CLAUDE.md` and the archive rewrite in `other.md`

- [ ] **Step 3: Compare the diff against the spec section-by-section**

Use this checklist manually while reading the diff:
- `CLAUDE.md` 是否补齐了 4 个实现文件映射
- `CLAUDE.md` 是否明确“唯一活跃规则入口”
- `other.md` 是否只收口颜色与字体，不扩大到组件编写规范
- 是否没有触碰 spec 明确排除的实现文件

Expected: every checklist item is satisfied.

- [ ] **Step 4: Stop at locally verified changes**

Do not add commit or extra execution steps. The handoff condition is: files updated, scoped verification passed, diff aligns with spec.

---

## Execution Notes

- 不要顺手修改 `src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`、`src/theme/index.js`。
- 不要把 `other.md` 改成“另一份更短的活跃规范”；它的职责是归档，不是并行维护。
- 不要把完整变量表复制进 `CLAUDE.md`；只保留规则和文件映射。
- 如果执行过程中发现 `CLAUDE.md` 已经被别的在途改动修改过，先对比目标段落，避免覆盖 unrelated work。
- 当前工作区还有 `.claude/skills/` 重命名或 Storybook 相关改动；执行本计划时只关注 `CLAUDE.md` 与 `other.md` 的 scoped diff。

## Done Criteria

This plan is complete only when all of the following are true:

- `CLAUDE.md` 明确说明颜色与字体规范的实现落点：`src/theme/color-palette.js`、`src/style/color.less`、`src/style/themes/default.less`、`src/theme/index.js`
- `CLAUDE.md` 明确表达自己是颜色与字体规范的唯一活跃规则入口，并明确 `other.md` 不再是并行规范源
- `other.md` 只保留颜色与字体相关的归档说明，不再保留旧的活跃规则章节
- 主题实现文件职责保持不变，没有被本次任务改动
- 所有 scoped verification 都已在会话中重新运行并通过
