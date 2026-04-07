import React from 'react';
import PropTypes from 'prop-types';
import { Result as AntResult } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Result = ({ version, className, ...props }) => {
  const resultClassName = classNames('tt-result', className);
  return (
    <AntResult className={resultClassName} {...props} data-component-version={version} />
  );
};

Result.version = componentVersions.Result;

Result.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  status: PropTypes.oneOf(['success', 'error', 'info', 'warning', '404', '403', '500']),
  title: PropTypes.node,
  subTitle: PropTypes.node,
  icon: PropTypes.node,
  extra: PropTypes.node,
  children: PropTypes.node,
};

export default Result;
