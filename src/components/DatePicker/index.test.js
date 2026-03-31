import moment from 'moment';
import React, { useState } from 'react';
import { act, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('does not close popup when clicking quick action in controlled mode', async () => {
    // Real-world usage: parent controls open via onOpenChange
    const handleOpenChange = jest.fn();
    const handleChange = jest.fn();

    const ControlledDatePicker = () => {
      const [open, setOpen] = useState(false);
      return (
        <DatePicker
          open={open}
          onOpenChange={(val) => { setOpen(val); handleOpenChange(val); }}
          onChange={handleChange}
          showQuickActions
          version={DatePicker.version}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      );
    };

    render(<ControlledDatePicker />);

    // Open the popup
    const trigger = document.querySelector('.ant-picker');
    fireEvent.click(trigger);
    expect(handleOpenChange).toHaveBeenLastCalledWith(true);

    // Click quick action — popup should NOT close
    fireEvent.click(await screen.findByRole('button', { name: '今天' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).not.toHaveBeenCalledWith(false);
    // Popup should still be visible
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
  });

  it('suppresses onOpenChange(false) from Ant Design when clicking quick action in controlled mode', async () => {
    // The fix uses onMouseDown focus trick to keep the trigger focused,
    // preventing Ant's rc-trigger from seeing a blur and closing the popup.
    // This test verifies the popup stays open after a quick action click.
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

    // Click the quick action
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: '今天' }));
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    // Popup should stay open
    expect(await screen.findByRole('button', { name: '今天' })).toBeInTheDocument();
  });

  it('re-focuses the matching picker instance on quick action mousedown', async () => {
    const firstRef = React.createRef();
    const secondRef = React.createRef();

    render(
      <div>
        <DatePicker
          ref={firstRef}
          open
          showQuickActions
          version={DatePicker.version}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
        <DatePicker
          ref={secondRef}
          open
          showQuickActions
          version={DatePicker.version}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </div>
    );

    expect(firstRef.current).not.toBeNull();
    expect(secondRef.current).not.toBeNull();

    const firstFocusSpy = jest.spyOn(firstRef.current, 'focus');
    const secondFocusSpy = jest.spyOn(secondRef.current, 'focus');
    const quickActions = await screen.findAllByRole('button', { name: '今天' });
    const mouseDownEvent = createEvent.mouseDown(quickActions[1]);

    quickActions[1].dispatchEvent(mouseDownEvent);

    expect(secondFocusSpy).toHaveBeenCalled();
    expect(firstFocusSpy).not.toHaveBeenCalled();
  });

  it('prevents default blur-close behavior on quick action mousedown', async () => {
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

    quickAction.dispatchEvent(mouseDownEvent);

    expect(mouseDownEvent.defaultPrevented).toBe(true);
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
