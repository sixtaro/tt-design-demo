import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { RangePicker, MonthPicker, WeekPicker, YearPicker } = AntDatePicker;

const DatePicker = ({ placeholder, disabled, format, version, className, ...props }) => {
  const datePickerClassName = classNames(
    'tt-datepicker',
    className
  );

  return (
    <AntDatePicker
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      className={datePickerClassName}
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

export default DatePicker;
