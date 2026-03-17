import React from 'react';
import { Cascader as AntCascader } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const Cascader = ({
  version,
  className,
  popupClassName,
  options,
  value,
  defaultValue,
  onChange,
  expandTrigger,
  showSearch,
  placeholder,
  disabled,
  size,
  allowClear,
  showArrow,
  multiple,
  maxTagCount,
  ...props
}) => {
  const cascaderClassName = classNames('tt-cascader', className);
  const cascaderPopupClassName = classNames('tt-cascader-dropdown', popupClassName);

  // 自定义标签渲染
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <span className="tt-cascader-tag" onMouseDown={onPreventMouseDown}>
        {label}
        {closable && (
          <span className="tt-cascader-tag-close" onClick={onClose}>
            ×
          </span>
        )}
      </span>
    );
  };

  // 自定义超出数量显示 - 纯数字
  const maxTagPlaceholder = (omittedValues) => omittedValues.length;

  return (
    <AntCascader
      className={cascaderClassName}
      popupClassName={cascaderPopupClassName}
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      expandTrigger={expandTrigger}
      showSearch={showSearch}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      allowClear={allowClear}
      showArrow={showArrow}
      multiple={multiple}
      maxTagCount={maxTagCount}
      tagRender={multiple ? tagRender : undefined}
      maxTagPlaceholder={maxTagCount ? maxTagPlaceholder : undefined}
      {...props}
      data-component-version={version}
    />
  );
};

Cascader.version = componentVersions.Cascader || '1.0.0';

Cascader.propTypes = {
  /** 组件版本号 */
  version: PropTypes.string,
  /** 自定义类名 */
  className: PropTypes.string,
  /** 下拉菜单类名 */
  popupClassName: PropTypes.string,
  /** 可选项数据源 */
  options: PropTypes.arrayOf(PropTypes.object),
  /** 当前值（受控） */
  value: PropTypes.array,
  /** 默认值（非受控） */
  defaultValue: PropTypes.array,
  /** 变化回调 */
  onChange: PropTypes.func,
  /** 次级菜单的展开方式 */
  expandTrigger: PropTypes.oneOf(['click', 'hover']),
  /** 是否支持搜索 */
  showSearch: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** 占位文本 */
  placeholder: PropTypes.string,
  /** 是否禁用 */
  disabled: PropTypes.bool,
  /** 尺寸 */
  size: PropTypes.oneOf(['small', 'default', 'large']),
  /** 是否允许清空 */
  allowClear: PropTypes.bool,
  /** 是否显示箭头 */
  showArrow: PropTypes.bool,
  /** 是否多选 */
  multiple: PropTypes.bool,
  /** 最多显示的标签数量 */
  maxTagCount: PropTypes.number,
};

export default Cascader;
