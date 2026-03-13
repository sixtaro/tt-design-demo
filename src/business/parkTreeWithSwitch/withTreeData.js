import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, TreeSelect, Switch, Spin } from 'antd';
import flattenDeep from 'lodash/flattenDeep';
import { getIcon } from '@/business';
import { Utils, request } from '@/utils';
import { findSwitchOnNodeIDs } from './utils';
import uniq from 'lodash/uniq';

const { recursiveTreeNode, getIconNameByNodeType } = Utils;

function isObjectEmpty(obj) {
    if (!obj || typeof obj !== 'object') {
        return true;
    }

    // 检查是否为空对象
    if (Object.keys(obj).length === 0) {
        return true;
    }

    // 检查所有属性值是否为空
    return Object.values(obj).every(value => {
        return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    });
}

export default function (type) {
    const { TreeNode } = type === 'tree' ? Tree : type === 'tree-select' ? TreeSelect : null;

    return function (WrapperedComponent) {
        class WithTreeData extends Component {
            static propTypes = {
                resTreeData: PropTypes.array,
                selectableType: PropTypes.string,
                disabledKeys: PropTypes.array,
            };

            static defaultProps = {
                disabledKeys: [],
            };

            constructor() {
                super();
                this.state = {
                    treeData: [],
                    // 是否需要渲染已有数据
                    needRender: true,
                };
            }

            getIconByNode(treeNode) {
                return getIcon(
                    treeNode.isRoot
                        ? 'home'
                        : getIconNameByNodeType((typeof treeNode.attributes.type === 'string' && treeNode.attributes.type) || treeNode.iconCls)
                );
            }

            getTreeNodeElement(treeNode) {
                const onSwitchClick = (value, e, treeNode, noUpdate = false) => {
                    let originalValue = this.props.value;
                    let newCheckedValue = [];
                    let newSwitchValue = [];
                    if (value) {
                        treeNode.on = true;
                        treeNode.disabled = true;
                        // 递归处理子节点、孙子节点及深层节点
                        function iterateChildren(node) {
                            node.children?.forEach(child => {
                                child.disabled = true;
                                child.on = true;
                                child.switchDisabled = true;
                                iterateChildren(child);
                            });
                        }
                        iterateChildren(treeNode);
                        newCheckedValue = uniq([...(originalValue?.checkedValue || []), ...treeNode.parkIDs]);
                        // 传递开关开启的机构节点id
                        newSwitchValue = findSwitchOnNodeIDs(this.state.treeData);
                    } else {
                        treeNode.on = false;
                        treeNode.disabled = false;
                        // 不开启父节点
                        // 只开启子节点，孙子节点及深层节点不开启
                        // 子节点车场不禁用
                        treeNode.children?.forEach(child => {
                            child.disabled = true;
                            child.on = true;
                            child.switchDisabled = false;
                            if (child.isPark) {
                                child.disabled = false;
                            }
                        });
                        // 强制刷新
                        newCheckedValue = originalValue?.checkedValue || [];
                        // 传递开关开启的机构节点id
                        newSwitchValue = findSwitchOnNodeIDs(this.state.treeData);
                    }
                    let res;
                    if (newCheckedValue.length > 0 || newSwitchValue.length > 0) {
                        res = {
                            checkedValue: newCheckedValue,
                            switchValue: newSwitchValue,
                        };
                    } else {
                        res = undefined;
                    }
                    if (!noUpdate) {
                        this.props.onChange && this.props.onChange(res);
                    } else {
                        this.setState({
                            needRender: false,
                        });
                    }
                    e?.stopPropagation?.();
                };

                const getLeafValue = treeNode => {
                    // 开关开启的机构节点id
                    let switchValue = this.props.value?.switchValue || [];
                    // 找到这些节点，执行一次开关开启的逻辑
                    if (treeNode.value && switchValue.includes(treeNode.value) && this.state.needRender) {
                        onSwitchClick(true, {}, treeNode, true);
                    }
                    return (
                        <TreeNode
                            isLeaf
                            key={treeNode.key}
                            value={treeNode.value}
                            title={
                                <span className={treeNode.isPark ? 'node-park' : 'node-department'}>
                                    {treeNode.text}
                                    {!treeNode.isPark && (
                                        <Switch
                                            checked={treeNode.on}
                                            disabled={treeNode.switchDisabled}
                                            className="tree-switch"
                                            onClick={(value, e) => onSwitchClick(value, e, treeNode)}
                                            style={{ marginLeft: 4 }}
                                        />
                                    )}
                                </span>
                            }
                            icon={this.getIconByNode(treeNode)}
                            disabled={treeNode.disabled}
                        />
                    );
                };

                const getParentValue = (treeNode, childrenValue) => {
                    // 开关开启的机构节点id
                    let switchValue = this.props.value?.switchValue || [];
                    // 找到这些节点，执行一次开关开启的逻辑
                    if (treeNode.value && switchValue.includes(treeNode.value) && this.state.needRender) {
                        onSwitchClick(true, {}, treeNode, true);
                    }
                    return (
                        <TreeNode
                            key={treeNode.key}
                            value={treeNode.value}
                            title={
                                <span className={treeNode.isPark ? 'node-park' : 'node-department'}>
                                    {treeNode.text}
                                    {
                                        <Switch
                                            className="tree-switch"
                                            checked={treeNode.on}
                                            disabled={treeNode.switchDisabled}
                                            onClick={(value, e) => onSwitchClick(value, e, treeNode)}
                                            style={{ marginLeft: 4 }}
                                        />
                                    }
                                </span>
                            }
                            icon={this.getIconByNode(treeNode)}
                            disabled={treeNode.disabled}
                        >
                            {childrenValue}
                        </TreeNode>
                    );
                };

                return recursiveTreeNode(treeNode, getLeafValue, getParentValue);
            }

            get treeChildren() {
                // 格式化树
                const transformTreeData = treeData => {
                    return (
                        treeData &&
                        treeData.map(treeNode => {
                            treeNode.on = false;
                            treeNode.disabled = false;
                            treeNode.switchDisabled = false;
                            if (treeNode.children?.length > 0) {
                                transformTreeData(treeNode.children);
                            }
                            return treeNode;
                        })
                    );
                };

                let treeData = this.state.treeData;
                const value = this.props.value;
                if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0) || isObjectEmpty(value)) {
                    treeData = transformTreeData(treeData);
                }

                return treeData.map(treeNode => {
                    treeNode.isRoot = true;
                    return this.getTreeNodeElement(treeNode);
                });
            }

            // 所有节点放在一个数组中
            get nodeList() {
                return flattenDeep(
                    this.state.treeData.map(treeNode => {
                        const getLeafValue = treeNode => treeNode;

                        const getParentValue = (treeNode, childrenValue) => {
                            return [treeNode].concat(flattenDeep(childrenValue));
                        };

                        return recursiveTreeNode(treeNode, getLeafValue, getParentValue);
                    })
                );
            }

            componentDidMount() {
                const fetchData = async () => {
                    const result = await request('../PublicV2/home/group/usergrouporg/orgtree', {
                        sysVersion: 4,
                        businessType: 0,
                    });

                    // 格式化树
                    const transformTreeData = treeData => {
                        return (
                            treeData &&
                            treeData.map(treeNode => {
                                treeNode.title = treeNode.text;
                                treeNode.value = treeNode.attributes.parkID === 0 ? treeNode.id : treeNode.attributes.parkID;
                                treeNode.key = treeNode.attributes.parkID === 0 ? treeNode.id : treeNode.attributes.parkID;
                                treeNode.isPark = !!treeNode.attributes.parkID;
                                treeNode.on = false;
                                treeNode.disabled = false;
                                treeNode.switchDisabled = false;
                                if (treeNode.children?.length > 0) {
                                    transformTreeData(treeNode.children);
                                }
                                return treeNode;
                            })
                        );
                    };

                    // 遍历树，将非叶子节点下的所有车场/机构部门 ID 及 自身ID 找出来放到它身上
                    const getChildParkIDs = treeNode => {
                        if (treeNode.children?.length > 0) {
                            let parkIDs = [treeNode.id];
                            treeNode.children.forEach(child => {
                                getChildParkIDs(child);
                                parkIDs = uniq([...parkIDs, ...child.parkIDs]);
                            });
                            treeNode.parkIDs = parkIDs;
                        } else {
                            if (treeNode.isPark) {
                                treeNode.parkIDs = [treeNode.attributes.parkID];
                            } else {
                                treeNode.parkIDs = [treeNode.id];
                            }
                        }
                    };
                    const getTreeNodeParkIDs = treeData => {
                        return (
                            treeData &&
                            treeData.map(treeNode => {
                                getChildParkIDs(treeNode);
                                return treeNode;
                            })
                        );
                    };

                    this.setState({
                        treeData: getTreeNodeParkIDs(transformTreeData(result)),
                    });
                };
                fetchData();
            }

            render() {
                const { forwardedRef, ...rest } = this.props;

                return (
                    <Spin spinning={this.state.treeData.length === 0}>
                        {this.state.treeData.length ? (
                            <WrapperedComponent
                                ref={forwardedRef}
                                treeChildren={this.treeChildren}
                                nodeList={this.nodeList}
                                treeData={this.state.treeData}
                                {...rest}
                            ></WrapperedComponent>
                        ) : null}
                    </Spin>
                );
            }
        }

        return React.forwardRef((props, ref) => {
            return <WithTreeData {...props} forwardedRef={ref}></WithTreeData>;
        });
    };
}
