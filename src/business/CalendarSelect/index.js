import React, { useMemo, memo, forwardRef } from 'react';
import { Calendar as AntCalendar } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

/**
 * 日历选择组件，form表单使用
 * 可间断选择日期
 */
const CalendarSelect = forwardRef((props, ref) => {
  const { value, onChange, width = 300, disabled = false, calendarProps = {}, className, style, version, ...restProps } = props;

  const selectedValue = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const handleSelect = date => {
    if (disabled) {
      return;
    }
    const dateFormat = date.format('YYYY-MM-DD');
    let result = [...selectedValue];
    if (selectedValue.includes(dateFormat)) {
      result = selectedValue.filter(item => item !== dateFormat);
    } else {
      result.push(dateFormat);
    }
    result.sort((a, b) => moment(a).valueOf() - moment(b).valueOf());
    onChange?.(result);
  };

  // 日历本身是显示组件，处理切换年、月，选中上一次日期问题
  const handlePanelChange = date => {
    if (disabled) {
      return;
    }
    const dateFormat = date.format('YYYY-MM-DD');
    // 切换前选中的数据
    const _selectedValue = [...selectedValue];
    setTimeout(() => {
      let result = _selectedValue;
      // 日历是显示组件，切换年月时，默认会选中切换后的年月下的日期，需要处理
      // 本身没被选择，切换年、月，被选择的需要删除；本身已选择，切换年月后不应该被删除
      if (!_selectedValue.includes(dateFormat)) {
        result = _selectedValue.filter(item => item !== dateFormat);
      }
      onChange?.(result);
    }, 50);
  };

  const wrapClasses = classNames('tt-calendar-select', className);

  return (
    <div ref={ref} className={wrapClasses} style={{ width, ...style }} data-component-version={version} {...restProps}>
      <AntCalendar
        {...calendarProps}
        fullscreen={false}
        dateFullCellRender={date => {
          const dateFormat = date.format('YYYY-MM-DD');
          const day = date.format('DD');
          const isSelected = selectedValue.includes(dateFormat);
          const cellClasses = classNames('ant-picker-cell-inner', 'ant-picker-calendar-date', {
            'tt-calendar-date-selected': isSelected,
            'tt-calendar-date-disabled': disabled,
          });
          return (
            <div className={cellClasses}>
              <div className="ant-picker-calendar-date-value">{day}</div>
            </div>
          );
        }}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
      />
    </div>
  );
});

CalendarSelect.displayName = 'CalendarSelect';

CalendarSelect.propTypes = {
  /** 当前选中的日期数组 */
  value: PropTypes.arrayOf(PropTypes.string),
  /** 选中日期变化的回调 */
  onChange: PropTypes.func,
  /** 组件宽度 */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** 是否禁用 */
  disabled: PropTypes.bool,
  /** 传给 AntD Calendar 的透传属性 */
  calendarProps: PropTypes.object,
  /** 样式类名 */
  className: PropTypes.string,
  /** 内联样式 */
  style: PropTypes.object,
  /** 组件版本 */
  version: PropTypes.string,
};

export default memo(CalendarSelect);
