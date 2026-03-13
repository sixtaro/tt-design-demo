import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, TreeSelect } from 'antd';
import { getIcon } from '@/business';
import { Utils } from '@/utils';
import treeDataV2 from './withTreeDataV2';

// function getIconString(treeNode) {
// if (treeNode.attributes.orgType === 0 || treeNode.attributes.orgType === 3 || treeNode.attributes.type === 'park') {
//     return 'icon-park';
// }
// if (treeNode.attributes.orgType === 1 || treeNode.attributes.type === 1) {
//     return 'icon-org';
// }
// }

const { recursiveTreeNode, getIconNameByNodeType } = Utils;

const treeData = type => {
    const { TreeNode } = type === 'tree' ? Tree : type === 'tree-select' ? TreeSelect : null;

    return function (WrapperedComponent, empty = null) {
        class WithTreeData extends Component {
            static propTypes = {
                resTreeData: PropTypes.array,
                selectableType: PropTypes.string,
                disabledKeys: PropTypes.array,
                disabledFunc: PropTypes.func,
            };

            static defaultProps = {
                disabledKeys: [],
                disabledFunc: () => false,
            };

            state = {
                nodeList: [],
            };

            componentDidMount() {
                const nodeList = [];
                Array.loopItem(this.props.resTreeData || [], (item, index, { parents }) => {
                    item.parents = parents;
                    item.index = index;
                    nodeList.push(item);
                });
                this.setState({ nodeList });
            }

            componentDidUpdate(prevProps) {
                if (prevProps.resTreeData !== this.props.resTreeData) {
                    const nodeList = [];
                    Array.loopItem(this.props.resTreeData || [], (item, index, { parents }) => {
                        item.parents = parents;
                        item.index = index;
                        nodeList.push(item);
                    });
                    this.setState({ nodeList });
                }
            }
            getIconByNode(treeNode) {
                return getIcon(treeNode.isRoot ? getIconNameByNodeType('icon-yijibumen') : getIconNameByNodeType(treeNode.iconCls));
            }

            getTreeNodeElement(treeNode) {
                const { selectableType, disabledKeys, disabledFunc } = this.props;

                const isAble = treeNode => {
                    return typeof selectableType === 'string' ? selectableType === treeNode.attributes.type : true;
                };

                const getLeafValue = treeNode => (
                    <TreeNode
                        isLeaf
                        key={treeNode.id}
                        value={treeNode.id}
                        title={treeNode.text}
                        icon={this.getIconByNode(treeNode)}
                        disabled={treeNode.disabled || !isAble(treeNode) || disabledKeys.indexOf(treeNode.id) > -1 || disabledFunc(treeNode, this.nodeList)}
                    />
                );

                const getParentValue = (treeNode, childrenValue) => (
                    <TreeNode
                        key={treeNode.id}
                        value={treeNode.id}
                        title={treeNode.text}
                        icon={this.getIconByNode(treeNode)}
                        disabled={treeNode.disabled || !isAble(treeNode) || disabledKeys.indexOf(treeNode.id) > -1 || disabledFunc(treeNode, this.nodeList)}
                    >
                        {childrenValue}
                    </TreeNode>
                );

                return recursiveTreeNode(treeNode, getLeafValue, getParentValue);
            }

            get treeChildren() {
                return this.props.resTreeData.map(treeNode => {
                    treeNode.isRoot = true;
                    return this.getTreeNodeElement(treeNode);
                });
            }

            // 所有节点放在一个数组中，并添加count，parents，index属性
            get nodeList() {
                return this.state.nodeList;
            }

            render() {
                const { forwardedRef, ...rest } = this.props;

                return this.state.nodeList.length ? (
                    <WrapperedComponent ref={forwardedRef} treeChildren={this.treeChildren} nodeList={this.state.nodeList} {...rest}></WrapperedComponent>
                ) : (
                    empty
                );
            }
        }

        return React.forwardRef((props, ref) => {
            return <WithTreeData {...props} forwardedRef={ref}></WithTreeData>;
        });
    };
};

const OrgTree = window.projectName === 'desktop' || window.projectName === 'managerV3' ? treeDataV2 : treeData;

export default OrgTree;
