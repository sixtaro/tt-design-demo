import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const Masonry = ({
  items,
  renderItem,
  children,
  columnCount,
  minColumnWidth,
  gap,
  itemKey,
  className,
  style,
  version,
  ...props
}) => {
  const masonryClassName = classNames('tt-masonry', className);
  const childList = renderItem
    ? (items || []).map((item, index) => {
      const key = typeof itemKey === 'function' ? itemKey(item, index) : item[itemKey] || index;
      return (
        <div key={key} className="tt-masonry-item">
          {renderItem(item, index)}
        </div>
      );
    })
    : Children.toArray(children).filter(Boolean).map((child, index) => (
      <div key={child.key || index} className="tt-masonry-item">
        {child}
      </div>
    ));

  const mergedStyle = {
    ...style,
    columnGap: gap,
  };

  if (columnCount) {
    mergedStyle.columnCount = columnCount;
  } else {
    mergedStyle.columnWidth = minColumnWidth;
  }

  return (
    <div
      className={masonryClassName}
      style={mergedStyle}
      data-component-version={version}
      {...props}
    >
      {childList}
    </div>
  );
};

Masonry.version = componentVersions.Masonry;

Masonry.propTypes = {
  version: PropTypes.string,
  items: PropTypes.array,
  renderItem: PropTypes.func,
  children: PropTypes.node,
  columnCount: PropTypes.number,
  minColumnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  style: PropTypes.object,
};

Masonry.defaultProps = {
  items: [],
  columnCount: undefined,
  minColumnWidth: 240,
  gap: 16,
  itemKey: 'key',
};

export default Masonry;
