import React from 'react';
import { Statistic as AntStatistic } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const { Countdown: AntCountdown } = AntStatistic;

const Statistic = ({
  version,
  className,
  title,
  value,
  precision,
  prefix,
  suffix,
  loading,
  valueStyle,
  groupSeparator,
  decimalSeparator,
  formatter,
  ...props
}) => {
  const statisticClassName = classNames('tt-statistic', className);
  const formatProps = {};

  if (precision !== undefined) {
    formatProps.precision = precision;
  }

  if (groupSeparator !== undefined) {
    formatProps.groupSeparator = groupSeparator;
  }

  if (decimalSeparator !== undefined) {
    formatProps.decimalSeparator = decimalSeparator;
  }

  if (formatter !== undefined) {
    formatProps.formatter = formatter;
  }

  return (
    <AntStatistic
      className={statisticClassName}
      title={title}
      value={value}
      prefix={prefix}
      suffix={suffix}
      loading={loading}
      valueStyle={valueStyle}
      {...formatProps}
      {...props}
      data-component-version={version}
    />
  );
};

const Countdown = ({ version, className, title, value, format, onFinish, ...props }) => {
  const statisticClassName = classNames('tt-statistic', className);

  return (
    <AntCountdown
      className={statisticClassName}
      title={title}
      value={value}
      format={format}
      onFinish={onFinish}
      {...props}
      data-component-version={version}
    />
  );
};

Statistic.Countdown = Countdown;
Statistic.version = componentVersions.Statistic;

Statistic.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  precision: PropTypes.number,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  loading: PropTypes.bool,
  valueStyle: PropTypes.object,
  groupSeparator: PropTypes.string,
  decimalSeparator: PropTypes.string,
  formatter: PropTypes.func,
};

Countdown.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
  format: PropTypes.string,
  onFinish: PropTypes.func,
};

export default Statistic;
