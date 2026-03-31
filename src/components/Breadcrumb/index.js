import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { Item, Separator } = AntBreadcrumb;

const getMergedDropdownProps = (childProps = {}) => {
  if (!childProps.menu && !childProps.overlay) {
    return childProps.dropdownProps;
  }

  return {
    ...childProps.dropdownProps,
    overlayClassName: classNames('tt-breadcrumb-dropdown', childProps.dropdownProps && childProps.dropdownProps.overlayClassName),
  };
};

const enhanceBreadcrumbChild = (child) => {
  if (!React.isValidElement(child) || !child.type || !child.type.__ANT_BREADCRUMB_ITEM) {
    return child;
  }

  return React.cloneElement(child, {
    dropdownProps: getMergedDropdownProps(child.props),
  });
};

const getCollapsedChildren = (children, maxCount) => {
  const childArray = React.Children.toArray(children).filter(Boolean);

  if (!maxCount || childArray.length <= maxCount) {
    return childArray;
  }

  const normalizedMaxCount = Math.max(3, maxCount);
  if (childArray.length <= normalizedMaxCount) {
    return childArray;
  }

  const tailCount = normalizedMaxCount - 2;
  const hiddenChildren = childArray.slice(1, childArray.length - tailCount);
  const visibleTailChildren = childArray.slice(childArray.length - tailCount);

  return {
    hiddenChildren,
    visibleChildren: [
      childArray[0],
      ...visibleTailChildren,
    ],
  };
};

const Breadcrumb = ({
  separator,
  version,
  className,
  children,
  maxCount,
  collapsedLabel,
  ...props
}) => {
  const breadcrumbClassName = classNames(
    'tt-breadcrumb',
    className
  );
  const collapsedResult = getCollapsedChildren(children, maxCount);

  const renderedChildren = Array.isArray(collapsedResult)
    ? collapsedResult.map(enhanceBreadcrumbChild)
    : [
      enhanceBreadcrumbChild(collapsedResult.visibleChildren[0]),
      (
        <Item
          key="tt-breadcrumb-collapsed"
          dropdownProps={{ overlayClassName: 'tt-breadcrumb-dropdown' }}
          menu={{
            items: collapsedResult.hiddenChildren.map((child, index) => ({
              key: `collapsed-${index}`,
              label: child.props && child.props.children ? child.props.children : child,
            })),
          }}
          className="tt-breadcrumb-item-collapsed"
        >
          {collapsedLabel}
        </Item>
      ),
      ...collapsedResult.visibleChildren.slice(1).map(enhanceBreadcrumbChild),
    ];

  return (
    <AntBreadcrumb
      separator={separator}
      className={breadcrumbClassName}
      {...props}
      data-component-version={version}
    >
      {renderedChildren}
    </AntBreadcrumb>
  );
};

Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;
Breadcrumb.version = componentVersions.Breadcrumb;

Breadcrumb.propTypes = {
  separator: PropTypes.node,
  version: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  maxCount: PropTypes.number,
  collapsedLabel: PropTypes.node,
};

Breadcrumb.defaultProps = {
  collapsedLabel: '...',
};

export default Breadcrumb;
