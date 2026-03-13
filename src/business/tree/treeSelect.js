import React, { Component } from 'react';
import { TreeSelect, Select } from 'antd';
import PropTypes from 'prop-types';
import withTreeData from './withTreeData';

const getElementTop = function (element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
};

class CustomTreeSelect extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
        /** 配置antd的TreeSelect的props */
        treeSelectProps: PropTypes.object,
        treeChildren: PropTypes.array,
    };

    static defaultProps = {
        onChange: () => {},
    };

    state = {
        dropdownHeight: 200,
        value: this.props.value,
        disabled: this.props.disable,
    };

    get value() {
        return this.props.value || this.state.value;
    }

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
                    dropdownHeight: windowHeight - (getElementTop(selectEle) || 200) - selectEle.clientHeight - 100,
                });
        }
    }

    onChange = (value, label) => {
        const { onChange } = this.props;

        this.setDropDownHeightBindThis();

        // treeSelectProps.onChange && treeSelectProps.onChange(value, label);

        // onChange &&
        //     onChange({
        //         target: {
        //             value,
        //         },
        //     });
        this.setState({
            value,
        });

        onChange(value, label);
    };

    render() {
        const { disabled } = this.state;
        const propsDisabled = this.props.disabled;
        return (
            <div className="custom-tree-select" ref={this.treeSelectWrapEle}>
                <TreeSelect
                    popupClassName="custom-tree-popup"
                    disabled={disabled || propsDisabled}
                    treeDefaultExpandAll
                    treeIcon
                    showSearch
                    treeNodeFilterProp="title"
                    // dropdownStyle={{ minHeight: 50, maxHeight: dropdownHeight }}
                    value={this.value}
                    {...this.props.treeSelectProps}
                    onChange={this.onChange}
                >
                    {this.props.treeChildren}
                </TreeSelect>
            </div>
        );
    }
}

export default withTreeData('tree-select')(CustomTreeSelect, <Select placeholder="没有可选数据" disabled />);
