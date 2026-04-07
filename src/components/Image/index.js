import React from 'react';
import PropTypes from 'prop-types';
import { Image as AntImage } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Image = ({ version, className, ...props }) => {
  const imageClassName = classNames('tt-image', className);

  return (
    <AntImage
      className={imageClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Image.PreviewGroup = AntImage.PreviewGroup;

Image.version = componentVersions.Image;

Image.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  fallback: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.node,
  preview: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  src: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onError: PropTypes.func,
};

export default Image;
