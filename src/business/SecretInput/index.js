import React, { useMemo, forwardRef, memo } from 'react';
import Input from '@/components/Input';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '@/utils/version-config';
import './index.less';

const defaultMethod = str => {
  let len = str.length;
  let result = '';
  if (len === 0) {
    result = '';
  } else if (len <= 3) {
    result = `${str[0]}${'*'.repeat(len - 1)}`;
  } else if (len <= 7) {
    result = `${str.substring(0, 2)}${'*'.repeat(len - 2)}`;
  } else if (len <= 10) {
    result = `${str.substring(0, 2)}${'*'.repeat(len - 4)}${str.substring(len - 2)}`;
  } else {
    result = `${str.substring(0, 3)}${'*'.repeat(len - 7)}${str.substring(len - 4)}`;
  }
  return result;
};

export { defaultMethod };

/**
 * 秘密输入组件
 * 根据字符串长度自动生成掩码文本
 */
const SecretInput = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    children,
    hide = true,
    method = defaultMethod,
    secretStyle,
    placeholder,
    className,
    style = {},
    version = componentVersions.SecretInput,
    ...restProps
  } = props;

  const secretValue = useMemo(() => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return value;
    }
    const str = String(value);
    const result = typeof method === 'function' ? method(str) : defaultMethod(str);
    return result;
  }, [value, method]);

  const renderChildren = () => {
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        ...child.props,
        value: value,
        onChange: e => {
          child.props.onChange && child.props.onChange(e);
          onChange && onChange(e);
        },
      });
    });
  };

  const wrapClasses = classNames('tt-secret-input', className);

  return (
    <div ref={ref} className={wrapClasses} style={style} data-component-version={version}>
      {hide && <Input type="text" disabled value={secretValue} style={secretStyle} placeholder={placeholder} {...restProps} />}
      {!hide && renderChildren()}
    </div>
  );
});

SecretInput.displayName = 'SecretInput';

SecretInput.propTypes = {
  /** 输入值 */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** 值变化回调 */
  onChange: PropTypes.func,
  /** 子组件（不隐藏时渲染） */
  children: PropTypes.node,
  /** 是否隐藏真实内容，显示掩码 */
  hide: PropTypes.bool,
  /** 自定义掩码方法 */
  method: PropTypes.func,
  /** 掩码输入框样式 */
  secretStyle: PropTypes.object,
  /** 占位文本 */
  placeholder: PropTypes.string,
  /** 样式类名 */
  className: PropTypes.string,
  /** 内联样式 */
  style: PropTypes.object,
  /** 组件版本 */
  version: PropTypes.string,
};

SecretInput.defaultProps = {
  hide: true,
  method: defaultMethod,
  secretStyle: {},
  className: '',
  style: {},
  version: componentVersions.SecretInput,
};

export default memo(SecretInput);
