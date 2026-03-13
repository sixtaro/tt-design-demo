/* eslint-disable no-unused-vars */
import { Button, message, Progress, Tooltip, Upload } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Request } from '@/utils';
import { DRAG_TIPS, STEP_ONE_TEXT } from '../config';
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import { getSize } from '../utils';
import { Storage } from '@/utils';
import ax from 'axios';

const { Dragger } = Upload;

const StepOne = props => {
    const { modelId, onStatusChange, file, setFile, uploadToken, fileSizeLimit } = props;
    // const exportTemplate = async () => {
    //     const res = await Request(
    //         {
    //             _url: '../Manager/home/importModel/exporttemplate',
    //             _type: 'get',
    //         },
    //         {
    //             modelId,
    //         }
    //     );
    //     if (res.success) {
    //         //
    //     } else {
    //         message.error(res.message || '模板导出失败');
    //     }
    // };

    const uploadProps = {
        name: 'file',
        multiple: true,
        customRequest: async options => {
            let params = new FormData();
            params.append('file', options.file);
            params.append('token', uploadToken || Storage.get('user')?.token);
            const res = await ax.request({
                url: window.location.origin + window._baseURL_prefix + '/PublicV2/home/uploadexcel',
                method: 'post',
                data: params,
                cancelToken: new ax.CancelToken(c => {
                    window.cancelUpload = c;
                }),
                onUploadProgress: ({ total, loaded }) => {
                    options.onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
                },
            });
            if (res.success) {
                options.onSuccess(res, options.file);
            }
        },
        accept: '.xls,.xlsx,.csv',
        data: { token: uploadToken || Storage.get('user')?.token },
        maxCount: 1,
        beforeUpload: file => {
            if (!/xls|xlsx|csv/.test(file.name)) {
                message.warning('仅支持.xls,.xlsx,.csv格式文件');
                return false;
            }
            if (file.size > (fileSizeLimit || 50) * 1024 * 1024) {
                message.error('文件尺寸不能超过50M');
                return false;
            }
        },
        onChange(info) {
            console.log(info.file);
            if (info.file?.size > (fileSizeLimit || 50) * 1024 * 1024) {
                return;
            }
            if (!/xls|xlsx|csv/.test(info.file?.name)) {
                return;
            }
            setFile(info.file);
            onStatusChange(info.file.status);
        },
        onDrop(e) {
            if (!/xls|xlsx|csv/.test(e.dataTransfer?.files?.[0]?.name || '')) {
                message.warning('仅支持.xls,.xlsx,.csv格式文件');
            }
        },
        ...(file ? { fileList: [file] } : {}),
        itemRender: (originNode, file, fileList, actions) => {
            const { name, percent, size } = file;
            return size > (fileSizeLimit || 50) * 1024 * 1024 || !/xls|xlsx|csv/.test(name) ? (
                ''
            ) : (
                <div className="upload-list">
                    <div className="list-line list-header">
                        <span className="list-item list-item--1">文件</span>
                        <span className="list-item list-item--2">大小</span>
                        <span className="list-item list-item--3">状态</span>
                        <span className="list-item list-item--4">操作</span>
                    </div>
                    <div className="list-body">
                        <div className="list-line">
                            <span className="list-item list-item--1">
                                <span className="file"></span>
                                <Tooltip title={name}>
                                    <span className="text">{name}</span>
                                </Tooltip>
                            </span>
                            <span className="list-item list-item--2">{getSize(size)}</span>
                            <span className="list-item list-item--3">
                                {file?.status === 'done' && file?.response?.success && <Progress percent={100} size="small" />}
                                {file?.status === 'uploading' && <Progress percent={percent} size="small" status="active" showInfo={false} />}
                                {(file?.status === 'error' || (file?.status === 'done' && !file?.response?.success)) && (
                                    <Progress percent={percent} size="small" status="exception" />
                                )}
                            </span>
                            <span className="list-item list-item--4">
                                <CloseOutlined
                                    className="btn"
                                    onClick={async () => {
                                        if (file?.response?.data?.filePath) {
                                            const res = await Request(
                                                {
                                                    _url: '../PublicV2/home/delimportfile',
                                                    _type: 'get',
                                                },
                                                {
                                                    filePath: file?.response?.data?.filePath,
                                                }
                                            );
                                            if (res.success) {
                                                message.success('上传文件取消成功');
                                                setFile(null);
                                                onStatusChange('removed');
                                            } else {
                                                message.error(res.message || '上传文件取消失败');
                                            }
                                        }
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            );
        },
    };

    return (
        <div className="step-content step-one">
            <div className="step-header">
                <span className="text">{STEP_ONE_TEXT}</span>
                {/* <Button type="link" onClick={exportTemplate}>
                    下载导入模板
                </Button> */}
                <a href={`/PublicV2/home/importModel/exporttemplate?modelId=${modelId}`} target="_blank" rel="noreferrer">
                    下载导入模板
                </a>
            </div>
            <div className="drag-upload">
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">{DRAG_TIPS}</p>
                </Dragger>
            </div>
            <div className=""></div>
        </div>
    );
};

export default StepOne;
