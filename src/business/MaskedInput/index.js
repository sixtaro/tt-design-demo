import React, { useMemo, useState, forwardRef, memo } from 'react';
import Input from '@/components/Input';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '@/utils/version-config';
import { defaultMethod } from '../SecretInput';
import './index.less';

/**
 * 掩码输入组件
 * 支持自定义掩码方法，聚焦时显示完整内容，失焦时显示掩码内容
 */
const MaskedInput = forwardRef((props, ref) => {
  const { value, onChange, method = defaultMethod, className, style = {}, version = componentVersions.MaskedInput, ...restProps } = props;

  const [isMasked, setMasked] = useState(true);

  const maskedValue = useMemo(() => {
    if (!isMasked) {
      return value;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      return value;
    }
    const str = String(value);
    return typeof method === 'function' ? method(str) : defaultMethod(str);
  }, [isMasked, method, value]);

  const handleChange = e => {
    onChange?.(e);
  };

  const handleFocus = e => {
    setMasked(false);
    restProps.onFocus?.(e);
  };

  const handleBlur = e => {
    setMasked(true);
    restProps.onBlur?.(e);
  };

  const wrapClasses = classNames('tt-masked-input', className);

  return (
    <div ref={ref} className={wrapClasses} style={style} data-component-version={version}>
      <Input
        {...restProps}
        type="text"
        value={maskedValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        suffix={
          isMasked ? (
            <EyeInvisibleOutlined
              onClick={e => {
                e.stopPropagation();
                setMasked(false);
              }}
            />
          ) : (
            <EyeOutlined
              onClick={e => {
                e.stopPropagation();
                setMasked(true);
              }}
            />
          )
        }
      />
    </div>
  );
});

MaskedInput.displayName = 'MaskedInput';

MaskedInput.propTypes = {
  /** 输入值 */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** 值变化回调 */
  onChange: PropTypes.func,
  /** 自定义掩码方法 */
  method: PropTypes.func,
  /** 样式类名 */
  className: PropTypes.string,
  /** 内联样式 */
  style: PropTypes.object,
  /** 组件版本 */
  version: PropTypes.string,
};

MaskedInput.defaultProps = {
  method: defaultMethod,
  className: '',
  style: {},
  version: componentVersions.MaskedInput,
};

export default memo(MaskedInput);
