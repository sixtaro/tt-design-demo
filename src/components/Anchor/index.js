import React from 'react';
import { Anchor as AntAnchor } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { Link } = AntAnchor;

const Anchor = React.forwardRef(({ version, className, ...props }, ref) => {
  const anchorClassName = classNames(
    'tt-anchor',
    className
  );

  return (
    <AntAnchor
      ref={ref}
      className={anchorClassName}
      data-component-version={version}
      {...props}
    />
  );
});

Anchor.Link = Link;
Anchor.version = componentVersions.Anchor;

Anchor.propTypes = {
  /** 锚点方向 */
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  /** 是否固定模式 */
  affix: PropTypes.bool,
  /** 锚点区域边界 */
  bounds: PropTypes.number,
  /** 滚动容器 */
  getContainer: PropTypes.func,
  /** 指定滚动的容器 */
  getCurrentAnchor: PropTypes.func,
  /** 距离窗口顶部达到指定偏移量后触发 */
  offsetTop: PropTypes.number,
  /** 是否显示 ink-dot */
  showInkInFixed: PropTypes.bool,
  /** 锚点滚动偏移量 */
  targetOffset: PropTypes.number,
  /** 锚点改变的回调 */
  onChange: PropTypes.func,
  /** 点击锚点项的回调 */
  onClick: PropTypes.func,
  /** 组件版本号 */
  version: PropTypes.string,
  /** 自定义类名 */
  className: PropTypes.string,
  /** 锚点项 */
  children: PropTypes.node,
};

Anchor.defaultProps = {
  direction: 'vertical',
  affix: true,
  bounds: 5,
  offsetTop: 0,
  showInkInFixed: false,
};

export default Anchor;
