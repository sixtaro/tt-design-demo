import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { DatePicker as AntDatePicker } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { RangePicker: AntRangePicker, MonthPicker: AntMonthPicker, WeekPicker: AntWeekPicker, YearPicker: AntYearPicker } = AntDatePicker;

const PICKER_DEFAULT_FORMATS = {
  date: 'YYYY-MM-DD',
  week: 'YYYY-wo',
  month: 'YYYY-MM',
  quarter: 'YYYY-[Q]Q',
  year: 'YYYY',
};

const RANGE_DEFAULT_FORMAT = 'YYYY-MM-DD';

const getDefaultQuickActions = (picker) => {
  if (picker === 'week') {
    return [
      { key: 'last-week', label: '上周', getValue: () => moment().subtract(1, 'week') },
      { key: 'current-week', label: '本周', getValue: () => moment() },
      { key: 'next-week', label: '下周', getValue: () => moment().add(1, 'week') },
    ];
  }

  if (picker === 'month') {
    return [
      { key: 'last-month', label: '上月', getValue: () => moment().subtract(1, 'month') },
      { key: 'current-month', label: '本月', getValue: () => moment() },
      { key: 'next-month', label: '下月', getValue: () => moment().add(1, 'month') },
    ];
  }

  if (picker === 'quarter') {
    return [
      { key: 'last-quarter', label: '上季度', getValue: () => moment().subtract(1, 'quarter') },
      { key: 'current-quarter', label: '本季度', getValue: () => moment() },
      { key: 'next-quarter', label: '下季度', getValue: () => moment().add(1, 'quarter') },
    ];
  }

  if (picker === 'year') {
    return [
      { key: 'last-year', label: '去年', getValue: () => moment().subtract(1, 'year') },
      { key: 'current-year', label: '今年', getValue: () => moment() },
      { key: 'next-year', label: '明年', getValue: () => moment().add(1, 'year') },
    ];
  }

  return [
    { key: 'yesterday', label: '昨天', getValue: () => moment().subtract(1, 'day') },
    { key: 'today', label: '今天', getValue: () => moment() },
    { key: 'tomorrow', label: '明天', getValue: () => moment().add(1, 'day') },
  ];
};

const getDefaultRangeQuickActions = () => ([
  {
    key: 'recent-week',
    label: '近一周',
    getValue: () => [moment().subtract(6, 'day'), moment()],
  },
  {
    key: 'recent-month',
    label: '近一月',
    getValue: () => [moment().subtract(1, 'month').add(1, 'day'), moment()],
  },
  {
    key: 'recent-quarter',
    label: '近一季',
    getValue: () => [moment().subtract(3, 'month').add(1, 'day'), moment()],
  },
]);

const getMergedRangeQuickActions = ({ showQuickActions, quickActions }) => {
  if (Array.isArray(quickActions) && quickActions.length > 0) {
    return quickActions;
  }

  if (showQuickActions) {
    return getDefaultRangeQuickActions();
  }

  return [];
};

const isSameQuickActionValue = (currentValue, actionValue, picker, isRange) => {
  if (isRange) {
    if (!Array.isArray(currentValue) || !Array.isArray(actionValue) || currentValue.length !== 2 || actionValue.length !== 2) {
      return false;
    }

    return currentValue[0] && currentValue[1] && actionValue[0] && actionValue[1]
      && moment(currentValue[0]).isSame(actionValue[0], 'day')
      && moment(currentValue[1]).isSame(actionValue[1], 'day');
  }

  return currentValue && actionValue && moment(currentValue).isSame(actionValue, picker);
};

const formatQuickActionValue = (nextValue, format, picker, isRange) => {
  if (isRange) {
    const rangeFormat = format || RANGE_DEFAULT_FORMAT;
    return Array.isArray(nextValue) ? nextValue.map((value) => (value ? value.format(rangeFormat) : '')) : ['', ''];
  }

  return nextValue ? nextValue.format(format || PICKER_DEFAULT_FORMATS[picker] || PICKER_DEFAULT_FORMATS.date) : '';
};

const getMergedQuickActions = ({ showQuickActions, quickActions, picker }) => {
  if (Array.isArray(quickActions) && quickActions.length > 0) {
    return quickActions;
  }

  if (showQuickActions) {
    return getDefaultQuickActions(picker);
  }

  return [];
};

