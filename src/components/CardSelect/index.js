import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import CardItem from './CardItem';
import './index.less';

const CardSelect = ({
  data,
  renderItem,
  value: valueProp,
  defaultValue,
  onChange,
  type,
  position,
  disabled,
  className,
  style,
  rowKey,
  grid,
  mode,
  ...props
}) => {
  // 支持受控和非受控模式
  const [internalValue, setInternalValue] = useState(defaultValue);

  // 如果是受控模式，使用传入的 value；否则使用内部状态
  const value = valueProp !== undefined ? valueProp : internalValue;

  const handleChange = key => {
    let newValue;
    const isSelected = value.includes(key);

    if (mode === 'single') {
      // 单选模式
      if (isSelected) {
        // 取消选中
        newValue = [];
      } else {
        // 选中（替换当前选中项）
        newValue = [key];
      }
    } else {
      // 多选模式
      if (isSelected) {
        // 取消选中
        newValue = value.filter(k => k !== key);
      } else {
        // 选中
        newValue = [...value, key];
      }
    }

    if (valueProp === undefined) {
      // 非受控模式，更新内部状态
      setInternalValue(newValue);
    }

    // 调用外部 onChange 回调
    if (onChange) {
      onChange(newValue, isSelected ? 'deselect' : 'select', key);
    }
  };

  const handleItemClick = (record, key) => {
    if (!disabled) {
      handleChange(key);
    }
  };

  // 渲染列表项
  const renderItems = useMemo(() => {
    return data.map((record, index) => {
      let key;
      if (typeof rowKey === 'function') {
        key = rowKey(record, index);
      } else {
        key = record[rowKey] || record.key || index;
      }
      const isSelected = value.includes(key);

      const itemNode = renderItem(record, index);

      return (
        <CardItem
          key={key}
          record={record}
          selected={isSelected}
          onClick={() => handleItemClick(record, key)}
          type={type}
          position={position}
          disabled={disabled}
        >
          {itemNode}
        </CardItem>
      );
    });
  }, [data, renderItem, value, type, position, disabled, rowKey, mode]);

  const cardSelectClassName = classNames(
    'tt-card-select-list',
    {
      'tt-card-select-list-grid': grid,
      'tt-card-select-list-disabled': disabled,
    },
    className
  );

  return (
    <div className={cardSelectClassName} style={style} {...props}>
      {renderItems}
    </div>
  );
};

CardSelect.version = componentVersions.CardSelect || '1.0.0';

CardSelect.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['corner', 'border', 'radio']),
  position: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  grid: PropTypes.bool,
  mode: PropTypes.oneOf(['multiple', 'single']),
};

CardSelect.defaultProps = {
  data: [],
  type: 'corner',
  position: 'left',
  disabled: false,
  defaultValue: [],
  grid: false,
  rowKey: 'key',
  mode: 'single',
};

export default CardSelect;
