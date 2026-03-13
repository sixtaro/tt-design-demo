import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { getIcon } from '@/business';
import { A } from '@/components';
import { HomeOutlined } from '@ant-design/icons';
import './breadcrumbOrg.less';

class Page extends Component {
    static defaultProps = {
        isPark: false,
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { page, extra, extraBefore, isPark, org } = this.props;

        const getIconType = (orgType) => {
            if (orgType === 0) {
                return 'icon-park';
            }
            if (orgType === 1) {
                return 'icon-org';
            }
            if (orgType === 2) {
                return 'icon-xiangmu';
            }
        };
        const pageOrg = page.org || org;
        return (
            <div className="breadcrumb-header">
                <div className="breadcrumb-header-view">
                    <Breadcrumb className="breadcrumb-header-view-org">
                        {
                            pageOrg && pageOrg.parents.map((org, index, array) => (
                                <Breadcrumb.Item key={org.orgID}>
                                    {
                                        (!isPark && index < array.length - 1) ? <A onClick={() => {
                                            page.tree?.triggerTreeSelect(org.orgID);
                                        }}>{index === 0 ? <HomeOutlined /> : getIcon(getIconType(org.orgType))}{org.name}</A> :
                                            <>{index === 0 ? <HomeOutlined /> : getIcon(getIconType(org.orgType))}{org.name}</>
                                    }
                                </Breadcrumb.Item>
                            ))
                        }
                    </Breadcrumb>
                    <div className="breadcrumb-header-view-extra-before">{extraBefore}</div>
                    <div className="breadcrumb-header-view-extra">{extra}</div>
                </div>
            </div>
        );
    }
}
export default Page;
