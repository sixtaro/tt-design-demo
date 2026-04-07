import React from 'react';
import PropTypes from 'prop-types';
import { Timeline as AntTimeline } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Timeline = ({ version, className, ...props }) => {
  const timelineClassName = classNames('tt-timeline', className);

  return (
    <AntTimeline
      className={timelineClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Timeline.Item = AntTimeline.Item;

Timeline.version = componentVersions.Timeline;

Timeline.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  mode: PropTypes.oneOf(['left', 'alternate', 'right']),
  pending: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  pendingDot: PropTypes.node,
  reverse: PropTypes.bool,
};

export default Timeline;
