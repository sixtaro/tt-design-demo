import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DeleteTwoTone, UploadOutlined } from '@ant-design/icons';
import { Upload, Button, Modal, message } from 'antd';
import './upload.less';

let uid = 1;

function generateFile(url) {
    return {
        uid: `${uid++}`,
        name: `file-${uid}`,
        status: 'done',
        url,
    };
}

function generateInitFileList(fileList) {
    if (typeof fileList === 'string') {
        return [generateFile(fileList)];
    }

    if (Array.isArray(fileList)) {
        return fileList.map(item => {
            if (typeof item === 'string') {
                return generateFile(item);
            } else {
                return item;
            }
        });
    }

    if (fileList && fileList.url) {
        return [fileList];
    }

    return [];
}

export default class OrdinaryUploadImage extends Component {
    static propTypes = {
        /** 配置这个属性来显示图片建议尺寸文案 */
        recommendSize: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        }),
        /** 是否多个文件上传和预览展示 默认单个文件 */
        isMultiple: PropTypes.bool,
        /** 多个文件上传和预览展示提示数量*/
        multipleNum: PropTypes.string,
        /** 能否删除图片 */
        canClear: PropTypes.bool,
        /** 预览图片点击的文字提示 */
        clickHint: PropTypes.string,
        /** 预览图片点击事件 */
        imageClick: PropTypes.func,
        /** 初始默认的已上传文件的url 支持单个文件和多个文件 */
        initUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
        /** 受控的fileList */
        fileList: PropTypes.array,
        /** onChange事件 */
        onChange: PropTypes.func,
        /** onRemove事件 */
        onRemove: PropTypes.func,
        /** upload组件可用的prop */
        uploadProps: PropTypes.object,
        /** 返回的字段名 */
        fieldName: PropTypes.string,
        /** 预览背景色 */
        previewColor: PropTypes.string,
        /** 是否展示预览 */
        hidePreview: PropTypes.bool,
        /** 文字描述 */
        description: PropTypes.string,
        /** 是否使用纯url */
        usePureURL: PropTypes.bool,
        /** 清除图片时不询问 */
        noAskOnRemove: PropTypes.bool,
    };

    static defaultProps = {
        canClear: true,
        fileList: [],
        isMultiple: false,
        uploadProps: {},
        onRemove: () => {},
        fieldName: 'filePath',
        previewColor: '#fff',
        srcFunc: file => {
            return file.url?.replace('/mortisejointenon//Manager', '/Manager');
        },
        usePureURL: false,
        noAskOnRemove: false,
    };

    state = {
        fileList: generateInitFileList(this.props.initUrl || this.props.fileList),
        uploadLoading: false,
    };

    get reversePreviewColor() {
        const { previewColor } = this.props;

        if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(previewColor)) {
            const colorNum = previewColor.substring(1);

            const result = (parseInt('f'.repeat(colorNum.length), 16) - parseInt(colorNum, 16)).toString(16);

            return `#${'0'.repeat(3 - result.length)}${result}`;
        } else if (/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/.test(previewColor)) {
            const colorNumStr = previewColor.substring(previewColor.indexOf('(') + 1, previewColor.indexOf(')'));
            const colorArr = colorNumStr.split(',');

            return `rgb(${colorArr.map(num => 255 - num).join(',')})`;
        }

        return '#000';
    }

    componentDidUpdate(prevProps) {
        const prevFileList = prevProps.fileList;
        const fileList = this.props.fileList;
        let fileListChange = false;
        if (prevFileList.length !== fileList.length) {
            fileListChange = true;
        } else {
            for (let i = 0; i < prevFileList.length; i++) {
                if (prevFileList[i] !== fileList[i]) {
                    fileListChange = true;
                }
            }
        }
        if (fileListChange) {
            this.setState({
                fileList: generateInitFileList(this.props.fileList),
            });
        }

        if (!prevProps.initUrl && this.props.initUrl) {
            this.setState({
                fileList: generateInitFileList(this.props.initUrl),
            });
        }

        if (!Object.equal(prevProps.initUrl, this.props.initUrl)) {
            this.setState({
                fileList: generateInitFileList(this.props.initUrl),
            });
        }
    }

    onPreview = file => {
        if (!/image/.test(file.type)) {
            message.warning('请上传图片格式！');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < (this.props.limitSize || 2);

        if (!isLt2M) {
            message.error(`图片不能超过${this.props.limitSize || 2}M大小`);
            return false;
        }
        this.props.uploadProps?.beforeUpload?.(file);
    };

    onChange = ({ file, fileList }) => {
        const isLt2M = file.size / 1024 / 1024 < (this.props.limitSize || 2);

        if (!isLt2M) {
            return false;
        }
        const { isMultiple, onChange = () => {}, fieldName } = this.props;
        let newFileList;

        if (file.status === 'uploading') {
            this.setState({
                uploadLoading: true,
            });
        }

        if (file.status === 'done' || file.status === 'error') {
            this.setState({
                uploadLoading: false,
            });
        }

        if (file.status === 'done' && file.response.success) {
            const imgPath = file.response.data?.[fieldName] || file.response.data?.imgPath || file.response.data?.filePath || file.response.data;
            if (imgPath.indexOf('http') === 0) {
                file.url = imgPath;
            } else {
                file.url = this.props.usePureURL ? '/' + imgPath : Image.url('/' + imgPath);
            }
            if (this.props.imageUrlFn) {
                file.url = this.props.imageUrlFn(imgPath);
            }
            if (isMultiple) {
                newFileList = this.state.fileList.concat(file);
            } else {
                newFileList = [file];
            }
        } else {
            newFileList = fileList.slice(0, fileList.length);
        }

        this.setState({
            fileList: newFileList,
        });
        onChange(file, newFileList);
    };

    onRemove = file => {
        if (this.props.noAskOnRemove) {
            const newFileList = this.state.fileList.filter(item => item.uid !== file.uid);
            this.setState({
                fileList: newFileList,
            });
            this.props.onRemove(file);
            this.props.onChange(undefined, newFileList);
        } else {
            Modal.confirm({
                title: '是否要清除当前图片',
                onOk: () => {
                    const newFileList = this.state.fileList.filter(item => item.uid !== file.uid);
                    this.setState({
                        fileList: newFileList,
                    });
                    this.props.onRemove(file);
                    this.props.onChange(undefined, newFileList);
                },
                okText: '确定',
                cancelText: '取消',
            });
        }
    };

    render() {
        const { canClear, recommendSize, uploadProps, clickHint, imageClick, previewColor, isMultiple, multipleNum, description, uploadBtnText, usePureURL } =
            this.props;
        const { uploadLoading } = this.state;
        const fileList = this.state.fileList;

        const disabled = !!uploadProps.disabled;

        return (
            <div className="ordinary-upload">
                <Upload
                    accept="image/*"
                    beforeUpload={this.onPreview}
                    {...uploadProps}
                    showUploadList={false}
                    fileList={fileList}
                    onChange={this.onChange}
                    onRemove={this.onRemove}
                >
                    <Button icon={<UploadOutlined />} loading={uploadLoading} disabled={disabled || multipleNum === fileList.length}>
                        {uploadLoading ? '上传中...' : uploadBtnText || '上传图片'}
                    </Button>
                    {/* {(description || recommendSize) && (
                        <span style={{ fontSize: 12, marginLeft: 10 }}>
                            {description || `图片尺寸建议为${recommendSize.x}*${recommendSize.y}`}
                        </span>
                    )}
                    {isMultiple && multipleNum && <span style={{ fontSize: 12, marginLeft: 10 }}>最多上传{multipleNum}张图，建议格式：jpg、jpeg、png</span>} */}
                </Upload>
                {(description || recommendSize) && (
                    <span className="ordinary-upload__description" style={{ fontSize: 12, marginLeft: 10 }}>
                        {description || `图片尺寸建议为${recommendSize.x}*${recommendSize.y}`}
                    </span>
                )}
                {!description && isMultiple && multipleNum && (
                    <span className="ordinary-upload__description" style={{ fontSize: 12, marginLeft: 10 }}>
                        最多上传{multipleNum}张图，建议格式：jpg、jpeg、png
                    </span>
                )}
                {this.props.hidePreview ? (
                    <></>
                ) : (
                    <>
                        {' '}
                        <div className="ordinary-upload__preview">
                            {fileList.map(file =>
                                file.url ? (
                                    <div
                                        className={`ordinary-upload__preview-item ${
                                            previewColor === 'transparent' && 'ordinary-upload__preview-item--transparent'
                                        }`}
                                        key={file.uid}
                                        style={{ backgroundColor: previewColor }}
                                    >
                                        <img
                                            className={classNames([
                                                'ordinary-upload__preview-img',
                                                {
                                                    'ordinary-upload__preview-img--click': !!imageClick,
                                                },
                                            ])}
                                            src={
                                                usePureURL
                                                    ? file.url
                                                    : Image.url(typeof this.props.srcFunc === 'function' ? this.props.srcFunc(file) : file.url)
                                            }
                                            onClick={() => imageClick && imageClick(file)}
                                            alt=""
                                        />
                                        <div className="ordinary-upload__preview-footer">
                                            <div className="ordinary-upload__preview-hint" style={{ color: this.reversePreviewColor }}>
                                                {clickHint}
                                            </div>
                                            {canClear && !disabled && (
                                                <div
                                                    className="ordinary-upload__preview-delete"
                                                    onClick={this.onRemove.bind(this, file)}
                                                    style={{ color: this.reversePreviewColor }}
                                                >
                                                    <DeleteTwoTone />
                                                    清除图片
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
