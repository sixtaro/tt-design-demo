import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import './style/index.less';

// 获取当前通知状态key
const getNotificationKey = (mode, state) => {
    if (mode === 'export') {
        switch (state) {
            case 'pending':
                return 'export-pending';
            case 'success':
                return 'export-success';
            case 'error':
                return 'export-error';
            default:
                break;
        }
    } else if (mode === 'import') {
        switch (state) {
            case 'pending':
                return 'import-pending';
            case 'success':
                return 'import-success';
            case 'error':
                return 'import-error';
            case 'cancel':
                return 'import-cancel';
            default:
                break;
        }
    }
};

// 获取通知配置
const getNotificationConfig = (mode, state, title, icon, content) => {
    if (mode === 'export') {
        switch (state) {
            case 'pending':
                return {
                    key: 'export-pending',
                    message: title || '导出文件准备中',
                    description: content || '这可能需要一段时间，现在您可以进行其他操作，导出完成后将通知您',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--pending"></span>,
                    className: 'import-export-tips',
                };
            case 'success':
                return {
                    key: 'export-success',
                    message: title || '导出文件准备完成',
                    description: content || '导出文件准备完成',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--success"></span>,
                    className: 'import-export-tips',
                };
            case 'error':
                return {
                    key: 'export-error',
                    message: title || '导出失败',
                    description: content || '导出失败，请重试',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--error"></span>,
                    className: 'import-export-tips',
                };
            case 'cancel':
                return {
                    key: 'import-cancel',
                    message: title || '导出取消',
                    description: content || '导出已取消',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--cancel"></span>,
                    className: 'import-export-tips',
                };
            default:
                break;
        }
    } else {
        switch (state) {
            case 'pending':
                return {
                    key: 'import-pending',
                    message: title || '正在导入数据',
                    description: content || '这可能需要一段时间，现在您可以进行其他操作，导入完成后将通知您',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--pending"></span>,
                    className: 'import-export-tips',
                };
            case 'success':
                return {
                    key: 'import-success',
                    message: title || '导入完成',
                    description: content || '导入文件准备完成',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--success"></span>,
                    className: 'import-export-tips',
                };
            case 'error':
                return {
                    key: 'import-error',
                    message: title || '导入失败',
                    description: content || '导入失败，请重试',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--error"></span>,
                    className: 'import-export-tips',
                };
            case 'cancel':
                return {
                    key: 'import-cancel',
                    message: title || '导入取消',
                    description: content || '导入已取消',
                    duration: 0,
                    placement: 'bottomRight',
                    icon: icon || <span className="state-icon state-icon--cancel"></span>,
                    className: 'import-export-tips',
                };
            default:
                break;
        }
    }
};

const ImportExportStateTips = props => {
    const [curKey, setCurKey] = useState('');
    const { mode, state, content, title, icon } = props;
    useEffect(() => {
        const event = () => {
            // 检查curKey,关闭curKey对应的通知框
            if (curKey) {
                notification.close(curKey);
            }
            // 打开新的通知框
            const config = getNotificationConfig(mode, state, title, icon, content);
            console.log('打卡通知框》〉》〉', state, config);
            if (config) {
                if (state === 'success' || state === 'error' || state === 'cancel') {
                    notification[state === 'cancel' ? 'warning' : state](config);
                } else {
                    notification.open(config);
                }
                // 设置新的curKey
                setCurKey(getNotificationKey(mode, state));
            }
        };
        if (mode && state) {
            event();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, mode]);
    return <div></div>;
};

export default ImportExportStateTips;
