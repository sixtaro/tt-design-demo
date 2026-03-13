import React, { useState } from 'react';
import { DatePicker, InputNumber, message, Modal } from 'antd';
import moment from 'moment';
import OrgTreeSelect from '../tree/orgTreeSelect';
import ParkTreeSelect from '../tree/parkTreeSelect';
import RegionTreeSelect from '../tree/regionTreeSelect';
import NewOrgTreeSelect from '../tree/newOrgTreeSelect';
import ParkTreeWithSwitch from '../parkTreeWithSwitch/parkTreeWithSwitch';
import ReactDOM from 'react-dom';
import { ENUM_SYSTEMHOOK } from '@/model/enum';
import { getIcon, PictureSwiper } from '@/business';
import ModalLayout from './modal';
import { Request } from '@/utils';
import Track from '@/business/track/track';

window.ReactDOM = ReactDOM;
export const FormatDatePicker = function ({ value, onChange, ...rest }) {
    return (
        <DatePicker
            {...rest}
            value={!value ? null : moment(value).format('YYYY-MM-DD') === 'Invalid date' ? null : moment(value)}
            onChange={date => (rest.showTime ? onChange(date.format('YYYY-MM-DD HH:mm:ss')) : onChange(date.format('YYYY-MM-DD')))}
        ></DatePicker>
    );
};

export const FormatRangePicker = function ({ value = [], onChange, ...rest }) {
    return (
        <DatePicker.RangePicker
            {...rest}
            value={value?.map ? value.map(date => moment(date)) : []}
            onChange={dates => onChange(dates.map(date => date.format('YYYY-MM-DD')))}
        ></DatePicker.RangePicker>
    );
};

export const FormatOrgSelect = function ({ value, onChange, disabled, ...rest }) {
    return (
        <OrgTreeSelect {...rest} value={!!value && `org_${value}`} disabled={disabled} onChange={orgID => onChange(orgID.replace('org_', ''))}></OrgTreeSelect>
    );
};

export const FormatNewOrgSelect = function ({ value, onChange, disabled, ...rest }) {
    const [v, setV] = useState(value);
    const handleChange = orgID => {
        setV(orgID);
        onChange(+orgID.replace('org_', '').replace('unit_', ''));
    };
    return <NewOrgTreeSelect {...rest} value={!!v && v} disabled={disabled} onChange={handleChange}></NewOrgTreeSelect>;
};

export const FormatParkSelect = function ({ value, onChange, multiple, disabled, ...rest }) {
    if (Array.isArray(value)) {
        value = value.map(item => `${item}`);
    }

    if (typeof value === 'string') {
        if (!multiple) {
            value = `${value}`;
        } else {
            value = value.split(',').map(item => `${item}`);
        }
    }

    return (
        <ParkTreeSelect
            {...rest}
            disabled={disabled}
            value={value}
            onChange={parkID => {
                if (Array.isArray(parkID)) {
                    parkID = parkID.map(id => id.replace('0_', '').replace('1_', ''));
                }

                if (typeof parkID === 'string') {
                    parkID = parkID.replace('0_', '').replace('1_', '');
                }
                onChange(parkID);
            }}
            enabledParentNode
            treeSelectProps={
                multiple
                    ? {
                          multiple: true,
                          allowClear: true,
                          treeCheckable: true,
                          style: {
                              width: '100%',
                              overflow: 'auto',
                              maxHeight: 180,
                          },
                          placeholder: '点击选择车场',
                      }
                    : {}
            }
        ></ParkTreeSelect>
    );
};

export const FormatRegionSelect = function ({ value, onChange, multiple, disabled, ...rest }) {
    return (
        <RegionTreeSelect
            {...rest}
            disabled={disabled}
            value={value}
            onChange={parkID => {
                if (Array.isArray(parkID)) {
                    parkID = parkID.join(',');
                }
                onChange(parkID);
            }}
            treeSelectProps={
                multiple
                    ? {
                          multiple: true,
                          allowClear: true,
                          treeCheckable: true,
                          style: { width: '100%' },
                          placeholder: '点击选择车场区域',
                      }
                    : {}
            }
        ></RegionTreeSelect>
    );
};

export const PercentInputNumber = function ({ value, onChange, precision, disabled }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputNumber
                disabled={disabled}
                style={{ flex: '1' }}
                min={0}
                max={100}
                precision={typeof precision === 'undefined' ? 2 : precision}
                value={value && value * 100}
                onChange={num => onChange(num / 100)}
            ></InputNumber>
            <span style={{ marginLeft: 10 }}>%</span>
        </div>
    );
};

