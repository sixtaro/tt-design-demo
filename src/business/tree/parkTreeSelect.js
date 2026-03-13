import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import { getIcon } from '@/business';
import { Utils } from '@/utils';

const { recursiveTreeNode, getIconNameByNodeType } = Utils;

const getElementTop = function (element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
};

function getNodeId(node, orgCanSelect) {
    let nodeType = node.attributes.orgType;
    switch (nodeType) {
        case 0:
            return `${orgCanSelect ? node.attributes.orgID : node.attributes.parkID}`;
        default:
            return `${node.attributes.orgID}`;
    }
}

const { TreeNode } = TreeSelect;

// 专为车场选择定制的treeselect
export default class CustomTreeSelect extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
        disabledKeys: PropTypes.array,
        /** 配置antd的TreeSelect的props */
        treeSelectProps: PropTypes.object,
        /** 组织机构是否可选 */
        orgCanSelect: PropTypes.bool,
        autoSelectFirstPark: PropTypes.bool,
    };

    static defaultProps = {
        disabledKeys: [],
        orgCanSelect: false,
        onChange: () => {},
        autoSelectFirstPark: false,
    };

    state = {
        orgTree: [],
        dropdownHeight: 200,
        value: this.props.value,
        disabled: this.props.disabled,
        firstPark: null,
    };

    get value() {
        return this.props.value || this.state.value;
    }

    get treeChildren() {
        return this.state.orgTree?.map?.(treeNode => {
            treeNode.isRoot = true;
            return this.getTreeNodeElement(treeNode);
        });
    }

    getIconByNode(treeNode) {
        return getIcon(
            treeNode.isRoot
                ? 'home'
                : getIconNameByNodeType(
                      (typeof treeNode.attributes.type === 'string' && treeNode.attributes.type) || treeNode.iconCls
                  )
        );
    }

    getTreeNodeElement(treeNode) {
        const { orgCanSelect } = this.props;

        const getLeafValue = treeNode => (
            <TreeNode
                isLeaf
                key={getNodeId(treeNode, orgCanSelect)}
                value={getNodeId(treeNode, orgCanSelect)}
                title={treeNode.text}
                icon={this.getIconByNode(treeNode)}
                disabled={treeNode.disabled}
            />
        );

        const getParentValue = (treeNode, childrenValue) => (
            <TreeNode
                key={getNodeId(treeNode, orgCanSelect)}
                value={getNodeId(treeNode, orgCanSelect)}
                title={treeNode.text}
                icon={this.getIconByNode(treeNode)}
                disabled={treeNode.disabled}
            >
                {childrenValue}
            </TreeNode>
        );

        return recursiveTreeNode(treeNode, getLeafValue, getParentValue);
    }

    treeSelectWrapEle = React.createRef();

    componentDidMount() {
        this.getOrgTree();
        this.setDropDownHeightBindThis();
        window.addEventListener('resize', this.setDropDownHeightBindThis);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setDropDownHeightBindThis);
    }

    handleOrgTree = (childrens, parent, level) => {
        const { disabledKeys, enabledParentNode, orgCanSelect } = this.props;

        const parkIDs = [];
        const parks = [];
        const orgIDs = [];
        childrens && childrens.forEach((item) => {
            if (!parent) {
                parent = { attributes: { parents: [] } };
                level = 1;
            }
            item.attributes.level = level;
            item.isPark = item.attributes.parkID !== 0;
            if (item.isPark && !this.state.firstPark) {
                this.setState({
                    firstPark: item,
                });
            }
            item.attributes.name = item.isPark ? item.text : (item.text.includes('(') ? item.text.substr(0, item.text.lastIndexOf('(')) : item.text);
            item.attributes.parents = [...parent.attributes.parents, {
                ...item.attributes,
                id: item.id,
            }];
            item.disabled = disabledKeys.includes(item.id) || (!enabledParentNode && !item.isPark);
            if (Object.isEmpty(item.children) && !item.isPark) {
                item.disabled = true;
            }
            if (orgCanSelect && !item.isPark) {
                item.disabled = false;
            }
            if (item.children) {
                const subOrgTree = this.handleOrgTree(item.children, item, level + 1);
                item.attributes.parks = subOrgTree.parks;
                item.attributes.parkIDs = subOrgTree.parkIDs;
                item.attributes.orgIDs = subOrgTree.orgIDs;
                parks.push(...item.attributes.parks);
                parkIDs.push(...item.attributes.parkIDs);
                orgIDs.push(...item.attributes.orgIDs);
            }
            if (item.children.length && item.children.every(item => item.disabled)) {
                item.disabled = true;
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
    }
    async getOrgTree() {
        const result = await Request(
            {
                _url:
                    '../PublicV2/home/group/usergrouporg/orgtree',
                _type: 'get',
                _cache: '5m',
            },
            { sysVersion: 4 }
        );

        this.handleOrgTree(result);

        this.setState({
            orgTree: result,
        }, () => {
            if (this.props.autoSelectFirstPark && this.state.firstPark) {
                this.onChange(this.state.firstPark.attributes.parkID, this.state.firstPark.text);
            }
        });
    }
    // 通过key获取node
    getTreeNode = key => {
        const { orgCanSelect } = this.props;
        return Array.loopItem(this.state.orgTree, item => {
            if (getNodeId(item, orgCanSelect) === key) {
                return item;
            }
        });
    }
    setDropDownHeightBindThis = this.setDropDownHeight.bind(this);

    setDropDownHeight() {
        if (this.treeSelectWrapEle.current) {
            const windowHeight = window.innerHeight;
            const selectEle = this.treeSelectWrapEle.current.querySelector('.ant-select');

            selectEle &&
                this.setState({
                    dropdownHeight: windowHeight - (getElementTop(selectEle) || 200) - selectEle.clientHeight - 100,
                });
        }
    }

    onChange = (value, label) => {
        console.log(value, label);
        const { onChange, enabledParentNode, orgCanSelect } = this.props;

        this.setDropDownHeightBindThis();

        if (enabledParentNode) {
            value = typeof(value) === "string" ? value : value.filter(key => {
                if (key.indexOf('0_') === 0) {
                    return true;
                }
                const node = this.getTreeNode(key);
                return orgCanSelect || !!node?.attributes?.parkID;
            });
        }
        this.setState({
            value,
        });

        onChange(value, label);
    };

    render() {
        const { dropdownHeight, disabled } = this.state;

        return (
            <div className="custom-tree-select" ref={this.treeSelectWrapEle}>
                <TreeSelect
                    treeDefaultExpandAll
                    treeIcon
                    showSearch
                    treeNodeFilterProp="title"
                    dropdownStyle={{ minHeight: 50, maxHeight: dropdownHeight }}
                    value={this.value}
                    {...this.props.treeSelectProps}
                    onChange={this.onChange}
                    disabled={disabled}
                >
                    {this.treeChildren}
                </TreeSelect>
            </div>
        );
    }
}
