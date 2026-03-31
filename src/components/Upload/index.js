import { Upload, Progress, Tooltip, message } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, FileOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DefaultImage from './images/image.png';
import Xml from './images/xml.png';
import Exe from './images/exe.png';
import Pdf from './images/pdf.png';
import Doc from './images/doc.png';
import Csv from './images/csv.png';
import Rar from './images/rar.png';
import Ppt from './images/ppt.png';
import Xls from './images/xls.png';
import './index.less';

const { Dragger } = Upload;

const Uploader = ({ className, style, getUrl, ...props }) => {
  /**
   * 根据文件类型获取对应图标
   * @param {Object} file - 文件对象
   * @returns {ReactNode} - 对应的图标组件
   */
  const getFileIcon = file => {
    const { name } = file;
    const ext = name?.split('.').pop()?.toLowerCase();

    if (!ext) {
      return <FileOutlined />;
    }

    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <img src={DefaultImage} alt="" />;
      case 'xls':
      case 'xlsx':
        return <img src={Xls} alt="" />;
      case 'pdf':
        return <img src={Pdf} alt="" />;
      case 'doc':
      case 'docx':
        return <img src={Doc} alt="" />;
      case 'csv':
        return <img src={Csv} alt="" />;
      case 'rar':
        return <img src={Rar} alt="" />;
      case 'ppt':
        return <img src={Ppt} alt="" />;
      case 'exe':
        return <img src={Exe} alt="" />;
      case 'xml':
        return <img src={Xml} alt="" />;
      default:
        return <FileOutlined />;
    }
  };

  /**
   * 自定义上传列表项
   * 支持显示文件图标、图片预览、上传进度、操作按钮
   */
  const uploadList = {
    itemRender: (originNode, file, fileList, actions) => {
      const { status } = file;
      const url = getUrl ? getUrl(file) : file.url || file.response?.url;
      const isImage = file.type?.startsWith('image/');
      const isPictureCard = props.listType === 'picture-card';

      // 照片墙模式
      if (isPictureCard) {
        const cardWidth = props.pictureCardWidth || 60;
        return (
          <div className={classNames('tt-upload-picture-card', status)} style={{ width: cardWidth, height: cardWidth }}>
            {status === 'uploading' ? (
              <>
                {isImage ? <img src={DefaultImage} alt="" style={{ width: '100%' }} /> : <div className="tt-upload-picture-card-icon">{getFileIcon(file)}</div>}
                <div className="tt-upload-picture-card-percent">{Math.round(file.percent || 0)}%</div>
                <div className="tt-upload-picture-card-progress">
                  <Progress type="line" percent={Math.round(file.percent || 0)} showInfo={false} />
                </div>
              </>
            ) : (
              <>
                {(status === 'done' || status === 'error') && (
                  <>
                    {status === 'error' && isImage ? (
                      <img src={DefaultImage} alt="" className="tt-upload-picture-card-image" />
                    ) : isImage ? (
                      <img src={url} alt="" className="tt-upload-picture-card-image" />
                    ) : (
                      <div className="tt-upload-picture-card-icon">{getFileIcon(file)}</div>
                    )}
                    <Tooltip title={status === 'error' ? '上传失败' : file.name}>
                      <div className="tt-upload-picture-card-actions">
                        {status === 'done' && (
                          <Tooltip title="预览">
                            <div
                              className="tt-upload-picture-card-action"
                              onClick={() => {
                                window.open(url, '_blank');
                              }}
                            >
                              <EyeOutlined />
                            </div>
                          </Tooltip>
                        )}
                        <Tooltip title="删除">
                          <div
                            className="tt-upload-picture-card-action"
                            onClick={() => {
                              if (actions.remove) {
                                actions.remove();
                              }
                            }}
                          >
                            <DeleteOutlined />
                          </div>
                        </Tooltip>
                      </div>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </div>
        );
      }

      // 普通文本和图片列表模式
      return (
        <div className={classNames('tt-upload-item', status)}>
          <div className="tt-upload-item-row">
            {/* 显示文件图标或图片预览 */}
            <div className="tt-upload-item-info">
              {status === 'done' && isImage ? (
                <div className="tt-upload-item-image">
                  <img src={url} alt="" />
                </div>
              ) : (
                <div className={classNames('tt-upload-item-icon', { 'error-icon': status === 'error' }, { 'tt-upload-item-icon-image': isImage })}>
                  {getFileIcon(file)}
                </div>
              )}
              <div className="tt-upload-item-name">{file.name}</div>
            </div>

            {/* 显示状态和进度 */}
            <div className="tt-upload-item-status">
              {status === 'uploading' && <span className="tt-upload-item-status-text">{Math.round(file.percent || 0)}%</span>}
              {status === 'done' && (
                <div className="tt-upload-item-status-success-icon">
                  <CheckOutlined />
                </div>
              )}
              {status === 'error' && (
                <>
                  {/* <span className="tt-upload-item-retry" onClick={actions.reupload}>
                    重试
                  </span> */}
                  <div className="tt-upload-item-status-error-icon">
                    <CloseOutlined />
                  </div>
                </>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="tt-upload-item-actions">
              {status === 'done' && (
                <>
                  <Tooltip title="预览">
                    <div
                      className="tt-upload-item-action"
                      onClick={e => {
                        e.stopPropagation();
                        window.open(url, '_blank');
                      }}
                    >
                      <EyeOutlined />
                    </div>
                  </Tooltip>
                  <Tooltip title="下载">
                    <div
                      className="tt-upload-item-action"
                      onClick={e => {
                        e.stopPropagation();
                        if (url) {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          message.info('文件暂无法下载');
                        }
                      }}
                    >
                      <DownloadOutlined />
                    </div>
                  </Tooltip>
                </>
              )}
              <Tooltip title="删除">
                <div
                  className="tt-upload-item-action"
                  onClick={e => {
                    e.stopPropagation();
                    if (actions.remove) {
                      actions.remove();
                    }
                  }}
                >
                  <DeleteOutlined />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* 显示上传进度条 */}
          {status === 'uploading' && (
            <div className="tt-upload-item-progress">
              <Progress percent={Math.round(file.percent || 0)} size="small" showInfo={false} />
            </div>
          )}
        </div>
      );
    },
  };

  /**
   * 合并上传组件属性
   * 添加自定义上传列表配置
   */
  const uploadProps = {
    ...props,
    ...uploadList,
  };

  return (
    <div style={{ ...style, '--picture-card-width': `${props.pictureCardWidth || 60}px` }}>
      {props.drag ? (
        <Dragger className={classNames('tt-upload', className)} {...uploadProps}>
          {props.children}
        </Dragger>
      ) : (
        <Upload className={classNames('tt-upload', className)} {...uploadProps}>
          {props.listType === 'picture-card' && props.fileList && props.maxCount && props.fileList.length >= props.maxCount ? null : props.children}
        </Upload>
      )}
    </div>
  );
};

// 组件属性类型定义
Uploader.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  drag: PropTypes.bool,
  listType: PropTypes.oneOf(['text', 'picture', 'picture-card']),
  fileList: PropTypes.array,
  defaultFileList: PropTypes.array,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  accept: PropTypes.string,
  maxCount: PropTypes.number,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  children: PropTypes.node,
  pictureCardWidth: PropTypes.number,
  // 自定义 URL 获取方法
  getUrl: PropTypes.func,
};

// 组件默认属性
Uploader.defaultProps = {
  drag: false,
  listType: 'text',
  multiple: false,
  pictureCardWidth: 60,
  // 默认 URL 获取方法
  getUrl: undefined,
};

export default Uploader;
