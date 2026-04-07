import React from 'react';
import PropTypes from 'prop-types';
import { Alert as AntAlert } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Alert = ({ version, className, ...props }) => {
  const alertClassName = classNames('tt-alert', className);
  return (
    <AntAlert className={alertClassName} {...props} data-component-version={version} />
  );
};

Alert.version = componentVersions.Alert;

Alert.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.node,
  description: PropTypes.node,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  closable: PropTypes.bool,
  closeText: PropTypes.node,
  showIcon: PropTypes.bool,
  banner: PropTypes.bool,
  icon: PropTypes.node,
  onClose: PropTypes.func,
  afterClose: PropTypes.func,
  action: PropTypes.node,
};

export default Alert;
