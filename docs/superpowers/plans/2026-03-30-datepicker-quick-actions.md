# DatePicker Quick Action Bugfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the DatePicker quick-actions popup open while immediately selecting the clicked date.

**Architecture:** The component already has quick-action rendering, change handling, active-state highlighting, and an `onOpenChange(false)` suppression fallback. The missing piece is to stop a quick-action button `mousedown` from stealing focus before `click` runs. Fix the interaction locally inside `QuickActionPanel`, then lock it in with a regression test that covers the `mousedown` safeguard and re-run the existing quick-action regression suite.

**Tech Stack:** React 17, Ant Design 4.24.8, JavaScript/JSX, Jest, React Testing Library, moment

---

## File Map

- Modify: `src/components/DatePicker/index.test.js`
  - Add a regression test for the missing `mousedown` safeguard and use the existing quick-action tests as the broader safety net for selection, open-state, and active-state behavior.
- Modify: `src/components/DatePicker/index.js`
  - Prevent the quick-action button from blurring the picker trigger on `mousedown` while preserving the current `onClick`, `onChange`, and `quickActionPendingRef` flow.

### Task 1: Add the failing regression test and implement the minimal fix

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify: `src/components/DatePicker/index.js`
- Test: `src/components/DatePicker/index.test.js`

- [ ] **Step 1: Write the failing regression test**

Update the React Testing Library import in `src/components/DatePicker/index.test.js` from:

```js
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
```

to:

```js
import { act, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
```

Then append this test inside `describe('DatePicker quick actions', () => { ... })`:

```js
it('prevents quick action mousedown from blurring the picker before click', async () => {
  render(
    <DatePicker
      open
      showQuickActions
      version={DatePicker.version}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    />
  );

  const quickAction = await screen.findByRole('button', { name: '今天' });
  const mouseDownEvent = createEvent.mouseDown(quickAction);

  fireEvent(quickAction, mouseDownEvent);

  expect(mouseDownEvent.defaultPrevented).toBe(true);
});
```

- [ ] **Step 2: Run the new test to verify it fails for the right reason**

Run:

```bash
yarn test:components src/components/DatePicker/index.test.js -t "prevents quick action mousedown from blurring the picker before click"
```

Expected: FAIL because the current quick-action button does not call `preventDefault()` on `mousedown`, so `mouseDownEvent.defaultPrevented` is `false`.

- [ ] **Step 3: Write the minimal implementation in `src/components/DatePicker/index.js`**

Replace the current `QuickActionPanel` block with this version:

```js
const QuickActionPanel = ({ actions, currentValue, onActionClick }) => {
  const handleQuickActionMouseDown = (event) => {
    event.preventDefault();
  };

  return (
    <div className="tt-picker-quick-actions">
      {actions.map((action) => {
        const actionValue = action.getValue();
        const isActive = currentValue && moment(currentValue).isSame(actionValue, 'day');

        return (
          <button
            key={action.key}
            type="button"
            className={classNames('tt-picker-quick-action', {
              'tt-picker-quick-action-active': isActive,
            })}
            onMouseDown={handleQuickActionMouseDown}
            onClick={() => onActionClick(action)}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
};
```

This is the only production-code change for the bugfix. Do not change `handleQuickActionClick`, `handleOpenChange`, styles, stories, or other picker branches in this task.

- [ ] **Step 4: Run the DatePicker quick-action tests to verify the fix**

Run:

```bash
yarn test:components src/components/DatePicker/index.test.js
```

Expected: PASS for the full DatePicker quick-actions suite, including:
- `prevents quick action mousedown from blurring the picker before click`
- `calls onChange when a quick action is clicked and keeps popup open so calendar highlights`
- `does not close popup when clicking quick action in controlled mode`
- `suppresses onOpenChange(false) from Ant Design when clicking quick action in controlled mode`
- `highlights the quick action that matches the current value`

### Task 2: Verify the Storybook scenario and create the final commit

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify: `src/components/DatePicker/index.js`

- [ ] **Step 1: Start Storybook for the manual regression check**

Run:

```bash
yarn storybook
```

Expected: Storybook starts on `http://localhost:6006`.

- [ ] **Step 2: Manually verify the user-reported story**

Open the story `数据录入/DatePicker 日期选择器/快捷操作` and click the left-side `今天` shortcut.

Expected:
- the popup stays open
- the clicked date is selected immediately on the calendar
- the left-side `今天` quick action shows the active state

- [ ] **Step 3: Run a production build to catch packaging regressions**

Run:

```bash
yarn build
```

Expected: SUCCESS with no Rollup build errors.

- [ ] **Step 4: Review the final diff to keep the change scoped**

Run:

```bash
git diff -- src/components/DatePicker/index.js src/components/DatePicker/index.test.js
```

Expected: only the `QuickActionPanel` `onMouseDown` safeguard and the new regression test appear.

- [ ] **Step 5: Create the final commit**

Run:

```bash
git add src/components/DatePicker/index.js src/components/DatePicker/index.test.js
git commit -m "fix(DatePicker): prevent quick action blur-close on mousedown"
```

## Self-Review

- **Spec coverage:** The plan covers the approved bugfix scope: keep the popup open, keep immediate date selection, preserve quick-action active-state behavior, and verify the exact Storybook scenario the user reported.
- **Placeholder scan:** No `TODO`, `TBD`, “similar to Task N”, or generic “write tests later” instructions remain.
- **Type consistency:** The plan consistently uses the existing `QuickActionPanel`, `quickActionPendingRef`, `showQuickActions`, `onActionClick`, and `tt-picker-quick-action-active` names already present in the component and test file.
