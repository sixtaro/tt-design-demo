import { Dropdown, Badge, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Request } from '@/utils';
import ImportExprtList from './importExportList';
import './style/index.less';
import { getIcon } from '@/business';

const ImportExportIcon = props => {
    const { iconName } = props;
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);

    const timer = useRef();

    const systemID = props.getSystemID?.();
    const userasyncjobsApi = systemID === 17 ? '../bs/business/userasyncjobs' : '../PublicV2/home/userasyncjobs';
    useEffect(() => {
        const fetchData = async () => {
            const res = await Request({
                _url: userasyncjobsApi,
                _type: 'get',
                _silence: true,
            });
            if (res.success) {
                // const list = res.data || [];
                // setCount(
                //     list?.filter(item => {
                //         const { status, readFlag, jobType, remark, failExcelName } = item;
                //         return (
                //             (status !== 1 && (remark || failExcelName) && readFlag === 0 && jobType === 11) ||
                //             (status === 2 && readFlag === 0 && jobType !== 11)
                //         );
                //     })?.length || 0
                // );
                setCount(+res.data?.unReadCount || 0);
            }
        };
        fetchData();
        timer.current = setInterval(() => {
            fetchData();
        }, 60000);
        window.refreshUserasyncJobs = fetchData;
        return () => {
            clearInterval(timer.current);
        };
    }, [userasyncjobsApi]);

    return (
        <span className="import-export-model" onClick={() => setVisible(!visible)}>
            <Tooltip title="导入/导出管理" placement="bottom">
                <Dropdown
                    placement="bottomRight"
                    dropdownRender={() => (
                        <ImportExprtList
                            visible={visible}
                            onClose={() => {
                                setVisible(false);
                            }}
                            setCount={setCount}
                            systemID={systemID}
                        />
                    )}
                    open={visible}
                    overlayClassName="import-export-overlay"
                    trigger={['click']}
                    onOpenChange={visible => setVisible(visible)}
                >
                    <span className="btn-wrap">
                        <Badge count={count} overflowCount={99} size="small">
                            <span className="icon-wrap">{getIcon(iconName || 'icon-daoru_daochu')}</span>
                        </Badge>
                    </span>
                </Dropdown>
            </Tooltip>
        </span>
    );
};

export default ImportExportIcon;
