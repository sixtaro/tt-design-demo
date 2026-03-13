import React, { useCallback } from 'react';
import UploadButton from '../../upload/UploadButton';
import { message } from 'antd';

export default function UploadButtonX(props) {
    const data = useCallback(
        file => {
            const _data = Object.renderObject(props.param, {
                ...props,
                file,
            });
            return _data;
        },
        [props]
    );

    return (
        <UploadButton
            uploadProps={{
                name: props.formName,
                action: props.path,
                accept: props.accept || '.xls,.xlsx,.xlsm',
                data,
                onChange: ({ file }) => {
                    if (file.status === 'done') {
                        if (file.response.success) {
                            if (props.onSuccess) {
                                props.onSuccess();
                            }
                        } else {
                            let tips = file.response.message || '导入失败';
                            if (props.errorMessage) {
                                tips = Object.renderRecord(props.errorMessage, { ...props, uploadResult: file.response || {} })
                            }
                            message.error(tips);
                        }
                    }
                    if (file.status === "error") {
                        const errorMessage = file.error?.toString?.() || '导入出错';
                        message.error(errorMessage);
                    }
                },
            }}
            buttonText={props.buttonText}
        ></UploadButton>
    );
}
