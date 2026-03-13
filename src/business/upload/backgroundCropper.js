import React, { Component } from 'react';
import { Modal, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default class BackgroundCropper extends Component {
    static propTypes = {
        imgSrc: PropTypes.string,
        visible: PropTypes.bool,
        onCloseModal: PropTypes.func, // 取消
        onCropEnd: PropTypes.func,
        uploadUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // 上传接口路径
        uploadImgName: PropTypes.string, // 上传的文件的字段
        uploadReturnName: PropTypes.string, // 上传成功后返回的图片的路径字段
        uploadData: PropTypes.object, // 上传接口参数
        aspectRatio: PropTypes.array, // 裁剪比例
    };

    static defaultProps = {
        imgSrc: '',
        onCloseModal: () => {},
        onCropEnd: () => {},
        uploadUrl: '',
        uploadImgName: 'file',
        uploadReturnName: 'file',
        aspectRatio: [1920, 500],
        uploadData: {},
    };

    state = {
        isLoading: true,
    };

    imageEle = React.createRef();
    previewEle = React.createRef();

    cropper = null;

    handleCancel = () => {
        this.props.onCloseModal();
        this.cropper = null;
    };

    crapImage = () => {
        const { uploadImgName, uploadUrl, uploadReturnName, onCropEnd } = this.props;
        const canvas = this.cropper.getCroppedCanvas({
            imageSmoothingEnabled: false,
            imageSmoothingQuality: 'high',
        });

        canvas.toBlob(blob => {
            const formData = new FormData();
            formData.append(uploadImgName, blob, `crop${Date.now()}.png`);
            for (let key in this.props.uploadData) {
                formData.append(key, this.props.uploadData[key]);
            }

            axios
                .post(uploadUrl?._url || uploadUrl, formData, {
                    headers: {
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryYlXBgLHAr4ANkaIZ',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                })
                .then(res => {
                    if (res.success) {
                        onCropEnd(res.data?.[uploadReturnName] || res.data);
                        // this.handleCancel();
                    }
                })
                .catch(err => {
                    message.error(err);
                });
        });
    };

    componentDidMount() {
        const { aspectRatio } = this.props;
        let checkInterval = setInterval(() => {
            if (this.imageEle.current) {
                this.cropper = new Cropper(this.imageEle.current, {
                    viewMode: 2,
                    aspectRatio: (aspectRatio?.[0] || 1920) / (aspectRatio?.[1] || 500),
                    autoCropArea: 1,
                    preview: this.previewEle.current,
                    zoomable: false,
                    ready: () => {
                        this.setState({
                            isLoading: false,
                        });
                    },
                });
                clearInterval(checkInterval);
            }
        }, 1000);
    }

    render() {
        const { visible, imgSrc } = this.props;
        const { isLoading } = this.state;

        return (
            <Modal
                title="图片裁剪"
                visible={visible}
                width={800}
                okText="确定裁剪"
                onCancel={this.handleCancel}
                onOk={this.crapImage}
            >
                <Spin spinning={isLoading} tip="裁剪组件加载中...">
                    <div className="background-cropper">
                        <div className="background-cropper__platform">
                            <img
                                className="background-cropper__image"
                                ref={this.imageEle}
                                src={imgSrc}
                                alt="背景图片"
                            />
                        </div>
                        <div className="background-cropper__preview" ref={this.previewEle}></div>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
