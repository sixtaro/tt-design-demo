import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Breadcrumb, Popover, message } from 'antd';
import { A } from '@/components';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { request, Storage } from '@/utils';
import OrgTree from '../tree/tree';
import './breadcrumbTreeSelect.less';

export default function BreadcrumbOrg({ page, extra, extraBefore, isPark, org }) {
    const pageOrg = page.org || org;

    const [popVisible, setPopVisible] = useState(false);
    const [orgTree, setOrgTree] = useState([]);

    const dropdownTree = useRef();

    const getOrgTree = useCallback(async () => {
        const handleOrgTree = (childrens, parent, level) => {
            const parkIDs = [];
            const parks = [];
            const orgIDs = [];
            childrens &&
                childrens.forEach(item => {
                    if (!parent) {
                        parent = { attributes: { parents: [] } };
                        level = 1;
                    }
                    item.attributes.level = level;
                    let isPark = item.attributes.parkID !== 0;
                    item.attributes.name = isPark ? item.text : item.text.includes('(') ? item.text.substr(0, item.text.lastIndexOf('(')) : item.text;
                    item.attributes.parents = [
                        ...parent.attributes.parents,
                        {
                            ...item.attributes,
                            id: item.id,
                        },
                    ];
                    if (item.children) {
                        const subOrgTree = handleOrgTree(item.children, item, level + 1);
                        item.attributes.parks = subOrgTree.parks;
                        item.attributes.parkIDs = subOrgTree.parkIDs;
                        item.attributes.orgIDs = subOrgTree.orgIDs;
                        parks.push(...item.attributes.parks);
                        parkIDs.push(...item.attributes.parkIDs);
                        orgIDs.push(...item.attributes.orgIDs);
                    }
                    if (item.attributes.parkID) {
                        item.attributes.parkVersion = parseInt(item.attributes.softwareEdition, 10) || 3;
                        parks.push(item.attributes);
                        parkIDs.push(item.attributes.parkID);
                        item.attributes.parks.push(item.attributes);
                        item.attributes.parkIDs.push(item.attributes.parkID);
                    }
                    if (item.attributes.orgID) {
                        orgIDs.push(item.attributes.orgID);
                        item.attributes.orgIDs.push(item.attributes.orgID);
                    }
                });
            return {
                parks,
                parkIDs,
                orgIDs,
            };
        };

        const user = Storage.get('user');
        const config = user.UserConfig;
        const showEmptyNode = typeof config.tree?.showEmptyNode === 'boolean' ? config.tree?.showEmptyNode : undefined;

        let orgtree = await request(`../PublicV2/home/group/usergrouporg/orgtree`, { sysVersion: 4, showEmptyNode });
        if (!orgtree || !(orgtree instanceof Array)) {
            return;
        }
        handleOrgTree(orgtree);
        setOrgTree(orgtree);
    }, []);

    const onVisibleChange = visible => {
        // 侧边栏打开的时候不展示下拉弹窗
        if (!page.showBar) {
            message.info('机构树已固定在左侧');
            return;
        }

        setPopVisible(visible);
    };

    const ArrowIcon = useMemo(() => {
        return page.showBar ? RightOutlined : DownOutlined;
    }, [page.showBar]);

    const PopContent = (
        <div className="pop-content">
            <OrgTree
                ref={dropdownTree}
                orgtree={orgTree}
                isPark={page.data.isPark}
                isSelect
                onStickClick={() => {
                    page.displayTree(page);
                    setPopVisible(false);
                }}
                onTreeSelect={org => {
                    if (org.orgID !== pageOrg.orgID) {
                        page.tree?.triggerTreeSelect(org.orgID);
                    }
                    return true;
                }}
                onSettingChange={getOrgTree}
            ></OrgTree>
        </div>
    );

    useEffect(() => {
        getOrgTree();
    }, [getOrgTree]);

    useEffect(() => {
        if (dropdownTree.current || popVisible) {
            setTimeout(() => {
                dropdownTree.current?.triggerTreeSelect(pageOrg.orgID);
            }, 200);
        }
    }, [pageOrg.orgID, popVisible]);

    return (
        <div className="breadcrumb-header-container">
            <Popover
                overlayClassName="breadcrumb-popover"
                placement="bottomLeft"
                trigger="click"
                open={popVisible}
                onOpenChange={onVisibleChange}
                content={PopContent}
            >
                <div className="breadcrumb-header-wrapper">
                    {/* <PartitionOutlined style={{ marginRight: 10 }} /> */}
                    <Breadcrumb className="breadcrumb-select">
                        {pageOrg &&
                            pageOrg.parents.map((org, index, array) => (
                                <Breadcrumb.Item key={org.orgID} className="breadcrumb-item">
                                    {!isPark && index < array.length - 1 ? (
                                        <A
                                            onClick={() => {
                                                page.tree?.triggerTreeSelect(org.orgID);
                                            }}
                                        >
                                            {/* <PartitionOutlined /> */}
                                            {/* {index === 0 ? <HomeOutlined /> : getIcon(getIconType(org.orgType))} */}
                                            {org.name}
                                        </A>
                                    ) : (
                                        <>
                                            {/* {index === 0 ? <HomeOutlined /> : getIcon(getIconType(org.orgType))} */}
                                            {org.name}
                                        </>
                                    )}
                                </Breadcrumb.Item>
                            ))}
                    </Breadcrumb>

                    <ArrowIcon style={{ marginLeft: 10, fontSize: 12 }} />
                </div>
            </Popover>

            <div className="breadcrumb-header-view-extra-before">{extraBefore}</div>
            <div className="breadcrumb-header-view-extra">{extra}</div>
        </div>
    );
}

BreadcrumbOrg.defaultProps = {
    isPark: false,
};
