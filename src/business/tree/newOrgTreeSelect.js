import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import TreeSelect from './treeSelect';

export default class NewOrgTreeSelect extends Component {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
        /** 配置antd的TreeSelect的props */
        treeSelectProps: PropTypes.object,
    };

    state = {
        orgTree: [],
        value: this.props.value,
    };

    componentDidMount() {
        this.getOrgTree();
    }

    getValue(temp, orgID, node) {
        if (node && (node.id === `org_${orgID}` || node.id === `unit_${orgID}`)) {
            temp.push(node.id);
        } else if (node?.children?.length) {
            for (let i = 0; i < node.children.length; i++) {
                this.getValue(temp, orgID, node.children[i]);
            }
        }
    }

    async getOrgTree() {
        const result = await Request(
            {
                _url: '../PublicV2/home/group/usergrouporg/projectmanagementdeptree',
                _type: 'get',
                _cache: '5m',
            },
            {
                userID: this.props.user?.userID,
                userGroupID: this.props.user?.userGroupID,
            }
        );

        let orgID = this.props.value;
        let temp = [];
        this.getValue(temp, orgID, result?.[0]);

        this.setState({
            orgTree: result,
            value: temp[0],
        });
    }

    render() {
        return (
            <TreeSelect
                disable={this.props.disabled}
                resTreeData={this.state.orgTree}
                {...this.props}
                value={typeof this.props.value === 'string' ? this.props.value : this.state.value}
            ></TreeSelect>
        );
    }
}
