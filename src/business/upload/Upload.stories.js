import React from 'react';
import Card from '@/components/Card';
import Font from '@/components/Font';
import UploadButton from './UploadButton';
import UploadCard from './UploadCard';
import OrdinaryUploadImage from './OrdinaryUploadImage';

const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9p2f6RcAAAAASUVORK5CYII=';
const pdfDataUrl = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nPj4KZW5kb2JqCnRyYWlsZXI8PC9Sb290IDEgMCBSPj4KJSVFT0Y=';

const UploadButtonDemo = args => {
  const [status, setStatus] = React.useState('等待上传');

  return (
    <Card style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <UploadButton
          {...args}
          uploadProps={{
            accept: '.png,.jpg,.jpeg',
            customRequest: ({ file, onProgress, onSuccess }) => {
              onProgress?.({ percent: 40 });
              setTimeout(() => {
                onProgress?.({ percent: 100 });
                onSuccess?.({ success: true, data: { filePath: file.name } });
              }, 300);
            },
            onChange: info => setStatus(info.file?.status || '待处理'),
          }}
        />
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前状态：{status}
        </Font>
      </div>
    </Card>
  );
};

const UploadCardDemo = args => {
  const [fileList, setFileList] = React.useState(args.fileList || []);

  return (
    <Card style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <UploadCard
          {...args}
          fileList={fileList}
          onChange={(file, nextFileList) => {
            setFileList(nextFileList);
            args.onChange?.(file, nextFileList);
          }}
        />
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前文件数：{fileList.length}
        </Font>
      </div>
    </Card>
  );
};

const OrdinaryUploadImageDemo = args => {
  const [fileList, setFileList] = React.useState(args.fileList || []);

  return (
    <Card style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OrdinaryUploadImage
          {...args}
          fileList={fileList}
          onChange={(file, nextFileList) => {
            setFileList(nextFileList || []);
            args.onChange?.(file, nextFileList);
          }}
        />
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          当前图片数：{fileList.length}
        </Font>
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/Upload 上传组件',
  parameters: {
    docs: {
      description: {
        component: '演示 UploadButton、UploadCard 与 OrdinaryUploadImage 的本地预览与上传交互。',
      },
    },
  },
};

export const 按钮上传 = args => <UploadButtonDemo {...args} />;
按钮上传.args = {
  buttonText: '上传附件',
};

export const 文件卡片 = args => <UploadCardDemo {...args} />;
文件卡片.args = {
  publicPath: '',
  buttonText: '继续上传',
  showUploadBtn: false,
  countsPerRow: 2,
  fileList: [
    {
      uid: '1',
      name: '停车场现场图.png',
      url: imageDataUrl,
      percent: 100,
      status: 'done',
    },
    {
      uid: '2',
      name: '项目说明.pdf',
      url: pdfDataUrl,
      percent: 100,
      status: 'done',
    },
  ],
};

export const 图片预览 = args => <OrdinaryUploadImageDemo {...args} />;
图片预览.args = {
  usePureURL: true,
  noAskOnRemove: true,
  uploadProps: {
    disabled: true,
  },
  fileList: [
    {
      uid: 'image-1',
      name: '封面图.png',
      url: imageDataUrl,
      status: 'done',
      type: 'image/png',
    },
  ],
};
