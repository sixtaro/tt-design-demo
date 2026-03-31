import React, { useState } from 'react';
import { AppstoreOutlined, DatabaseOutlined, SettingOutlined, TeamOutlined, FileTextOutlined, AuditOutlined } from '@ant-design/icons';
import Menu from './index';

export default {
  title: '导航/Menu 导航',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component: `Menu 导航组件 - 版本: ${Menu.version}\n\n用于页面级和模块级导航，支持水平、垂直、内联、分组和折叠等常见场景。`
      }
    }
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical', 'inline']
      }
    },
    theme: {
      control: {
        type: 'select',
        options: ['light', 'dark']
      }
    },
    version: {
      control: 'text'
    }
  }
};

export const 水平导航 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <h4>常规</h4>
      <Menu mode="horizontal" selectedKeys={['dashboard']} version={Menu.version}>
        <Menu.Item key="dashboard">首页</Menu.Item>
        <Menu.Item key="finance">财务管理</Menu.Item>
        <Menu.Item key="operation">运营管理</Menu.Item>
        <Menu.Item key="data">数据中心</Menu.Item>
        <Menu.Item key="setting">系统设置</Menu.Item>
      </Menu>
    </div>

    <div>
      <h4>带下拉</h4>
      <Menu mode="horizontal" selectedKeys={['asset']} version={Menu.version}>
        <Menu.Item key="home">首页</Menu.Item>
        <Menu.SubMenu key="finance" title="财务管理">
          <Menu.Item key="invoice">发票管理</Menu.Item>
          <Menu.Item key="settle">结算中心</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="operation" title="运营管理">
          <Menu.Item key="campaign">活动投放</Menu.Item>
          <Menu.Item key="content">内容管理</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="data" title="数据中心">
          <Menu.Item key="asset">资产目录</Menu.Item>
          <Menu.Item key="tag">标签管理</Menu.Item>
          <Menu.Item key="quality">质量校验</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="console">控制台</Menu.Item>
      </Menu>
    </div>

    <div>
      <h4>带分页</h4>
      <div style={{ width: 1120, maxWidth: '100%' }}>
        <Menu
          mode="horizontal"
          pagination
          pageSize={10}
          selectedKeys={['operation']}
          version={Menu.version}
        >
          <Menu.Item key="home">首页</Menu.Item>
          <Menu.Item key="finance">财务管理</Menu.Item>
          <Menu.Item key="operation">运营管理</Menu.Item>
          <Menu.Item key="data">数据中心</Menu.Item>
          <Menu.Item key="revenue">收银台</Menu.Item>
          <Menu.Item key="cloud">云维护</Menu.Item>
          <Menu.Item key="market">应用市场</Menu.Item>
          <Menu.Item key="car">车务管理</Menu.Item>
          <Menu.Item key="door">门禁管理</Menu.Item>
          <Menu.Item key="park">车位管理</Menu.Item>
          <Menu.Item key="device">设备管理</Menu.Item>
          <Menu.Item key="archive">档案中心</Menu.Item>
        </Menu>
      </div>
    </div>
  </div>
);

export const 侧边导航 = () => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
    <div style={{ width: 240 }}>
      <h4>背景高亮</h4>
      <Menu mode="vertical" selectedKeys={['report']} version={Menu.version}>
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>工作台</Menu.Item>
        <Menu.Item key="report" icon={<FileTextOutlined />}>报表分析</Menu.Item>
        <Menu.Item key="audit" icon={<AuditOutlined />}>审批中心</Menu.Item>
        <Menu.Item key="setting" icon={<SettingOutlined />}>系统设置</Menu.Item>
      </Menu>
    </div>
    <div style={{ width: 240 }}>
      <h4>仅文字高亮</h4>
      <Menu mode="vertical" activeStyle="text" selectedKeys={['report']} version={Menu.version}>
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>工作台</Menu.Item>
        <Menu.Item key="report" icon={<FileTextOutlined />}>报表分析</Menu.Item>
        <Menu.Item key="audit" icon={<AuditOutlined />}>审批中心</Menu.Item>
        <Menu.Item key="setting" icon={<SettingOutlined />}>系统设置</Menu.Item>
      </Menu>
    </div>
  </div>
);

export const 内联展开 = () => (
  <div style={{ width: 240 }}>
    <Menu
      mode="inline"
      defaultSelectedKeys={['org-member']}
      defaultOpenKeys={['org', 'asset']}
      version={Menu.version}
    >
      <Menu.SubMenu key="org" title="组织管理" icon={<TeamOutlined />}>
        <Menu.Item key="org-structure">组织架构</Menu.Item>
        <Menu.Item key="org-member">成员管理</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="asset" title="资产中心" icon={<DatabaseOutlined />}>
        <Menu.Item key="asset-list">资产列表</Menu.Item>
        <Menu.Item key="asset-tag">标签管理</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="setting" icon={<SettingOutlined />}>系统设置</Menu.Item>
    </Menu>
  </div>
);

export const 分组导航 = () => (
  <div style={{ width: 260 }}>
    <Menu mode="inline" defaultSelectedKeys={['log']} version={Menu.version}>
      <Menu.Group key="group-work" title="工作台">
        <Menu.Item key="overview">概览</Menu.Item>
        <Menu.Item key="todo">待办事项</Menu.Item>
      </Menu.Group>
      <Menu.Group key="group-system" title="系统管理">
        <Menu.Item key="user">用户管理</Menu.Item>
        <Menu.Item key="role">角色权限</Menu.Item>
        <Menu.Item key="log">操作日志</Menu.Item>
      </Menu.Group>
    </Menu>
  </div>
);

export const 折叠导航 = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          marginBottom: 12,
          padding: '6px 12px',
          borderRadius: 4,
          border: '1px solid var(--tt-border-color-light)',
          background: 'var(--tt-bg-white)',
          cursor: 'pointer'
        }}
      >
        {collapsed ? '展开导航' : '收起导航'}
      </button>
      <div style={{ width: collapsed ? 72 : 240 }}>
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          defaultSelectedKeys={['dashboard']}
          version={Menu.version}
        >
          <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>工作台</Menu.Item>
          <Menu.Item key="data" icon={<DatabaseOutlined />}>数据中心</Menu.Item>
          <Menu.Item key="team" icon={<TeamOutlined />}>组织管理</Menu.Item>
          <Menu.Item key="setting" icon={<SettingOutlined />}>系统设置</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export const 带指示条 = () => (
  <div style={{ width: 240 }}>
    <Menu
      mode="inline"
      showIndicator
      defaultSelectedKeys={['report']}
      defaultOpenKeys={['analysis']}
      version={Menu.version}
    >
      <Menu.SubMenu key="analysis" title="分析中心" icon={<FileTextOutlined />}>
        <Menu.Item key="overview">数据概览</Menu.Item>
        <Menu.Item key="report">经营报表</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="audit" icon={<AuditOutlined />}>审计记录</Menu.Item>
      <Menu.Item key="setting" icon={<SettingOutlined />}>系统设置</Menu.Item>
    </Menu>
  </div>
);
