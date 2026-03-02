import React from 'react';
import { Row as AntRow, Col as AntCol } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Row = ({ gutter, justify, align, version, className, ...props }) => {
  const rowClassName = classNames(
    'tt-row',
    className
  );

  return (
    <AntRow
      gutter={gutter}
      justify={justify}
      align={align}
      className={rowClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Row.Col = AntCol;
Row.version = componentVersions.Row;

export default Row;
