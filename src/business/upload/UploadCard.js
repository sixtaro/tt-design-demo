import { useEffect, useMemo, useState } from 'react';
import { Upload, Button, Tooltip, Progress, message } from 'antd';
import { PlusOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getFileType } from '@/components/discuss/utils';
import PropTypes from 'prop-types';
import './uploadCard.less';

let uid = 1;
function generateFile(url) {
    const name = url?.substr(url?.lastIndexOf('/') + 1) || 'file';
    return {
        uid: `${uid++}`,
        name: name,
        status: 'done',
        url,
        percent: 100,
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

const UploadCard = props => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const uploadProps = useMemo(
        () => ({
            name: 'file',
            className: 'clearfix',
            accept: '.jpg,.png,.jpeg',
            data: {
                userCenterToken: props.user?.token,
                token: props.user?.token,
            },
            showUploadList: false,
            ...(props.uploadProps || {}),
        }),
        [props.user?.token, props.uploadProps]
    );

    useEffect(() => {
        setFileList(generateInitFileList(props.fileList || []));
    }, [props.fileList]);

    const uploadChange = ({ file, fileList, event }) => {
        // 过滤item.status有值的，过滤掉beforeUpload返回false的
        let newFileList = [...fileList].filter(item => item.status).map(item => ({ ...item, percent: item.uid === file.uid ? event?.percent : item.percent }));

        const filterFiles = () => {
            return [...fileList]
                .filter(it => it.url || (it.status === 'done' && it.response?.success))
                .map(it => ({ ...it, url: it.url || Object.getValue(it.response, props.fieldName), percent: 100 }));
        };

        if (file.status === 'uploading') {
            setUploading(true);
        } else {
            setUploading(false);
        }

        if (file.status === 'error') {
            message.error('上传失败，可能是网络原因');
            newFileList = filterFiles();
        }
        if (file.status === 'done' && !file.response?.success) {
            message.error(file?.response.message || '文件上传失败');
            newFileList = filterFiles();
        }
        if (file.status === 'done' && file.response?.success) {
            newFileList = filterFiles();
        }
        setFileList(newFileList);
        props.onChange?.(file, newFileList);
        // console.log('new', newFileList);
    };
    // 从文件列表里删除
    const onDelete = uid => {
        let newFileList = [...fileList].filter(file => file.uid !== uid);
        setFileList(newFileList);
        props.onChange?.(null, newFileList);
    };

    return (
        <div className="component-upload-files-card">
            {props.showUploadBtn && (
                <Upload {...uploadProps} onChange={uploadChange} fileList={fileList}>
                    <Button loading={uploading} disabled={uploading || props.disabled || fileList.length >= props.maxCount} icon={<PlusOutlined />}>
                        {uploading ? '上传中' : props.buttonText}
                    </Button>
                </Upload>
            )}
            {props.extra && <div className="extra">{props.extra}</div>}
            <div className="files">
                {fileList.map((file, index) => {
                    const fileType = getFileType(file.name);
                    const { fileName, name, url, uid, percent } = file;
                    const fullUrl = props.publicPath + url;
                    const _fileName = fileName || name?.substr(name?.lastIndexOf('/') + 1) || 'file';
                    return (
                        <div
                            className="file-item"
                            style={{
                                width: `calc((100% - ${(props.countsPerRow - 1) * 10}px) / ${props.countsPerRow})`,
                                marginRight: (index + 1) % props.countsPerRow === 0 ? 0 : 10,
                            }}
                        >
                            {percent === 100 && url ? (
                                <>
                                    <Tooltip title={_fileName}>
                                        <div className="mask">
                                            {!props.disabled && (
                                                <span className="button delete" onClick={() => onDelete(uid)}>
                                                    <DeleteOutlined />
                                                </span>
                                            )}
                                            <a
                                                className="button download"
                                                href={props.downloadUrlFn ? props.downloadUrlFn(fullUrl) : fullUrl}
                                                download={_fileName}
                                            >
                                                <DownloadOutlined />
                                            </a>
                                            <span className="button share" onClick={() => window.open(fullUrl, '_blank')}>
                                                <EyeOutlined />
                                            </span>
                                        </div>
                                    </Tooltip>
                                    {fileType !== 'image' ? (
                                        <div className="file-content">
                                            <div
                                                className="file-core"
                                                style={{ backgroundImage: `url(${require(`@/components/discuss/img/${fileType}.png`)})` }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <img className="file-image" src={fullUrl} alt="附件图片" />
                                    )}
                                    <Tooltip title={_fileName}>
                                        <div className="file-name">{_fileName}</div>
                                    </Tooltip>
                                </>
                            ) : (
                                <div className="file-item-loading">
                                    <Progress type="circle" percent={percent === 100 ? 99 : percent || 0} format={p => `${p.toFixed(0)}%`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UploadCard;

UploadCard.propTypes = {
    /** 受控的fileList */
    fileList: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /** onChange事件 */
    onChange: PropTypes.func,
    /** upload组件可用的prop */
    uploadProps: PropTypes.object,
    /** 最多数量 */
    maxCount: PropTypes.number,
    /** 图片路径的公共前缀路径 */
    publicPath: PropTypes.string,
    /** 是否禁用 */
    disabled: PropTypes.bool,
    /** 上传图片接口返回的图片地址字段 */
    fieldName: PropTypes.string,
    /** 按钮文字 */
    buttonText: PropTypes.string,
    /** 是否显示上传按钮 */
    showUploadBtn: PropTypes.bool,
    /** 每行展示几个图片 */
    countsPerRow: PropTypes.number,
};

UploadCard.defaultProps = {
    fileList: [],
    uploadProps: {},
    fieldName: 'data.filePath',
    maxCount: 1,
    publicPath: '/PublicV2/',
    disabled: false,
    buttonText: '上传图片',
    showUploadBtn: true,
    countsPerRow: 3,
};
