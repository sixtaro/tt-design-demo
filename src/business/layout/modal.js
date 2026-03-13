/* eslint-disable no-unused-vars */
import React, { useState, useImperativeHandle, useRef, useMemo } from 'react';
import { Modal, Empty, Spin, ConfigProvider, message, Popover } from 'antd';
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { Request, Utils } from '@/utils';
import PageLayout from './index';
import zhCN from 'antd/lib/locale/zh_CN';
import { renderReact } from './utils';

const { copyText } = Utils;

const ModalLayout = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const pageRef = useRef();
    const [prop, setProp] = useState(props);
    const config = useMemo(() => prop.action || {}, [prop]);

    const onCancel = () => {
        setVisible(false);
    };
    const onOk = () => {
        setVisible(false);
        prop.onModalOk && prop.onModalOk();
    };
    const getPage = config => {
        if (config.pathType === 'text') {
            return <p>{config.path}</p>;
        }
        if (config.pathType === 'html') {
            return <p>{config.path}</p>;
        }
        if (config.pathType === 'PageLayout') {
            return (
                <PageLayout {...prop} ref={pageRef} pageID={config.path} onModalOk={onOk} onModalCancel={onCancel} />
            );
        }
        if (config.pathType === 'PagePath') {
            const PageComponent = prop.routes[config.path] || Empty;
            return (
                <React.Suspense fallback={<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}>
                    <PageComponent
                        {...prop}
                        onOk={onOk}
                        onCancel={onCancel}
                        ref={pageRef}
                        page={{ ...prop.page }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={`未找到页面${config.path}`}
                    />
                </React.Suspense>
            );
        }
        if (config.pathType === 'url') {
            const PageComponent = prop.routes['Web'];
            const page = prop.page;
            return <PageComponent {...prop} ref={pageRef} page={{ ...page }} url={config.path} />;
        }
    };

    useImperativeHandle(ref, () => ({
        resize: () => {
            pageRef.current?.resize && pageRef.current.resize();
        },
        reload: () => {
            pageRef.current?.reload && pageRef.current.reload();
        },
        show: prop => {
            setProp({ ...props, ...prop });
            setVisible(true);
        },
        onCancel,
        onOk,
    }));

    const modalProps = useMemo(() => {
        const modalProps = { ...props.modalProps };
        if (typeof config.modalProps === 'object') {
            return { ...modalProps, ...config.modalProps };
        } else {
            try {
                return { ...modalProps, ...eval(`(${config.modalProps})`) };
            } catch {
                console.error('config.modalProps:', config.modalProps);
            }
        }
    }, [config, props.modalProps]);

    return (
        <Modal
            title={config.pageTitle}
            onCancel={onCancel}
            centered
            footer={null}
            visible={visible}
            destroyOnClose={true}
            {...modalProps}
        >
            {getPage(config)}
        </Modal>
    );
});
ModalLayout.create = props => {
    const modal = Modal.confirm({});
    const getPage = action => {
        const config = Object.renderObject(Object.clone(action), props);
        if (config.pathType === 'text') {
            return <div className="modal-content-text">{config.path}</div>;
        }
        if (config.pathType === 'html') {
            return <div className="modal-content-html" dangerouslySetInnerHTML={{ __html: config.path }}></div>;
        }
        if (config.pathType === 'PageLayout') {
            return <React.Suspense fallback={<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}>
                <PageLayout {...props} closePage={(pageID, clearSelection) => {
                if (pageID === 'current') {
                    props.action.reloadOnClose && props.reloadTable && props.reloadTable(clearSelection);
                    modal.destroy();
                    props.action.refreshOrgTree && props.refreshOrgTree && props.refreshOrgTree();
                } else {
                    props.closePage(pageID);
                }
            }} pageID={config.path} onModalOk={props.onOk} onModalCancel={props.onCancel} changeTitle={title => changeTitle(title)} />
            </React.Suspense>
        }
        if (config.pathType === 'PagePath') {
            const PageComponent = props.routes[config.path] || Empty;
            return (
                <React.Suspense fallback={<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}>
                    <PageComponent
                        {...props}
                        onOk={props.onOk}
                        onCancel={props.onCancel}
                        page={{ ...props.page }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        // description={`未找到页面${config.path}`}
                        description={`未找到页面`}
                        changeTitle={title => changeTitle(title)}
                    />
                </React.Suspense>
            );
        }
        if (config.pathType === 'url') {
            const PageComponent = props.routes['Web'];
            const page = props.page;
            return <PageComponent {...props} page={{ ...page }} url={config.path} pure={true}/>;
        }
    };
    const popup = document.createElement('div');
    document.body.append(popup);
    const modalProps = Object.clone(props.action.modalProps);
    const success = message.success;
    try {
        // eslint-disable-next-line no-new-func
        modalProps.onCancel = typeof modalProps.onCancel === "string" ? eval(modalProps.onCancel) : modalProps.onCancel;
        modalProps.onOk = typeof modalProps.onOk === "string" ? eval(modalProps.onOk) : modalProps.onOk;
    } catch {
        //
    }
    if (!modalProps?.onCancel) {
        delete modalProps?.onCancel;
    }
    if (!modalProps?.onOk) {
        delete modalProps?.onOk;
    }
    const options = {
        closable: true,
        icon: undefined,
        okText: '确定',
        getContainer: popup,
        width: 600,
        onCancel: ()=>{
            props.action.reloadOnClose && props.reloadTable && props.reloadTable();
        },
        ...modalProps,
        className: `modal-layout ${props.action.hasButton ? 'has-button' : ''} ${modalProps?.className || ''}`,
        content: (
            <div>
                <div className="ant-modal-header">
                    <div className="ant-modal-title">
                        {/* {props.action.pageTitle} */}
                        {renderReact(props.action.pageTitle, { ...props })}
                        {
                            props.action.titleTips ? <Popover content={<div dangerouslySetInnerHTML={{__html: props.action.titleTips}}></div>}>
                                <ExclamationCircleFilled style={{color: '#888', marginLeft: 10}}/>
                            </Popover> : ''
                        }
                    </div>
                </div>
                <div className="ant-modal-body"><ConfigProvider locale={zhCN}>{getPage(props.action || {})}</ConfigProvider></div>
            </div>
        ),
    };
    modal.update(options);
    modal._hide = false;
    modal.show = () => {
        popup.style.display = 'block';
        modal._hide = false;
    };
    modal.hide = () => {
        popup.style.display = 'none';
        modal._hide = true;
    };
    function changeTitle(title) {
        const dom = popup.querySelector('.ant-modal-header > .ant-modal-title');
        if (dom) {
            dom.innerText = title;
        }
    }
    return modal;
};
export default ModalLayout;
