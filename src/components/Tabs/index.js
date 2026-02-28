import React from 'react';
import { Tabs as AntTabs } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { TabPane } = AntTabs;

const Tabs = ({ activeKey, onChange, type, version, className, ...props }) => {
  const tabsClassName = classNames(
    'tt-tabs',
    className
  );

  return (
    <AntTabs
      activeKey={activeKey}
      onChange={onChange}
      type={type}
      className={tabsClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Tabs.TabPane = TabPane;
Tabs.version = componentVersions.Tabs;

export default Tabs;
