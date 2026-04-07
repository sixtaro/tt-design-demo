import React from 'react';
import Comment from './index';

export default {
  title: '数据展示/Comment 评论',
  component: Comment,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Comment 评论组件，版本：${Comment.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <Comment
    author="Han Solo"
    avatar="https://joeschmoe.io/api/v1/random"
    content="这是一条评论的内容。"
    datetime="2024-01-01"
  />
);

// 嵌套评论
export const 嵌套评论 = () => (
  <Comment
    author="Han Solo"
    avatar="https://joeschmoe.io/api/v1/random"
    content="这是一条评论的内容。"
    datetime="2024-01-01"
  >
    <Comment
      author="Han Solo"
      avatar="https://joeschmoe.io/api/v1/random"
      content="这是一条回复的内容。"
      datetime="2024-01-02"
    />
  </Comment>
);
