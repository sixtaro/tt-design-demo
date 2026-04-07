# DatePicker Quick Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Figma-aligned quick actions to the single-value `DatePicker` when `picker="date"`, with default and custom quick actions rendered through `panelRender` while preserving existing behavior for all other picker modes.

**Architecture:** Extend `src/components/DatePicker/index.js` instead of introducing a new abstraction. The wrapper will merge default/custom quick actions, compose them with any user-provided `panelRender`, and lightly manage `value`/`open` only when the quick-action panel is enabled. Styling stays in `src/components/DatePicker/index.less`, and Storybook documents the new behavior. Because the repo does not currently expose a React component test harness, the plan first adds a minimal Jest + React Testing Library setup so TDD is real instead of performative.

**Tech Stack:** React 17, Ant Design 4.24.8, JavaScript/JSX, Less, Storybook 6, Jest, React Testing Library, moment

---

## File Map

- Modify: `package.json`
  - Add a real component test script and the minimum dev dependencies required to run it.
- Create: `jest.config.js`
  - Jest environment/config for JSX component tests.
- Create: `babel.config.js`
  - Babel transform config for Jest so existing JSX files can be tested.
- Create: `src/components/DatePicker/index.test.js`
  - Behavior tests for quick actions in TDD order.
- Modify: `src/components/DatePicker/index.js`
  - Add quick-action props, state merging, `panelRender` composition, and click behavior.
- Modify: `src/components/DatePicker/index.less`
  - Add left quick-action rail layout and states matching the approved Figma design.
- Modify: `src/components/DatePicker/DatePicker.stories.js`
  - Add Storybook scenarios for default and custom quick actions.
- Optional modify: `src/utils/version-config.js`
  - Only if the repo expects feature changes to bump component version.

### Task 1: Add a real component test harness

**Files:**
- Modify: `package.json`
- Create: `jest.config.js`
- Create: `babel.config.js`

- [ ] **Step 1: Write the failing config-first smoke test file**

Create `src/components/DatePicker/index.test.js` with this minimal test so the harness has a target:

```js
import React from 'react';
import { render } from '@testing-library/react';
import DatePicker from './index';

describe('DatePicker quick actions', () => {
  it('renders base DatePicker without crashing', () => {
    render(<DatePicker open version={DatePicker.version} />);
  });
});
```

- [ ] **Step 2: Run test to verify it fails because the harness does not exist yet**

Run: `npx jest src/components/DatePicker/index.test.js --runInBand`
Expected: FAIL with missing Jest config / missing jsdom / missing transform support.

- [ ] **Step 3: Add the minimal test script and dependencies**

Update `package.json` by adding a script and dev dependencies:

