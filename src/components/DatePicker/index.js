import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState, useCallback } from 'react';
import moment from 'moment';
import { DatePicker as AntDatePicker } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { RangePicker: AntRangePicker, MonthPicker: AntMonthPicker, WeekPicker: AntWeekPicker, YearPicker: AntYearPicker } = AntDatePicker;

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

const QuickActionPanel = ({ actions, currentValue, onActionClick, triggerRef }) => {
  // Keep focus on the trigger input so Ant's rc-trigger doesn't close the popup.
  // When a button is clicked, the default browser behavior shifts focus away from
  // the trigger to the button, triggering Ant's onOpenChange(false).
  // By calling focus() on mouseDown, we keep the trigger focused.
  const keepTriggerFocused = (e) => {
    if (triggerRef && triggerRef.current) {
      triggerRef.current.focus({ preventScroll: true });
    }
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
            onClick={() => onActionClick(action)}
            onMouseDown={keepTriggerFocused}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
};

const DatePicker = forwardRef(({
  placeholder,
  disabled,
  format,
  version,
  className,
  popupClassName,
  showQuickActions,
  quickActions,
  picker,
  panelRender,
  ...props
}, ref) => {
  const triggerRef = useRef(null);
  const containerRef = useCallback((node) => {
    if (node) {
      triggerRef.current = node.querySelector('.ant-picker > input');
    }
  }, []);

  const datePickerClassName = classNames('tt-datepicker', className);
  const pickerPopupClassName = classNames('tt-picker-dropdown', popupClassName);
  const mergedPicker = picker || 'date';
  const mergedQuickActions = useMemo(
    () => getMergedQuickActions({ showQuickActions, quickActions }),
    [showQuickActions, quickActions]
  );
  const shouldShowQuickActions = !disabled && mergedPicker === 'date' && mergedQuickActions.length > 0;
  const isOpenControlled = typeof props.open === 'boolean';
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const [innerOpen, setInnerOpen] = useState(Boolean(props.defaultOpen));
  const [innerValue, setInnerValue] = useState(props.defaultValue);
  const mergedValue = isValueControlled ? props.value : innerValue;

  const handleOpenChange = (nextOpen) => {
    if (!isOpenControlled) {
      setInnerOpen(nextOpen);
    }

    if (props.onOpenChange) {
      props.onOpenChange(nextOpen);
    }
  };

  const handleChange = (nextValue, nextDateString) => {
    if (!isValueControlled) {
      setInnerValue(nextValue);
    }

    if (props.onChange) {
      props.onChange(nextValue, nextDateString);
    }
  };

  const isQuickActionDisabled = (nextValue) => {
    return typeof props.disabledDate === 'function' && nextValue ? props.disabledDate(nextValue) : false;
  };

  const handleQuickActionClick = (action) => {
    const nextValue = action.getValue();

    if (isQuickActionDisabled(nextValue)) {
      return;
    }

    const nextDateString = nextValue ? nextValue.format(format || 'YYYY-MM-DD') : '';
    handleChange(nextValue, nextDateString);
  };

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
          triggerRef={triggerRef}
        />
        <div className="tt-picker-quick-actions-divider" />
        <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
      </div>
    );
  };

  return (
    <div ref={containerRef}>
      <AntDatePicker
        {...props}
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        picker={picker}
        open={shouldShowQuickActions ? (isOpenControlled ? props.open : innerOpen) : props.open}
        value={shouldShowQuickActions ? mergedValue : props.value}
        onChange={shouldShowQuickActions ? handleChange : props.onChange}
        onOpenChange={shouldShowQuickActions ? handleOpenChange : props.onOpenChange}
        className={datePickerClassName}
        popupClassName={pickerPopupClassName}
        panelRender={mergedPanelRender}
        data-component-version={version}
      />
    </div>
  );
});

const RangePicker = ({ version, className, popupClassName, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntRangePicker
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const MonthPicker = ({ version, className, popupClassName, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntMonthPicker
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const WeekPicker = ({ version, className, popupClassName, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntWeekPicker
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const YearPicker = ({ version, className, popupClassName, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntYearPicker
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

DatePicker.RangePicker = RangePicker;
DatePicker.MonthPicker = MonthPicker;
DatePicker.WeekPicker = WeekPicker;
DatePicker.YearPicker = YearPicker;
DatePicker.version = componentVersions.DatePicker;

DatePicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  picker: PropTypes.oneOf(['date', 'week', 'month', 'quarter', 'year']),
  popupClassName: PropTypes.string,
  showQuickActions: PropTypes.bool,
  quickActions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      getValue: PropTypes.func.isRequired,
    })
  ),
};

RangePicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  popupClassName: PropTypes.string,
};

MonthPicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  popupClassName: PropTypes.string,
};

WeekPicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  popupClassName: PropTypes.string,
};

YearPicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  popupClassName: PropTypes.string,
};

export default DatePicker;
