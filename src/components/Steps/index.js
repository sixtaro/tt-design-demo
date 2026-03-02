import React from 'react';
import { Steps as AntSteps } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Step } = AntSteps;

const Steps = ({ current, direction, size, labelPlacement, version, className, ...props }) => {
  const stepsClassName = classNames(
    'tt-steps',
    className
  );

  return (
    <AntSteps
      current={current}
      direction={direction}
      size={size}
      labelPlacement={labelPlacement}
      className={stepsClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Steps.Step = Step;
Steps.version = componentVersions.Steps;

export default Steps;