```json
{
  "scripts": {
    "test:components": "jest --runInBand"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^12.1.5",
    "babel-jest": "^29.7.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

- [ ] **Step 4: Add Jest config**

Create `jest.config.js`:

```js
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/components/**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(less|css)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
```

- [ ] **Step 5: Add Babel config for Jest**

Create `babel.config.js`:

```js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
};
```

- [ ] **Step 6: Install the new test dependencies**

Run: `npm install`
Expected: install completes successfully and updates lockfile if needed.

- [ ] **Step 7: Run the smoke test to verify the harness passes**

Run: `npm run test:components -- src/components/DatePicker/index.test.js`
Expected: PASS for the single smoke test.

- [ ] **Step 8: Commit the harness setup**

```bash
git add package.json package-lock.json jest.config.js babel.config.js src/components/DatePicker/index.test.js
git commit -m "test: add component test harness for DatePicker"
```

### Task 2: Add a failing test for default quick actions

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify later: `src/components/DatePicker/index.js`

- [ ] **Step 1: Replace the smoke test with the first real failing test**

Update `src/components/DatePicker/index.test.js` to:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import DatePicker from './index';

describe('DatePicker quick actions', () => {
  it('renders default quick actions when showQuickActions is true for date picker', () => {
    render(<DatePicker open showQuickActions version={DatePicker.version} />);

    expect(screen.getByText('昨天')).toBeInTheDocument();
    expect(screen.getByText('今天')).toBeInTheDocument();
    expect(screen.getByText('明天')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails for the expected reason**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "renders default quick actions"`
Expected: FAIL because the quick-action labels are not rendered.

- [ ] **Step 3: Add the minimal quick-action rendering implementation**

In `src/components/DatePicker/index.js`, add:

```js
import moment from 'moment';
import React, { useMemo, useState } from 'react';
```

Add helpers above `DatePicker`:

```js
const getDefaultQuickActions = () => ([
  { key: 'yesterday', label: '昨天', getValue: () => moment().subtract(1, 'day') },
  { key: 'today', label: '今天', getValue: () => moment() },
  { key: 'tomorrow', label: '明天', getValue: () => moment().add(1, 'day') },
]);

const getMergedQuickActions = ({ showQuickActions, quickActions }) => {
  if (Array.isArray(quickActions) && quickActions.length > 0) {
    return quickActions;
  }

  if (showQuickActions) {
    return getDefaultQuickActions();
  }

  return [];
};

const QuickActionPanel = ({ actions }) => {
  return (
    <div className="tt-picker-quick-actions">
      {actions.map((action) => (
        <button key={action.key} type="button" className="tt-picker-quick-action">
          {action.label}
        </button>
      ))}
    </div>
  );
};
```

Inside `DatePicker`, compute and apply:

```js
const mergedPicker = props.picker || 'date';
const mergedQuickActions = useMemo(
  () => getMergedQuickActions({ showQuickActions: props.showQuickActions, quickActions: props.quickActions }),
  [props.showQuickActions, props.quickActions]
);
const shouldShowQuickActions = !disabled && mergedPicker === 'date' && mergedQuickActions.length > 0;

const mergedPanelRender = (panelNode) => {
  const renderedPanel = props.panelRender ? props.panelRender(panelNode) : panelNode;

  if (!shouldShowQuickActions) {
    return renderedPanel;
  }

  return (
    <div className="tt-picker-panel-with-quick-actions">
      <QuickActionPanel actions={mergedQuickActions} />
      <div className="tt-picker-quick-actions-divider" />
      <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
    </div>
  );
};
```

Pass it to `AntDatePicker`:

```js
panelRender={mergedPanelRender}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "renders default quick actions"`
Expected: PASS.

- [ ] **Step 5: Commit the first behavior**

```bash
git add src/components/DatePicker/index.test.js src/components/DatePicker/index.js
git commit -m "feat: render DatePicker quick actions panel"
```

### Task 3: Add failing tests for scope boundaries and priority rules

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify later: `src/components/DatePicker/index.js`

- [ ] **Step 1: Add failing tests for non-date and disabled boundaries**

Append these tests:

```js
it('does not render quick actions for non-date pickers', () => {
  render(<DatePicker open showQuickActions picker="month" version={DatePicker.version} />);

  expect(screen.queryByText('昨天')).not.toBeInTheDocument();
});

it('does not render quick actions when disabled', () => {
  render(<DatePicker open showQuickActions disabled version={DatePicker.version} />);

  expect(screen.queryByText('昨天')).not.toBeInTheDocument();
});

it('prefers custom quickActions over default quick actions', () => {
  render(
    <DatePicker
      open
      showQuickActions
      quickActions={[{ key: 'custom', label: '自定义', getValue: () => moment('2026-07-22') }]}
      version={DatePicker.version}
    />
  );

  expect(screen.getByText('自定义')).toBeInTheDocument();
  expect(screen.queryByText('昨天')).not.toBeInTheDocument();
});
```

Add import at the top if missing:

```js
import moment from 'moment';
```

- [ ] **Step 2: Run the targeted tests to verify the expected failures**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "does not render quick actions|prefers custom quickActions"`
Expected: FAIL because current code does not yet fully enforce these rules or the custom case.

- [ ] **Step 3: Tighten the implementation to satisfy the rules**

In `src/components/DatePicker/index.js`, ensure the prop signature includes new fields:

```js
const DatePicker = ({
  placeholder,
  disabled,
  format,
  version,
  className,
  popupClassName,
  showQuickActions,
  quickActions,
  panelRender,
  picker,
  ...props
}) => {
```

Use the destructured values in the merge logic:

```js
const mergedPicker = picker || 'date';
const mergedQuickActions = useMemo(
  () => getMergedQuickActions({ showQuickActions, quickActions }),
  [showQuickActions, quickActions]
);
const shouldShowQuickActions = !disabled && mergedPicker === 'date' && mergedQuickActions.length > 0;

const mergedPanelRender = (panelNode) => {
  const renderedPanel = panelRender ? panelRender(panelNode) : panelNode;
  if (!shouldShowQuickActions) return renderedPanel;
  return (
    <div className="tt-picker-panel-with-quick-actions">
      <QuickActionPanel actions={mergedQuickActions} />
      <div className="tt-picker-quick-actions-divider" />
      <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
    </div>
  );
};
```

Pass `picker={picker}` through to `AntDatePicker` so the logic and actual component stay aligned.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "does not render quick actions|prefers custom quickActions"`
Expected: PASS.

- [ ] **Step 5: Commit the scope and priority behavior**

```bash
git add src/components/DatePicker/index.test.js src/components/DatePicker/index.js
git commit -m "feat: scope DatePicker quick actions to date mode"
```

### Task 4: Add failing tests for click behavior and active-state matching

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify later: `src/components/DatePicker/index.js`

- [ ] **Step 1: Add failing tests for click, close, and active state**

Append these tests:

```js
import { fireEvent } from '@testing-library/react';

it('calls onChange and closes when a quick action is clicked', () => {
  const handleChange = jest.fn();

  render(<DatePicker defaultOpen showQuickActions onChange={handleChange} version={DatePicker.version} />);

  fireEvent.click(screen.getByRole('button', { name: '今天' }));

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('昨天')).not.toBeInTheDocument();
});

it('highlights the quick action that matches the current value', () => {
  render(
    <DatePicker
      open
      showQuickActions
      value={moment().subtract(1, 'day')}
      version={DatePicker.version}
    />
  );

  expect(screen.getByRole('button', { name: '昨天' })).toHaveClass('tt-picker-quick-action-active');
});
```

Update the import line to include `fireEvent`:

```js
import { fireEvent, render, screen } from '@testing-library/react';
```

- [ ] **Step 2: Run the targeted tests to verify they fail for the right reasons**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "calls onChange and closes|highlights the quick action"`
Expected: FAIL because buttons do not call `onChange`, panel stays open, and no active class is applied.

- [ ] **Step 3: Implement the minimal click and matching logic**

In `src/components/DatePicker/index.js`, extend `QuickActionPanel` to accept state and callbacks:

```js
const QuickActionPanel = ({ actions, currentValue, onActionClick }) => {
  return (
    <div className="tt-picker-quick-actions">
      {actions.map((action) => {
        const nextValue = action.getValue();
        const isActive = currentValue && moment(currentValue).isSame(nextValue, 'day');

        return (
          <button
            key={action.key}
            type="button"
            className={classNames('tt-picker-quick-action', {
              'tt-picker-quick-action-active': isActive,
            })}
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

Inside `DatePicker`, add merged open/value state:

```js
const isOpenControlled = typeof props.open === 'boolean';
const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
const [innerOpen, setInnerOpen] = useState(Boolean(props.defaultOpen));
const [innerValue, setInnerValue] = useState(props.defaultValue);

const mergedOpen = isOpenControlled ? props.open : innerOpen;
const mergedValue = isValueControlled ? props.value : innerValue;

const handleOpenChange = (nextOpen) => {
  if (!isOpenControlled) {
    setInnerOpen(nextOpen);
  }
  if (props.onOpenChange) {
    props.onOpenChange(nextOpen);
  }
};

const handleQuickActionClick = (action) => {
  const nextValue = action.getValue();
  const nextDateString = nextValue ? nextValue.format(format || 'YYYY-MM-DD') : '';

  if (!isValueControlled) {
    setInnerValue(nextValue);
  }

  if (props.onChange) {
    props.onChange(nextValue, nextDateString);
  }

  handleOpenChange(false);
};
```

Update the quick-action panel call:

```js
<QuickActionPanel
  actions={mergedQuickActions}
  currentValue={mergedValue}
  onActionClick={handleQuickActionClick}
/>
```

Pass the merged state to AntD:

```js
open={shouldShowQuickActions ? mergedOpen : props.open}
value={shouldShowQuickActions ? mergedValue : props.value}
onOpenChange={shouldShowQuickActions ? handleOpenChange : props.onOpenChange}
```

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "calls onChange and closes|highlights the quick action"`
Expected: PASS.

- [ ] **Step 5: Commit click behavior and active state**

```bash
git add src/components/DatePicker/index.test.js src/components/DatePicker/index.js
git commit -m "feat: support DatePicker quick action selection"
```

### Task 5: Add a failing test for custom panelRender composition

**Files:**
- Modify: `src/components/DatePicker/index.test.js`
- Modify later: `src/components/DatePicker/index.js`

- [ ] **Step 1: Add the failing composition test**

Append this test:

```js
it('composes quick actions with a user provided panelRender', () => {
  render(
    <DatePicker
      open
      showQuickActions
      panelRender={(panelNode) => <div data-testid="custom-panel">{panelNode}</div>}
      version={DatePicker.version}
    />
  );

  expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
  expect(screen.getByText('昨天')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails if composition regressed**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "composes quick actions with a user provided panelRender"`
Expected: FAIL only if current merge logic is missing or broken.

- [ ] **Step 3: Make the panelRender composition explicit and stable**

In `src/components/DatePicker/index.js`, keep this exact structure in `mergedPanelRender`:

```js
const mergedPanelRender = (panelNode) => {
  const renderedPanel = panelRender ? panelRender(panelNode) : panelNode;

  if (!shouldShowQuickActions) {
    return renderedPanel;
  }

  return (
    <div className="tt-picker-panel-with-quick-actions">
      <QuickActionPanel
        actions={mergedQuickActions}
        currentValue={mergedValue}
        onActionClick={handleQuickActionClick}
      />
      <div className="tt-picker-quick-actions-divider" />
      <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
    </div>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:components -- src/components/DatePicker/index.test.js -t "composes quick actions with a user provided panelRender"`
Expected: PASS.

- [ ] **Step 5: Commit the composition safeguard**

```bash
git add src/components/DatePicker/index.test.js src/components/DatePicker/index.js
git commit -m "test: cover DatePicker panelRender composition"
```

### Task 6: Implement the approved Figma-aligned styles

**Files:**
- Modify: `src/components/DatePicker/index.less`

- [ ] **Step 1: Add a visual regression checkpoint in Storybook-first terms**

Before changing Less, use the existing open story as the visual baseline: no code change in this step.

Run: `npm run storybook`
Expected: Storybook opens and the current DatePicker panel has no quick-action rail yet.

- [ ] **Step 2: Add the quick-action layout styles**

Append these styles to `src/components/DatePicker/index.less` under `.tt-picker-dropdown`:

```less
  .tt-picker-panel-with-quick-actions {
    display: flex;
    align-items: stretch;
    background-color: var(--tt-bg-white, var(--tt-color-grey-0));
    border-radius: 4px;
  }

  .tt-picker-quick-actions {
    width: 110px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
  }

  .tt-picker-quick-action {
    height: 40px;
    padding: 8px;
    border: none;
    border-radius: 4px;
    background-color: transparent;
    color: var(--tt-color-grey-7);
    font-size: 14px;
    line-height: 22px;
    text-align: left;
    cursor: pointer;
  }

  .tt-picker-quick-action:hover {
    background-color: var(--tt-color-grey-1);
  }

  .tt-picker-quick-action-active {
    background-color: var(--tt-color-primary-1);
    color: var(--tt-color-primary-6);
  }

  .tt-picker-quick-actions-divider {
    width: 1px;
    background-color: var(--tt-border-color-light, var(--tt-color-grey-2));
    flex-shrink: 0;
  }

  .tt-picker-panel-with-quick-actions-content {
    display: flex;
  }
```

- [ ] **Step 3: Remove any obvious style conflicts with the existing week sidebar block**

If the old `.tt-picker-week-sidebar` selectors overlap visually, keep them unchanged but ensure the new selectors remain namespaced to `.tt-picker-panel-with-quick-actions` only.

- [ ] **Step 4: Run the component tests to ensure style-only changes did not break behavior**

Run: `npm run test:components -- src/components/DatePicker/index.test.js`
Expected: PASS all DatePicker quick-action tests.

- [ ] **Step 5: Commit the styling pass**

```bash
git add src/components/DatePicker/index.less
git commit -m "style: add DatePicker quick action panel styles"
```

### Task 7: Document the behavior in Storybook

**Files:**
- Modify: `src/components/DatePicker/DatePicker.stories.js`

- [ ] **Step 1: Write the story-first failing expectation**

Add two new stories to `src/components/DatePicker/DatePicker.stories.js`:

```js
export const 快捷操作 = () => {
  return (
    <div style={{ paddingBottom: '420px' }}>
      <DatePicker
        open={true}
        showQuickActions
        placeholder="请选择日期"
        style={{ width: 280 }}
        version={DatePicker.version}
      />
    </div>
  );
};

export const 自定义快捷操作 = () => {
  return (
    <div style={{ paddingBottom: '420px' }}>
      <DatePicker
        open={true}
        quickActions={[
          { key: 'yesterday', label: '昨天', getValue: () => moment().subtract(1, 'day') },
          { key: 'today', label: '今天', getValue: () => moment() },
          { key: 'tomorrow', label: '明天', getValue: () => moment().add(1, 'day') },
        ]}
        value={moment().subtract(1, 'day')}
        placeholder="请选择日期"
        style={{ width: 280 }}
        version={DatePicker.version}
      />
    </div>
  );
};
```

Add import if missing:

```js
import moment from 'moment';
```

- [ ] **Step 2: Run Storybook to verify the stories render and visually expose the feature**

Run: `npm run storybook`
Expected: Both new stories render the left rail and match the approved Figma structure closely.

- [ ] **Step 3: Refine story labels or spacing only if the visual comparison needs it**

If the panel gets clipped in Storybook, increase the wrapper bottom padding and keep the code minimal.

- [ ] **Step 4: Re-run component tests as a final regression check**

Run: `npm run test:components -- src/components/DatePicker/index.test.js`
Expected: PASS.

- [ ] **Step 5: Commit the Storybook documentation**

```bash
git add src/components/DatePicker/DatePicker.stories.js
git commit -m "docs: add DatePicker quick action stories"
```

### Task 8: Final verification and optional version update

**Files:**
- Modify if needed: `src/utils/version-config.js`

- [ ] **Step 1: Decide whether this repo expects component version bumps for feature changes**

Check the current practice in nearby component changes. If the repo consistently updates component versions for feature work, update:

```js
DatePicker: '1.1.0',
```

Otherwise leave `src/utils/version-config.js` unchanged.

- [ ] **Step 2: Run the complete targeted verification suite**

Run: `npm run test:components -- src/components/DatePicker/index.test.js`
Expected: PASS all tests.

Run: `npm run build`
Expected: Build completes successfully.

- [ ] **Step 3: Run the visual verification path**

Run: `npm run storybook`
Expected: The `快捷操作` story visually matches the approved Figma layout: left rail width, active background, divider, and right-side calendar alignment.

- [ ] **Step 4: Review git diff for scope discipline**

Run: `git diff -- src/components/DatePicker/index.js src/components/DatePicker/index.less src/components/DatePicker/DatePicker.stories.js package.json package-lock.json jest.config.js babel.config.js src/components/DatePicker/index.test.js src/utils/version-config.js`
Expected: Only the planned files changed.

- [ ] **Step 5: Commit the final integration changes**

```bash
git add src/components/DatePicker/index.js src/components/DatePicker/index.less src/components/DatePicker/DatePicker.stories.js src/components/DatePicker/index.test.js package.json package-lock.json jest.config.js babel.config.js src/utils/version-config.js
git commit -m "feat: add quick actions to DatePicker panel"
```

## Self-Review

- Spec coverage checked: API shape, date-only scope, custom-over-default priority, click-to-select-and-close, active-state matching, disabled suppression, `panelRender` composition, Figma-aligned styles, and Storybook examples are all mapped to tasks above.
- Placeholder scan checked: no `TODO`, no vague “write tests later”, no cross-task shorthand.
- Type consistency checked: the plan consistently uses `showQuickActions`, `quickActions`, `getValue`, `mergedPanelRender`, `handleQuickActionClick`, and the CSS class names introduced in the style task.
