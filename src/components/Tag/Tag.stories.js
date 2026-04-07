import React, { useState } from 'react';
import Tag from './index';

const { CheckableTag } = Tag;

export default {
  title: '数据展示/Tag 标签',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Tag 标签组件，版本：${Tag.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag>标签一</Tag>
    <Tag>标签二</Tag>
    <Tag>标签三</Tag>
  </div>
);

// 多彩标签
export const 多彩标签 = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag color="success">成功</Tag>
    <Tag color="processing">进行中</Tag>
    <Tag color="error">错误</Tag>
    <Tag color="warning">警告</Tag>
    <Tag color="default">默认</Tag>
  </div>
);

// 可关闭
export const 可关闭 = () => {
  const [tags, setTags] = useState(['标签一', '标签二', '标签三']);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={() => setTags(tags.filter((t) => t !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};

// CheckableTag
export const 可选标签 = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <CheckableTag checked={checked} onChange={setChecked}>标签一</CheckableTag>
      <CheckableTag checked={!checked} onChange={(v) => setChecked(!v)}>标签二</CheckableTag>
    </div>
  );
};
