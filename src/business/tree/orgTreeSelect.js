import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import TreeSelect from './treeSelect';

export default class OrgTreeSelect extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
        /** 配置antd的TreeSelect的props */
        treeSelectProps: PropTypes.object,
    };

    state = {
        orgTree: [],
    };

    componentDidMount() {
        this.getOrgTree();
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

        this.setState({
            orgTree: result,
        });
    }

    render() {
        return <TreeSelect disable={this.props.disabled} resTreeData={this.state.orgTree} {...this.props}></TreeSelect>;
    }
}
