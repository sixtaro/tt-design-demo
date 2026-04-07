import React from 'react';
import PropTypes from 'prop-types';
import { Tag as AntTag } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Tag = ({ version, className, ...props }) => {
  const tagClassName = classNames('tt-tag', className);

  return (
    <AntTag
      className={tagClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Tag.CheckableTag = AntTag.CheckableTag;

Tag.version = componentVersions.Tag;

Tag.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  closable: PropTypes.bool,
  color: PropTypes.string,
  icon: PropTypes.node,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  afterClose: PropTypes.func,
};

export default Tag;
