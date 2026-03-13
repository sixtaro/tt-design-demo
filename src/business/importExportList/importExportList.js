/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Request } from '@/utils';
import { Button, Menu, message, Progress, Select, Tooltip } from 'antd';
import { mockImportExportList } from './mock';
import ErrorReportModal from './components/errorReportModal';
import { getDurationText, getState } from './utils';
import ImportExportStateTips from '../importExportStateTips';
import { ClearOutlined, LoadingOutlined, CloseOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import ClearItem from './components/clearItem';
import JumpFailure from './components/jumpFailure';
import { Utils, Storage } from '@/utils';

const ImportExprtList = React.forwardRef((props, ref) => {
    const { title, visible, onClose, setCount, systemID } = props;

    const [list, setList] = useState([]);
    // 错误报告内容
    const [simpleText, setSimpleText] = useState('');
    const [remark, setRemark] = useState('');
    const [jobID, setJobID] = useState();
    const [showErrorBtn, setShowErrorBtn] = useState(false);
    // 错误报告展示
    const [errorShow, setErrorShow] = useState(false);
    // 导入tips状态控制(初始是等待唤醒的状态)
    const [status, setStatus] = useState('wait');
    // 导入tips内容配置
    const [importProcess, setImportProcess] = useState({});
    // 分页相关
    const [row, setRow] = useState(1);
    const [loading, setLoading] = useState(false);

    const timer = useRef();
    const tipsTimer = useRef();
    const listRef = useRef();
    // 批量设置过期数据已读计时器
    // const readTimer = useRef();

    const user = useMemo(() => window._user || Storage.get('user') || {}, []);
    const token = useMemo(() => `token=${user.token || user.userCenterToken}&userCenterToken=${user.token || user.userCenterToken}`, [user]);
    const userasyncjobsApi = systemID === 17 ? '../bs/business/userasyncjobs' : '../PublicV2/home/userasyncjobs';
    const cancelexportjobApi = systemID === 17 ? '../bs/business/cancelexportjob' : '../PublicV2/home/cancelexportjob';
    const cancelasyncjobsApi = systemID === 17 ? '/bs/business/cancelasyncjobs' : '/PublicV2/home/cancelasyncjobs';
    const readjobmsgApi = systemID === 17 ? '../bs/business/readjobmsg' : '../PublicV2/home/readjobmsg';
    // const downloadexportHref = Utils.getUrlWithBaseUrlPrefix(systemID === 17 ? '/bs/business/downloadexport' : '/PublicV2/home/downloadexport');
    const downloadexportHref = Utils.getUrlWithBaseUrlPrefix(
        systemID === 17 ? '/bs/business/downloadexport' : systemID === 4 ? '/Manager/home/downloadexport' : '/PublicV2/home/downloadexport'
    );
    const getIsExpired = expireTime => {
        return new Date(expireTime).getTime() < new Date().getTime();
    };

    const handleRemove = useCallback(
        async ({ jobIds, batchType }) => {
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
            }
        },
        [cancelasyncjobsApi]
    );

    const tipsContent = useMemo(() => {
        const { jobID, remark, failExcelName, message, failType } = importProcess || {};
        const status = getState(importProcess.status, failType);
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
                //
            } else {
                message.error(res.message || '未成功同步已读状态');
            }
        };
        const openErrorShow = (remark, jobID, message) => {
            setRemark(remark);
            setJobID(jobID);
            setErrorShow(true);
            setSimpleText(message);
            setRead(jobID);
        };
        switch (status) {
            case 'pending':
                return '';
            case 'success':
                return (
                    <span className="text">
                        {message || '导入完成'}
                        <>
                            {remark ? (
                                <>
                                    ，查看
                                    <Button type="link" onClick={() => openErrorShow(remark, jobID, message)}>
                                        错误报告
                                    </Button>
                                    <JumpFailure
                                        url={Utils.getUrlWithBaseUrlPrefix(`/PublicV2/home/failurefile?${token}`)}
                                        param={{ jobID }}
                                        onClick={() => setRead(jobID)}
                                    />
                                </>
                            ) : (
                                ''
                            )}
                        </>
                    </span>
                );
            case 'error':
                return (
                    <span className="text">
                        导入失败：{message || ''}
                        {jobID != null && (
                            <>
                                ，请检查文件后重新尝试，查看
                                <Button type="link" onClick={() => openErrorShow(remark, jobID, message)}>
                                    错误报告
                                </Button>
                            </>
                        )}
                    </span>
                );
            case 'cancel':
                return importProcess.status === 4 ? (
                    <span className="text">导入正在取消，请耐心等待</span>
                ) : (
                    <span className="text">
                        {message || '导入取消'}
                        {remark ? (
                            <>
                                ，查看
                                <Button type="link" onClick={() => openErrorShow(remark, jobID, message)}>
                                    错误报告
                                </Button>
                                {failExcelName ? (
                                    <>
                                        <JumpFailure url={Utils.getUrlWithBaseUrlPrefix(`/PublicV2/home/failurefile?${token}`)} param={{ jobID }} />
                                    </>
                                ) : (
                                    <>，未生成可下载文件</>
                                )}
                            </>
                        ) : (
                            ''
                        )}
                    </span>
                );
            default:
                return '';
        }
    }, [importProcess, readjobmsgApi, token]);

    useEffect(() => {
        const getMode = mode => {
            switch (mode) {
                case 1:
                    return 'export';
                case 2:
                    return 'export-image';
                case 11:
                    return 'import';
                default:
                    return '';
            }
        };

        const getState = status => {
            switch (status) {
                case 1:
                    return 'pending';
                case 2:
                    return 'success';
                case 3:
                    return 'error';
                case 4:
                    return 'cancel';
                default:
                    return 'start';
            }
        };

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
                //
            } else {
                message.error(res.message || '未成功同步已读状态');
            }
        };

        const openErrorShow = (remark, jobID, message, failExcelName) => {
            setRemark(remark);
            setJobID(jobID);
            setSimpleText(message);
            setErrorShow(true);
            setShowErrorBtn(failExcelName ? true : false);
            setRead(jobID);
        };

        const getTextNode = (status, jobType, remark, jobID, message, failExcelName, sheetName, orginFileName, expireTime) => {
            switch (status) {
                case 1:
                    return (
                        <span className="text">
                            {`${orginFileName || ''}`}正在{jobType === 11 ? '导入' : '导出'}...
                        </span>
                    );
                case 2:
                    return jobType === 11 ? (
                        <span className="text">
                            <>
                                {message || '导入完成'}
                                {remark ? (
                                    <>
                                        ，查看
                                        <Button type="link" onClick={() => openErrorShow(remark, jobID, message, failExcelName)}>
                                            错误报告
                                        </Button>
                                        <JumpFailure url={Utils.getUrlWithBaseUrlPrefix(`/PublicV2/home/failurefile?${token}`)} param={{ jobID }} />
                                    </>
                                ) : (
                                    ''
                                )}{' '}
                            </>
                            <ClearItem jobID={jobID} systemID={systemID} />
                        </span>
                    ) : (
                        <span className="text">
                            {jobType === 11 ? '导入' : `【${sheetName}】导出`}
                            {getDurationText(expireTime)}
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
                            <ClearItem jobID={jobID} systemID={systemID} />
                        </span>
                    );
                case 3:
                    return jobType === 11 ? (
                        <span className="text">
                            {jobType === 11 ? '导入' : '导出'}失败：{message || ''}，请检查文件后重新尝试，查看
                            <Button type="link" onClick={() => openErrorShow(remark, jobID, message, failExcelName)}>
                                错误报告
                            </Button>
                            {failExcelName ? (
                                <>
                                    ，或者下载
                                    <a
                                        className="download"
                                        target="_blank"
                                        rel="noreferrer"
                                        href={Utils.getUrlWithBaseUrlPrefix(`/PublicV2/home/failurefile?jobID=${jobID}&${token}`)}
                                        onClick={() => setRead(jobID)}
                                    >
                                        未{jobType === 11 ? '导入' : '导出'}数据
                                    </a>
                                </>
                            ) : (
                                <>，未生成可下载文件</>
                            )}
                            <ClearItem jobID={jobID} systemID={systemID} />
                        </span>
                    ) : (
                        <span className="text">
                            【{sheetName}】 导出失败
                            <ClearItem jobID={jobID} systemID={systemID} />
                        </span>
                    );
                default:
                    break;
            }
        };

        const fetchData = async () => {
            setLoading(true);
            const res = await Request(
                {
                    _url: userasyncjobsApi,
                    _type: 'get',
                    _silence: true,
                },
                {
                    offset: 0,
                    rows: 20 * row,
                }
            );
            setLoading(false);
            if (res.success) {
                // const list = res.data || mockImportExportList();
                const list = res.data?.list || [];
                const temp = list.map(item => {
                    const {
                        jobID,
                        status,
                        jobType,
                        remark,
                        failExcelName,
                        finishTime,
                        expireTime,
                        process,
                        message,
                        orginFileName,
                        submitTime,
                        readFlag,
                        sheetName,
                        fileName,
                    } = item;
                    return {
                        jobID,
                        fileName: failExcelName,
                        remark,
                        mode: getMode(jobType),
                        state: getState(status),
                        textNode: getTextNode(status, jobType, remark, jobID, message, failExcelName, sheetName, orginFileName, expireTime),
                        time: finishTime || submitTime,
                        expireTime,
                        progress: process,
                        orginFileName,
                        readFlag,
                        jobType,
                        sheetName,
                    };
                });
                setList(temp);
                // setCount(
                //     list?.filter(item => {
                //         const { status, readFlag, jobType, remark, failExcelName } = item;
                //         return (
                //             (status !== 1 && (remark || failExcelName) && readFlag === 0 && jobType === 11) ||
                //             (status === 2 && readFlag === 0 && jobType !== 11)
                //         );
                //     })?.length || 0
                // );
                setCount(+res.data?.unReadCount);
            }
        };
        if (visible) {
            if (timer.current) {
                clearInterval(timer.current);
            }
            fetchData();
            timer.current = setInterval(() => {
                fetchData();
            }, 1000);
        } else {
            clearInterval(timer.current);
        }
        return () => {
            clearInterval(timer.current);
        };
    }, [visible, setCount, row, systemID, userasyncjobsApi, readjobmsgApi, downloadexportHref, handleRemove, token]);

    // 把已过期但未读的数据设置为已读
    useEffect(() => {
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
                return true;
            } else {
                message.error(res.message || '未成功同步已读状态');
                return false;
            }
        };
        // 列表打开时才执行逻辑
        // clearTimeout(readTimer.current);
        if (visible) {
            // readTimer.current = setTimeout(() => {
            //     const expires = list?.filter(item => getIsExpired(item.expireTime) && item.readFlag === 0) || [];
            //     const temp = [];
            //     expires.forEach(item => temp.push(setRead(item.jobID)));
            //     Promise.all(temp).then(() => {
            //         clearTimeout(readTimer.current);
            //     });
            // }, 3000);
            const expires = list?.filter(item => getIsExpired(item.expireTime) && item.readFlag === 0) || [];
            if (expires.length) {
                expires.forEach(item => setRead(item.jobID));
            }
        }
    }, [visible, readjobmsgApi, list]);

    const getMoreData = () => {
        setRow(row + 1);
    };

    // 截流
    const throttle = fn => {
        if (!loading) {
            typeof fn === 'function' && fn();
        }
    };

    // 滚动查看列表事件
    const handleScroll = e => {
        const listDom = listRef.current;
        const scrollTop = listDom.scrollTop;
        const offsetHeight = listDom.offsetHeight;
        const scrollHeight = listDom.scrollHeight;
        // 上拉加载更多
        if (scrollTop + offsetHeight >= scrollHeight) {
            throttle(getMoreData);
        }
    };

    const cancelImportJob = async jobID => {
        const fetchData = async () => {
            const res = await Request(
                {
                    _url: '../PublicV2/home/importprocess',
                    _type: 'get',
                },
                {
                    jobID,
                }
            );
            if (res.success) {
                if (res.data?.status === 3 && res.data?.failType === 2) {
                    const status = getState(res.data?.status, res.data?.failType);
                    setStatus(status);
                    setImportProcess(res.data || {});
                    clearInterval(tipsTimer.current);
                }
            }
        };
        const res = await Request(
            {
                _url: '../PublicV2/home/cancalimportjobs',
                _type: 'get',
            },
            {
                jobIDs: jobID,
            }
        );
        if (res.success) {
            message.success(res.message || '取消成功');
        } else {
            message.error(res.message || '取消导入失败');
        }
        setStatus('wait');
        setImportProcess({});
        if (tipsTimer.current) {
            clearInterval(tipsTimer.current);
        }
        fetchData();
        tipsTimer.current = setInterval(() => {
            fetchData();
        }, 1000);
    };

    const cancelExportJob = async jobID => {
        const res = await Request(
            {
                _url: cancelexportjobApi,
                _type: 'get',
            },
            {
                jobIDs: jobID,
            }
        );
        if (res.success) {
            message.success(res.message || '取消成功');
        }
    };

    return (
        <div className="import-export-warpper">
            <div className="title">
                <div className="title-content">
                    <span className="text">{title || '导入/导出列表'}</span>
                    <Tooltip
                        title={
                            <Menu
                                items={[
                                    { key: 1, label: '清空列表' },
                                    { key: 2, label: '清空已读记录' },
                                    { key: 3, label: '清空失败记录' },
                                ]}
                                mode="inline"
                                selectable={true}
                                onSelect={({ key }) => handleRemove({ batchType: key })}
                            ></Menu>
                        }
                        overlayClassName="clear-tooltip"
                        placement="bottomRight"
                        getPopupContainer={triggerNode => triggerNode}
                        zIndex={9999}
                        color="#fff"
                        showArrow={false}
                    >
                        <span className="clear-icon">
                            <ClearOutlined />
                        </span>
                    </Tooltip>
                    <span className="close-icon" onClick={onClose}>
                        <CloseOutlined />
                    </span>
                </div>
            </div>
            <div className="import-export-list" ref={listRef} onScroll={handleScroll}>
                {list?.length > 0 ? (
                    <div className="list-wrap">
                        {list.map(item => {
                            const { jobID, fileName, mode, remark, state, textNode, time, expireTime, progress, orginFileName, readFlag, jobType, sheetName } =
                                item;
                            return (
                                <div className="list-item" key={jobID}>
                                    <div className="item-header">
                                        {mode === 'import' ? (
                                            <span className="icon icon-import">
                                                <DownloadOutlined />
                                            </span>
                                        ) : (
                                            <span className="icon icon-export">
                                                <UploadOutlined />
                                            </span>
                                        )}
                                        <span className="file">
                                            {state === 'success' && readFlag === 0 && jobType !== 11 && <span className="error-dot"></span>}
                                            {state !== 'pending' && (remark || fileName) && readFlag === 0 && jobType === 11 && (
                                                <span className="error-dot"></span>
                                            )}
                                            <span className="name">【{sheetName || orginFileName}】</span>
                                        </span>
                                        <span className="time">{time}</span>
                                    </div>
                                    <div className="item-body">
                                        {state === 'start' && (
                                            <div className="pending">
                                                <div className="content">
                                                    {textNode || '正在准备...'}
                                                    {/* 【{orginFileName}】{textNode || '正在准备...'} */}
                                                </div>
                                                <div className="progress">
                                                    <Progress percent={100} format={() => '准备中'} status="active" />
                                                    <span
                                                        className="close"
                                                        onClick={jobType === 11 ? () => cancelImportJob(jobID) : () => cancelExportJob(jobID)}
                                                    ></span>
                                                </div>
                                            </div>
                                        )}
                                        {state === 'pending' && (
                                            <div className="pending">
                                                <div className="content">
                                                    {textNode || '正在准备...'}
                                                    {/* 【{orginFileName}】{textNode || '正在准备...'} */}
                                                </div>
                                                <div className="progress">
                                                    <Progress percent={progress || 0} strokeColor="#15B4A5" trailColor="#DDE1EB" />
                                                    <span
                                                        className="close"
                                                        onClick={jobType === 11 ? () => cancelImportJob(jobID) : () => cancelExportJob(jobID)}
                                                    ></span>
                                                </div>
                                            </div>
                                        )}
                                        {state !== 'pending' && state !== 'start' && (
                                            <div className={`done ${getIsExpired(expireTime) ? 'over-time' : ''}`}>
                                                <div className="content">
                                                    {textNode}
                                                    {/* 【{orginFileName}】{textNode} */}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-data">
                        <div className="no-data-img">
                            <span className="text">暂无数据</span>
                        </div>
                    </div>
                )}
            </div>
            <ErrorReportModal
                visible={errorShow}
                handleCancel={() => setErrorShow(false)}
                remark={remark}
                simpleText={simpleText}
                jobID={jobID}
                showErrorBtn={showErrorBtn}
            />
            <ImportExportStateTips mode="import" state={getState(importProcess.status, importProcess.failType)} content={tipsContent} />
        </div>
    );
});

export default ImportExprtList;
