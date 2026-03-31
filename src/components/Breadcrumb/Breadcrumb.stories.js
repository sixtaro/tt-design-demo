import React from 'react';
import { DownOutlined, HomeOutlined, AppstoreOutlined, FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons';
import Breadcrumb from './index';
import Icon from '../Icon';

export default {
  title: '导航/Breadcrumb 面包屑',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `Breadcrumb 面包屑组件 - 版本: ${Breadcrumb.version}\n\n显示当前页面在网站层级结构中的位置，帮助用户了解并导航回之前的页面。`
      }
    }
  },
  argTypes: {
    separator: {
      control: 'text'
    },
    maxCount: {
      control: 'number'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>分类</Breadcrumb.Item>
    <Breadcrumb.Item>子分类</Breadcrumb.Item>
    <Breadcrumb.Item>当前页面</Breadcrumb.Item>
  </Breadcrumb>
);

export const 常规面包屑 = () => (
  <Breadcrumb version={Breadcrumb.version}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>商品中心</Breadcrumb.Item>
    <Breadcrumb.Item>商品详情</Breadcrumb.Item>
  </Breadcrumb>
);

export const 自定义分隔符 = () => (
  <Breadcrumb separator=">" version={Breadcrumb.version}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>应用管理</Breadcrumb.Item>
    <Breadcrumb.Item>应用详情</Breadcrumb.Item>
  </Breadcrumb>
);

export const 一级无法精确的定位 = () => (
  <Breadcrumb version={Breadcrumb.version}>
    <Breadcrumb.Item>业务工作台</Breadcrumb.Item>
    <Breadcrumb.Item>订单中心</Breadcrumb.Item>
    <Breadcrumb.Item>售后工单详情</Breadcrumb.Item>
  </Breadcrumb>
);

export const 带图标 = () => (
  <Breadcrumb version={Breadcrumb.version}>
    <Breadcrumb.Item href="#">
      <span className="tt-breadcrumb-item-icon">
        <Icon component={HomeOutlined} version={Icon.version} />
      </span>
      首页
    </Breadcrumb.Item>
    <Breadcrumb.Item href="#">
      <span className="tt-breadcrumb-item-icon">
        <Icon component={AppstoreOutlined} version={Icon.version} />
      </span>
      应用中心
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <span className="tt-breadcrumb-item-icon">
        <Icon component={FileTextOutlined} version={Icon.version} />
      </span>
      页面详情
    </Breadcrumb.Item>
  </Breadcrumb>
);

export const 显示省略 = () => (
  <Breadcrumb maxCount={4} version={Breadcrumb.version}>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item>企业管理</Breadcrumb.Item>
    <Breadcrumb.Item>组织架构</Breadcrumb.Item>
    <Breadcrumb.Item>华东大区</Breadcrumb.Item>
    <Breadcrumb.Item>上海分部</Breadcrumb.Item>
    <Breadcrumb.Item>成员详情</Breadcrumb.Item>
  </Breadcrumb>
);

export const 支持下拉 = () => {
  const menu = {
    items: [
      { key: '1', label: '最近访问' },
      { key: '2', label: '我的收藏' },
      { key: '3', label: '全部应用' },
    ],
  };

  return (
    <Breadcrumb version={Breadcrumb.version}>
      <Breadcrumb.Item href="#">
        <span className="tt-breadcrumb-item-icon">
          <Icon component={HomeOutlined} version={Icon.version} />
        </span>
        首页
      </Breadcrumb.Item>
      <Breadcrumb.Item menu={menu}>
        <span>
          应用中心
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item href="#">
        <span className="tt-breadcrumb-item-icon">
          <Icon component={FolderOpenOutlined} version={Icon.version} />
        </span>
        数据资产
      </Breadcrumb.Item>
      <Breadcrumb.Item>资产详情</Breadcrumb.Item>
    </Breadcrumb>
  );
};
