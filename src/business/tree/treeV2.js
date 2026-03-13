import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback, useImperativeHandle } from 'react';
import { Tree, Input, AutoComplete, Empty, Tooltip, Popover, Checkbox } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { request, Storage, Utils } from '@/utils';
import './treeV2.less';
import ReactDOM from 'react-dom';
import { getIcon } from '@/business';
import { PushpinFilled, SettingOutlined } from '@ant-design/icons';

const { desktopTreeIcon } = Utils;

const Search = Input.Search;

function OrgTree({ page, orgtree, isPark, onTreeSelect, onStickClick, isSider, isSelect, defaultOrg, onSettingChange }, ref) {
    const systemConfig = Storage.get('SystemConfig');
    // const [searchValue, setSearchValue] = useState('');
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [height, setHeight] = useState(500);
    const [dataSource, setDataSource] = useState([
        {
            type: 'org',
            title: '组织',
            children: [],
        },
        {
            type: 'park',
            title: '车场',
            children: [],
        },
    ]);

    const depSelectable = useMemo(() => {
        if (page?.data?.depStatus === '1') {
            return true;
        }
        if (page?.data?.depStatus === '2') {
            return false;
        }
        return !isPark;
    }, [page, isPark]);

    const arr = useMemo(() => {
        let loopChildren = (childrens, parent) => {
            let arr = [];
            arr.count = 0;
            childrens &&
                childrens.forEach((item, index) => {
                    const newItem = {
                        ...item,
                        parents: parent ? [...parent.parents, parent] : [],
                        index,
                    };
                    arr.count++;
                    arr.push(newItem);
                    if (newItem.children?.length) {
                        const cArr = loopChildren(newItem.children, newItem);
                        newItem.count = cArr.count;
                        arr.count += newItem.count;
                        arr.push(...cArr);
                    }
                });
            return arr;
        };
        return loopChildren(orgtree);
    }, [orgtree]);

    const treeData = useMemo(() => {
        const SystemConfig = Storage.get('SystemConfig');
        const isYaJuLe = SystemConfig?.isYaJuLe;

        const mapTree = item => {
            if ([1, 3].includes(item.attributes.orgType)) {
                return {
                    key: item.id,
                    title: (
                        <>
                            <span className="title-content" title={item.text}>
                                {item.text}
                            </span>
                            {/* <span className="online-status">{item.attributes.onlineOrder === 0 ? getIcon('icon-weilianwang') : ''}</span> */}
                        </>
                    ),
                    icon:
                        item === orgtree[0] ? (
                            // <HomeOutlined />
                            <>
                                {/* <span className={item.attributes.onlineOrder === 0 ? 'online-status-icon offline' : 'online-status-icon'}></span> */}
                                {getIcon(desktopTreeIcon(item))}
                            </>
                        ) : (
                            // getIcon(item.attributes.orgType === 2 ? 'icon-xiangmu' : 'icon-org')
                            // getIcon('icon-xianxingrenyuanbumen')
                            <>
                                {/* <span className={item.attributes.onlineOrder === 0 ? 'online-status-icon offline' : 'online-status-icon'}></span> */}
                                {getIcon(desktopTreeIcon(item))}
                            </>
                        ),
                    selectable: depSelectable,
                    className: `ref${item.id} ${isYaJuLe && item.disabled ? 'tree-node-offline' : ''}`,
                    data: item,
                    children: item.children.map(mapTree).filter(Boolean),
                };
            } else {
                return {
                    className: `ref${item.id} ${isYaJuLe && item.disabled ? 'tree-node-offline' : ''}`,
                    key: item.id,
                    title: (
                        <div className="park-node" title={item.text}>
                            <>
                                <span className="title-content">{item.text}</span>
                                {/* <span className="online-status">{item.attributes.onlineOrder === 0 ? getIcon('icon-weilianwang') : ''}</span> */}
                            </>
                        </div>
                    ),
                    // icon: getIcon(item.attributes.orgType === 2 ? 'icon-xiangmu' : 'icon-park'),
                    icon: (
                        <>
                            {item.attributes.onlineOrder === 0 ? (
                                <Tooltip title="未联网">
                                    <span className="online-status-icon offline"></span>
                                </Tooltip>
                            ) : (
                                <></>
                            )}
                            {getIcon(desktopTreeIcon(item))}
                        </>
                    ),
                    data: item,
                    ...(isYaJuLe && { children: item.children.map(mapTree).filter(Boolean) }),
                };
            }
        };

        return orgtree.map(mapTree).filter(Boolean);
    }, [depSelectable, orgtree]);

    const options = useMemo(() => {
        return dataSource
            .filter(group => group.children.length)
            .map(group => ({
                label: group.title,
                options: group.children.map(opt => ({
                    value: opt.text,
                    key: opt.id,
                })),
            }));
    }, [dataSource]);

    const tree = useRef();
    const directoryTree = useRef();

    const onChange = useCallback(
        value => {
            let dataSource = [
                {
                    type: 'org',
                    title: '组织',
                    children: [],
                },
                {
                    type: 'park',
                    title: '车场',
                    children: [],
                },
            ];
            arr &&
                arr.forEach(item => {
                    if (item.text.indexOf(value) > -1) {
                        if (item.attributes.parkID === 0) {
                            dataSource[0].children.push(item);
                        } else {
                            dataSource[1].children.push(item);
                        }
                    }
                });
            if (dataSource[1].children.length === 0) {
                dataSource.pop();
            }
            if (dataSource[0].children.length === 0) {
                dataSource.shift();
            }
            setDataSource(dataSource);
            // setSearchValue(value);
        },
        [arr]
    );

    const onSearchSelect = useCallback(
        (value, option) => {
            const key = option.key;
            let findChild =
                arr &&
                arr.find(item => {
                    return item.id === key;
                });
            if (findChild?.attributes?.parents instanceof Array) {
                setExpandedKeys(expandedKeys => {
                    const newExpandedKeys = expandedKeys.concat();
                    findChild.attributes.parents.forEach(parent => {
                        if (!newExpandedKeys.includes(parent.id)) {
                            newExpandedKeys.push(parent.id);
                        }
                    });
                    return newExpandedKeys;
                });
                onTreeSelect(findChild.attributes);

                setSelectedKeys([key]);
                // setSearchValue(value);

                setTimeout(() => {
                    directoryTree.current?.scrollTo({ key: key });
                }, 100);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [arr]
    );

    const onMyTreeSelect = (selectedKeys, { node }) => {
        if (onTreeSelect({ ...node.data.attributes, id: 'org_' + node.data.attributes.orgID })) {
            setSelectedKeys(selectedKeys);
        }
    };

    const onExpand = expandedKeys => {
        const rootID = orgtree[0]?.id;
        if (!expandedKeys.includes(rootID) && !selectedKeys.includes(rootID)) {
            expandedKeys.splice(0, 0, rootID);
        }
        setExpandedKeys(expandedKeys);
    };

    const searchParkNode = useCallback(
        id => {
            const parkList = dataSource[1]?.children;

            const parkNode = parkList?.find(node => node.attributes.parkID === +id);

            if (parkNode) {
                onSearchSelect('', {
                    key: parkNode.id,
                });
            }
        },
        [dataSource, onSearchSelect]
    );

    const triggerTreeSelect = useCallback(
        (id, idType = 'orgID') => {
            if (idType === 'orgID') {
                onSearchSelect('', {
                    key: 'org_' + id,
                });
            }

            if (idType === 'parkID') {
                searchParkNode(id);
            }
        },
        [onSearchSelect, searchParkNode]
    );

    const triggerTreeSelectByParkId = useCallback((id) => {
        if (!Number.isFinite(id)) {
            return;
        }
        const target = arr.find(item => item.attributes.parkID === id);
        if (!target) {
            return;
        }
        triggerTreeSelect(target.attributes.orgID);
    }, [arr, triggerTreeSelect])

    const changeOrg = useCallback(
        orgID => {
            // onSearchSelect('', {
            //     key: 'org_' + orgID,
            // });
            triggerTreeSelect(orgID);
        },
        [triggerTreeSelect]
    );

    useLayoutEffect(() => {
        const id = defaultOrg?.id;
        if (id && id.indexOf('undefined') === -1) {
            const orgExist = !!Array.loopItem(orgtree, item => {
                if (item.attributes.orgID === defaultOrg.orgID) {
                    return item;
                }
            });

            if (orgExist) {
                // setExpandedKeys(defaultOrg.parents.map(node => node.id));
                // setSelectedKeys([id]);
                triggerTreeSelect(id.replace('org_', ''));
            } else {
                setExpandedKeys([orgtree[0]?.id]);
                setSelectedKeys([orgtree[0]?.id]);
            }
        } else {
            if (orgtree.length > 0) {
                setExpandedKeys([orgtree[0]?.id]);
                setSelectedKeys([orgtree[0]?.id]);
            }
        }
        const searchParams = new URLSearchParams(window.location.search);
        const initParkID = searchParams.get('initParkID');
        if (initParkID) {
            setTimeout(() => {
                triggerTreeSelect(initParkID, 'parkID');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultOrg, orgtree]);

    const onWindowResize = useCallback(() => {
        const treeDom = ReactDOM.findDOMNode(tree.current);
        let height = 500;
        if (treeDom?.offsetHeight) {
            height = treeDom.offsetHeight - 84;
        }
        setHeight(height);
        return height;
    }, []);

    useEffect(() => {
        setTimeout(() => {
            onWindowResize();
        });
        setTimeout(() => {
            onWindowResize();
        }, 400);
        window.addEventListener('resize', onWindowResize);

        onChange('');

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, [onChange, onWindowResize, isSider]);

    // useEffect(() => {
    //     const { depStatus, allowPark, allowCharge, allowCommplatform, allowWash } = page.data;
    //     if (typeof depStatus === 'string') {
    //         const businessTypes = appInfo.businessTypes.split(',');

    //         const hasPark = businessTypes.some(type => {
    //             if ((type === '0' && allowPark) || (type === '1' && allowCharge) || (type === '2' && allowWash) || (type === '3' && allowCommplatform)) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         });

    //         if (!hasPark) {
    //             message.warn('应用的业务范围与页面的业务范围不一致，机构树不展示车场');
    //         }
    //     }
    // }, [appInfo.businessTypes, page.data]);

    useImperativeHandle(
        ref,
        () => ({
            triggerTreeSelect,
            changeOrg,
            triggerTreeSelectByParkId,
        }),
        [changeOrg, triggerTreeSelect, triggerTreeSelectByParkId]
    );

    return (
        <div className="new-side-tree desktop-tree page-side-org-tree" ref={tree}>
            {/* {isSider && (
                <div className="fold">
                    <span style={{ cursor: 'pointer' }} onClick={onFoldClick}>
                        <MenuUnfoldOutlined style={{ marginRight: 4 }} />
                        收起
                    </span>
                </div>
            )} */}
            <div className="complete-row">
                <Tooltip title="固定在左侧">{isSelect && <PushpinFilled className="push-pin" onClick={onStickClick} />}</Tooltip>
                <AutoComplete
                    options={options}
                    onSearch={onChange}
                    onSelect={onSearchSelect}
                    notFoundContent={<Empty description="无匹配项" image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>}
                    className="auto-complete"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                    <Search className="search" placeholder="请输入需要查找的机构" allowClear enterButton={getIcon('icon-search1')} />
                </AutoComplete>
                <OrgTreeSetting onSettingChange={onSettingChange} treeRef={tree}></OrgTreeSetting>
            </div>
            <Tree.DirectoryTree
                ref={directoryTree}
                switcherIcon={<DownOutlined />}
                showIcon
                blockNode
                height={height}
                multiple={!isPark}
                onSelect={onMyTreeSelect}
                className={systemConfig?.maxTreeWidth === 'none' ? 'tree tree-v2 tree-scroll' : 'tree tree-v2'}
                selectedKeys={selectedKeys}
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                treeData={treeData}
            ></Tree.DirectoryTree>
        </div>
    );
}

export function OrgTreeSetting({ onSettingChange }) {
    const [showEmptyNode, setShowEmptyNode] = useState(true);

    const onSettingCheckChange = async e => {
        const checked = e.target.checked;
        const user = Storage.get('user');
        const config = JSON.parse(user.config || '{}');

        if (!config.tree) {
            config.tree = {};
        }

        config.tree.showEmptyNode = !checked;

        await request('../PublicV2/home/sysversion/upsertuserconfig', { userID: user.userID, config }, { silence: true });
        user.config = JSON.stringify(config);
        Storage.set('user', user);
        setShowEmptyNode(!checked);
        onSettingChange?.();
    };

    const settingContent = (
        <Checkbox checked={!showEmptyNode} onChange={onSettingCheckChange}>
            隐藏无项目的节点
        </Checkbox>
    );

    useEffect(() => {
        const initShowEmptyNode = async () => {
            const showEmptyNode = await getShowEmptyNode();
            setShowEmptyNode(showEmptyNode);
        };

        initShowEmptyNode();
    }, []);

    return (
        <Popover trigger={['click']} placement="bottomRight" content={settingContent} getPopupContainer={triggerNode => triggerNode.parentNode}>
            <SettingOutlined className="setting-icon" style={{ margin: '0 6px' }} />
        </Popover>
    );
}

export async function getShowEmptyNode() {
    const result = await request('../PublicV2/home/sysversion/getuserconfig', {}, { silence: true });
    const config = JSON.parse(result.data?.config || '{}');
    return typeof config.tree?.showEmptyNode === 'boolean' ? config.tree?.showEmptyNode : false;
}

export default React.forwardRef(OrgTree);
