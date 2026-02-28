import React from 'react';
import { Table as AntTable } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Table = ({ columns, dataSource, pagination, loading, version, className, ...props }) => {
  const tableClassName = classNames(
    'tt-table',
    className
  );

  return (
    <AntTable
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      className={tableClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Table.version = componentVersions.Table;

export default Table;
