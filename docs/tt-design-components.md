# TT Design Components 技术文档

> 基于 React 17.0.1 和 Ant Design 4.24.8 构建的企业级组件库
>
> 库版本: 1.0.0

---

## 目录

- [通用组件](#通用组件)
- [数据录入](#数据录入)
- [数据展示](#数据展示)
- [反馈组件](#反馈组件)
- [导航组件](#导航组件)
- [其他组件](#其他组件)

---

## 通用组件

### Button 按钮

**版本**: 1.0.0

按钮组件，支持多种类型、尺寸和形状。

#### 基础用法

```jsx
import { Button } from 'tt-design';

<Button type="primary" version="1.0.0">主要按钮</Button>
<Button type="default" version="1.0.0">默认按钮</Button>
<Button type="text" version="1.0.0">纯文字</Button>
<Button type="link" version="1.0.0">超链接</Button>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 按钮类型 | 'primary' \| 'default' \| 'link' \| 'text' | 'default' |
| size | 按钮尺寸 | 'small' \| 'middle' \| 'large' | - |
| shape | 按钮形状 | 'default' \| 'circle' \| 'round' | 'default' |
| danger | 是否危险按钮 | boolean | false |
| border | 是否显示边框 | boolean | true |
| disabled | 是否禁用 | boolean | false |
| icon | 按钮图标 | ReactNode | - |
| loading | 是否加载中 | boolean | false |
| children | 按钮内容 | ReactNode | - |
| version | 组件版本号 | string | - |

#### 下拉按钮

```jsx
<Button.Dropdown menu={{ items }} version="1.0.0">更多操作</Button.Dropdown>
```

---

### Icon 图标

**版本**: 1.0.0

图标组件，提供丰富的图标库。

#### 基础用法

```jsx
import { Icon } from 'tt-design';
import { SearchOutlined } from '@ant-design/icons';

<Icon component={SearchOutlined} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| component | 图标组件 | React.ComponentType | - |
| version | 组件版本号 | string | - |

---

### FloatButton 悬浮按钮

**版本**: 1.0.0

悬浮按钮组件，用于页面快速操作。

#### 基础用法

```jsx
import { FloatButton } from 'tt-design';

<FloatButton version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| version | 组件版本号 | string | - |

---

### BackTop 回到顶部

**版本**: 1.0.0

回到顶部组件，用于快速返回页面顶部。

#### 基础用法

```jsx
import { BackTop } from 'tt-design';

<BackTop version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| version | 组件版本号 | string | - |

---

## 数据录入

### Input 输入框

**版本**: 1.0.0

输入框组件，支持多种类型和扩展功能。

#### 基础用法

```jsx
import { Input } from 'tt-design';

<Input placeholder="请输入内容" version="1.0.0" />
<Input.Password placeholder="请输入密码" version="1.0.0" />
<Input.TextArea placeholder="请输入详细描述" rows={4} version="1.0.0" />
<Input.Search placeholder="请输入搜索内容" enterButton="搜索" version="1.0.0" />
<Input.RichText value={value} onChange={setValue} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 输入框类型 | 'text' \| 'password' \| 'number' \| 'email' | 'text' |
| placeholder | 占位文本 | string | - |
| defaultValue | 默认值 | string | - |
| disabled | 是否禁用 | boolean | false |
| prefix | 前缀图标 | ReactNode | - |
| suffix | 后缀内容 | ReactNode | - |
| addonBefore | 前置标签 | ReactNode | - |
| addonAfter | 后置标签 | ReactNode | - |
| version | 组件版本号 | string | - |

---

### Select 选择器

**版本**: 1.1.0

选择器组件，支持单选、多选、搜索和全选功能。

#### 基础用法

```jsx
import { Select } from 'tt-design';

const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
];

<Select
  placeholder="请选择"
  options={options}
  value={value}
  onChange={setValue}
  version="1.1.0"
/>
```

#### 多选模式

```jsx
<Select
  mode="multiple"
  placeholder="请选择多个选项"
  options={options}
  value={value}
  onChange={setValue}
  searchable
  showSelectAll
  version="1.1.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 占位文本 | string | - |
| options | 选项数据 | Array | - |
| value | 当前值 | string \| Array | - |
| onChange | 变化回调 | function | - |
| mode | 选择模式 | 'default' \| 'multiple' \| 'tags' | 'default' |
| disabled | 是否禁用 | boolean | false |
| searchable | 是否可搜索 | boolean | false |
| searchPlaceholder | 搜索占位文本 | string | '请输入关键字' |
| showSelectAll | 是否显示全选 | boolean | false |
| maxTagCount | 最大显示标签数 | number | - |
| status | 状态 | 'default' \| 'error' | 'default' |
| version | 组件版本号 | string | - |

---

### Checkbox 复选框

**版本**: 1.0.0

复选框组件，支持单个复选框和复选框组。

#### 基础用法

```jsx
import { Checkbox } from 'tt-design';

<Checkbox checked={checked} onChange={setChecked} version="1.0.0">选项</Checkbox>

<Checkbox.Group
  options={['选项A', '选项B', '选项C']}
  value={value}
  onChange={setValue}
  version="1.0.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| checked | 是否选中 | boolean | - |
| indeterminate | 是否半选状态 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| children | 标签内容 | ReactNode | - |
| version | 组件版本号 | string | - |

#### Checkbox.Group API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options | 选项数据 | Array | - |
| value | 当前值 | Array | - |
| onChange | 变化回调 | function | - |
| version | 组件版本号 | string | - |

---

### Radio 单选框

**版本**: 1.1.0

单选框组件，支持单个单选框和单选框组。

#### 基础用法

```jsx
import { Radio } from 'tt-design';

<Radio checked={checked} onChange={setChecked} version="1.1.0">选项</Radio>

<Radio.Group
  options={['选项A', '选项B', '选项C']}
  value={value}
  onChange={setValue}
  version="1.1.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| checked | 是否选中 | boolean | - |
| disabled | 是否禁用 | boolean | false |
| children | 标签内容 | ReactNode | - |
| version | 组件版本号 | string | - |

#### Radio.Group API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options | 选项数据 | Array | - |
| value | 当前值 | string | - |
| onChange | 变化回调 | function | - |
| version | 组件版本号 | string | - |

---

### Switch 开关

**版本**: 1.0.0

开关组件，用于切换两种状态。

#### 基础用法

```jsx
import { Switch } from 'tt-design';

<Switch checked={checked} onChange={setChecked} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| checked | 是否选中 | boolean | - |
| disabled | 是否禁用 | boolean | false |
| onChange | 变化回调 | function | - |
| version | 组件版本号 | string | - |

---

### InputNumber 数字输入框

**版本**: 1.1.0

数字输入框组件，用于输入数字。

#### 基础用法

```jsx
import { InputNumber } from 'tt-design';

<InputNumber min={0} max={100} value={value} onChange={setValue} version="1.1.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| min | 最小值 | number | - |
| max | 最大值 | number | - |
| step | 步长 | number | 1 |
| value | 当前值 | number | - |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### DatePicker 日期选择器

**版本**: 1.0.0

日期选择器组件，支持日期和日期范围选择。

#### 基础用法

```jsx
import { DatePicker } from 'tt-design';

<DatePicker placeholder="请选择日期" value={value} onChange={setValue} version="1.0.0" />
<DatePicker.RangePicker value={value} onChange={setValue} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 占位文本 | string | - |
| value | 当前值 | moment | - |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### TimePicker 时间选择器

**版本**: 1.0.0

时间选择器组件，支持时间和时间范围选择。

#### 基础用法

```jsx
import { TimePicker } from 'tt-design';

<TimePicker placeholder="请选择时间" value={value} onChange={setValue} version="1.0.0" />
<TimePicker.RangePicker value={value} onChange={setValue} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 占位文本 | string | - |
| value | 当前值 | moment | - |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### Cascader 级联选择

**版本**: 1.0.0

级联选择组件，用于多级联动选择。

#### 基础用法

```jsx
import { Cascader } from 'tt-design';

const options = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      { value: 'hangzhou', label: '杭州市' },
    ],
  },
];

<Cascader
  placeholder="请选择地区"
  options={options}
  value={value}
  onChange={setValue}
  version="1.0.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 占位文本 | string | - |
| options | 选项数据 | Array | - |
| value | 当前值 | Array | - |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### TreeSelect 树形选择

**版本**: 1.0.0

树形选择组件，用于选择树形结构数据。

#### 基础用法

```jsx
import { TreeSelect } from 'tt-design';

const treeData = [
  {
    title: '节点1',
    value: 'node1',
    key: 'node1',
    children: [
      { title: '节点1-1', value: 'node1-1', key: 'node1-1' },
    ],
  },
];

<TreeSelect
  placeholder="请选择节点"
  treeData={treeData}
  value={value}
  onChange={setValue}
  version="1.0.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| placeholder | 占位文本 | string | - |
| treeData | 树形数据 | Array | - |
| value | 当前值 | string | - |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### Rate 评分

**版本**: 1.0.0

评分组件，用于用户评分。

#### 基础用法

```jsx
import { Rate } from 'tt-design';

<Rate value={value} onChange={setValue} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 当前值 | number | - |
| count | 星级数量 | number | 5 |
| onChange | 变化回调 | function | - |
| disabled | 是否禁用 | boolean | false |
| version | 组件版本号 | string | - |

---

### ColorPicker 颜色选择器

**版本**: 1.0.0

颜色选择器组件，支持纯色和渐变色选择。

#### 基础用法

```jsx
import { ColorPicker } from 'tt-design';

<ColorPicker initialColor="#1890ff" onChange={setColor} version="1.0.0" />
<ColorPicker initialStatus="gradient" onChange={setColor} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| initialColor | 初始颜色 | string | - |
| initialStatus | 初始状态 | 'pure' \| 'gradient' | 'pure' |
| onChange | 变化回调 | function | - |
| showIcon | 是否显示图标 | boolean | false |
| version | 组件版本号 | string | - |

---

### Form 表单

**版本**: 1.0.0

表单组件，用于数据收集和验证。

#### 基础用法

```jsx
import { Form, Input, Button } from 'tt-design';

const [form] = Form.useForm();

<Form form={form} layout="vertical" version="1.0.0">
  <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
    <Input placeholder="请输入用户名" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">提交</Button>
  </Form.Item>
</Form>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| layout | 表单布局 | 'horizontal' \| 'vertical' \| 'inline' | 'vertical' |
| labelCol | 标签列配置 | object | - |
| wrapperCol | 内容列配置 | object | - |
| colon | 是否显示冒号 | boolean | true |
| disabled | 是否禁用 | boolean | false |
| initialValues | 初始值 | object | - |
| onFinish | 提交成功回调 | function | - |
| onFinishFailed | 提交失败回调 | function | - |
| onValuesChange | 字段变化回调 | function | - |
| version | 组件版本号 | string | - |

#### Form.Item API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 标签文本 | string | - |
| name | 字段名 | string | - |
| rules | 验证规则 | Array | - |
| valuePropName | 值属性名 | string | 'value' |

---

## 数据展示

### Table 表格

**版本**: 1.0.0

表格组件，用于展示和操作数据。

#### 基础用法

```jsx
import { Table } from 'tt-design';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '地址', dataIndex: 'address', key: 'address' },
];

const dataSource = [
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
];

<Table columns={columns} dataSource={dataSource} version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| columns | 列配置 | Array | - |
| dataSource | 数据 | Array | - |
| pagination | 分页配置 | object \| false | - |
| loading | 是否加载中 | boolean | false |
| version | 组件版本号 | string | - |

---

### Card 卡片

**版本**: 1.0.0

卡片组件，用于内容容器展示。

#### 基础用法

```jsx
import { Card } from 'tt-design';

<Card title="卡片标题" extra={<a href="#">更多</a>} version="1.0.0">
  卡片内容
</Card>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | string \| ReactNode | - |
| extra | 右上角内容 | ReactNode | - |
| hoverable | 是否可悬浮 | boolean | false |
| loading | 是否加载中 | boolean | false |
| children | 卡片内容 | ReactNode | - |
| version | 组件版本号 | string | - |

---

### Tabs 标签页

**版本**: 1.0.0

标签页组件，用于切换不同内容面板。

#### 基础用法

```jsx
import { Tabs } from 'tt-design';

<Tabs defaultActiveKey="1" version="1.0.0">
  <Tabs.TabPane tab="标签一" key="1">内容一</Tabs.TabPane>
  <Tabs.TabPane tab="标签二" key="2">内容二</Tabs.TabPane>
</Tabs>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| activeKey | 当前激活面板 | string | - |
| defaultActiveKey | 默认激活面板 | string | - |
| onChange | 切换回调 | function | - |
| version | 组件版本号 | string | - |

---

### Spin 加载

**版本**: 1.0.0

加载组件，用于展示加载状态。

#### 基础用法

```jsx
import { Spin } from 'tt-design';

<Spin spinning={loading} version="1.0.0">
  加载内容
</Spin>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| spinning | 是否加载中 | boolean | false |
| size | 尺寸 | 'small' \| 'default' \| 'large' | 'default' |
| tip | 提示文本 | string | - |
| children | 包裹内容 | ReactNode | - |
| version | 组件版本号 | string | - |

---

### Divider 分割线

**版本**: 1.0.0

分割线组件，用于分隔内容。

#### 基础用法

```jsx
import { Divider } from 'tt-design';

<Divider />
<Divider>文本</Divider>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 分割线类型 | 'horizontal' \| 'vertical' | 'horizontal' |
| children | 分割线文本 | ReactNode | - |
| version | 组件版本号 | string | - |

---

## 反馈组件

### Modal 模态框

**版本**: 1.0.0

模态框组件，用于重要信息展示和操作确认。

#### 基础用法

```jsx
import { Modal, Button } from 'tt-design';

const [visible, setVisible] = useState(false);

<Button onClick={() => setVisible(true)}>打开模态框</Button>

<Modal
  title="模态框标题"
  visible={visible}
  onCancel={() => setVisible(false)}
  onOk={() => setVisible(false)}
  version="1.0.0"
>
  模态框内容
</Modal>
```

#### 静态方法

```jsx
Modal.info({ title: '提示', content: '提示内容' });
Modal.success({ title: '成功', content: '操作成功' });
Modal.error({ title: '错误', content: '操作失败' });
Modal.warning({ title: '警告', content: '请注意' });
Modal.confirm({ title: '确认', content: '确定执行此操作？', onOk() {} });
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | string \| ReactNode | - |
| visible | 是否可见 | boolean | false |
| onCancel | 取消回调 | function | - |
| onOk | 确定回调 | function | - |
| width | 宽度 | number \| string | 520 |
| centered | 是否居中 | boolean | false |
| mask | 是否显示遮罩 | boolean | true |
| maskClosable | 点击遮罩是否关闭 | boolean | true |
| confirmLoading | 确定按钮加载 | boolean | false |
| footer | 底部内容 | ReactNode | - |
| children | 模态框内容 | ReactNode | - |
| version | 组件版本号 | string | - |

---

### Drawer 抽屉

**版本**: 1.0.0

抽屉组件，用于侧边内容展示。

#### 基础用法

```jsx
import { Drawer, Button } from 'tt-design';

const [visible, setVisible] = useState(false);

<Button onClick={() => setVisible(true)}>打开抽屉</Button>

<Drawer
  title="抽屉标题"
  visible={visible}
  onClose={() => setVisible(false)}
  version="1.0.0"
>
  抽屉内容
</Drawer>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | string \| ReactNode | - |
| visible | 是否可见 | boolean | false |
| onClose | 关闭回调 | function | - |
| width | 宽度 | number \| string | 378 |
| placement | 位置 | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' |
| mask | 是否显示遮罩 | boolean | true |
| maskClosable | 点击遮罩是否关闭 | boolean | true |
| children | 抽屉内容 | ReactNode | - |
| version | 组件版本号 | string | - |

---

### Message 全局提示

**版本**: 1.0.0

全局提示组件，用于轻量级信息展示。

#### 基础用法

```jsx
import { Message } from 'tt-design';

Message.success('操作成功');
Message.error('操作失败');
Message.warning('警告信息');
Message.info('提示信息');
Message.loading('加载中...');
```

#### API

| 方法 | 说明 | 参数 |
|------|------|------|
| success | 成功提示 | content, duration |
| error | 错误提示 | content, duration |
| warning | 警告提示 | content, duration |
| info | 信息提示 | content, duration |
| loading | 加载提示 | content, duration |

---

### Notification 通知提醒框

**版本**: 1.0.0

通知提醒框组件，用于右上角通知展示。

#### 基础用法

```jsx
import { Notification } from 'tt-design';

Notification.success({
  message: '通知标题',
  description: '通知内容',
});
```

#### API

| 方法 | 说明 | 参数 |
|------|------|------|
| success | 成功通知 | config |
| error | 错误通知 | config |
| warning | 警告通知 | config |
| info | 信息通知 | config |

---

### Popover 气泡卡片

**版本**: 1.0.0

气泡卡片组件，用于悬浮内容展示。

#### 基础用法

```jsx
import { Popover, Button } from 'tt-design';

<Popover content="气泡内容" title="标题" version="1.0.0">
  <Button>鼠标移入</Button>
</Popover>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | string \| ReactNode | - |
| content | 内容 | string \| ReactNode | - |
| trigger | 触发方式 | 'hover' \| 'click' \| 'focus' | 'hover' |
| placement | 位置 | string | 'top' |
| version | 组件版本号 | string | - |

---

## 导航组件

### Menu 导航菜单

**版本**: 1.0.0

导航菜单组件，用于页面导航。

#### 基础用法

```jsx
import { Menu } from 'tt-design';

<Menu defaultSelectedKeys={['1']} version="1.0.0">
  <Menu.Item key="1">菜单项一</Menu.Item>
  <Menu.Item key="2">菜单项二</Menu.Item>
  <Menu.SubMenu key="sub1" title="子菜单">
    <Menu.Item key="3">子菜单项</Menu.Item>
  </Menu.SubMenu>
</Menu>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| mode | 菜单模式 | 'vertical' \| 'horizontal' \| 'inline' | 'vertical' |
| selectedKeys | 当前选中的菜单项 | Array | - |
| defaultSelectedKeys | 默认选中的菜单项 | Array | - |
| openKeys | 当前展开的子菜单 | Array | - |
| defaultOpenKeys | 默认展开的子菜单 | Array | - |
| onSelect | 选中回调 | function | - |
| onOpenChange | 展开回调 | function | - |
| version | 组件版本号 | string | - |

---

### Breadcrumb 面包屑

**版本**: 1.0.0

面包屑组件，用于展示当前位置。

#### 基础用法

```jsx
import { Breadcrumb } from 'tt-design';

<Breadcrumb version="1.0.0">
  <Breadcrumb.Item>首页</Breadcrumb.Item>
  <Breadcrumb.Item>应用中心</Breadcrumb.Item>
  <Breadcrumb.Item>某应用</Breadcrumb.Item>
</Breadcrumb>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| separator | 分隔符 | string \| ReactNode | '/' |
| version | 组件版本号 | string | - |

---

### Steps 步骤条

**版本**: 1.0.0

步骤条组件，用于展示操作流程。

#### 基础用法

```jsx
import { Steps } from 'tt-design';

<Steps current={1} version="1.0.0">
  <Steps.Step title="步骤一" description="这是步骤一的描述" />
  <Steps.Step title="步骤二" description="这是步骤二的描述" />
  <Steps.Step title="步骤三" description="这是步骤三的描述" />
</Steps>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| current | 当前步骤 | number | 0 |
| direction | 方向 | 'horizontal' \| 'vertical' | 'horizontal' |
| status | 当前步骤状态 | 'wait' \| 'process' \| 'finish' \| 'error' | 'process' |
| version | 组件版本号 | string | - |

---

### Dropdown 下拉菜单

**版本**: 1.0.0

下拉菜单组件，用于展示下拉操作菜单。

#### 基础用法

```jsx
import { Dropdown, Button } from 'tt-design';

const items = [
  { key: '1', label: '操作一' },
  { key: '2', label: '操作二' },
];

<Dropdown menu={{ items }} version="1.0.0">
  <Button>下拉菜单</Button>
</Dropdown>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| menu | 菜单配置 | object | - |
| trigger | 触发方式 | 'click' \| 'hover' \| 'contextMenu' | 'hover' |
| placement | 位置 | string | 'bottomLeft' |
| version | 组件版本号 | string | - |

---

### Pagination 分页

**版本**: 1.0.0

分页组件，用于数据分页展示。

#### 基础用法

```jsx
import { Pagination } from 'tt-design';

<Pagination
  total={50}
  pageSize={10}
  current={1}
  onChange={(page, pageSize) => {}}
  version="1.0.0"
/>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| total | 总数 | number | - |
| pageSize | 每页条数 | number | 10 |
| current | 当前页 | number | 1 |
| onChange | 页码变化回调 | function | - |
| onShowSizeChange | 每页条数变化回调 | function | - |
| showSizeChanger | 是否显示每页条数选择器 | boolean | false |
| showQuickJumper | 是否显示快速跳转 | boolean | false |
| version | 组件版本号 | string | - |

---

## 其他组件

### Color 色彩

**版本**: 1.0.0

色彩组件，用于展示色彩规范。

#### 基础用法

```jsx
import { Color } from 'tt-design';

<Color version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| version | 组件版本号 | string | - |

---

### Font 字体

**版本**: 1.0.0

字体组件，用于展示字体规范。

#### 基础用法

```jsx
import { Font } from 'tt-design';

<Font version="1.0.0" />
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| version | 组件版本号 | string | - |

---

### Row 栅格

**版本**: 1.0.0

栅格组件，用于页面布局。

#### 基础用法

```jsx
import { Row, Col } from 'tt-design';

<Row version="1.0.0">
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
</Row>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| gutter | 栅格间隔 | number \| Array | 0 |
| justify | 水平排列方式 | 'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' | 'start' |
| align | 垂直对齐方式 | 'top' \| 'middle' \| 'bottom' | 'top' |
| version | 组件版本号 | string | - |

#### Col API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| span | 栅格占位格数 | number | - |
| offset | 栅格左侧间隔格数 | number | 0 |
| version | 组件版本号 | string | - |

---

### CardSelect 卡片选择

**版本**: 1.0.0

卡片选择组件，用于卡片式选择。

#### 基础用法

```jsx
import { CardSelect } from 'tt-design';

<CardSelect value={value} onChange={setValue} version="1.0.0">
  <CardSelect.CardItem value="1">选项一</CardSelect.CardItem>
  <CardSelect.CardItem value="2">选项二</CardSelect.CardItem>
</CardSelect>
```

#### API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 当前值 | string \| Array | - |
| onChange | 变化回调 | function | - |
| multiple | 是否多选 | boolean | false |
| version | 组件版本号 | string | - |

---

## 版本说明

### 库版本

- **当前版本**: 1.0.0
- **发布日期**: 2026-03-21

### 组件版本更新日志

#### 1.0.0 (2026-03-21)

- 初始版本发布
- 包含 40+ 组件
- 基于 React 17.0.1 和 Ant Design 4.24.8 构建

---

## 技术栈

- **React**: 17.0.1
- **Ant Design**: 4.24.8
- **TypeScript**: 支持
- **Storybook**: 7.x (用于组件文档)

---

## 使用说明

### 安装

```bash
npm install tt-design
```

### 引入组件

```jsx
import { Button, Input, Select } from 'tt-design';
```

### 全局引入样式

```jsx
import 'tt-design/dist/index.css';
```

---

## 注意事项

1. 所有组件必须传入 `version` 属性，用于标识组件版本
2. 色彩和字体样式严格遵循设计规范
3. 禁止在组件样式中使用 `!important`
4. 禁止硬编码颜色值，应使用设计系统提供的颜色变量

---

*文档生成时间: 2026-03-21*
