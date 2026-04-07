import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions as AntDescriptions } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Descriptions = ({ version, className, ...props }) => {
  const descriptionsClassName = classNames('tt-descriptions', className);

  return (
    <AntDescriptions
      className={descriptionsClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Descriptions.Item = AntDescriptions.Item;

Descriptions.version = componentVersions.Descriptions;

Descriptions.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  bordered: PropTypes.bool,
  colon: PropTypes.bool,
  column: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  contentStyle: PropTypes.object,
  extra: PropTypes.node,
  labelStyle: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['default', 'middle', 'small']),
  title: PropTypes.node,
};

export default Descriptions;
