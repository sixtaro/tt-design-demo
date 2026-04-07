import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from './index';

describe('Breadcrumb', () => {
  it('renders children normally without maxCount', () => {
    render(
      <Breadcrumb version={Breadcrumb.version}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>列表</Breadcrumb.Item>
        <Breadcrumb.Item>详情</Breadcrumb.Item>
      </Breadcrumb>
    );

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('列表')).toBeInTheDocument();
    expect(screen.getByText('详情')).toBeInTheDocument();
  });

  it('collapses middle breadcrumb items when maxCount is exceeded', () => {
    render(
      <Breadcrumb maxCount={4} version={Breadcrumb.version}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>企业管理</Breadcrumb.Item>
        <Breadcrumb.Item>组织架构</Breadcrumb.Item>
        <Breadcrumb.Item>华东大区</Breadcrumb.Item>
        <Breadcrumb.Item>上海分部</Breadcrumb.Item>
        <Breadcrumb.Item>成员详情</Breadcrumb.Item>
      </Breadcrumb>
    );

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('上海分部')).toBeInTheDocument();
    expect(screen.getByText('成员详情')).toBeInTheDocument();
    expect(screen.queryByText('企业管理')).not.toBeInTheDocument();
    expect(screen.queryByText('组织架构')).not.toBeInTheDocument();
    expect(screen.queryByText('华东大区')).not.toBeInTheDocument();
  });
});
