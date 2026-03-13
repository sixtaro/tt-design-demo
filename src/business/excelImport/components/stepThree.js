/* eslint-disable no-unused-vars */
import { Col, Input, Row, Select } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { mockMapList } from '../mock';
import { Storage } from '@/utils';
import { getFieldType } from '../utils';

const StepThree = props => {
    const { modelId, mapList, displayNames, fieldMapper, setFieldMapper } = props;
    console.log('props>>>>', props);

    const onSelectChange = (itemName, displayName) => {
        const temp = [];
        const fieldMapperNames = fieldMapper?.map?.(item => item.name) || [];
        fieldMapper?.forEach(mapper => {
            if (mapper.name === itemName) {
                temp.push({
                    ...mapper,
                    displayName: displayName || '',
                });
            } else {
                temp.push({ ...mapper });
            }
        });
        if (!fieldMapperNames.includes(itemName)) {
            temp.push({ name: itemName, displayName });
        }
        setFieldMapper(temp);
    };

    // 初始化fieldMapper结构
    useEffect(() => {
        if (!Storage.get(`export_fieldMapper_${modelId}`)?.length) {
            const temp = [];
            mapList?.forEach(map => {
                const { viewName, itemName } = map;
                temp.push({
                    name: itemName,
                    displayName: displayNames?.filter(name => name.label === viewName)[0]?.label || '',
                });
            });
            setFieldMapper(temp);
        } else {
            const temp = [];
            fieldMapper?.forEach(mapper => {
                let flag = false;
                displayNames?.forEach(item => {
                    if (mapper.displayName === item.label) {
                        temp.push({ ...mapper });
                        flag = true;
                    }
                });
                if (!flag) {
                    temp.push({
                        ...mapper,
                        displayName: '',
                    });
                }
            });
            setFieldMapper(temp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayNames]);

    const getValue = useCallback(
        itemName => {
            const v = fieldMapper?.filter(name => name.name === itemName)[0]?.displayName;
            const inArr = displayNames?.filter(name => name.label === v).length;
            return inArr ? v : undefined;
        },
        [fieldMapper, displayNames]
    );
    // 格式化时间数据
    const formatDisplayText = (text, mapIndex) => {
        if (mapIndex === 2 || mapIndex === 3) { // 第3，4行数据需要格式化
            // 确保 text 是字符串且不为空
            if (typeof text !== 'string' || !text.trim()) {
                return text;
            }
            try {
                const date = new Date(text);
                console.log(date)
                if (!isNaN(date.getTime())) {
                    // 格式化为 YYYY-MM-DD
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
                return text; // 无效日期时返回原始值
            } catch (error) {
                console.warn(`无法解析时间数据: ${text}`, error);
                return text; // 解析失败时返回原始值
            }
        }
        return text; // 非目标行，保持原样
    };

    return (
        <div className="step-content">
            <Row>
                <Col span={14}>Excel列</Col>
                <Col span={10}>工作表字段</Col>
            </Row>
            <div className="line"></div>
            <div className="mapping-content">
                {mapList?.map((map, mapIndex) => {
                    const { viewName, itemName, isNecessary, type } = map;
                    const value = getValue(itemName);
                    return (
                        <Row className="step-row">
                            <Col span={10}>
                                <Select
                                    onChange={value => onSelectChange(itemName, value)}
                                    style={{ width: '100%' }}
                                    // defaultValue={defaultValue}
                                    value={value || undefined}
                                    placeholder="请选择"
                                    allowClear
                                >
                                    {displayNames?.map((name, index) => {
                                        const { label, text } = name;
                                        const formattedText = formatDisplayText(text, mapIndex);
                                        return (
                                            <Select.Option value={label} key={index}>
                                                <span className="label">{label}</span>
                                                <span className="text">{formattedText}</span>
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                            <Col span={4} className={`arrow-col ${value ? 'linked' : ''}`}>
                                <span className="half-line"></span>
                                <RightOutlined className="icon" />
                            </Col>
                            <Col span={10} className="item-col">
                                <div className="disabled-text">
                                    <span className="text">{viewName || ''}</span>
                                    <span className="text">（{getFieldType(type)}）</span>
                                    {+isNecessary === 1 && <span className="necessary">*</span>}
                                </div>
                            </Col>
                        </Row>
                    );
                })}
            </div>
        </div>
    );
};

export default StepThree;
