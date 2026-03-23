import React, { useState } from 'react';
import classNames from 'classnames';
import './index.less';

// 导入组件库组件
import Form from '../../components/Form';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Radio from '../../components/Radio';
import Switch from '../../components/Switch';
import Button from '../../components/Button';
import Row from '../../components/Row';
import Divider from '../../components/Divider';
import Card from '../../components/Card';
import { CloseOutlined, PlusOutlined, DeleteOutlined, MoreOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Option } = Select;

const ConfigForm = ({ className, ...props }) => {
  const [form] = Form.useForm();
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [aggregationEnabled, setAggregationEnabled] = useState(false);
  const [filterGroups, setFilterGroups] = useState([
    {
      id: 'group-1',
      logic: 'and',
      conditions: [
        { id: 'cond-1', field: '', operator: '=', value: '' },
        { id: 'cond-2', field: '', operator: '=', value: '' }
      ]
    },
    {
      id: 'group-2',
      logic: 'or',
      conditions: [
        { id: 'cond-3', field: '', operator: '=', value: '' }
      ]
    }
  ]);
  const [outputFields, setOutputFields] = useState([
    { id: 'field-1', name: '', type: '', description: '' },
    { id: 'field-2', name: '', type: '', description: '' }
  ]);

  const configFormClassName = classNames('tt-config-form', className);

  // 模拟数据选项
  const dataSourceOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' }
  ];

  const splitKeyOptions = [
    { label: 'id', value: 'id' },
    { label: 'created_at', value: 'created_at' },
    { label: 'updated_at', value: 'updated_at' },
    { label: 'user_id', value: 'user_id' }
  ];

  const fieldOptions = [
    { label: 'id', value: 'id' },
    { label: 'name', value: 'name' },
    { label: 'email', value: 'email' },
    { label: 'phone', value: 'phone' },
    { label: 'status', value: 'status' },
    { label: 'created_at', value: 'created_at' },
    { label: 'updated_at', value: 'updated_at' }
  ];

  const operatorOptions = [
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: 'LIKE', value: 'like' },
    { label: 'IN', value: 'in' },
    { label: 'NOT IN', value: 'not_in' }
  ];

  // 添加过滤条件
  const addCondition = (groupId) => {
    setFilterGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [
            ...group.conditions,
            { id: `cond-${Date.now()}`, field: '', operator: '=', value: '' }
          ]
        };
      }
      return group;
    }));
  };

  // 删除过滤条件
  const removeCondition = (groupId, conditionId) => {
    setFilterGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter(c => c.id !== conditionId)
        };
      }
      return group;
    }));
  };

  // 添加过滤组
  const addFilterGroup = (logic) => {
    setFilterGroups(groups => [
      ...groups,
      {
        id: `group-${Date.now()}`,
        logic,
        conditions: [
          { id: `cond-${Date.now()}`, field: '', operator: '=', value: '' }
        ]
      }
    ]);
  };

  // 删除过滤组
  const removeFilterGroup = (groupId) => {
    setFilterGroups(groups => groups.filter(g => g.id !== groupId));
  };

  // 添加输出字段
  const addOutputField = () => {
    setOutputFields(fields => [
      ...fields,
      { id: `field-${Date.now()}`, name: '', type: '', description: '' }
    ]);
  };

  // 删除输出字段
  const removeOutputField = (fieldId) => {
    setOutputFields(fields => fields.filter(f => f.id !== fieldId));
  };

  return (
    <div className={configFormClassName} {...props}>
      <div className="tt-config-form-wrapper">
        {/* 头部 */}
        <div className="tt-config-form-header">
          <div className="tt-config-form-header-left">
            <div className="tt-config-form-header-icon">
              <DatabaseOutlined />
            </div>
            <span className="tt-config-form-header-title">MySQL 输入</span>
          </div>
          <div className="tt-config-form-header-actions">
            <Button type="text" size="small" className="tt-config-form-action-btn">
              <MoreOutlined />
            </Button>
            <Button type="text" size="small" className="tt-config-form-action-btn">
              <CloseOutlined />
            </Button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="tt-config-form-content">
          <Form form={form} layout="vertical" className="tt-config-form-inner">
            {/* 数据源配置 */}
            <div className="tt-config-form-section">
              <div className="tt-config-form-section-title">数据源配置</div>

              <Form.Item label={<span className="tt-config-form-required">输入数据源：</span>} name="dataSource">
                <Select placeholder="请选择输入数据源" style={{ width: '100%' }}>
                  {dataSourceOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="tt-config-form-required">来源表量：</span>} name="sourceType">
                <Radio.Group defaultValue="dynamic">
                  <Radio value="single">查询单表</Radio>
                  <Radio value="dynamic">动态多表</Radio>
                  <Radio value="join">联表查询</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label={<span className="tt-config-form-required">数据表：</span>} name="dataTable">
                <Input placeholder="请输入数据库支持的正则表达式" />
              </Form.Item>

              <Form.Item label={<span className="tt-config-form-required">切分键：</span>} name="splitKey">
                <Select placeholder="请选择切分键" style={{ width: '100%' }}>
                  {splitKeyOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* 输入过滤 */}
            <div className="tt-config-form-section">
              <div className="tt-config-form-section-title">
                <span>输入过滤</span>
                <Switch
                  checked={filterEnabled}
                  onChange={setFilterEnabled}
                  className="tt-config-form-switch"
                />
              </div>

              {filterEnabled && (
                <div className="tt-config-form-filter">
                  {filterGroups.map((group, groupIndex) => (
                    <div key={group.id} className="tt-config-form-filter-group">
                      {groupIndex > 0 && (
                        <div className="tt-config-form-filter-or-divider">
                          <Divider>
                            <span className="tt-config-form-or-text">或者</span>
                          </Divider>
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeFilterGroup(group.id)}
                            className="tt-config-form-delete-group-btn"
                          />
                        </div>
                      )}

                      <div className="tt-config-form-filter-group-content">
                        {group.conditions.map((condition, condIndex) => (
                          <div key={condition.id} className="tt-config-form-filter-row">
                            {condIndex > 0 && (
                              <div className="tt-config-form-filter-and-label-wrapper">
                                <span className="tt-config-form-filter-and-label">并且</span>
                              </div>
                            )}
                            <div className="tt-config-form-filter-fields">
                              <Select placeholder="选择字段" style={{ flex: 1 }} className="tt-config-form-select">
                                {fieldOptions.map(opt => (
                                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                              </Select>
                              <Select placeholder="=" style={{ width: 80 }} className="tt-config-form-select">
                                {operatorOptions.map(opt => (
                                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                              </Select>
                              <Input placeholder="输入或引用" style={{ flex: 1 }} className="tt-config-form-input" />
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                className="tt-config-form-filter-plus"
                              />
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() => removeCondition(group.id, condition.id)}
                                className="tt-config-form-filter-delete"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => addCondition(group.id)}
                          className="tt-config-form-add-condition-btn"
                        >
                          <span className="tt-config-form-add-text">并且</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="default"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => addFilterGroup('or')}
                    className="tt-config-form-add-or-btn"
                  >
                    或者
                  </Button>
                </div>
              )}
            </div>

            {/* 分组汇总 */}
            <div className="tt-config-form-section">
              <div className="tt-config-form-section-title">
                <span>分组汇总</span>
                <Switch
                  checked={aggregationEnabled}
                  onChange={setAggregationEnabled}
                  className="tt-config-form-switch-gray"
                />
              </div>
            </div>

            {/* 输出字段 */}
            <div className="tt-config-form-section">
              <div className="tt-config-form-section-title">
                <span>输出字段</span>
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={addOutputField}
                  className="tt-config-form-add-field-btn"
                />
              </div>

              <div className="tt-config-form-output-fields">
                <div className="tt-config-form-output-header">
                  <div className="tt-config-form-output-col">字段名</div>
                  <div className="tt-config-form-output-col">字段类型</div>
                  <div className="tt-config-form-output-col">字段描述</div>
                </div>

                {outputFields.map(field => (
                  <div key={field.id} className="tt-config-form-output-row">
                    <div className="tt-config-form-output-col">
                      <Select placeholder="选择字段" style={{ width: '100%' }} className="tt-config-form-select">
                        {fieldOptions.map(opt => (
                          <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                        ))}
                      </Select>
                    </div>
                    <div className="tt-config-form-output-col">
                      <Input placeholder="--" disabled className="tt-config-form-input-disabled" />
                    </div>
                    <div className="tt-config-form-output-col">
                      <Input placeholder="--" disabled className="tt-config-form-input-disabled" />
                    </div>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => removeOutputField(field.id)}
                      className="tt-config-form-delete-field-btn"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConfigForm;
