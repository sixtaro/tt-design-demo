import React from 'react';
import PropTypes from 'prop-types';
import { Progress as AntProgress } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Progress = ({ version, className, ...props }) => {
  const progressClassName = classNames('tt-progress', className);
  return (
    <AntProgress className={progressClassName} {...props} data-component-version={version} />
  );
};

Progress.version = componentVersions.Progress;

Progress.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
  percent: PropTypes.number,
  status: PropTypes.oneOf(['success', 'exception', 'normal', 'active']),
  strokeWidth: PropTypes.number,
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  trailColor: PropTypes.string,
  showInfo: PropTypes.bool,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.string,
  steps: PropTypes.number,
};

export default Progress;
