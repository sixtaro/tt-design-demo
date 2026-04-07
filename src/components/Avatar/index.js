import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as AntAvatar } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Avatar = ({ version, className, ...props }) => {
  const avatarClassName = classNames('tt-avatar', className);

  return (
    <AntAvatar
      className={avatarClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Avatar.Group = AntAvatar.Group;

Avatar.version = componentVersions.Avatar;

Avatar.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  gap: PropTypes.number,
  icon: PropTypes.node,
  shape: PropTypes.oneOf(['circle', 'square']),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['large', 'small', 'default'])]),
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  alt: PropTypes.string,
  draggable: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default Avatar;
