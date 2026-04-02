import React from 'react';
import { Pagination as AntPagination } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Pagination = ({ version, className, ...props }) => {
  const paginationClassName = classNames(
    'tt-pagination',
    className
  );

  return (
    <AntPagination
      className={paginationClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Pagination.version = componentVersions.Pagination;

export default Pagination;
