import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { RangePicker: AntRangePicker, MonthPicker: AntMonthPicker, WeekPicker: AntWeekPicker, YearPicker: AntYearPicker } = AntDatePicker;

const DatePicker = ({ placeholder, disabled, format, version, className, popupClassName, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  const pickerPopupClassName = classNames(
    'tt-picker-dropdown',
    popupClassName
  );

  return (
    <AntDatePicker
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      className={datePickerClassName}
      popupClassName={pickerPopupClassName}
      {...props}
      data-component-version={version}
    />
  );
};

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
