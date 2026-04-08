import React, { useState } from 'react';
import { ThemeProvider, Button, Input, Select, Table, Modal, Form, DatePicker, message } from 'tt-design';
import { presetThemes, colors } from 'tt-design/theme';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'tt-design/dist/cjs/index.css';

const { Option } = Select;
const { Column } = Table;

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('geekBlue');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      message.success('表单提交成功！');
      console.log('提交的数据：', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const tableData = [
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区', status: 'active' },
    { key: '2', name: '李四', age: 28, address: '上海市浦东新区', status: 'active' },
    { key: '3', name: '王五', age: 35, address: '广州市天河区', status: 'inactive' },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider theme={presetThemes[currentTheme]}>
        <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '24px', color: 'var(--tt-text-title)' }}>
            tt-design + Ant Design 4.24 示例
          </h1>

          {/* 主题切换区域 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              主题切换
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.keys(presetThemes).map(themeName => (
                <Button
                  key={themeName}
                  type={currentTheme === themeName ? 'primary' : 'default'}
                  onClick={() => handleThemeChange(themeName)}
                >
                  {themeName === 'geekBlue' && '极客蓝'}
                  {themeName === 'dustRed' && '薄暮红'}
                  {themeName === 'mintGreen' && '薄荷绿'}
                  {themeName === 'neonBlue' && '霓虹蓝'}
                  {themeName === 'sunsetOrange' && '日暮橙'}
                  {themeName === 'goldenPurple' && '酱紫'}
                  {themeName === 'cyan' && '明青'}
                </Button>
              ))}
            </div>
            <p style={{ marginTop: '12px', color: 'var(--tt-text-secondary)' }}>
              当前主题：{currentTheme} | 主色：{colors.primary}
            </p>
          </section>

          {/* 按钮组件 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              按钮组件
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button type="primary">主要按钮</Button>
              <Button>默认按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="text">文本按钮</Button>
              <Button type="link">链接按钮</Button>
              <Button danger>危险按钮</Button>
              <Button type="primary" loading>加载中</Button>
              <Button type="primary" disabled>禁用</Button>
            </div>
          </section>

          {/* 输入组件 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              输入组件
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <Input
                placeholder="请输入文本"
                style={{ width: '240px' }}
                prefix="用户"
              />
              <Input.Password placeholder="请输入密码" style={{ width: '240px' }} />
              <Input.Search
                placeholder="搜索内容"
                style={{ width: '240px' }}
                onSearch={(value) => message.info(`搜索：${value}`)}
              />
              <Select
                placeholder="请选择"
                style={{ width: '200px' }}
              >
                <Option value="option1">选项一</Option>
                <Option value="option2">选项二</Option>
                <Option value="option3">选项三</Option>
              </Select>
              <DatePicker placeholder="选择日期" />
            </div>
          </section>

          {/* 表格组件 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              表格组件
            </h2>
            <Table dataSource={tableData} pagination={false} style={{ width: '100%' }}>
              <Column title="姓名" dataIndex="name" key="name" />
              <Column title="年龄" dataIndex="age" key="age" />
              <Column title="地址" dataIndex="address" key="address" />
              <Column
                title="状态"
                dataIndex="status"
                key="status"
                render={(status) => (
                  <span style={{
                    color: status === 'active' ? 'var(--tt-status-success)' : 'var(--tt-text-secondary)'
                  }}>
                    {status === 'active' ? '启用' : '禁用'}
                  </span>
                )}
              />
              <Column
                title="操作"
                key="action"
                render={(_, record) => (
                  <Button type="link" onClick={() => message.info(`编辑 ${record.name}`)}>
                    编辑
                  </Button>
                )}
              />
            </Table>
          </section>

          {/* 弹窗表单 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              弹窗表单
            </h2>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              打开弹窗
            </Button>
            <Modal
              title="创建用户"
              visible={isModalVisible}
              onOk={handleSubmit}
              onCancel={() => setIsModalVisible(false)}
              okText="确认"
              cancelText="取消"
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="部门"
                  rules={[{ required: true, message: '请选择部门' }]}
                >
                  <Select placeholder="请选择部门">
                    <Option value="tech">技术部</Option>
                    <Option value="product">产品部</Option>
                    <Option value="design">设计部</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </section>

          {/* 信息提示 */}
          <section>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--tt-text-title)' }}>
              消息提示
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button onClick={() => message.success('操作成功！')}>成功</Button>
              <Button onClick={() => message.error('操作失败！')}>失败</Button>
              <Button onClick={() => message.warning('请注意！')}>警告</Button>
              <Button onClick={() => message.info('这是一条信息提示')}>信息</Button>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