const QuickActionPanel = ({ actions, currentValue, onActionClick, focusTrigger, picker, isRange }) => {
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (focusTrigger) {
      focusTrigger();
    }
  };

  return (
    <div className="tt-picker-quick-actions">
      {actions.map((action) => {
        const actionValue = action.getValue();
        const isActive = isSameQuickActionValue(currentValue, actionValue, picker, isRange);

        return (
          <button
            key={action.key}
            type="button"
            className={classNames('tt-picker-quick-action', {
              'tt-picker-quick-action-active': isActive,
            })}
          onMouseDown={handleMouseDown}
          onClick={() => onActionClick(action)}
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
  const quickActionPendingRef = useRef(false);
  const pickerRef = useRef(null);

  const datePickerClassName = classNames('tt-datepicker', className);
  const pickerPopupClassName = classNames('tt-picker-dropdown', popupClassName);
  const mergedPicker = picker || 'date';
  const mergedQuickActions = useMemo(
    () => getMergedQuickActions({ showQuickActions, quickActions, picker: mergedPicker }),
    [showQuickActions, quickActions, mergedPicker]
  );
  const shouldShowQuickActions = !disabled && ['date', 'week', 'month', 'quarter', 'year'].includes(mergedPicker) && mergedQuickActions.length > 0;
  const isOpenControlled = typeof props.open === 'boolean';
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const [innerOpen, setInnerOpen] = useState(Boolean(props.defaultOpen));
  const [innerValue, setInnerValue] = useState(props.defaultValue);
  const mergedValue = isValueControlled ? props.value : innerValue;

  useImperativeHandle(ref, () => pickerRef.current);

  const handleOpenChange = (nextOpen) => {
    // If a quick action just fired, Ant may call onOpenChange(false) as part of
    // its internal change handling. Suppress it — the popup should stay open.
    if (quickActionPendingRef.current && nextOpen === false) {
      quickActionPendingRef.current = false;
      return;
    }

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

  const focusTrigger = () => {
    if (pickerRef.current && typeof pickerRef.current.focus === 'function') {
      pickerRef.current.focus();
    }
  };

  const handleQuickActionClick = (action) => {
    const nextValue = action.getValue();

    if (isQuickActionDisabled(nextValue)) {
      return;
    }

    // Set flag BEFORE calling handleChange.
    // When Ant processes this change and fires onOpenChange(false),
    // handleOpenChange will see the flag and suppress the close.
    quickActionPendingRef.current = true;

    const nextDateString = formatQuickActionValue(nextValue, format, mergedPicker, false);
    handleChange(nextValue, nextDateString);

    // Reset the flag after a tick so subsequent user interactions
    // (e.g. clicking outside to close) work normally.
    setTimeout(() => {
      quickActionPendingRef.current = false;
    }, 0);
  };

  const mergedPanelRender = (panelNode) => {
    const renderedPanel = panelRender ? panelRender(panelNode) : panelNode;

    if (!shouldShowQuickActions) {
      return renderedPanel;
    }

    return (
      <div className={classNames('tt-picker-panel-with-quick-actions', {
        [`tt-picker-panel-with-quick-actions-${mergedPicker}`]: true,
        'tt-picker-panel-with-quick-actions-month': mergedPicker === 'month',
      })}>
        <QuickActionPanel
          actions={mergedQuickActions}
          currentValue={mergedValue}
          onActionClick={handleQuickActionClick}
          focusTrigger={focusTrigger}
          picker={mergedPicker}
          isRange={false}
        />
        <div className="tt-picker-quick-actions-divider" />
        <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
      </div>
    );
  };

  return (
    <AntDatePicker
      {...props}
      ref={pickerRef}
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
  );
});

const RangePicker = ({
  version,
  className,
  popupClassName,
  showQuickActions,
  quickActions,
  panelRender,
  ...props
}) => {
  const quickActionPendingRef = useRef(false);
  const pickerRef = useRef(null);
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  const mergedQuickActions = useMemo(
    () => getMergedRangeQuickActions({ showQuickActions, quickActions }),
    [showQuickActions, quickActions]
  );
  const isOpenControlled = typeof props.open === 'boolean';
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const [innerOpen, setInnerOpen] = useState(Boolean(props.defaultOpen));
  const [innerValue, setInnerValue] = useState(props.defaultValue);
  const mergedValue = isValueControlled ? props.value : innerValue;
  const shouldShowQuickActions = !props.disabled && (!props.picker || props.picker === 'date') && mergedQuickActions.length > 0;

  const handleOpenChange = (nextOpen) => {
    if (quickActionPendingRef.current && nextOpen === false) {
      quickActionPendingRef.current = false;
      return;
    }

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
    return typeof props.disabledDate === 'function'
      && Array.isArray(nextValue)
      && nextValue.some((value) => value && props.disabledDate(value))
      ;
  };

  const focusTrigger = () => {
    if (pickerRef.current && typeof pickerRef.current.focus === 'function') {
      pickerRef.current.focus();
    }
  };

  const handleQuickActionClick = (action) => {
    const nextValue = action.getValue();

    if (isQuickActionDisabled(nextValue)) {
      return;
    }

    quickActionPendingRef.current = true;
    handleChange(nextValue, formatQuickActionValue(nextValue, props.format, 'date', true));

    setTimeout(() => {
      quickActionPendingRef.current = false;
    }, 0);
  };

  const mergedPanelRender = (panelNode) => {
    const renderedPanel = panelRender ? panelRender(panelNode) : panelNode;

    if (!shouldShowQuickActions) {
      return renderedPanel;
    }

    return (
      <div className={classNames('tt-picker-panel-with-quick-actions', 'tt-picker-panel-with-quick-actions-range', 'tt-picker-panel-with-quick-actions-date')}>
        <QuickActionPanel
          actions={mergedQuickActions}
          currentValue={mergedValue}
          onActionClick={handleQuickActionClick}
          focusTrigger={focusTrigger}
          picker="date"
          isRange
        />
        <div className="tt-picker-quick-actions-divider" />
        <div className="tt-picker-panel-with-quick-actions-content">{renderedPanel}</div>
      </div>
    );
  };

  return (
    <AntRangePicker
      ref={pickerRef}
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      open={shouldShowQuickActions ? (isOpenControlled ? props.open : innerOpen) : props.open}
      value={shouldShowQuickActions ? mergedValue : props.value}
      onChange={shouldShowQuickActions ? handleChange : props.onChange}
      onOpenChange={shouldShowQuickActions ? handleOpenChange : props.onOpenChange}
      panelRender={mergedPanelRender}
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
  showQuickActions: PropTypes.bool,
  quickActions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      getValue: PropTypes.func.isRequired,
    })
  ),
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