export const FormatParkTreeWithSwitch = function (props) {
    // 数据前置处理
    /*
     *  数据接收格式（以下为 JSON.parse 后的结构）：
     *  {
     *      parkIDs: string || undefined,
     *      orgIDs: string || undefined,
     *  }
     *
     *
     *  目标格式：
     *  {
     *      checkedValue: number[],
     *      switchValue: string[],
     *  }
     *  或 undefined
     */
    let { value, onChange, ...rest } = props;
    const temp = JSON.parse(value || '{}');

    let parkIDs = undefined;
    if (temp?.parkIDs?.length > 0) {
        parkIDs = temp.parkIDs.split(',')?.map(item => +item);
    }
    let orgIDs = undefined;
    if (temp?.orgIDs?.length > 0) {
        orgIDs = temp.orgIDs.split(',');
    }
    let checkedValue = [...(parkIDs || []), ...(orgIDs || [])];
    let parkIDAndOrgIDs = {
        checkedValue: checkedValue.length > 0 ? checkedValue : undefined,
        switchValue: orgIDs,
    };

    // 传递数据处理
    const handleChange = res => {
        // 组件传递回来的数据中，已勾选数据包含机构ID，需要过滤掉
        let parkIDs = res?.checkedValue?.filter(item => !item.toString().includes('org_')).join(',') || undefined;
        let orgIDs = res?.switchValue?.join(',') || undefined;
        if (parkIDs === undefined && orgIDs === undefined) {
            onChange(undefined);
        } else {
            onChange(
                JSON.stringify({
                    parkIDs,
                    orgIDs,
                })
            );
        }
    };

    return (
        <ParkTreeWithSwitch
            value={parkIDAndOrgIDs}
            onChange={handleChange}
            treeSelectProps={{
                multiple: true,
                allowClear: true,
                showArrow: true,
                treeCheckable: true,
                style: { width: '100%', overflow: 'auto', maxHeight: 150 },
                placeholder: '点击选择车场',
            }}
            {...rest}
        ></ParkTreeWithSwitch>
    );
};

// 渲染数据
export const toReactDOM = (nodeArr, param) => {
    const nodes = [];
    Array.loopItem(nodeArr, (item, index, { parent }) => {
        let node = {};
        const nodeType = item.node?.toLowerCase();
        const props = { ...item.props, ...param };
        if (nodeType === '#text') {
            node = <>{item.value}</>;
        } else if (nodeType === 'icon') {
            node = getIcon(props.type, props);
        } else {
            if (props.hasOwnProperty('style') && typeof props.style !== 'object') {
                console.log('style属性必须是object', props.style);
                props.style = {};
            }
            node = React.createElement(nodeType, props, item.children || props.children);
        }
        if (parent) {
            parent._temp.props?.children?.splice(index, 1, node);
        } else {
            nodes.push(node);
        }
        item._temp = node;
    });
    return nodes;
};

// 将文本解析为DOM
export const renderReact = (text, record, param) => {
    const value = Object.renderRecord(text, record);
    try {
        const nodeArray = String.toNodeArray(value);
        if (Object.isEmpty(nodeArray)) {
            return value;
        }
        return toReactDOM(nodeArray, param);
    } catch (error) {
        return (
            <span title={error} style={{ color: 'red' }}>
                解析失败
            </span>
        );
    }
};

