import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import api from '@/desktop/model';
import TreeSelect from './treeSelect';

// 这个人员选择调用门户的接口，支持applicationID传参
export default class UserTreeSelect extends Component {
    static propTypes = {
        param: PropTypes.object,
    };

    state = {
        orgTree: [],
        loadding: true,
    };

    componentDidMount() {
        this.getOrgTree();
    }

    componentDidUpdate(prevProps) {
        if (!Object.equal(prevProps.param, this.props.param)) {
            this.getOrgTree();
        }
    }

    async getOrgTree() {
        const result = await Request(api.form.persons, {
            paramJsonStr: '{}',
            ...this.props.param,
        });

        if (result.success) {
            const tree = result.data.userTree;

            this.setState({
                orgTree: tree,
                loadding: false,
            });
        }
    }

    render() {
        return this.state.loadding ? (
            <label
                style={{
                    display: 'block',
                    width: '200px',
                }}
            >
                加载中...
            </label>
        ) : Object.isEmpty(this.state.orgTree) ? (
            <label
                style={{
                    display: 'block',
                    width: '200px',
                }}
            >
                无可选人员
            </label>
        ) : (
            <TreeSelect resTreeData={this.state.orgTree} {...this.props}></TreeSelect>
        );
    }
}
