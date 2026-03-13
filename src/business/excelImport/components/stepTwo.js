/* eslint-disable no-unused-vars */
import { message, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SELECT_RULE_TIPS, SELECT_TIPS } from '../config';

const { TabPane } = Tabs;

const StepTwo = props => {
    const {
        sheets,
        sheetNames,
        setSheetIndex,
        setDataRowNum,
        setTotalCount,
        setDisplayNames,
        sheetIndex,
        dataRowNum,
        textPre = false, // 表格中的文本是否保留空格
    } = props;

    const selectRow = (idx, sheetIndex) => {
        // const line1 = Object.keys((sheets || [])[sheetIndex]?.[0] || {});
        // const line2 = Object.keys((sheets || [])[sheetIndex]?.[1] || {});
        // const max = Math.max(line1?.length || 0, line2?.length || 0);
        // const keys = line2?.length > line1?.length ? line2 : line1;
        // const obj1 = {};
        // const obj2 = {};
        // for (let i = 0; i < max; i++) {
        //     obj1[keys[i]] = (sheets || [])[sheetIndex]?.[idx]?.[keys[i]] || '';
        //     obj2[keys[i]] = (sheets || [])[sheetIndex]?.[idx + 1]?.[keys[i]] || '';
        // }
        // let temp = Object.values(obj1);
        // let preview = Object.values(obj2);
        const line1 = (sheets || [])[sheetIndex]?.[0] || [];
        const line2 = (sheets || [])[sheetIndex]?.[1] || [];
        const line3 = (sheets || [])[sheetIndex]?.[2] || {};
        const max = Math.max(line1?.length || 0, line2?.length || 0, line3?.length || 0);
        let temp = [];
        let preview = [];
        for (let i = 0; i < max; i++) {
            temp[i] = (sheets || [])[sheetIndex]?.[idx]?.[i] || '';
            preview[i] = (sheets || [])[sheetIndex]?.[idx + 1]?.[i] || '';
        }
        const displayNames = [];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i]) {
                displayNames.push({
                    label: temp[i],
                    text: preview[i] || '',
                });
            } else {
                break;
            }
        }
        if (!displayNames.length) {
            message.warning('表头第一列不得为空');
        }
        setDisplayNames(displayNames);
        setDataRowNum(idx);
        setTotalCount((sheets || [])[sheetIndex]?.total - idx - 1);
    };

    const callback = key => {
        setSheetIndex(+key);
        selectRow(0, +key);
    };

    useEffect(() => {
        if (!sheets?.length) {
            return;
        }
        const line1 = (sheets || [])[0]?.[0] || [];
        const line2 = (sheets || [])[0]?.[1] || [];
        const line3 = (sheets || [])[0]?.[2] || {};
        const max = Math.max(line1?.length || 0, line2?.length || 0, line3?.length || 0);
        let temp = [];
        for (let i = 0; i < max; i++) {
            temp[i] = line1[i] || '';
        }
        let preview = line2;
        const displayNames = [];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i]) {
                displayNames.push({
                    label: temp[i],
                    text: preview[i] || '',
                });
            } else {
                break;
            }
        }
        if (!displayNames.length) {
            message.warning('表头第一列不得为空');
        }
        setDisplayNames(displayNames);
        setDataRowNum(0);
        setTotalCount((sheets || [])[0]?.total - 1);
    }, [sheets, setDataRowNum, setDisplayNames, setTotalCount]);

    return (
        <div className="step-content step-content--two">
            {/* <div className="step-header"> */}
            {sheetNames?.length > 0 && (
                <Tabs
                    defaultActiveKey="0"
                    onChange={callback}
                    tabBarExtraContent={{
                        right: (
                            <div className="tips-core">
                                <Tooltip title={SELECT_RULE_TIPS}>
                                    <span className="tips">
                                        <ExclamationCircleOutlined />
                                    </span>
                                </Tooltip>
                                <span className="text">{SELECT_TIPS}</span>
                            </div>
                        ),
                    }}
                >
                    {sheetNames?.map((sheetName, index) => {
                        let renderList = (sheets || [])[index]?.slice?.(0, 10) || [];
                        if (renderList.length < 10) {
                            renderList = renderList.concat(new Array(10 - renderList.length).fill({}));
                        }
                        return (
                            <TabPane tab={sheetName} key={`${index}`}>
                                <div className="sheet-core">
                                    {renderList?.map((line, idx) => {
                                        const line1 = (sheets || [])[index]?.[0] || [];
                                        const line2 = (sheets || [])[index]?.[1] || [];
                                        const line3 = (sheets || [])[index]?.[2] || {};
                                        const max = Math.max(
                                            line1?.length || 0,
                                            line2?.length || 0,
                                            line3?.length || 0
                                        );
                                        let temp = [];
                                        for (let i = 0; i < max; i++) {
                                            temp[i] = line[i] || '';
                                        }
                                        return (
                                            <div className="sheet-line">
                                                <div
                                                    className={`sheet-item sheet-item-num ${
                                                        idx === dataRowNum ? 'selected' : ''
                                                    }`}
                                                    onClick={() => selectRow(idx, sheetIndex)}
                                                >
                                                    <span className="text">{idx + 1}</span>
                                                    <span className="icon">
                                                        <span className="text">表头</span>
                                                        <span className="back"></span>
                                                    </span>
                                                </div>
                                                {temp.map((item, index) => {
                                                    return (
                                                        <div className="sheet-item" key={index} style={textPre ? { whiteSpace: 'pre' } : {}} title={item}>
                                                            {item}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabPane>
                        );
                    })}
                </Tabs>
            )}
            {/* </div> */}
        </div>
    );
};

export default StepTwo;
