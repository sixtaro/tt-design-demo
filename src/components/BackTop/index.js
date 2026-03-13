import React from 'react';
import { BackTop as AntBackTop, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const BackTop = ({
  visibilityHeight = 200,
  duration,
  target,
  onClick,
  version,
  className,
  tooltipTitle = '回到顶部',
  ...props
}) => {
  const backTopClassName = classNames(
    'tt-back-top',
    className
  );

  return (
    <Tooltip title={tooltipTitle}>
      <AntBackTop
        visibilityHeight={visibilityHeight}
        duration={duration}
        target={target}
        onClick={onClick}
        className={backTopClassName}
        data-component-version={version}
        {...props}
      >
        <div className="tt-back-top-wrapper">
          <ArrowUpOutlined className="tt-back-top-icon" />
        </div>
      </AntBackTop>
    </Tooltip>
  );
};

BackTop.version = componentVersions.BackTop;

export default BackTop;
