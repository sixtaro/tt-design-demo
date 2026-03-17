import React, { useState, useEffect, useMemo, Children } from 'react';
import { Select as AntSelect } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import Input from '../Input';
import Checkbox from '../Checkbox';
import './index.less';

const { Option, OptGroup } = AntSelect;

const Select = ({
  version,
  className,
  searchable = false,
  searchPlaceholder = '请输入关键字',
  showSelectAll = false,
  children,
  value: propsValue,
  onChange,
  mode,
  popupClassName,
  options,
  maxTagCount,
  onDropdownVisibleChange,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [allSelected, setAllSelected] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const selectClassName = classNames('tt-select', className);
  const selectPopupClassName = classNames('tt-select-dropdown', popupClassName);

  // 获取当前已选中的值
  const selectedValues = useMemo(() => {
    if (!propsValue) return [];
    return Array.isArray(propsValue) ? propsValue : [propsValue];
  }, [propsValue]);

  // 获取选项的 label
  const getOptionLabel = (opt) => {
    if (typeof opt === 'string') return opt;
    if (opt?.label) return opt.label.toString();
    if (opt?.value) return opt.value.toString();
    return '';
  };

  // 获取选项的 value
  const getOptionValue = (opt) => {
    return typeof opt === 'string' ? opt : opt.value;
  };

  // 根据搜索值过滤 options - 确保已选中的选项始终保留
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue || !options) return options;

    const lowerSearchValue = searchValue.toLowerCase();

    return options.filter(opt => {
      const value = getOptionValue(opt);
      if (selectedValues.includes(value)) return true;
      return getOptionLabel(opt).toLowerCase().includes(lowerSearchValue);
    });
  }, [options, searchable, searchValue, selectedValues]);

  // 根据搜索值过滤 children - 确保已选中的选项始终保留
  const filteredChildren = useMemo(() => {
    if (!searchable || !searchValue || !children) return children;

    const lowerSearchValue = searchValue.toLowerCase();

    const filterChild = (child) => {
      if (!child) return false;

      if (child.type === OptGroup) {
        const filteredGroupChildren = Children.toArray(child.props.children).filter(filterChild);
        return filteredGroupChildren.length > 0;
      }

      if (child.type === Option) {
        if (selectedValues.includes(child.props.value)) return true;
        let label = '';
        if (typeof child.props.children === 'string') {
          label = child.props.children;
        } else if (child.props.value) {
          label = child.props.value.toString();
        }
        return label.toLowerCase().includes(lowerSearchValue);
      }

      return true;
    };

    return Children.map(children, child => {
      if (!child) return child;

      if (child.type === OptGroup) {
        const filteredGroupChildren = Children.toArray(child.props.children).filter(filterChild);
        if (filteredGroupChildren.length > 0) {
          return React.cloneElement(child, { children: filteredGroupChildren });
        }
        return null;
      }

      if (child.type === Option) {
        return filterChild(child) ? child : null;
      }

      return child;
    }).filter(Boolean);
  }, [children, searchable, searchValue, selectedValues]);

  // 从 options 属性或 children 中收集所有选项值
  const allOptionValues = useMemo(() => {
    const values = [];

    if (options) {
      options.forEach(opt => values.push(getOptionValue(opt)));
    } else if (children) {
      Children.forEach(children, (child) => {
        if (child && child.type === Option) {
          values.push(child.props.value);
        } else if (child && child.type === OptGroup) {
          Children.forEach(child.props.children, (optChild) => {
            if (optChild && optChild.type === Option) {
              values.push(optChild.props.value);
            }
          });
        }
      });
    }

    return values;
  }, [options, children]);

  // 处理全选状态
  useEffect(() => {
    if (mode === 'multiple' && propsValue) {
      const selected = Array.isArray(propsValue) ? propsValue : [propsValue];
      const isAllSelected = selected.length === allOptionValues.length && allOptionValues.length > 0;
      const isIndeterminate = !isAllSelected && selected.length > 0;
      setAllSelected(isAllSelected);
      setIndeterminate(isIndeterminate);
    }
  }, [propsValue, allOptionValues, mode]);

  // 全选处理
  const handleSelectAll = () => {
    if (mode === 'multiple' && onChange) {
      const newAllSelected = !allSelected;
      setAllSelected(newAllSelected);
      onChange(newAllSelected ? [...allOptionValues] : []);
    }
  };

  // 下拉菜单可见性变化
  const handleDropdownVisibleChange = (visible) => {
    if (visible) setSearchValue('');
    onDropdownVisibleChange?.(visible);
  };

  // 搜索框变化处理
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // 阻止搜索框的键盘事件冒泡
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  // 搜索框
  const renderSearchInput = () => {
    if (!searchable) return null;
    return (
      <div className="tt-select-search">
        <Input
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          autoFocus
        />
      </div>
    );
  };

  // 全选复选框
  const renderSelectAll = () => {
    if (!showSelectAll || mode !== 'multiple') return null;
    return (
      <div className="tt-select-select-all">
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
          disabled={allOptionValues.length === 0}
        >
          全选
        </Checkbox>
      </div>
    );
  };

  // 自定义下拉菜单内容
  const dropdownRender = (menu) => {
    if (!searchable && !showSelectAll) return menu;
    return (
      <div className="tt-select-dropdown-custom">
        {renderSearchInput()}
        {menu}
        {renderSelectAll()}
      </div>
    );
  };

  // 自定义标签渲染
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <span className="tt-select-tag" onMouseDown={onPreventMouseDown}>
        {label}
        {closable && (
          <span className="tt-select-tag-close" onClick={onClose}>
            ×
          </span>
        )}
      </span>
    );
  };

  // 自定义超出数量显示 - 纯数字
  const maxTagPlaceholder = (omittedValues) => omittedValues.length;

  return (
    <AntSelect
      className={selectClassName}
      popupClassName={selectPopupClassName}
      dropdownRender={(searchable || showSelectAll) ? dropdownRender : undefined}
      tagRender={mode === 'multiple' ? tagRender : undefined}
      maxTagCount={maxTagCount}
      maxTagPlaceholder={maxTagCount ? maxTagPlaceholder : undefined}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      notFoundContent={searchable ? '暂无匹配结果' : '无选项'}
      mode={mode}
      value={propsValue}
      onChange={onChange}
      options={filteredOptions}
      {...props}
      data-component-version={version}
    >
      {filteredChildren}
    </AntSelect>
  );
};

Select.Option = Option;
Select.OptGroup = OptGroup;
Select.version = componentVersions.Select;

export default Select;
