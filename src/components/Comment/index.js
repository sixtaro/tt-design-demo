import React from 'react';
import PropTypes from 'prop-types';
import { Comment as AntComment } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Comment = ({ version, className, ...props }) => {
  const commentClassName = classNames('tt-comment', className);

  return (
    <AntComment
      className={commentClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Comment.version = componentVersions.Comment;

Comment.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  actions: PropTypes.array,
  author: PropTypes.node,
  avatar: PropTypes.node,
  children: PropTypes.node,
  content: PropTypes.node,
  datetime: PropTypes.node,
};

export default Comment;
