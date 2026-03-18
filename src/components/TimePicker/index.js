import React from 'react';
import { TimePicker as AntTimePicker } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { RangePicker: AntRangePicker } = AntTimePicker;

const TimePicker = ({ placeholder, disabled, format, version, className, popupClassName, ...props }) => {
  const timePickerClassName = classNames(
    'tt-timepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntTimePicker
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      className={timePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

const RangePicker = ({ version, className, popupClassName, ...props }) => {
  const timePickerClassName = classNames(
    'tt-timepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntRangePicker
      className={timePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

TimePicker.RangePicker = RangePicker;
TimePicker.version = componentVersions.TimePicker || '1.0.0';

TimePicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  use12Hours: PropTypes.bool,
  hourStep: PropTypes.number,
  minuteStep: PropTypes.number,
  secondStep: PropTypes.number,
  allowClear: PropTypes.bool,
  autoFocus: PropTypes.bool,
  inputReadOnly: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'default', 'small']),
  addon: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  defaultOpenValue: PropTypes.object,
  disabledHours: PropTypes.func,
  disabledMinutes: PropTypes.func,
  disabledSeconds: PropTypes.func,
  hideDisabledOptions: PropTypes.bool,
  onChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  onAmPmChange: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
  getPopupContainer: PropTypes.func,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  id: PropTypes.string,
  suffixIcon: PropTypes.node,
  clearIcon: PropTypes.node,
};

RangePicker.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.bool)]),
  format: PropTypes.string,
  size: PropTypes.oneOf(['large', 'default', 'small']),
  order: PropTypes.bool,
  onChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  disabledTime: PropTypes.func,
  showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  separator: PropTypes.node,
  allowClear: PropTypes.bool,
  hideDisabledOptions: PropTypes.bool,
  placement: PropTypes.oneOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
  getPopupContainer: PropTypes.func,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  id: PropTypes.string,
  suffixIcon: PropTypes.node,
  clearIcon: PropTypes.node,
};

export default TimePicker;
