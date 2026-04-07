import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm as AntPopconfirm } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Popconfirm = ({ version, className, ...props }) => {
  const popconfirmClassName = classNames('tt-popconfirm', className);
  return (
    <AntPopconfirm overlayClassName={popconfirmClassName} {...props} data-component-version={version} />
  );
};

Popconfirm.version = componentVersions.Popconfirm;

Popconfirm.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.node,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.node,
  cancelText: PropTypes.node,
  okType: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
  placement: PropTypes.string,
  children: PropTypes.node,
};

export default Popconfirm;
