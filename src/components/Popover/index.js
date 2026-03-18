import React from 'react';
import { Popover as AntPopover } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Popover = ({
  title,
  content,
  trigger,
  placement,
  onOpenChange,
  version,
  className,
  ...props
}) => {
  const popoverClassName = classNames(
    'tt-popover',
    className
  );

  return (
    <AntPopover
      title={title}
      content={content}
      trigger={trigger}
      placement={placement}
      onOpenChange={onOpenChange}
      className={popoverClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Popover.version = componentVersions.Popover || '1.0.0';

export default Popover;
