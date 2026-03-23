import React, { useState } from 'react';
import classNames from 'classnames';
import './index.less';

// 导入组件库组件
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Radio from '../../components/Radio';
import DatePicker from '../../components/DatePicker';
import TimePicker from '../../components/TimePicker';
import Select from '../../components/Select';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Row from '../../components/Row';
import Divider from '../../components/Divider';
import { PlusOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';

const { Option } = Select;

const SchedulePlan = ({ className, visible, onCancel, onOk, ...props }) => {
  const [form] = Form.useForm();
  const [scheduleCycle, setScheduleCycle] = useState('daily');
  const [weekDays, setWeekDays] = useState([]);
  const [selfDependency, setSelfDependency] = useState(false);
  const [globalVariables, setGlobalVariables] = useState([
    { key: '1', name: '', value: '' }
  ]);

  const schedulePlanClassName = classNames('tt-schedule-plan', className);

  // 调度周期选项
  const cycleOptions = [
    { label: '每分钟', value: 'minutely' },
    { label: '每小时', value: 'hourly' },
    { label: '每天', value: 'daily' },
    { label: '每周特定几天', value: 'weekly' },
    { label: '每月', value: 'monthly' }
  ];

  // 星期选项
  const weekDayOptions = [
    { label: '周一', value: 'monday' },
    { label: '周二', value: 'tuesday' },
    { label: '周三', value: 'wednesday' },
    { label: '周四', value: 'thursday' },
    { label: '周五', value: 'friday' },
    { label: '周六', value: 'saturday' },
    { label: '周日', value: 'sunday' }
  ];

  // 全局变量表格列
  const variableColumns = [
    {
      title: '变量名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => (
        <Input
          placeholder="请输入变量名"
          value={text}
          onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
        />
      )
    },
    {
      title: '值/表达式',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, index) => (
        <Input
          placeholder="请输入值或表达式"
          value={text}
          onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 60,
      render: (text, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeVariable(index)}
          disabled={globalVariables.length <= 1}
        />
      )
    }
  ];

  // 处理调度周期变化
  const handleCycleChange = (value) => {
    setScheduleCycle(value);
  };

  // 处理星期选择
  const handleWeekDayChange = (checkedValues) => {
    setWeekDays(checkedValues);
  };

  // 处理全局变量变化
  const handleVariableChange = (index, field, value) => {
    const newVariables = [...globalVariables];
    newVariables[index][field] = value;
    setGlobalVariables(newVariables);
  };

  // 添加全局变量
  const addVariable = () => {
    setGlobalVariables([
      ...globalVariables,
      { key: Date.now().toString(), name: '', value: '' }
    ]);
  };

  // 删除全局变量
  const removeVariable = (index) => {
    if (globalVariables.length > 1) {
      const newVariables = globalVariables.filter((_, i) => i !== index);
      setGlobalVariables(newVariables);
    }
  };

  // 添加上游依赖
  const addUpstreamDependency = () => {
    // 这里可以打开选择上游依赖的弹窗
    console.log('添加上游依赖');
  };

  return (
    <Modal
      title="添加调度计划"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={520}
      className={schedulePlanClassName}
      {...props}
      bodyStyle={{ maxHeight: 800, overflowY: 'auto' }}
    >
      <Form form={form} layout="vertical" className="tt-schedule-plan-form">
        {/* 执行配置区 */}
        <div className="tt-schedule-plan-section">
          <div className="tt-schedule-plan-section-title">执行配置</div>

          <Form.Item
            label={<span className="tt-schedule-plan-required">计划名称</span>}
            name="planName"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入计划名称" />
          </Form.Item>

          <Form.Item
            label={<span className="tt-schedule-plan-required">调度状态</span>}
            name="scheduleStatus"
            initialValue="normal"
            rules={[{ required: true, message: '请选择调度状态' }]}
          >
            <Radio.Group>
              <Radio value="normal">正常</Radio>
              <Radio value="dryrun">空跑</Radio>
              <Radio value="paused">暂停</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="tt-schedule-plan-required">首次执行</span>}
            name="firstExecute"
            rules={[{ required: true, message: '请选择首次执行日期' }]}
          >
            <DatePicker placeholder="请选择首次执行日期" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={<span className="tt-schedule-plan-required">调度周期</span>}
            name="scheduleCycle"
            initialValue="daily"
            rules={[{ required: true, message: '请选择调度周期' }]}
          >
            <Select
              placeholder="请选择调度周期"
              style={{ width: '100%' }}
              onChange={handleCycleChange}
            >
              {cycleOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* 每周特定几天时显示星期选择 */}
          {scheduleCycle === 'weekly' && (
            <>
              <Form.Item label="选择星期">
                <Checkbox.Group
                  options={weekDayOptions}
                  value={weekDays}
                  onChange={handleWeekDayChange}
                />
              </Form.Item>
              <div className="tt-schedule-plan-hint">
                提示：选择的星期将作为每周执行的日期
              </div>
            </>
          )}

          <Form.Item
            label={<span className="tt-schedule-plan-required">执行时间</span>}
            name="executeTime"
            initialValue={null}
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <TimePicker
              placeholder="请选择执行时间"
              style={{ width: '100%' }}
              format="HH:mm"
              defaultValue={null}
            />
          </Form.Item>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 全局变量区 */}
        <div className="tt-schedule-plan-section">
          <div className="tt-schedule-plan-section-title">全局变量</div>

          <Table
            columns={variableColumns}
            dataSource={globalVariables}
            pagination={false}
            rowKey="key"
            size="small"
            className="tt-schedule-plan-variable-table"
          />

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addVariable}
            className="tt-schedule-plan-add-variable-btn"
          >
            添加全局变量
          </Button>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 调度依赖区 */}
        <div className="tt-schedule-plan-section">
          <div className="tt-schedule-plan-section-title">调度依赖</div>

          <div className="tt-schedule-plan-warning-box">
            <div className="tt-schedule-plan-warning-content">
              <WarningOutlined className="tt-schedule-plan-warning-icon" />
              <Checkbox
                checked={selfDependency}
                onChange={(e) => setSelfDependency(e.target.checked)}
              >
                开启自依赖
              </Checkbox>
            </div>
          </div>

          <Button
            type="default"
            block
            icon={<PlusOutlined />}
            onClick={addUpstreamDependency}
            className="tt-schedule-plan-add-dependency-btn"
          >
            添加上游依赖
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SchedulePlan;
