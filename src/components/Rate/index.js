import React from 'react';
import { Rate as AntRate } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const Rate = ({
  version,
  className,
  ...props
}) => {
  const rateClassName = classNames('tt-rate', className);

  return (
    <AntRate
      className={rateClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Rate.version = componentVersions.Rate || '1.0.0';

Rate.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  allowClear: PropTypes.bool,
  allowHalf: PropTypes.bool,
  autoFocus: PropTypes.bool,
  count: PropTypes.number,
  defaultValue: PropTypes.number,
  disabled: PropTypes.bool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onHoverChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  character: PropTypes.node,
  characterRender: PropTypes.func,
};

export default Rate;
