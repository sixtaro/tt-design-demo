import React from 'react';
import { Empty as AntEmpty } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import { emptyPresets, getPresetImage } from './presetMap';
import './index.less';

const Empty = ({ className, version, preset, image, description, style, children, imageStyle, ...props }) => {
  const emptyClassName = classNames('tt-empty', className);
  let resolvedImage = image;

  if (!resolvedImage) {
    if (preset === emptyPresets.simple) {
      resolvedImage = AntEmpty.PRESENTED_IMAGE_SIMPLE;
    } else if (preset === emptyPresets.default) {
      resolvedImage = AntEmpty.PRESENTED_IMAGE_DEFAULT;
    } else {
      resolvedImage = getPresetImage(preset);
    }
  }

  return (
    <AntEmpty
      className={emptyClassName}
      image={resolvedImage}
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
Empty.presets = emptyPresets;

Empty.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  preset: PropTypes.oneOf(Object.values(emptyPresets)),
  image: PropTypes.node,
  description: PropTypes.node,
  style: PropTypes.object,
  children: PropTypes.node,
  imageStyle: PropTypes.object,
};

Empty.defaultProps = {
  preset: emptyPresets.default,
};

export default Empty;
