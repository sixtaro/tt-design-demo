import React from 'react';
import { Tabs as AntTabs } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { TabPane } = AntTabs;

const Tabs = ({ version, className, ...props }) => {
  const tabsClassName = classNames(
    'tt-tabs',
    className
  );

  return (
    <AntTabs
      className={tabsClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Tabs.TabPane = TabPane;
Tabs.version = componentVersions.Tabs;

Tabs.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  activeKey: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['line', 'card', 'editable-card']),
  tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  size: PropTypes.oneOf(['default', 'small', 'large']),
  hideAdd: PropTypes.bool,
  onEdit: PropTypes.func,
  onTabClick: PropTypes.func,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func,
  tabBarStyle: PropTypes.object,
  tabBarExtraContent: PropTypes.node,
  children: PropTypes.node,
};

export default Tabs;
