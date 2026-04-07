import React from 'react';
import Image from './index';

export default {
  title: '数据展示/Image 图片',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Image 图片组件，版本：${Image.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => (
  <Image
    width={200}
    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
  />
);

// 多张预览
export const 多张预览 = () => (
  <Image.PreviewGroup>
    <Image
      width={200}
      src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
    />
    <Image
      width={200}
      src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-05bfa082c2f9.webp"
    />
  </Image.PreviewGroup>
);
