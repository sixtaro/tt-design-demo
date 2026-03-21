import React, { useState } from 'react';
import Upload from './index';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default {
  title: '数据录入/Upload 上传',
  component: Upload,
  tags: ['autodocs'],
  argTypes: {
    listType: {
      control: 'select',
      options: ['text', 'picture', 'picture-card'],
    },
    multiple: {
      control: 'boolean',
    },
    drag: {
      control: 'boolean',
    },
  },
};

const actionApi =
  '/PublicV2/home/group/carowner/v2/uploadfile?token=00198bc2db0e378848beb8c6d923be4ef4641_2&userCenterToken=00198bc2db0e378848beb8c6d923be4ef4641_2';

// 公共的 URL 获取函数
const getLogoPath = file => '/PublicV2' + (file?.response?.data?.logoPath || file.url || file.response?.url || '');

// 普通上传
export const 普通上传 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };
  console.log(fileList);

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    maxCount: 5,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo" style={{ width: 400 }}>
      <h3>普通上传</h3>
      <Upload {...uploadProps}>
        <Button>点击上传</Button>
      </Upload>
    </div>
  );
};

// 拖拽上传
export const 拖拽上传 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    maxCount: 5,
    drag: true,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo">
      <h3>拖拽上传</h3>
      <Upload {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <i className="anticon anticon-inbox" />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        <p className="ant-upload-hint">支持单个或多个文件上传，最多上传 5 个文件</p>
      </Upload>
    </div>
  );
};

// 图片上传
export const 图片上传 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    listType: 'picture',
    accept: 'image/*',
    maxCount: 1,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo">
      <h3>图片上传</h3>
      <Upload {...uploadProps}>
        <Button>点击上传图片</Button>
      </Upload>
    </div>
  );
};

// 图片卡片上传
export const 图片卡片上传 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    listType: 'picture-card',
    accept: 'image/*',
    multiple: true,
    maxCount: 5,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo">
      <h3>图片卡片上传</h3>
      <Upload {...uploadProps}>
        <div>
          <i className="anticon anticon-plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      </Upload>
    </div>
  );
};

// 照片墙上传
export const 照片墙上传 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    listType: 'picture-card',
    accept: 'image/*',
    multiple: true,
    maxCount: 9,
    pictureCardWidth: 100,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo">
      <h3>照片墙上传</h3>
      <Upload {...uploadProps}>
        <div>
          <PlusOutlined />
        </div>
      </Upload>
    </div>
  );
};

// 带文件类型限制的上传
export const 文件类型限制 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    accept: '.xls,.xlsx,.doc,.docx,.pdf',
    maxCount: 5,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo" style={{ width: 400 }}>
      <h3>文件类型限制</h3>
      <Upload {...uploadProps}>
        <Button>点击上传</Button>
      </Upload>
    </div>
  );
};

// 自定义上传按钮
export const 自定义上传按钮 = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    setFileList(info.fileList);
  };

  const uploadProps = {
    name: 'file',
    fileList,
    onChange: handleChange,
    action: actionApi,
    maxCount: 5,
    getUrl: getLogoPath,
  };

  return (
    <div className="tt-upload-demo">
      <h3>自定义上传按钮</h3>
      <Upload {...uploadProps}>
        <Button type="primary">选择文件</Button>
      </Upload>
    </div>
  );
};
