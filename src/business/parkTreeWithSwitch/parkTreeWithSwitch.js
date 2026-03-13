import React, { Component } from 'react';
import { TreeSelect, Alert, Tag } from 'antd';
import PropTypes from 'prop-types';
import withTreeData from './withTreeData';
import { findSwitchOnNodeIDs } from './utils';
import './parkTreeWithSwitch.less';

const getElementTop = function (element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
};

class ParkTreeWithSwitch extends Component {
    static propTypes = {
        // value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        value: PropTypes.object,
        onChange: PropTypes.func,
        /** 配置 antd 的 TreeSelect 的 props */
        treeSelectProps: PropTypes.object,
        treeChildren: PropTypes.array,
    };

    static defaultProps = {
        onChange: () => {},
    };

    state = {
        dropdownHeight: 200,
        value: this.props.value,
    };

    get value() {
        if (this.props.value === undefined) {
            return this.state.value;
        }
        return this.props.value;
    }

    get checkedValue() {
        return this.value?.checkedValue || undefined;
    }

    get switchValue() {
        return this.value?.switchValue || undefined;
    }

    tagRender = props => {
        const { label, value, closable, onClose } = props;

        // 如果值包含 org_，则不渲染这个标签
        if (value && value.toString().includes('org_')) {
            return null;
        }

        return (
            <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    };

    treeSelectWrapEle = React.createRef();

    componentDidMount() {
        this.setDropDownHeightBindThis();
        window.addEventListener('resize', this.setDropDownHeightBindThis);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setDropDownHeightBindThis);
    }

    setDropDownHeightBindThis = this.setDropDownHeight.bind(this);

    setDropDownHeight() {
        if (this.treeSelectWrapEle.current) {
            const windowHeight = window.innerHeight;
            const selectEle = this.treeSelectWrapEle.current.querySelector('.ant-select');

            selectEle &&
                this.setState({
                    dropdownHeight: windowHeight - (getElementTop(selectEle) || 200) - selectEle.clientHeight,
                });
        }
    }

    onChange = value => {
        const { onChange } = this.props;
        this.setDropDownHeightBindThis();

        // 传递开关开启的机构节点id
        let switchValue = findSwitchOnNodeIDs(this.props.treeData);
        let checkedValue = value || [];
        let res;
        // 如果没有勾选的值，则清空开关开启的机构节点id（只要有开关开启，一定有勾选的值）
        if (checkedValue.length > 0 || switchValue.length > 0) {
            if (checkedValue.length > 0) {
                res = {
                    checkedValue,
                    switchValue,
                };
            } else {
                res = undefined;
            }
        } else {
            res = undefined;
        }
        this.setState({
            value: res,
        });

        onChange(res);
    };

    render() {
        return (
            <div className="park-tree-select-switch" ref={this.treeSelectWrapEle}>
                <TreeSelect
                    treeDefaultExpandAll
                    treeIcon
                    showSearch
                    // treeNodeFilterProp="text"
                    filterTreeNode={(inputValue, treeNode) => {
                        let text = treeNode.title?.props?.children?.[0] || '';
                        return text.includes(inputValue);
                    }}
                    // dropdownStyle={{ minHeight: 50, maxHeight: dropdownHeight }}
                    value={this.checkedValue}
                    {...this.props.treeSelectProps}
                    onChange={this.onChange}
                    disabled={this.props.disabled}
                    tagRender={this.tagRender}
                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                    dropdownRender={menuNode => (
                        <>
                            <Alert
                                className="park-switch-alert"
                                message="部门旁边的开关开启后，表示在本部门下的所有车场（包括新增的车场）自动拉黑"
                                type="info"
                                showIcon={false}
                            />
                            {menuNode}
                        </>
                    )}
                >
                    {this.props.treeChildren}
                </TreeSelect>
            </div>
        );
    }
}

export default withTreeData('tree-select')(ParkTreeWithSwitch);
