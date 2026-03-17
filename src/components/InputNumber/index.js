import React, { useState, useCallback, useMemo } from 'react';
import { InputNumber as AntInputNumber, Input } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const InputNumber = ({
  version,
  className,
  buttonMode,
  value: propsValue,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  size,
  style,
  suffix,
  prefix,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputNumberClassName = classNames('tt-input-number', className);
  const currentValue = propsValue !== undefined ? propsValue : internalValue;

  // 更新值的统一方法
  const updateValue = useCallback((newValue) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange]);

  // 增量操作
  const handleIncrement = useCallback(() => {
    if (disabled) return;
    let newValue = (currentValue || 0) + step;
    if (max !== undefined && newValue > max) {
      newValue = max;
    }
    updateValue(newValue);
  }, [currentValue, step, max, disabled, updateValue]);

  // 减量操作
  const handleDecrement = useCallback(() => {
    if (disabled) return;
    let newValue = (currentValue || 0) - step;
    if (min !== undefined && newValue < min) {
      newValue = min;
    }
    updateValue(newValue);
  }, [currentValue, step, min, disabled, updateValue]);

  // 输入框变化
  const handleInputChange = useCallback((e) => {
    if (disabled) return;
    const inputValue = e.target.value;
    if (inputValue === '') {
      updateValue(undefined);
      return;
    }
    const val = Number(inputValue);
    if (!isNaN(val)) {
      updateValue(val);
    }
  }, [disabled, updateValue]);

  // 计算按钮禁用状态
  const { isMinDisabled, isMaxDisabled } = useMemo(() => ({
    isMinDisabled: min !== undefined && currentValue !== undefined && currentValue <= min,
    isMaxDisabled: max !== undefined && currentValue !== undefined && currentValue >= max,
  }), [min, max, currentValue]);

  // 侧边按钮模式
  if (buttonMode === 'side') {
    const wrapperClassName = classNames('tt-input-number-side-wrapper', {
      'tt-input-number-side-wrapper-disabled': disabled,
      [`tt-input-number-side-wrapper-${size}`]: size,
    });

    const leftBtnClassName = classNames('tt-input-number-side-btn tt-input-number-side-btn-left', {
      'tt-input-number-side-btn-disabled': disabled || isMinDisabled,
    });

    const rightBtnClassName = classNames('tt-input-number-side-btn tt-input-number-side-btn-right', {
      'tt-input-number-side-btn-disabled': disabled || isMaxDisabled,
    });

    return (
      <div className={wrapperClassName} style={style}>
        <span
          className={leftBtnClassName}
          onClick={!disabled && !isMinDisabled ? handleDecrement : undefined}
        >
          <MinusOutlined />
        </span>
        {prefix && <span className="tt-input-number-side-prefix">{prefix}</span>}
        <Input
          className="tt-input-number-side-input"
          value={currentValue}
          onChange={handleInputChange}
          disabled={disabled}
          size={size}
          {...props}
        />
        {suffix && <span className="tt-input-number-side-suffix">{suffix}</span>}
        <span
          className={rightBtnClassName}
          onClick={!disabled && !isMaxDisabled ? handleIncrement : undefined}
        >
          <PlusOutlined />
        </span>
      </div>
    );
  }

  // 默认模式 - 带前缀后缀包裹容器
  const defaultInput = (
    <AntInputNumber
      className={inputNumberClassName}
      value={propsValue}
      defaultValue={defaultValue}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      size={size}
      style={prefix || suffix ? undefined : style}
      {...props}
      data-component-version={version}
    />
  );

  if (prefix || suffix) {
    const wrapperClassName = classNames('tt-input-number-affix-wrapper', {
      'tt-input-number-affix-wrapper-disabled': disabled,
      [`tt-input-number-affix-wrapper-${size}`]: size,
    });

    return (
      <div className={wrapperClassName} style={style}>
        {prefix && <span className="tt-input-number-prefix">{prefix}</span>}
        {defaultInput}
        {suffix && <span className="tt-input-number-suffix">{suffix}</span>}
      </div>
    );
  }

  return defaultInput;
};

InputNumber.version = componentVersions.InputNumber || '1.1.0';

InputNumber.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  buttonMode: PropTypes.oneOf(['default', 'side']),
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  style: PropTypes.object,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
};

export default InputNumber;
