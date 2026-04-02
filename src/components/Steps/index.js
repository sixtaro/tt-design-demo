import React from 'react';
import { Steps as AntSteps } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { Step } = AntSteps;

const Steps = React.forwardRef(({ version, className, ...props }, ref) => {
  const stepsClassName = classNames(
    'tt-steps',
    className
  );

  return (
    <AntSteps
      ref={ref}
      className={stepsClassName}
      data-component-version={version}
      {...props}
    />
  );
});

Steps.Step = Step;
Steps.version = componentVersions.Steps;

Steps.propTypes = {
  /** 当前步骤，从 0 开始 */
  current: PropTypes.number,
  /** 步骤条方向 */
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  /** 步骤条大小 */
  size: PropTypes.oneOf(['default', 'small']),
  /** 标签放置位置 */
  labelPlacement: PropTypes.oneOf(['horizontal', 'vertical']),
  /** 当前步骤的状态 */
  status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
  /** 组件版本号 */
  version: PropTypes.string,
  /** 自定义类名 */
  className: PropTypes.string,
  /** 步骤项 */
  children: PropTypes.node,
};

Steps.defaultProps = {
  current: 0,
  direction: 'horizontal',
  size: 'default',
  labelPlacement: 'horizontal',
};

export default Steps;