// 事件载体
export const actionEvent = async (action, props, config) => {
    const { index, gIndex, globalObjectProps, reloadFunc, reloadTable, setComponent } = config;
    // loading 如果是在列表内则为数组，并以下标为标记
    if (!action.loading && !isNaN(index)) {
        action.loading = [];
    }
    const objectProps = globalObjectProps || {
        ...props,
        action,
        index,
    };
    // 前置触发，一般用于需要连续调用接口的情况
    if (action.before?.length) {
        for (const actionItem of action.before) {
            // 不填成功消息则默认不提示
            if (!actionItem.successMsg) {
                actionItem.successMsg = false;
            }
            // 不填成功消息则默认不提示
            if (!actionItem.reloadTable) {
                actionItem.reloadTable = false;
            }
            const result = await actionEvent(actionItem, props, config);
            objectProps[actionItem.resultName] = result;
        }
    }
    // 操作的额外参数
    action.param = typeof action.param === 'object' ? action.param : eval(`(${action.param || '{}'})`);
    const actionApi = Object.renderObject(Object.clone(action.api), objectProps);
    const actionParam = Object.renderObject(Object.clone(action.param), objectProps);
    const actionType = Object.renderRecord(action.type, objectProps);
    if (!action.confirm) {
        // 点击事件埋点，非确认类操作
        // 处理数据列名称
        let title = '';
        if (action?.columnType === 'dataIndex' || action?.columnType === 'totalDataIndex') {
            Array.loopItem(props.pageConfig?.columns, item => {
                if (item?.dataIndex === action.dataIndex) {
                    title = item?.title;
                }
            });
        }
        Track.trackButtonClick(`BUTTON_${action?.name || title || action?.dataIndex || ''}`);
    }
    if (actionType === 'action') {
        let result = false;
        try {
            if (isNaN(index)) {
                action.loading = true;
            } else {
                action.loading.push(gIndex || index);
            }
            // 400毫秒后显示loadding状态，防止网络顺畅时按钮发抖
            setTimeout(() => reloadFunc(), 400);
            let hideLoading = null;
            if (action.loadingMessage) {
                hideLoading = message.loading(action.loadingMessage, 10000);
            }
            result = await Request(actionApi, actionParam);
            if (hideLoading) {
                hideLoading();
            }
            if (result?.success) {
                if (action.successMsg !== false) {
                    message.success(Object.renderRecord(action.successMsg, { ...objectProps, response: result }) || '操作成功');
                }
                if (action.reloadTable !== false) {
                    reloadTable(true);
                }
                if (action.reloadAllTabs) {
                    props.reloadAllTabs?.();
                }
                if (action.refreshOrgTree) {
                    props.systemHook?.({ type: ENUM_SYSTEMHOOK.REFRESH_ORGTREE });
                }
                if (action.openLink && result.data) {
                    window.open(result.data);
                }
            } else {
                if (action.errorConfirm) {
                    Modal.warning({
                        content: result.message || '操作失败',
                    });
                    return;
                }
                message.error(result.message || '操作失败');
            }
        } catch {
            message.error('服务繁忙，请稍后再试');
        }
        if (isNaN(index)) {
            action.loading = false;
        } else {
            action.loading.splice(action.loading.indexOf(gIndex || index), 1);
        }
        reloadFunc();
        return result;
    } else if (actionType === 'link') {
        props.openTab(
            action.pathType === 'RightName'
                ? action.path
                : {
                      rightID: Object.renderRecord(`tabpage-${action.path}-${actionParam?.key || ''}-${action.multiple ? Date.now() : ''}`, objectProps),
                      displayName: Object.renderRecord(action.pageTitle, objectProps),
                      ...(action.pathType === 'PageLayout'
                          ? {
                                path: 'PageLayout',
                                pageID: Object.renderRecord(action.path, objectProps),
                            }
                          : {
                                path: Object.renderRecord(action.path, objectProps),
                            }),
                      multiple: action.multiple,
                      showTree: action.showTree,
                      options: props.page?.options,
                      ...action.pageOtherData,
                  },
            {
                ...actionParam,
                reloadTable: () => {
                    reloadTable();
                },
            }
        );
    } else if (actionType === 'modal') {
        const modal = ModalLayout.create({
            ...props,
            action: Object.renderObject(Object.clone(action), objectProps),
            actionParam,
            modalProps: {
                onOk: () => {
                    setTimeout(() => {
                        reloadTable(null, true);
                    });
                },
            },
            getModal: () => modal,
            reloadTable: clearSelection => {
                reloadTable(clearSelection);
            },
            refreshOrgTree: () => {
                props.systemHook?.({ type: ENUM_SYSTEMHOOK.REFRESH_ORGTREE });
            },
        });
    } else if (actionType === 'component') {
        let Component;
        if (action.path === 'PictureSwiper') {
            Component = PictureSwiper;
            actionParam.itemRender = Object.clone(action.param.itemRender);
            actionParam.defaultIndex = Object.clone(action.param.defaultIndex);
        }
        if (Component) {
            setComponent(
                <Component
                    {...objectProps}
                    {...actionParam}
                    reloadTable={clearSelection => {
                        reloadTable(clearSelection);
                    }}
                    onClose={() => setComponent()}
                ></Component>
            );
        } else {
            console.log('不支持的组件', action);
        }
    } else if (actionType === 'execute') {
        Object.renderRecord(action.path, objectProps);
        reloadFunc();
    } else if (actionType === 'url') {
        const url = Object.renderRecord(action.path, objectProps);
        window.open(url);
    } else if (actionType === 'nothing') {
        // 什么也不做
    } else if (!actionType) {
        message.error('未配置操作');
    } else {
        message.error('不支持的操作：' + actionType);
    }
    return true;
};
