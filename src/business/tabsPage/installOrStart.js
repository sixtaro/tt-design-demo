import { Modal } from 'antd';

// const iframe = document.createElement('iframe');
// iframe.style.display = 'none';
const newOpen = window.open('', '_self');
let isAddToBody = false;
const installOrStart = options => {
    // iframe.src = options.startUrl;
    if (!isAddToBody) {
        // document.body.append(iframe);
        isAddToBody = true;
    }

    let modal;
    const popup = document.createElement('div');
    const modalOptions = {
        className: 'modal-layout1 ',
        closable: true,
        icon: undefined,
        okText: '下载',
        getContainer: popup,
        width: 600,
        okButtonProps: { disabled: true },
        onOk: () => {
            const newInstallUrl = window.location.protocol + '//' + options.installUrl.split('://')[1]; //同步文件协议和当前环境的协议
            newOpen.location.href = newInstallUrl;
        },
        onCancel: () => {
            newOpen.location.href = '';
        },
        content: (
            <div>
                <div class="ant-modal-header">
                    <div class="ant-modal-title">{options.appName}</div>
                </div>
                <div class="ant-modal-body">
                    <p>正在启动{options.appName}...</p>
                </div>
            </div>
        ),
        ...options,
    };
    setTimeout(() => {
        modal = Modal.confirm({});
        document.body.append(popup);
        modal.update(modalOptions);
    }, 800);

    if (options.installUrl) {
        setTimeout(() => {
            modalOptions.okButtonProps = { disabled: false };
            modalOptions.content = (
                <div>
                    <div class="ant-modal-header">
                        <div class="ant-modal-title">{options.appName}</div>
                    </div>
                    <div class="ant-modal-body">
                        <p>正在启动{options.appName}...</p>
                        <p>若未安装程序，请先下载并安装</p>
                    </div>
                </div>
            );
            modal.update(modalOptions);
        }, 3000);
    } else {
        setTimeout(() => {
            modalOptions.okButtonProps = { disabled: true };
            modalOptions.content = (
                <div>
                    <div class="ant-modal-header">
                        <div class="ant-modal-title">{options.appName}</div>
                    </div>
                    <div class="ant-modal-body">
                        <p>正在启动{options.appName}...</p>
                        <p>未获取安装程序，暂不支持下载安装</p>
                    </div>
                </div>
            );
            modal.update(modalOptions);
        }, 3000);
    }
    return modal;
};

export default installOrStart;
