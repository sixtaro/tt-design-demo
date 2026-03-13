import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import TreeSelect from './treeSelect';

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
        const result = await Request(
            {
                _url: '../PublicV2/home/group/user/usertree',
                _type: 'get',
            },
            this.props.param
        );

        this.setState({
            orgTree: result,
            loadding: false,
        });
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
