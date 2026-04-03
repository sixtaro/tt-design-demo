import React from 'react';
import Empty from './index';
import Button from '../Button';
import { Empty as AntEmpty } from 'antd';
import NoDownloadIllustration from './svg/NoDownloadIllustration';
import NoContentIllustration from './svg/NoContentIllustration';
import NoSearchResultIllustration from './svg/NoSearchResultIllustration';
import NoMessageIllustration from './svg/NoMessageIllustration';
import NoPictureIllustration from './svg/NoPictureIllustration';
import NoDataIllustration from './svg/NoDataIllustration';

export default {
  title: '反馈/Empty 空状态',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Empty 组件 - 版本: ${Empty.version}`,
      },
    },
  },
  argTypes: {
    description: {
      control: 'text',
    },
    version: {
      control: false,
    },
    image: {
      control: false,
    },
    children: {
      control: false,
    },
  },
};

const Template = args => <Empty {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  description: '暂无数据',
  version: Empty.version,
};

export const 组合展示 = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Empty description="默认空状态" version={Empty.version} />
      <Empty image={AntEmpty.PRESENTED_IMAGE_SIMPLE} description="简洁图片" version={Empty.version} />
      <Empty description="当前没有可展示内容" version={Empty.version}>
        <Button type="primary" version={Button.version}>
          立即新增
        </Button>
      </Empty>
      <Empty image={<NoDownloadIllustration />} description="暂无可下载内容" version={Empty.version} />
    </div>
  ),
};

export const 主题联动插画 = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
      <Empty image={<NoContentIllustration />} description="暂无内容" version={Empty.version} />
      <Empty image={<NoSearchResultIllustration />} description="无搜索结果" version={Empty.version} />
      <Empty image={<NoMessageIllustration />} description="暂无消息" version={Empty.version} />
      <Empty image={<NoPictureIllustration />} description="暂无图片" version={Empty.version} />
      <Empty image={<NoDataIllustration />} description="暂无数据" version={Empty.version} />
      <div style={{ padding: 24, background: 'var(--tt-color-primary-1)', borderRadius: 12 }}>
        <Empty image={<NoDownloadIllustration />} description="暂无下载记录" version={Empty.version} />
      </div>
    </div>
  ),
};
