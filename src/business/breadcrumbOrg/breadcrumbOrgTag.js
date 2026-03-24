import { Tooltip, Tag } from 'antd';
import './breadcrumbOrgTag.less';

export default function BreadcrumbOrgTag({ page }) {
    const org = page.org;

    return (
        <Tooltip title={org.name}>
            <Tag
                className='breadcrumb-org-tag'
                onClick={() => {
                    page.displayTree(page);
                }}
            >
                <span className="tag-name">项目</span>
                <span className="tag-value">{org.name}</span>
            </Tag>
        </Tooltip>
    );
}
