import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Item, Separator } = AntBreadcrumb;

const Breadcrumb = ({ separator, version, className, ...props }) => {
  const breadcrumbClassName = classNames(
    'tt-breadcrumb',
    className
  );

  return (
    <AntBreadcrumb
      separator={separator}
      className={breadcrumbClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;
Breadcrumb.version = componentVersions.Breadcrumb;

export default Breadcrumb;
