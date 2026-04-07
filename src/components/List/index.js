import React from 'react';
import PropTypes from 'prop-types';
import { List as AntList } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const List = ({ version, className, ...props }) => {
  const listClassName = classNames('tt-list', className);

  return (
    <AntList
      className={listClassName}
      {...props}
      data-component-version={version}
    />
  );
};

List.Item = AntList.Item;

List.version = componentVersions.List;

List.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  bordered: PropTypes.bool,
  dataSource: PropTypes.array,
  footer: PropTypes.node,
  grid: PropTypes.object,
  header: PropTypes.node,
  itemLayout: PropTypes.oneOf(['horizontal', 'vertical']),
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  loadMore: PropTypes.node,
  locale: PropTypes.object,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  renderItem: PropTypes.func,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOf(['default', 'large', 'small']),
  split: PropTypes.bool,
};

export default List;
