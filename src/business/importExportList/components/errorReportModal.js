import { Modal } from 'antd';
import React, { useMemo } from 'react';
import './index.less';

const ErrorReportModal = props => {
    // eslint-disable-next-line no-unused-vars
    const { visible, handleCancel, remark, simpleText, jobID, showErrorBtn } = props;

    const onCancel = () => {
        typeof handleCancel === 'function' && handleCancel();
    };

    const innerHtml = useMemo(() => {
        const str = remark
            ?.split('\n')
            ?.map(str => {
                if (/^【错误】/.test(str)) {
                    return `<div class="text error">${str}</div>`;
                } else if (/^【警告】/.test(str)) {
                    return `<div class="text warn">${str}</div>`;
                }
                return `<div class="text">${str}</div>`;
            })
            .join('');
        return str;
    }, [remark]);

    return (
        <Modal title="错误报告" visible={visible} width={860} wrapClassName="error-report-modal" onCancel={onCancel} footer={[]}>
            <div className="modal-content">
                <div className="content-header">
                    <span className="text">{simpleText}</span>
                    {/* {showErrorBtn ? ( */}
                    <a className="down-btn" target="_blank" rel="noreferrer" href={`/PublicV2/home/failurefile?jobID=${jobID}`}>
                        下载错误报告
                    </a>
                    {/* ) : (
                        <span className="text-btn">无可下载文件</span>
                    )} */}
                </div>
                {/* <div className="content-core" dangerouslySetInnerHTML={{ __html: remark }}></div> */}
                <div className="content-core" dangerouslySetInnerHTML={{ __html: innerHtml }}></div>
            </div>
        </Modal>
    );
};

export default ErrorReportModal;
