import React, { forwardRef, memo } from 'react';
import { Breadcrumb as AntBreadcrumb, Tag as AntTag, Tooltip as AntTooltip } from 'antd';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
  UserOutlined,
  createFromIconfontCN,
} from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import { getIconNameByNodeType } from '../../utils/utils';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import A from '../A';
import './index.less';

const { Item, Separator } = AntBreadcrumb;

let OrgIconFont = null;

const orgIconFallbackMap = {
  'icon-org': ApartmentOutlined,
  'icon-park': AppstoreOutlined,
  'icon-xiangmu': FundProjectionScreenOutlined,
  user: UserOutlined,
};

const getOrgIconFont = () => {
  if (OrgIconFont || typeof window === 'undefined') {
    return OrgIconFont;
  }

  const iconfontUrl = window.iconfontUrl || 'static/icon.js';
  const scriptUrl = window._app ? `${window._pageURL}/${iconfontUrl}` : iconfontUrl;

  OrgIconFont = createFromIconfontCN({
    scriptUrl,
  });

  return OrgIconFont;
};

const resolveOrgIconName = orgType => {
  if (orgType === 2) {
    return 'icon-xiangmu';
  }

  return getIconNameByNodeType(orgType);
};

const renderOrgIcon = (orgType, isHome) => {
  if (isHome) {
    return <HomeOutlined className="tt-breadcrumb-org-icon" />;
  }

  const iconName = resolveOrgIconName(orgType);
  const IconFont = getOrgIconFont();

  if (IconFont && typeof iconName === 'string' && (iconName.startsWith('icon-') || iconName.startsWith('picon-'))) {
    return <IconFont className="tt-breadcrumb-org-icon" type={iconName.replace('picon-', 'icon-')} />;
  }

  const FallbackIcon = orgIconFallbackMap[iconName] || ApartmentOutlined;
  return <FallbackIcon className="tt-breadcrumb-org-icon" />;
};

const BreadcrumbOrg = memo(forwardRef(({
  mode = 'path',
  page,
  org,
  isPark = false,
  extra,
  extraBefore,
  className,
  version = componentVersions.Breadcrumb,
  onClick,
  ...props
}, ref) => {
  const currentOrg = page?.org || org;
  const parents = Array.isArray(currentOrg?.parents) ? currentOrg.parents : [];

  if (mode === 'tag') {
    if (!currentOrg?.name) {
      return null;
    }

    const handleTagClick = event => {
      page?.displayTree?.(page);
      onClick?.(event);
    };

    return (
      <span ref={ref} data-component-version={version}>
        <AntTooltip title={currentOrg.name}>
          <AntTag
            className={classNames('tt-breadcrumb-org-tag', className)}
            onClick={handleTagClick}
            {...props}
          >
            <span className="tt-breadcrumb-org-tag-name">项目</span>
            <span className="tt-breadcrumb-org-tag-value">{currentOrg.name}</span>
          </AntTag>
        </AntTooltip>
      </span>
    );
  }

  return (
    <div
      ref={ref}
      className={classNames('tt-breadcrumb-org', className)}
      data-component-version={version}
      {...props}
    >
      <div className="tt-breadcrumb-org-view">
        <AntBreadcrumb className="tt-breadcrumb-org-content">
          {parents.map((item, index, list) => {
            const isLast = index === list.length - 1;
            const nodeContent = (
              <span className="tt-breadcrumb-org-node">
                {renderOrgIcon(item?.orgType, index === 0)}
                <span className="tt-breadcrumb-org-label">{item?.name}</span>
              </span>
            );

            const isClickable = !isPark && !isLast && item?.orgID !== undefined && item?.orgID !== null;

            return (
              <Item key={item?.orgID || `${item?.name || 'org'}-${index}`}>
                {isClickable ? (
                  <A
                    className="tt-breadcrumb-org-link"
                    onClick={() => {
                      page?.tree?.triggerTreeSelect?.(item.orgID);
                    }}
                  >
                    {nodeContent}
                  </A>
                ) : (
                  <span className="tt-breadcrumb-org-text">{nodeContent}</span>
                )}
              </Item>
            );
          })}
        </AntBreadcrumb>
        {extraBefore ? <div className="tt-breadcrumb-org-extra-before">{extraBefore}</div> : null}
        {extra ? <div className="tt-breadcrumb-org-extra">{extra}</div> : null}
      </div>
    </div>
  );
}));

const Breadcrumb = forwardRef(({ separator, version = componentVersions.Breadcrumb, className, ...props }, ref) => {
  const breadcrumbClassName = classNames(
    'tt-breadcrumb',
    className
  );

  return (
    <AntBreadcrumb
      ref={ref}
      separator={separator}
      className={breadcrumbClassName}
      {...props}
      data-component-version={version}
    />
  );
});

Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;
Breadcrumb.Org = BreadcrumbOrg;
Breadcrumb.version = componentVersions.Breadcrumb;
Breadcrumb.Org.version = componentVersions.Breadcrumb;

Breadcrumb.propTypes = {
  separator: PropTypes.node,
  version: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  itemRender: PropTypes.func,
  params: PropTypes.object,
  routes: PropTypes.array,
};

BreadcrumbOrg.propTypes = {
  mode: PropTypes.oneOf(['path', 'tag']),
  page: PropTypes.object,
  org: PropTypes.object,
  isPark: PropTypes.bool,
  extra: PropTypes.node,
  extraBefore: PropTypes.node,
  className: PropTypes.string,
  version: PropTypes.string,
  onClick: PropTypes.func,
};

export default Breadcrumb;
