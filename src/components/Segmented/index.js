import React from 'react';
import PropTypes from 'prop-types';
import { Segmented as AntSegmented } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Segmented = ({ version, className, ...props }) => {
  const segmentedClassName = classNames('tt-segmented', className);

  return (
    <AntSegmented
      className={segmentedClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Segmented.version = componentVersions.Segmented;

Segmented.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  block: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        icon: PropTypes.node,
        disabled: PropTypes.bool,
        className: PropTypes.string,
      })
    ),
  ]),
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Segmented;
