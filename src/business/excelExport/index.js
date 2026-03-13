import { message } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import ImportExportStateTips from '../importExportStateTips';
import ExcelExportModal from './excelExportModal';
import { Request, Utils, Storage } from '@/utils';
import { getDurationText, getIsExpired } from '../importExportList/utils';

const ExcelExport = props => {
    // 当前导出状态
    const [exportState, setExportState] = useState('wait');
    // 导出tips内容配置
    const [exportProcess, setExportProcess] = useState({});

    // 定时器轮训导入任务
    const timer = useRef();

    const getState = (status, failType) => {
        switch (status) {
            case 0:
                return 'start';
            case 1:
                return 'pending';
            case 2:
                return 'success';
            case 3:
                if (failType !== 2) {
                    return 'error';
                } else {
                    return 'removed';
                }
            case 4:
                return 'removed';
            default:
                return 'wait';
        }
    };

    const user = useMemo(() => window._user || Storage.get('user') || {}, []);
    const token = useMemo(() => `token=${user.token || user.userCenterToken}&userCenterToken=${user.userCenterToken || user.token}`, [user]);
    const exportprocessApi = window.systemID === 17 ? '../bs/business/exportprocess' : '../PublicV2/home/exportprocess';
    const readjobmsgApi = window.systemID === 17 ? '../bs/business/readjobmsg' : '../PublicV2/home/readjobmsg';
    // const downloadexportHref = Utils.getUrlWithBaseUrlPrefix(window.systemID === 17 ? '/bs/business/downloadexport' : '/PublicV2/home/downloadexport');
    const downloadexportHref = Utils.getUrlWithBaseUrlPrefix(
        window.systemID === 17 ? '/bs/business/downloadexport' : window.systemID === 4 ? '/Manager/home/downloadexport' : '/PublicV2/home/downloadexport'
    );
    // 轮询设置导入提示信息
    const getExportProcess = jobID => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        timer.current = setInterval(async () => {
            const res = await Request(
                {
                    _url: exportprocessApi,
                    _type: 'get',
                },
                {
                    jobID,
                }
            );
            if (res.success) {
                const status = getState(res.data?.status);
                setExportState(status);
                setExportProcess(res.data || {});
                if (status !== 'pending') {
                    window.refreshUserasyncJobs?.();
                    clearInterval(timer.current);
                }
            } else {
                if (res.data?.failMessage) {
                    message.error(res.data.failMessage);
                } else {
                    message.error(res.message || '无法获取导出文件状态');
                }
            }
        }, 1000);
    };

    const tipsContent = useMemo(() => {
        const { jobID, sheetName, expireTime, failMessage } = exportProcess || {};
        const setRead = async jobID => {
            const res = await Request(
                {
                    _url: readjobmsgApi,
                    _type: 'get',
                },
                {
                    jobID,
                }
            );
            if (res.success) {
                window.refreshUserasyncJobs?.();
            } else {
                message.error(res.message || '未成功同步已读状态');
            }
        };
        switch (exportState) {
            case 'pending':
                return '';
            case 'success':
                return (
                    <span className="text">
                        【{sheetName || '文件'}】{getDurationText(expireTime)}
                        {getIsExpired(expireTime) ? (
                            <></>
                        ) : (
                            <a
                                className="download"
                                target="_blank"
                                rel="noreferrer"
                                href={`${downloadexportHref}?jobID=${jobID}&${token}`}
                                onClick={() => setRead(jobID)}
                            >
                                立即下载
                            </a>
                        )}
                    </span>
                );
            case 'error':
                return (
                    <span className="text">
                        【{sheetName || '文件'}】导出失败：请重新尝试。{failMessage && '失败原因：' + failMessage}
                    </span>
                );
            default:
                return '';
        }
    }, [exportState, exportProcess, readjobmsgApi, downloadexportHref, token]);

    return (
        <div className="excel-export-wrap">
            <ExcelExportModal getExportProcess={getExportProcess} setExportProcess={setExportProcess} setStatus={setExportState} {...props} />
            <ImportExportStateTips mode="export" state={getState(exportProcess.status)} content={tipsContent} />
        </div>
    );
};

export default ExcelExport;
