import React, { useImperativeHandle, useMemo, useState, useRef } from 'react';
import { Selector, Condition, BreadcrumbOrg, getIcon, ExcelImportBtn } from '@/business';
import { Empty, Popconfirm, Button, Dropdown, Menu, Modal, Tooltip, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import UploadButtonX from './components/upload';
import { ENUM_SELECTOR_RENDER_ORDER } from '@/model/enum';
import { renderReact, actionEvent } from './utils';
import Track from '@/business/track/track';

export default React.forwardRef((props, ref) => {
    console.log('ttdesign pagelayout table');
    const [prop, setProp] = useState();
    const tableRef = useRef();
    const [conditionParam, setConditionParam] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [component, setComponent] = useState();
    const [callbackData, setCallbackData] = useState(); // 通过selector回调拿到的列表数据
    const [controlDisabled, setControlDisabled] = useState({});

    const tableConfig = useMemo(() => {
        if (props.pageConfig) {
            const config = typeof props.pageConfig === 'object' ? { ...props.pageConfig } : eval(`(${props.pageConfig || '{}'})`);
            let param;
            if (typeof config.param === 'object') {
                param = { ...config.param };
            } else {
                param = eval(`(${config.param || '{}'})`);
                config.param = {};
            }
            const propsValue = {
                ...props,
                method: config.method,
                message,
            };
            // 左侧机构树的参数
            if (props.page?.params?.treeParam && props.page.tree?.triggerTreeSelect) {
                if (props.page.params.treeParam.orgID !== undefined) {
                    props.page.tree.triggerTreeSelect(props.page.params.treeParam.orgID);
                } else if (props.page.params.treeParam.parkID !== undefined) {
                    props.page.tree.triggerTreeSelect(props.page.params.treeParam.parkID, 'parkID');
                }
                delete props.page.params.treeParam;
            }
            if (typeof config.table?.rowClassName === 'string') {
                if (config.table.rowClassName.indexOf('function') === 0) {
                    config.table.rowClassName = eval(`(${config.table?.rowClassName})`);
                }
            }
            if (typeof config.paramsFormatter === 'string') {
                if (config.paramsFormatter.indexOf('function') === 0) {
                    config.paramsFormatter = eval(`(${config.paramsFormatter})`);
                }
            }
            // 表格的额外参数
            config.param = Object.renderObject(Object.clone(param), props);
            config.table = Object.renderObject(Object.clone(config.table), props);
            config.api = Object.renderObject(Object.clone(config.api), props);
            delete config.dataSource;
            if (config.data) {
                config.dataSource = Object.renderObject(Object.clone(config.data), props);
                if (Object.isEmpty(config.dataSource)) {
                    config.dataSource = [];
                }
            }

            const actionFunc = async (action, record, index, gIndex, globalObjectProps) => {
                actionEvent(
                    action,
                    {
                        ...propsValue,
                        record,
                        records: selectedRows || [],
                        filter: tableRef.current?.currentValue,
                        callbackData: tableRef.current?.callbackData,
                    },
                    {
                        index,
                        gIndex,
                        globalObjectProps,
                        reloadFunc: () => setProp({ ...prop }),
                        reloadTable: clearSelection =>
                            tableRef.current.reload(() => {
                                setSelectedRows([]);
                                setSelectedRowKeys([]);
                            }, clearSelection),
                        setComponent,
                    }
                );
            };
            // const actionFunc1 = async (action, record, index, gIndex, globalObjectProps) => {
            //     // loading 如果是在列表内则为数组，并以下标为标记
            //     if (!action.loading && !isNaN(index)) {
            //         action.loading = [];
            //     }
            //     const objectProps = globalObjectProps || {
            //         ...props,
            //         record,
            //         records: selectedRows || [],
            //         filter: tableRef.current?.currentValue,
            //         action,
            //         index,
            //     };
            //     // 前置触发，一般用于需要连续调用接口的情况
            //     if (action.before?.length) {
            //         for (const actionItem of action.before) {
            //             // 不填成功消息则默认不提示
            //             if (!actionItem.successMsg) {
            //                 actionItem.successMsg = false;
            //             }
            //             // 不填成功消息则默认不提示
            //             if (!actionItem.reloadTable) {
            //                 actionItem.reloadTable = false;
            //             }
            //             const result = await actionFunc(actionItem, record, index, gIndex, objectProps);
            //             objectProps[actionItem.resultName] = result;
            //         }
            //     }
            //     // 操作的额外参数
            //     action.param = typeof action.param === 'object' ? action.param : eval(`(${action.param || '{}'})`);
            //     const actionParam = Object.renderObject(Object.clone(action.param), objectProps);
            //     if (action.type === 'action') {
            //         let result = false;
            //         try {
            //             if (isNaN(index)) {
            //                 action.loading = true;
            //             } else {
            //                 action.loading.push(gIndex || index);
            //             }
            //             // 400毫秒后显示loadding状态，防止网络顺畅时按钮发抖
            //             setTimeout(() => setProp({ ...prop }), 400);
            //             result = await Request(action.api, actionParam);
            //             if (result?.success) {
            //                 if (action.successMsg !== false) {
            //                     message.success(
            //                         Object.renderRecord(action.successMsg, { ...objectProps, response: result }) ||
            //                             '操作成功'
            //                     );
            //                 }
            //                 if (action.reloadTable !== false) {
            //                     tableRef.current.reload(() => {
            //                         setSelectedRows([]);
            //                         setSelectedRowKeys([]);
            //                     }, true);
            //                 }
            //             } else {
            //                 message.error(result.message || '操作失败');
            //             }
            //         } catch {
            //             message.error('服务繁忙，请稍后再试');
            //         }
            //         if (isNaN(index)) {
            //             action.loading = false;
            //         } else {
            //             action.loading.splice(action.loading.indexOf(gIndex || index), 1);
            //         }
            //         setProp({ ...prop });
            //         return result;
            //     } else if (action.type === 'link') {
            //         props.openTab(
            //             action.pathType === 'RightName'
            //                 ? action.path
            //                 : {
            //                       rightID: Object.renderRecord(
            //                           `tabpage-${action.path}-${actionParam?.key || ''}-${
            //                               action.multiple ? Date.now() : ''
            //                           }`,
            //                           objectProps
            //                       ),
            //                       displayName: Object.renderRecord(action.pageTitle, objectProps),
            //                       ...(action.pathType === 'PageLayout'
            //                           ? {
            //                                 path: 'PageLayout',
            //                                 pageID: Object.renderRecord(action.path, objectProps),
            //                             }
            //                           : {
            //                                 path: Object.renderRecord(action.path, objectProps),
            //                             }),
            //                       multiple: action.multiple,
            //                       showTree: action.showTree,
            //                       options: props.page.options,
            //                   },
            //             {
            //                 ...actionParam,
            //                 reloadTable: () => {
            //                     tableRef.current.reload();
            //                 },
            //             }
            //         );
            //     } else if (action.type === 'modal') {
            //         const modal = ModalLayout.create({
            //             ...props,
            //             record,
            //             records: selectedRows || [],
            //             filter: tableRef.current?.currentValue,
            //             action: Object.renderObject(Object.clone(action), objectProps),
            //             actionParam,
            //             modalProps: {
            //                 onOk: () => {
            //                     setTimeout(() => {
            //                         tableRef.current.reload(null, true);
            //                     });
            //                 },
            //             },
            //             getModal: () => modal,
            //             reloadTable: clearSelection => {
            //                 tableRef.current.reload(() => {
            //                     setSelectedRows([]);
            //                     setSelectedRowKeys([]);
            //                 }, clearSelection);
            //             },
            //         });
            //     } else if (action.type === 'component') {
            //         let Component;
            //         if (action.path === 'PictureSwiper') {
            //             Component = PictureSwiper;
            //             actionParam.itemRender = Object.clone(action.param.itemRender);
            //             actionParam.defaultIndex = Object.clone(action.param.defaultIndex);
            //         }
            //         if (Component) {
            //             setComponent(<Component {...objectProps} {...actionParam}
            //                 reloadTable={clearSelection => {
            //                     tableRef.current.reload(() => {
            //                         setSelectedRows([]);
            //                         setSelectedRowKeys([]);
            //                     }, clearSelection);
            //                 }}
            //                 onClose={() => setComponent()}
            //                 ></Component>);
            //         } else {
            //             console.log('不支持的组件', action);
            //         }
            //     } else if (action.type === 'execute') {
            //         Object.renderRecord(action.path, objectProps);
            //         setProp({ ...prop });
            //     } else if (action.type === 'url') {
            //         const url = Object.renderRecord(action.path, objectProps);
            //         window.open(url);
            //     } else if (action.type === 'nothing') {
            //         // 什么也不做
            //     } else if (!action.type) {
            //         message.error('未配置操作');
            //     } else {
            //         message.error('不支持的操作：' + action.type);
            //     }
            //     return true;
            // };

            if (tableRef.current) {
                tableRef.current.actionFunc = actionFunc;
                tableRef.current.callbackData = callbackData;
            }

            // 需要解析的属性
            const renderColumnsFields = ['name', 'dataIndex', 'filter'];
            function iteretor(columns) {
                return columns.filter(col => {
                    for (const key in col) {
                        if (renderColumnsFields.includes(key)) {
                            col[key] = Object.renderObject(col[key], {
                                ...propsValue,
                                filter: tableRef.current?.currentValue,
                            });
                        }
                        if (col.children && Array.isArray(col.children)) {
                            col.children = iteretor(col.children);
                        }
                    }
                    if (col.hide) {
                        return !Object.renderRecord(col.hide, {
                            ...propsValue,
                            filter: tableRef.current?.currentValue,
                        });
                    }
                    if (col.columnType === 'component') {
                        col.componentChange = (record, value) => {
                            const objectProps = {
                                ...propsValue,
                                record,
                                records: selectedRows || [],
                                filter: tableRef.current?.currentValue,
                                callbackData: tableRef.current?.callbackData,
                                input: value,
                            };
                            const action = Object.renderObject(Object.clone(col.componentAction), objectProps);
                            actionFunc(action, {});
                        };
                    }
                    return true;
                });
            }
            config.columns = iteretor(config.columns);

            // 表格的初始化参数
            if (props.page?.params?.tableInitialValue) {
                for (const key in props.page.params.tableInitialValue) {
                    if (props.page.params.tableInitialValue.hasOwnProperty(key)) {
                        const column = config.columns.find(col => col.dataIndex === key || col.key === key);
                        if (!column?.filter && column?.source) {
                            column.filter = {
                                type: 'items',
                            };
                        }
                        if (column?.filter) {
                            column.filter.initialValue = props.page.params.tableInitialValue[key];
                        }
                    }
                }
            }
            // 表格的默认参数
            if (props.page?.params?.tableDefaultValue) {
                for (const key in props.page.params.tableDefaultValue) {
                    if (props.page.params.tableDefaultValue.hasOwnProperty(key)) {
                        const column = config.columns.find(col => col.dataIndex === key || col.key === key);
                        if (!column?.filter && column?.source) {
                            column.filter = {
                                type: 'items',
                            };
                        }
                        if (column?.filter) {
                            column.filter.defaultValue = props.page.params.tableDefaultValue[key];
                        }
                    }
                }
            }
            let conditionDiv = false;
            if (config.conditionOptions) {
                // const conditionOptions = Object.renderRecord(Object.clone(config.conditionOptions), props);
                const objectProps = {
                    ...propsValue,
                    records: selectedRows || [],
                    filter: tableRef.current?.currentValue,
                    callbackData: tableRef.current?.callbackData,
                };
                let _conditionOptions = Object.clone(config.conditionOptions);
                const conditionOptions = Array.isArray(_conditionOptions)
                    ? _conditionOptions.map(item => ({
                          ...Object.renderObject(Object.clone(item), objectProps),
                      }))
                    : Object.renderRecord(_conditionOptions, objectProps);
                conditionDiv =
                    conditionOptions && conditionOptions.length ? (
                        <Condition
                            layout="less"
                            options={conditionOptions}
                            onChange={_conditionParam => {
                                setConditionParam(_conditionParam);
                            }}
                            style={{ display: 'inline-block' }}
                        ></Condition>
                    ) : (
                        false
                    );
            }
            let buttonDiv = false;
            let importButtonDiv = false;
            // 表格的操作列，并且没有被添加过
            if (config.tableAction) {
                const tableAction = config.tableAction;
                const renderAction = (action, record, index, value, pagination) => {
                    if (!action.loading) {
                        action.loading = [];
                    }
                    let gIndex = index;
                    if (pagination) {
                        gIndex = index + pagination.pageSize * (pagination.current - 1);
                    }
                    const objectProps = {
                        ...propsValue,
                        record,
                        filter: tableRef.current?.currentValue,
                        callbackData: tableRef.current?.callbackData,
                    };
                    let name = renderReact(action.name, objectProps);
                    let label = '';
                    if (action.columnType === 'dataIndex' || action.columnType === 'totalDataIndex') {
                        name = name ?? value ?? record[action.dataIndex];
                        if (action.group) {
                            label = name;
                            name = Object.renderRecord(action.group, objectProps);
                        }
                        if (action.icon) {
                            name = getIcon(action.icon, Object.renderObject(Object.clone(action.iconProps), objectProps));
                        }
                    }
                    let disabled = false;
                    if (action.disabled) {
                        disabled = Object.renderRecord(action.disabled, objectProps);
                    }
                    let DIV = React.Fragment;
                    let tooltip = Object.renderObject(Object.clone(action.tooltip), objectProps) || {};
                    if (action.tooltip) {
                        DIV = Tooltip;
                    }
                    return (
                        <DIV key={action.key || `${action.name}_${action.dataIndex}` || action.path || index} {...tooltip}>
                            {label}
                            {action.confirm && !disabled ? (
                                <Popconfirm
                                    placement="topRight"
                                    title={Object.renderRecord(action.confirmMsg, objectProps)}
                                    onConfirm={() =>
                                        tableRef.current?.actionFunc
                                            ? tableRef.current.actionFunc(action, record, index, gIndex)
                                            : actionFunc(action, record, index, gIndex)
                                    }
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="link" size="small" loading={action.loading.includes(gIndex)} danger={action.danger} onClick={() => Track.trackButtonClick(`BUTTON_${action?.name || action?.dataIndex || ''}`)}>
                                        {name}
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Button
                                    disabled={disabled}
                                    type="link"
                                    size="small"
                                    loading={action.loading.includes(gIndex)}
                                    onClick={() =>
                                        tableRef.current?.actionFunc
                                            ? tableRef.current.actionFunc(action, record, index, gIndex)
                                            : actionFunc(action, record, index, gIndex)
                                    }
                                    danger={action.danger}
                                >
                                    {name}
                                </Button>
                            )}
                        </DIV>
                    );
                };

                // 操作列
                const columnList = tableAction.list
                    .filter(action => action.columnType === 'action')
                    .filter(action => {
                        const objectProps = {
                            ...props,
                            filter: tableRef.current?.currentValue,
                            callbackData: tableRef.current?.callbackData,
                        };
                        action.right = Object.renderRecord(action.right, objectProps);
                        return !action.right || props.hasRight(action.right) || window.hasRight?.(action.right);
                    });
                columnList.forEach(c => (c.group = c.group || ''));
                const columnGroup = Array.uniq(columnList.map(c => c.group));
                columnGroup.forEach(group => {
                    const column = {
                        title: group || '操作',
                        key: 'action-' + group,
                        noTooltip: true,
                        ...columnList.find(c => c.group === group).columnProps,
                        render: (text, record, index, value, pagination) => {
                            const objectProps = {
                                ...propsValue,
                                record,
                                filter: tableRef.current?.currentValue,
                                callbackData: tableRef.current?.callbackData,
                            };
                            return (
                                <div>
                                    {columnList
                                        .filter(c => c.group === group)
                                        .filter(action => {
                                            let show = true;
                                            if (action.showFields?.length) {
                                                show = false;
                                                action.showFields.forEach(field => {
                                                    const value = Object.renderRecord(field.source, objectProps);
                                                    if (field.showIn?.some?.(v => String(v) === String(value))) {
                                                        show = true;
                                                    }
                                                    if (field.between?.length > 1 && value >= field.between[0] && value <= field.between[1]) {
                                                        show = true;
                                                    }
                                                    if (field.hideIn?.some?.(v => String(v) === String(value))) {
                                                        show = false;
                                                    }
                                                });
                                            }
                                            if (action.hide) {
                                                show = !Object.renderRecord(action.hide, objectProps);
                                            }
                                            return show;
                                        })
                                        .map(action => renderAction(action, record, index, value, pagination))}
                                </div>
                            );
                        },
                    };
                    const index = config.columns.findIndex(c => c.key === column.key);
                    if (index > -1) {
                        config.columns.splice(index, 1, column);
                    } else {
                        config.columns.push(column);
                    }
                });

                if (!tableAction._isAddConfigPage) {
                    tableAction._isAddConfigPage = true;
                    // 数据列
                    tableAction.list
                        .filter(action => action.columnType === 'dataIndex')
                        .filter(action => !action.right || props.hasRight(action.right) || window.hasRight?.(action.right))
                        .forEach(action => {
                            // 获取所有列，包括children的子列
                            const allColumnsArray = Array.flatten(config.columns);
                            let column = allColumnsArray.find(col => col.dataIndex === action.dataIndex);
                            if (column) {
                                // if (column.render && !column.render.isConfig) {
                                //     column._oldRender = column.render;
                                // }
                                if (!column.renders) {
                                    column.renders = [];
                                }
                                column.renders.push({
                                    order: ENUM_SELECTOR_RENDER_ORDER.After,
                                    render: (text, record, index, content, pagination) => {
                                        const objectProps = {
                                            ...propsValue,
                                            record,
                                            filter: tableRef.current?.currentValue,
                                            callbackData: tableRef.current?.callbackData,
                                        };
                                        let show = true;
                                        if (action.showFields?.length) {
                                            show = false;
                                            action.showFields.forEach(field => {
                                                const value = Object.renderRecord(field.source, objectProps);
                                                if (field.showIn?.some?.(v => String(v) === String(value))) {
                                                    show = true;
                                                }
                                                if (field.between?.length > 1 && value >= field.between[0] && value <= field.between[1]) {
                                                    show = true;
                                                }
                                                if (field.hideIn?.some?.(v => String(v) === String(value))) {
                                                    show = false;
                                                }
                                            });
                                        }
                                        if (action.hide) {
                                            show = !Object.renderRecord(action.hide, objectProps);
                                        }
                                        const __render = show ? renderAction(action, record, index, content, pagination) : <></>;
                                        if (action.name || action.group || action.icon) {
                                            return (
                                                <>
                                                    {content}
                                                    {__render}
                                                </>
                                            );
                                        }
                                        return __render;
                                    },
                                });
                            }
                        });
                }
                // 总计数据操作        经营报表页面-会员卡办理列使用到
                tableAction.list
                    .filter(action => action.columnType === 'totalDataIndex')
                    .filter(action => !action.right || props.hasRight(action.right) || window.hasRight?.(action.right))
                    .forEach(action => {
                        // 获取所有列，包括children的子列
                        const allColumnsArray = Array.flatten(config.columns);
                        let column = allColumnsArray.find(col => col.dataIndex === action.dataIndex);
                        if (column) {
                            column.totalRender = (text, record) => {
                                const objectProps = {
                                    ...propsValue,
                                    record,
                                    filter: tableRef.current?.currentValue,
                                    callbackData: tableRef.current?.callbackData,
                                };
                                let show = true;
                                if (action.hide) {
                                    show = !Object.renderRecord(action.hide, objectProps);
                                }
                                return show ? renderAction(action, record, undefined, text) : <>{text}</>;
                            };
                        }
                    });
                // 批量操作按钮
                const buttonList = tableAction.list
                    .filter(action => action.columnType === 'buttons' || action.columnType === 'button')
                    .filter(action => !action.right || props.hasRight(action.right) || window.hasRight?.(action.right))
                    .filter(action => {
                        const records = selectedRows || [];
                        const record = {};
                        if (records?.[0]) {
                            for (const key in records[0]) {
                                record[key] = records.map(r => r[key]);
                            }
                        }
                        record.length = records.length;
                        const objectProps = {
                            ...propsValue,
                            record,
                            records,
                            filter: tableRef.current?.currentValue,
                            callbackData: tableRef.current?.callbackData,
                        };
                        let show = true;
                        if (action.showFields?.length) {
                            show = false;
                            action.showFields.forEach(field => {
                                const value = Object.renderRecord(field.source, objectProps);
                                if (field.showIn?.some?.(v => String(v) === String(value))) {
                                    show = true;
                                }
                                if (field.between?.length > 1 && value >= field.between[0] && value <= field.between[1]) {
                                    show = true;
                                }
                                if (field.hideIn?.some?.(v => String(v) === String(value))) {
                                    show = false;
                                }
                            });
                        }
                        if (action.hide) {
                            show = !Object.renderRecord(action.hide, objectProps);
                        }
                        return show;
                    });
                // 过滤出有分组并且分组内按钮数量至少2个的分组
                const buttonGroup = Array.uniq(buttonList.filter(b => b.group && buttonList.filter(b2 => b2.group === b.group).length >= 2).map(b => b.group));
                const buttonSingle = buttonList.filter(b => !b.group || buttonList.filter(b2 => b2.group === b.group).length < 2);
                buttonDiv =
                    buttonSingle.length || buttonGroup.length ? (
                        <>
                            {buttonSingle.map(action => {
                                const records = selectedRows || [];
                                const record = {};
                                if (records?.[0]) {
                                    for (const key in records[0]) {
                                        record[key] = records.map(r => r[key]);
                                    }
                                }
                                record.length = records.length;

                                const objectProps = {
                                    ...propsValue,
                                    record,
                                    records,
                                    filter: tableRef.current?.currentValue,
                                    callbackData: tableRef.current?.callbackData,
                                };
                                let actionObj = Object.clone(action) || {};
                                let disabled = actionObj.columnType === 'buttons' && !selectedRowKeys.length;
                                if (actionObj.columnType === 'buttons' && actionObj.condition) {
                                    let flag = selectedRows.map(item => {
                                        return Object.renderRecord(actionObj.condition, { record: item });
                                    });
                                    if (flag.includes(false)) {
                                        disabled = true;
                                    }
                                }
                                let name = renderReact(actionObj.name, objectProps);
                                let icon;
                                if (actionObj.icon) {
                                    icon = getIcon(actionObj.icon, Object.renderObject(Object.clone(actionObj.iconProps), objectProps));
                                }
                                let DIV = React.Fragment;
                                if (actionObj.tooltip) {
                                    DIV = Tooltip;
                                }
                                if ((actionObj.columnType === 'button' || (actionObj.columnType === 'buttons' && !disabled)) && action.disabled) {
                                    disabled = Object.renderRecord(actionObj.disabled, objectProps);
                                }
                                const button = (
                                    <Button
                                        type="primary"
                                        disabled={disabled || !!controlDisabled[actionObj.controlDisabled?.key]}
                                        loading={actionObj.loading}
                                        icon={icon}
                                        {...actionObj.buttonProps}
                                        {...(!actionObj.confirm
                                            ? {
                                                  onClick: () => {
                                                      if (actionObj.controlDisabled?.key && actionObj.controlDisabled?.time) {
                                                          setControlDisabled(value => ({
                                                              ...value,
                                                              [actionObj.controlDisabled.key]: true,
                                                          }));
                                                          setTimeout(() => {
                                                              setControlDisabled(value => ({
                                                                  ...value,
                                                                  [actionObj.controlDisabled.key]: false,
                                                              }));
                                                          }, actionObj.controlDisabled.time * 1000);
                                                      }
                                                      actionFunc(action, record);
                                                  },
                                              }
                                            : {
                                                  onClick: () => {
                                                      Track.trackButtonClick(`BUTTON_${action?.name || action?.dataIndex || ''}`);
                                                  },
                                              })}
                                    >
                                        {name}
                                    </Button>
                                );
                                return (
                                    <DIV {...actionObj.tooltip}>
                                        {actionObj.confirm && !disabled ? (
                                            <Popconfirm
                                                placement="topRight"
                                                title={Object.renderRecord(action.confirmMsg, objectProps)}
                                                onConfirm={() => actionFunc(action, record)}
                                                okText="确定"
                                                cancelText="取消"
                                                {...actionObj.popconfirmProps}
                                            >
                                                {button}
                                            </Popconfirm>
                                        ) : (
                                            button
                                        )}
                                    </DIV>
                                );
                            })}
                            {buttonGroup.map(group => {
                                const records = selectedRows || [];
                                const record = {};
                                if (records?.[0]) {
                                    for (const key in records[0]) {
                                        record[key] = records.map(r => r[key]);
                                    }
                                }
                                record.length = records.length;

                                const objectProps = {
                                    ...propsValue,
                                    record,
                                    filter: tableRef.current?.currentValue,
                                    callbackData: tableRef.current?.callbackData,
                                };
                                // 组内按钮均为禁用状态时，禁用此按钮组
                                const buttonGroupList = buttonList.filter(b => b.group === group);
                                const disabled =
                                    buttonGroupList.filter(b => {
                                        b._disabled = false;
                                        if (b.columnType === 'buttons' && !selectedRowKeys.length) {
                                            b._disabled = true;
                                        }
                                        if (b.columnType === 'button') {
                                            b._disabled = b.disabled && Object.renderRecord(b.disabled, objectProps);
                                        }
                                        return b._disabled;
                                    }).length === buttonGroupList.length;
                                return (
                                    <Dropdown
                                        disabled={disabled}
                                        overlay={
                                            <Menu>
                                                {buttonList
                                                    .filter(b => b.group === group)
                                                    .map((action, index) => {
                                                        return (
                                                            <Menu.Item
                                                                key={index}
                                                                disabled={action._disabled}
                                                                onClick={() => {
                                                                    action.confirm
                                                                        ? Modal.confirm({
                                                                              content: Object.renderRecord(action.confirmMsg, objectProps),
                                                                              onOk: () => {
                                                                                  return actionFunc(action, record);
                                                                              },
                                                                          })
                                                                        : actionFunc(action, record);
                                                                }}
                                                            >
                                                                {Object.renderRecord(action.name, objectProps)}
                                                            </Menu.Item>
                                                        );
                                                    })}
                                            </Menu>
                                        }
                                    >
                                        <Button>
                                            {group} <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                );
                            })}
                        </>
                    ) : (
                        false
                    );

                // 特殊按钮，导入按钮
                const importButtonList = tableAction.list
                    .filter(action => action.columnType === 'special')
                    .filter(action => !action.right || props.hasRight(action.right) || window.hasRight?.(action.right))
                    .filter(action => {
                        const records = selectedRows || [];
                        const record = {};
                        if (records?.[0]) {
                            for (const key in records[0]) {
                                record[key] = records.map(r => r[key]);
                            }
                        }
                        record.length = records.length;
                        const objectProps = {
                            ...propsValue,
                            record,
                            records,
                            filter: tableRef.current?.currentValue,
                            callbackData: tableRef.current?.callbackData,
                        };
                        let show = true;
                        if (action.showFields?.length) {
                            show = false;
                            action.showFields.forEach(field => {
                                const value = Object.renderRecord(field.source, objectProps);
                                if (field.showIn?.some?.(v => String(v) === String(value))) {
                                    show = true;
                                }
                                if (field.between?.length > 1 && value >= field.between[0] && value <= field.between[1]) {
                                    show = true;
                                }
                                if (field.hideIn?.some?.(v => String(v) === String(value))) {
                                    show = false;
                                }
                            });
                        }
                        if (action.hide) {
                            show = !Object.renderRecord(action.hide, objectProps);
                        }
                        return show;
                    });
                importButtonDiv = importButtonList.length > 0 && (
                    <>
                        {importButtonList.map(action => {
                            const records = selectedRows || [];
                            const record = {};
                            if (records?.[0]) {
                                for (const key in records[0]) {
                                    record[key] = records.map(r => r[key]);
                                }
                            }
                            record.length = records.length;

                            const objectProps = {
                                ...propsValue,
                                record,
                                records,
                                filter: tableRef.current?.currentValue,
                                callbackData: tableRef.current?.callbackData,
                            };
                            let disabled = false;
                            if (action.disabled) {
                                disabled = Object.renderRecord(action.disabled, objectProps);
                            }
                            let actionParam = action.param;
                            if (typeof action.param === 'object') {
                                actionParam = Object.renderObject({ ...action.param }, objectProps);
                            } else {
                                try {
                                    actionParam = Object.renderObject(eval(`(${action.param || '{}'})`), objectProps);
                                } catch {
                                    actionParam = {};
                                    action.formName = action.formName || action.param;
                                }
                            }
                            // return (
                            //     !disabled &&
                            //     (action.type === 'excelImport' ? (
                            //         <ExcelImportBtn {...props} {...action} importParams={actionParam} onOk={() => tableRef.current.reload(null, true)} />
                            //     ) : (
                            //         <UploadButtonX
                            //             {...props}
                            //             {...action}
                            //             param={actionParam}
                            //             buttonText={Object.renderRecord(action.name, objectProps)}
                            //             onSuccess={() => {
                            //                 message.success(Object.renderRecord(action.successMsg, objectProps));
                            //                 tableRef.current.reload(null, true);
                            //             }}
                            //         ></UploadButtonX>
                            //     ))
                            // );
                            return (
                                !disabled &&
                                (props.page.pageID === 'CarContacts' ? (
                                    <ExcelImportBtn
                                        modelId={'car_owner_tpl'}
                                        {...props}
                                        {...action}
                                        importParams={{ ...actionParam, userGroupID: props.user.userGroupID, operatorID: props.user.userID }}
                                        onOk={() => tableRef.current.reload(null, true)}
                                    />
                                ) : action.type === 'excelImport' ? (
                                    <ExcelImportBtn {...props} {...action} importParams={actionParam} onOk={() => tableRef.current.reload(null, true)} />
                                ) : (
                                    <UploadButtonX
                                        {...props}
                                        {...action}
                                        param={actionParam}
                                        buttonText={Object.renderRecord(action.name, objectProps)}
                                        onSuccess={() => {
                                            message.success(Object.renderRecord(action.successMsg, objectProps));
                                            tableRef.current.reload(null, true);
                                        }}
                                    ></UploadButtonX>
                                ))
                            );
                        })}
                    </>
                );
                config.table = {
                    ...config.table,
                    ...(config.tableRowKey
                        ? {
                              rowKey: record => {
                                  const objectProps = {
                                      ...props,
                                      record,
                                      filter: tableRef.current?.currentValue,
                                      callbackData: tableRef.current?.callbackData,
                                  };
                                  return Object.renderRecord(config.tableRowKey, objectProps);
                              },
                          }
                        : {}),
                    ...(tableAction.list
                        .filter(action => action.columnType === 'buttons')
                        .filter(action => {
                            const objectProps = {
                                ...props,
                                filter: tableRef.current?.currentValue,
                                callbackData: tableRef.current?.callbackData,
                            };
                            return !Object.renderRecord(action.hide, objectProps);
                        })
                        .filter(action => !action.right || props.hasRight(action.right) || window.hasRight?.(action.right)).length > 0
                        ? {
                              rowKey: record => {
                                  const objectProps = {
                                      ...props,
                                      record,
                                      filter: tableRef.current?.currentValue,
                                      callbackData: tableRef.current?.callbackData,
                                  };
                                  return Object.renderRecord(config.tableRowKey, objectProps);
                              },
                              rowSelection: {
                                  selectedRowKeys,
                                  onChange: (selectedRowKeys, selectedRows) => {
                                      setSelectedRowKeys(selectedRowKeys);
                                      setSelectedRows(selectedRows);
                                  },
                                  // 当存在批量操作按钮时，禁用某些选项，配置参数【tableRowDisabled】与tableRowKey同级，配置格式同hide内容
                                  // 例如：tableRowDisabled": "[#[5, 6].includes(${record.status})#]", status为5或6时，禁用该行复选框（参考BMAgreementList）
                                  getCheckboxProps: record => ({
                                      disabled: Object.renderRecord(config.tableRowDisabled, {
                                          ...props,
                                          ...propsValue,
                                          record,
                                          filter: tableRef.current?.currentValue,
                                      }),
                                  }),
                              },
                          }
                        : {}),
                };
            }
            if (config.exportParams && tableRef.current) {
                config.exportOptions = Object.renderObject(
                    { ...config.exportParams },
                    {
                        ...propsValue,
                        filter: tableRef.current?.currentValue,
                    }
                );
            }
            if (conditionDiv || buttonDiv || importButtonDiv) {
                config.extraTagAfterFixed = (
                    <div>
                        {conditionDiv}
                        {buttonDiv}
                        {importButtonDiv}
                    </div>
                );
            }
            config.breadCrumb = Object.renderObject(config.breadCrumb, props);
            if (!!config.breadCrumb && !config.breadCrumb.hide) {
                config.extraTagBefore = (
                    <div>
                        <BreadcrumbOrg {...props} {...config.breadCrumb}></BreadcrumbOrg>
                    </div>
                );
            }
            config.param = { ...config.param, ...conditionParam };
            const handleColumns = column => {
                if (typeof column.render === 'string') {
                    if (column.render.indexOf('function') === 0) {
                        column.render = eval(`(${column.render})`);
                    } else {
                        const renderText = column.render;
                        column.render = (text, record) => {
                            return renderReact(renderText, record);
                        };
                    }
                }
                if (typeof column.onCell === 'string') {
                    const renderText = column.onCell;
                    column.onCell = (record, index) => {
                        const objectProps = {
                            ...props,
                            record,
                            index,
                            filter: tableRef.current?.currentValue,
                            callbackData: tableRef.current?.callbackData,
                        };
                        return Object.renderObject(renderText, objectProps);
                    };
                }

                // 列的source.param, source.api解析
                if (column.source) {
                    let param = column.source.param;
                    if (param) {
                        param = typeof param === 'object' ? param : eval(`(${param || '{}'})`);
                        column.source.param = Object.renderObject(param, props);
                    }
                    column.source.api = Object.renderObject(column.source.api, props);
                }

                if (column.children && column.children instanceof Array) {
                    column.children.forEach(handleColumns);
                }
            };
            config.columns.forEach(handleColumns);
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, prop, selectedRowKeys, conditionParam, callbackData, controlDisabled]);

    useImperativeHandle(ref, () => ({
        tableRef,
        resize: () => {
            tableRef.current?.resize && tableRef.current.resize();
        },
        reload: () => {
            tableRef.current?.reload && tableRef.current.reload();
        },
        getFixedExtra: () => {
            return tableRef.current?.getFixedExtra();
        },
        setState: state => {
            setProp({ ...state });
        },
    }));

    const showEmptyText = useMemo(() => {
        let text = null;
        const depStatus = props.page?.data?.depStatus;
        const showTree = props.page?.data?.showTree;
        if (showTree) {
            if (typeof depStatus === 'string') {
                if (!(props.page?.data?.allowPark && props.page?.org?.parkIDs?.length > 0)) {
                    if (props.page?.data?.allowPark) {
                        text = '该组织下没有车场';
                    }
                    // if (props.page?.data?.allowCharge) {
                    //     text = '该组织下没有充电站';
                    // }
                    // if (props.page?.data?.allowEBike) {
                    //     text = '该组织下没有两轮车站点';
                    // }
                    // if (props.page?.data?.allowPark && props.page?.data?.allowCharge) {
                    //     text = '该组织下没有车场和充电站';
                    // }
                }
            } else {
                text =
                    props.page?.showTree && !props.page?.org?.parkIDs?.length && !props.page?.data?.isChargeStation && !props.page?.params?.isChargeStation
                        ? '该组织下没有车场'
                        : null;
            }
        }

        return text;
    }, [props.page?.showTree, props.page?.data, props.page?.org, props.page?.params]);

    return (
        <>
            {showEmptyText ? (
                <Empty style={{ paddingTop: '10%' }} description={showEmptyText} />
            ) : (
                <Selector
                    ref={tableRef}
                    tableID={'PageLayout-' + (props.page?.pageID || props.pageID)}
                    {...props}
                    dataSource={props.dataSource instanceof Array ? props.dataSource : undefined}
                    {...tableConfig}
                    prop={prop}
                    onParentRender={() => props.parent?.current?.setState?.({ now: Date.now() })}
                    callback={data => {
                        setCallbackData(data);
                        props.callback?.(data);
                    }}
                ></Selector>
            )}
            {component}
        </>
    );
});
