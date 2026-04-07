import React from 'react';
import PropTypes from 'prop-types';
import { Calendar as AntCalendar } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Calendar = ({ version, className, ...props }) => {
  const calendarClassName = classNames('tt-calendar', className);

  return (
    <AntCalendar
      className={calendarClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Calendar.version = componentVersions.Calendar;

Calendar.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  dateCellRender: PropTypes.func,
  dateFullCellRender: PropTypes.func,
  defaultValue: PropTypes.object,
  disabledDate: PropTypes.func,
  fullscreen: PropTypes.bool,
  headerRender: PropTypes.func,
  mode: PropTypes.oneOf(['month', 'year']),
  monthCellRender: PropTypes.func,
  monthFullCellRender: PropTypes.func,
  validRange: PropTypes.array,
  value: PropTypes.object,
  onChange: PropTypes.func,
  onPanelChange: PropTypes.func,
  onSelect: PropTypes.func,
};

export default Calendar;
