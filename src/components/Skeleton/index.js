import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton as AntSkeleton } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Skeleton = ({ version, className, ...props }) => {
  const skeletonClassName = classNames('tt-skeleton', className);
  return (
    <AntSkeleton className={skeletonClassName} {...props} data-component-version={version} />
  );
};

Skeleton.version = componentVersions.Skeleton;

Skeleton.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  avatar: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  paragraph: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  round: PropTypes.bool,
  children: PropTypes.node,
};

export default Skeleton;
