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
import Card from '../../components/Card';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const Demo3 = ({ className, visible, onCancel, onOk, ...props }) => {
  const [form] = Form.useForm();
  const [selfDependency, setSelfDependency] = useState(false);
  const [globalVariables, setGlobalVariables] = useState([
    { key: '1', name: 'start', type: 'String', value: '${yyyy-MM-dd 00:00:00}' },
    { key: '2', name: 'parkIds', type: 'String', value: '888,999,1024' },
    { key: '3', name: '', type: 'String', value: '' }
  ]);
  const [upstreamDependencies, setUpstreamDependencies] = useState([
    { key: '1', task: '', schedule: '', strategy: 'same_period' },
    { key: '2', task: '', schedule: '', strategy: 'same_period' }
  ]);

  const demo3ClassName = classNames('tt-demo3', className);

  // 调度周期选项
  const cycleOptions = [
    { label: '每分钟执行', value: 'minutely' },
    { label: '每小时执行', value: 'hourly' },
    { label: '每日执行', value: 'daily' },
    { label: '每周执行', value: 'weekly' },
    { label: '每月执行', value: 'monthly' }
  ];

  // 变量类型选项
  const typeOptions = [
    { label: 'String', value: 'String' },
    { label: 'Number', value: 'Number' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Date', value: 'Date' }
  ];

  // 依赖策略选项
  const strategyOptions = [
    { label: '同周期（同一业务日期）', value: 'same_period' },
    { label: '上一周期', value: 'last_period' },
    { label: '自定义', value: 'custom' }
  ];

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
      { key: Date.now().toString(), name: '', type: 'String', value: '' }
    ]);
  };

  // 删除全局变量
  const removeVariable = (index) => {
    const newVariables = globalVariables.filter((_, i) => i !== index);
    setGlobalVariables(newVariables);
  };

  // 处理上游依赖变化
  const handleDependencyChange = (index, field, value) => {
    const newDependencies = [...upstreamDependencies];
    newDependencies[index][field] = value;
    setUpstreamDependencies(newDependencies);
  };

  // 添加上游依赖
  const addUpstreamDependency = () => {
    setUpstreamDependencies([
      ...upstreamDependencies,
      { key: Date.now().toString(), task: '', schedule: '', strategy: 'same_period' }
    ]);
  };

  // 删除上游依赖
  const removeUpstreamDependency = (index) => {
    const newDependencies = upstreamDependencies.filter((_, i) => i !== index);
    setUpstreamDependencies(newDependencies);
  };

  return (
    <Modal
      title="添加调度计划"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      className={demo3ClassName}
      {...props}
      closable={true}
      closeIcon={<CloseOutlined />}
    >
      <Form form={form} layout="vertical" className="tt-demo3-form">
        {/* 执行配置区 */}
        <div className="tt-demo3-section">
          <div className="tt-demo3-section-title">执行配置</div>

          <Form.Item
            label={<span className="tt-demo3-required">计划名称：</span>}
            name="planName"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label={<span className="tt-demo3-required">调度状态：</span>}
            name="scheduleStatus"
            initialValue="normal"
            rules={[{ required: true, message: '请选择调度状态' }]}
          >
            <Radio.Group>
              <Radio value="normal">正常调度</Radio>
              <Radio value="dryrun">空跑调度</Radio>
              <Radio value="paused">暂停调度</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="tt-demo3-required">首次执行：</span>}
            name="firstExecute"
            rules={[{ required: true, message: '请选择首次执行日期' }]}
          >
            <DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={<span className="tt-demo3-required">调度周期：</span>}
            name="scheduleCycle"
            initialValue="daily"
            rules={[{ required: true, message: '请选择调度周期' }]}
          >
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {cycleOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="tt-demo3-required">执行时间：</span>}
            name="executeTime"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <TimePicker
              placeholder="00:00"
              style={{ width: '100%' }}
              format="HH:mm"
            />
          </Form.Item>
        </div>

        {/* 全局变量区 */}
        <div className="tt-demo3-section">
          <div className="tt-demo3-section-title">全局变量</div>

          <div className="tt-demo3-variables">
            <div className="tt-demo3-variables-header">
              <div className="tt-demo3-variables-col">变量名</div>
              <div className="tt-demo3-variables-col">变量类型</div>
              <div className="tt-demo3-variables-col">值/表达式</div>
            </div>

            {globalVariables.map((variable, index) => (
              <div key={variable.key} className="tt-demo3-variables-row">
                <div className="tt-demo3-variables-col">
                  <Input
                    placeholder="输入或选择"
                    value={variable.name}
                    onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="tt-demo3-variables-col">
                  <Select
                    value={variable.type}
                    onChange={(value) => handleVariableChange(index, 'type', value)}
                    style={{ width: '100%' }}
                  >
                    {typeOptions.map(opt => (
                      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                    ))}
                  </Select>
                </div>
                <div className="tt-demo3-variables-col">
                  <Input
                    placeholder="请输入"
                    value={variable.value}
                    onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeVariable(index)}
                  className="tt-demo3-delete-btn"
                />
              </div>
            ))}
          </div>

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addVariable}
            className="tt-demo3-add-variable-btn"
          >
            添加全局变量
          </Button>
        </div>

        {/* 调度依赖区 */}
        <div className="tt-demo3-section">
          <div className="tt-demo3-section-title">调度依赖</div>

          {/* 自依赖开关 */}
          <div className="tt-demo3-self-dependency">
            <Checkbox
              checked={selfDependency}
              onChange={(e) => setSelfDependency(e.target.checked)}
            >
              <span className="tt-demo3-self-dependency-label">开启自依赖</span>
              <span className="tt-demo3-self-dependency-desc">
                当前调度等待自己的【上一周期】实例成功后才会执行。
              </span>
            </Checkbox>
          </div>

          {/* 上游依赖卡片 */}
          <div className="tt-demo3-dependencies">
            {upstreamDependencies.map((dependency, index) => (
              <Card key={dependency.key} className="tt-demo3-dependency-card">
                <div className="tt-demo3-dependency-header">
                  <span className="tt-demo3-dependency-title">依赖任务</span>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeUpstreamDependency(index)}
                    className="tt-demo3-delete-btn"
                  />
                </div>

                <Form.Item
                  label="依赖任务"
                  name={`dependencyTask_${index}`}
                  className="tt-demo3-dependency-item"
                >
                  <Select
                    placeholder="请选择任务"
                    value={dependency.task}
                    onChange={(value) => handleDependencyChange(index, 'task', value)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  label="依赖调度"
                  name={`dependencySchedule_${index}`}
                  className="tt-demo3-dependency-item"
                >
                  <Select
                    placeholder="请选择调度计划"
                    value={dependency.schedule}
                    onChange={(value) => handleDependencyChange(index, 'schedule', value)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  label="依赖策略"
                  name={`dependencyStrategy_${index}`}
                  className="tt-demo3-dependency-item"
                >
                  <Select
                    value={dependency.strategy}
                    onChange={(value) => handleDependencyChange(index, 'strategy', value)}
                    style={{ width: '100%' }}
                  >
                    {strategyOptions.map(opt => (
                      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addUpstreamDependency}
            className="tt-demo3-add-dependency-btn"
          >
            添加上游依赖
          </Button>
        </div>

        {/* 底部操作按钮 */}
        <div className="tt-demo3-footer">
          <Button onClick={onCancel} className="tt-demo3-cancel-btn">
            取消
          </Button>
          <Button type="primary" onClick={onOk} className="tt-demo3-confirm-btn">
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Demo3;
