import React from 'react';
import { Empty as AntEmpty } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const Empty = ({ className, version, image, description, style, children, imageStyle, ...props }) => {
  const emptyClassName = classNames('tt-empty', className);

  return (
    <AntEmpty
      className={emptyClassName}
      image={image}
      imageStyle={imageStyle}
      description={description}
      style={style}
      {...props}
      data-component-version={version}
    >
      {children}
    </AntEmpty>
  );
};

Empty.version = componentVersions.Empty;

Empty.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  image: PropTypes.node,
  description: PropTypes.node,
  style: PropTypes.object,
  children: PropTypes.node,
  imageStyle: PropTypes.object,
};

export default Empty;
