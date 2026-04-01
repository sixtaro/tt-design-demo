import React, { memo, forwardRef, useMemo } from 'react';
import Select from '@/components/Select';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '@/utils/version-config';
import './index.less';

// 生成小时选项
const generateHourOptions = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: `${hour}:00` };
  });
};

/**
 * 小时范围选择组件
 * 用于选择时间段的开始和结束小时
 */
const HourRangeSelect = forwardRef((props, ref) => {
  const { value, onChange, disabled = false, style = {}, className, version = componentVersions.HourRangeSelect, ...restProps } = props;

  const options = useMemo(() => generateHourOptions(), []);

  const handleChange = (time, index) => {
    const _value = value ? [...value] : [undefined, undefined];
    _value[index] = time;
    // 判断时间大小，不符合调换顺序
    if (_value[0] && _value[1]) {
      const time1 = parseInt(_value[0].split(':')[0], 10);
      const time2 = parseInt(_value[1].split(':')[0], 10);

      if (time1 > time2) {
        _value.reverse();
      }
    }

    onChange?.(_value);
  };

  const wrapClasses = classNames('tt-hour-range-select', className);

  return (
    <div ref={ref} className={wrapClasses} style={{ display: 'flex', ...style }} data-component-version={version} {...restProps}>
      <Select
        value={value?.[0] || undefined}
        options={options}
        disabled={disabled}
        onChange={val => handleChange(val, 0)}
        placeholder="开始时间"
        style={{ width: 100, marginRight: 8 }}
      />
      <Select
        value={value?.[1] || undefined}
        options={options}
        disabled={disabled}
        onChange={val => handleChange(val, 1)}
        placeholder="结束时间"
        style={{ width: 100 }}
      />
    </div>
  );
});

HourRangeSelect.displayName = 'HourRangeSelect';

HourRangeSelect.propTypes = {
  /** 当前选中的时间范围数组 */
  value: PropTypes.arrayOf(PropTypes.string),
  /** 时间范围变化的回调 */
  onChange: PropTypes.func,
  /** 是否禁用 */
  disabled: PropTypes.bool,
  /** 内联样式 */
  style: PropTypes.object,
  /** 样式类名 */
  className: PropTypes.string,
  /** 组件版本 */
  version: PropTypes.string,
};

HourRangeSelect.defaultProps = {
  disabled: false,
  style: {},
  className: '',
  version: componentVersions.HourRangeSelect,
};

export default memo(HourRangeSelect);
