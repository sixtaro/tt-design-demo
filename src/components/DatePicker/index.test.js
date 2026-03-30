import moment from 'moment';
import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import DatePicker from './index';

const renderDatePicker = (props = {}) => {
  return render(
    <DatePicker
      open
      showQuickActions
      version={DatePicker.version}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      {...props}
    />
  );
};

describe('DatePicker quick actions', () => {
  it('renders default quick actions when showQuickActions is true', async () => {
    renderDatePicker();

    expect(await screen.findByRole('button', { name: '昨天' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '明天' })).toBeInTheDocument();
  });

  it('does not render quick actions for non-date pickers', async () => {
    const { container } = renderDatePicker({ picker: 'month' });

    await waitFor(() => {
      expect(container.querySelector('.ant-picker-panel-container')).not.toBeNull();
    });

    expect(screen.queryByRole('button', { name: '昨天' })).not.toBeInTheDocument();
  });

  it('does not render quick actions when disabled', () => {
    renderDatePicker({ disabled: true });

    expect(screen.queryByRole('button', { name: '昨天' })).not.toBeInTheDocument();
  });

  it('prefers custom quickActions over default quick actions', async () => {
    renderDatePicker({
      quickActions: [
        { key: 'custom', label: '自定义', getValue: () => moment('2026-07-22', 'YYYY-MM-DD') },
      ],
    });

    expect(await screen.findByRole('button', { name: '自定义' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '昨天' })).not.toBeInTheDocument();
  });

  it('calls onChange when a quick action is clicked and keeps popup open so calendar highlights', async () => {
    const handleChange = jest.fn();
    render(
      <DatePicker
        defaultOpen
        showQuickActions
        onChange={handleChange}
        version={DatePicker.version}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    );

    fireEvent.click(await screen.findByRole('button', { name: '今天' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    // Popup stays open so user can see the calendar cell highlight
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
  });

  it('does not call onChange when a quick action matches disabledDate', async () => {
    const handleChange = jest.fn();
    render(
      <DatePicker
        defaultOpen
        showQuickActions
        onChange={handleChange}
        disabledDate={(current) => current && current.isSame(moment(), 'day')}
        version={DatePicker.version}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    );

    fireEvent.click(await screen.findByRole('button', { name: '今天' }));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('highlights the quick action that matches the current value', async () => {
    renderDatePicker({
      value: moment().subtract(1, 'day'),
    });

    expect(await screen.findByRole('button', { name: '昨天' })).toHaveClass('tt-picker-quick-action-active');
  });

  it('does not fire onOpenChange(false) to parent when clicking quick action in controlled mode', async () => {
    // Test with controlled open — parent manages open state via onOpenChange
    const handleOpenChange = jest.fn();
    const handleChange = jest.fn();
    render(
      <DatePicker
        open
        showQuickActions
        onOpenChange={handleOpenChange}
        onChange={handleChange}
        version={DatePicker.version}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    );

    fireEvent.click(await screen.findByRole('button', { name: '今天' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).not.toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
  });

  it('suppresses onOpenChange(false) from Ant Design when clicking quick action in controlled mode', async () => {
    // In a real browser, Ant Design's rc-trigger fires onOpenChange(false) after
    // the quick action click (trigger blur, focus shift in the portal, etc.).
    // We simulate this via the exposed triggerOpenChange imperatively.
    const parentOnOpenChange = jest.fn();
    const handleChange = jest.fn();
    const ref = { current: null };

    render(
      <DatePicker
        ref={ref}
        open
        showQuickActions
        onOpenChange={parentOnOpenChange}
        onChange={handleChange}
        version={DatePicker.version}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    );

    // Click the quick action — this sets isProcessingQuickAction = true
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: '今天' }));
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(ref.current).not.toBeNull();

    // Simulate Ant Design firing onOpenChange(false) after the click.
    // With the fix, this should be suppressed and not reach the parent.
    await act(async () => {
      ref.current.triggerOpenChange(false);
    });

    expect(parentOnOpenChange).not.toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
  });

  it('composes quick actions with a user provided panelRender', async () => {
    render(
      <DatePicker
        open
        showQuickActions
        panelRender={(panelNode) => <div data-testid="custom-panel">{panelNode}</div>}
        version={DatePicker.version}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    );

    expect(await screen.findByTestId('custom-panel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '昨天' })).toBeInTheDocument();
  });
});
