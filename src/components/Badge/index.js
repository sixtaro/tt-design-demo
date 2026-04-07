import React from 'react';
import PropTypes from 'prop-types';
import { Badge as AntBadge } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Badge = ({ version, className, ...props }) => {
  const badgeClassName = classNames('tt-badge', className);

  return (
    <AntBadge
      className={badgeClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Badge.Ribbon = AntBadge.Ribbon;

Badge.version = componentVersions.Badge;

Badge.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  count: PropTypes.node,
  dot: PropTypes.bool,
  offset: PropTypes.array,
  overflowCount: PropTypes.number,
  showZero: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'small']),
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.node,
  title: PropTypes.string,
};

export default Badge;
