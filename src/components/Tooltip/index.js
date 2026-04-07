import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as AntTooltip } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Tooltip = ({ version, className, ...props }) => {
  const tooltipClassName = classNames('tt-tooltip', className);

  return (
    <AntTooltip
      overlayClassName={tooltipClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Tooltip.version = componentVersions.Tooltip;

Tooltip.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.node,
  placement: PropTypes.oneOf([
    'top', 'left', 'right', 'bottom',
    'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
    'leftTop', 'leftBottom', 'rightTop', 'rightBottom',
  ]),
  arrowPointAtCenter: PropTypes.bool,
  autoAdjustOverflow: PropTypes.bool,
  color: PropTypes.string,
  defaultVisible: PropTypes.bool,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  overlayStyle: PropTypes.object,
  trigger: PropTypes.oneOf(['hover', 'focus', 'click', 'contextMenu']),
  visible: PropTypes.bool,
  onVisibleChange: PropTypes.func,
};

export default Tooltip;
