import React, { useCallback, useState } from 'react';
import { Request } from '@/utils';
import { ClearOutlined, LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';

const ClearItem = props => {
    const { jobID } = props;
    // 清除动画状态
    const [isClearing, setIsClearing] = useState(false);

    const cancelasyncjobsApi = props.systemID === 17 ? '/bs/business/cancelasyncjobs' : '/PublicV2/home/cancelasyncjobs';

    const handleRemove = useCallback(async ({ jobIds, batchType }) => {
        setIsClearing(true);
        const res = await Request(
            {
                _url: window.location.origin + window._baseURL_prefix + cancelasyncjobsApi,
                _type: 'post',
            },
            {
                jobIds: jobIds || undefined,
                batchType: batchType || undefined,
            }
        );
        if (res.success) {
            switch (batchType) {
                case 1:
                    message.success('清空导入/导出列表成功！');
                    break;
                case 2:
                    message.success('清除已读记录成功！');
                    break;
                case 3:
                    message.success('清除失败记录成功！');
                    break;
                default:
                    break;
            }
        } else {
            message.error(res.message || '清除失败');
            setIsClearing(false);
        }
    }, [cancelasyncjobsApi]);

    return (
        <span className="clean" onClick={() => handleRemove({ jobIds: jobID })}>
            {isClearing ? <LoadingOutlined /> : <ClearOutlined />}
        </span>
    );
};

export default ClearItem;
