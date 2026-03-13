import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, TreeSelect } from 'antd';
import { getIcon } from '@/business';
import { Utils } from '@/utils';

const { recursiveTreeNode, desktopTreeIcon } = Utils;

// const orgIcon = (orgType, isRoadSide) => {
//     switch (orgType) {
//         case 0:
//             return isRoadSide ? 'icon-lucechechang' : 'icon-fengbichechang';
//         case 1:
//         case 3:
//             return 'icon-jigou1';
//         case 2:
//             return 'icon-menjin';
//         case 4:
//             return 'icon-chongdianzhuang2';
//         default:
//             break;
//     }
// };

const treeDataV2 = type => {
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
                return getIcon(desktopTreeIcon(treeNode));
                // return getIcon(orgIcon(treeNode.attributes.orgType, treeNode.attributes.isRoadSide));
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

export default treeDataV2;
