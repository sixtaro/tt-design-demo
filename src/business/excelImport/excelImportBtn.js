import { Button } from 'antd';
import React, { useState } from 'react';
import ExcelImport from '.';
import Track from '@/business/track/track';

const ExcelImportBtn = props => {
    const { title, modelId, onCancel, onOk, importParams, buttonName, buttonType, uploadToken, fileSizeLimit, textPre = false } = props;
    const [visible, setVisible] = useState(false);
    // 导入tips状态控制(初始是等待唤醒的状态)
    const [status, setStatus] = useState('wait');

    const handleCancel = () => {
        setVisible(false);
        typeof onCancel === 'function' && onCancel();
    };

    const handleOk = jobID => {
        // setVisible(false);
        typeof onOk === 'function' && onOk(jobID);
    };

    return (
        <>
            <Button
                className="excel-import-btn"
                type={buttonType || 'default'}
                disabled={!modelId || status === 'pending'}
                onClick={() => {
                    Track.trackButtonClick(`BUTTON_${buttonName || '导入'}`);
                    setVisible(true);
                    setStatus('wait');
                }}
            >
                {buttonName || '导入'}
            </Button>
            <ExcelImport
                title={title}
                modelId={modelId}
                visible={visible}
                setVisible={setVisible}
                onCancel={handleCancel}
                onOk={jobID => {
                    handleOk(jobID);
                }}
                importParams={importParams}
                setStatus={setStatus}
                status={status}
                uploadToken={uploadToken}
                fileSizeLimit={fileSizeLimit}
                textPre={textPre}
            />
        </>
    );
};

export default ExcelImportBtn;
