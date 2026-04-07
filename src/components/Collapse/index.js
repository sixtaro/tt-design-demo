import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as AntCollapse } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Collapse = ({ version, className, ...props }) => {
  const collapseClassName = classNames('tt-collapse', className);

  return (
    <AntCollapse
      className={collapseClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Collapse.Panel = AntCollapse.Panel;

Collapse.version = componentVersions.Collapse;

Collapse.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  accordion: PropTypes.bool,
  bordered: PropTypes.bool,
  collapsible: PropTypes.oneOf(['header', 'icon', 'disabled']),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  destroyInactivePanel: PropTypes.bool,
  expandIconPosition: PropTypes.oneOf(['left', 'right']),
  ghost: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Collapse;
