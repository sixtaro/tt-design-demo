import React, { useImperativeHandle, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    message,
    Radio,
    Checkbox,
    Switch,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
    Modal,
    Collapse,
    Typography,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Request, Utils, Storage } from '@/utils';
import LicencePlateInput from '../licencePlateInput/licencePlateInput';
import LicencePlateInputV2 from '../licencePlateInputV2/licencePlateInputV2';
import { TelWithCode } from '@/business';
import { FormatDatePicker, FormatRangePicker, FormatOrgSelect, FormatNewOrgSelect, FormatParkSelect, PercentInputNumber, FormatRegionSelect, FormatParkTreeWithSwitch } from './utils';
// import ParkTreeWithSwitch from '../parkTreeWithSwitch/parkTreeWithSwitch';
import ModalLayout from './modal';
import moment from 'moment';
import Track from '@/business/track/track';
import './form.less';

const { copyText } = Utils;
const oneColSpanConfig = {
    span: 10,
    offset: 7,
};

export default React.forwardRef((props, ref) => {
    const refForm = useRef();
    const [prop, setProp] = useState();
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState({});
    const allItems = useRef({});
    const [colorOptions, setColorOptions] = useState([])
    const defaultRecord = !!props.pageConfig.getFromRecord ? props.page.params?.record || props.actionParam?.record || props.record : null;

    const loadForm = useCallback(async config => {
        // 从传参的 record 获取
        if (config.getFromRecord) {
            let record = { ...defaultRecord };
            for (let key in record) {
                if (record.hasOwnProperty(key)) {
                    let formItem = config.formItems.filter(item => item.name === key)[0];
                    if (formItem && formItem.specialData && formItem.specialData.hasOwnProperty(record[key] + '')) {
                        record[key] = formItem.specialData[record[key] + ''] + '';
                    } else {
                        record[key] = record[key] || record[key] === 0 ? record[key] + '' : '';
                    }
                }
            }
            setRecord(record);
            refForm.current.setFieldsValue(record);
            return;
        }
        // 从接口获取
        if (config.getApi?._url) {
            const result = await Request(config.getApi, config.param);
            if (result.success) {
                let record = Object.getValue(result.data, config.recordField, {});
                for (let key in record) {
                    if (record.hasOwnProperty(key)) {
                        let formItem = config.formItems.filter(item => item.name === key)[0];
                        if (formItem && formItem.specialData && formItem.specialData.hasOwnProperty(record[key] + '')) {
                            record[key] = formItem.specialData[record[key] + ''] + '';
                        } else {
                            record[key] = record[key] + '';
                        }
                    }
                }
                console.log(record);
                setRecord(record);
                refForm.current.setFieldsValue(record);
            } else {
                message.error(result.message || '读取表单失败');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const isAdd = props.page?.params?.isAdd || props.action?.param?.isAdd;

    const formConfig = useMemo(() => {
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
            config.param = Object.renderObject(Object.clone(param), props);
            config.param = { ...config.param };
            let buttonDiv = false;
            // 表格的操作列，并且没有被添加过
            if (config.formButtons) {
                const formButtons = config.formButtons;

                const checkRelations = params => {
                    let result = config.formItemsRelations.map(item => {
                        switch (item.type) {
                            case 'startEndTime':
                                let start = params[item.keys[0]];
                                let end = params[item.keys[1]];
                                if (moment(start).isAfter(end)) {
                                    message.error(item.message);
                                    return false;
                                }
                                break;
                        }
                        return true;
                    });
                    if (result.includes(false)) {
                        return false;
                    }
                };

                const checkItems = params => {
                    let needCheckItems = allItems.current;
                    for (let key in needCheckItems) {
                        if (needCheckItems.hasOwnProperty(key)) {
                            const items = needCheckItems[key].itemFormat
                                ? Object.renderArray(needCheckItems[key].items, needCheckItems[key].itemFormat, {
                                      ...propsValue,
                                      record,
                                      form: refForm.current?.getFieldsValue?.(),
                                      input: refForm.current?.getFieldsValue?.(),
                                  })
                                : needCheckItems[key].items;
                            let flag = items.filter(item => '' + item.value === '' + params[key]).length;
                            if (flag === 0) {
                                message.error(`${needCheckItems[key].label}目前所选项不存在，请检查！`);
                                return false;
                            }
                        }
                    }
                };

                const actionFunc = async (action, record) => {
                    // 点击事件埋点
                    Track.trackButtonClick(`BUTTON_${action?.name || ''}`);
                    const objectProps = {
                        ...propsValue,
                        record,
                        input: refForm.current?.getFieldsValue?.(),
                    };
                    // 操作的额外参数
                    action.param = typeof action.param === 'object' ? action.param : eval(`(${action.param || '{}'})`);
                    const _actionParam = Object.renderObject(Object.clone(action.param), objectProps);
                    let actionParam = {
                        ..._actionParam['...'],
                    };
                    delete _actionParam['...'];
                    actionParam = {
                        ...actionParam,
                        ..._actionParam,
                    };
                    if (action.type === 'action') {
                        if (action.validate) {
                            try {
                                await refForm.current.validateFields();
                            } catch (error) {
                                console.log(error);
                                message.error('表单校验未通过');
                                return;
                            }
                            if (config.formItemsRelations && config.formItemsRelations.length > 0) {
                                let flag = checkRelations(actionParam);
                                if (flag === false) {
                                    return;
                                }
                            }
                            let itemsFlag = checkItems(actionParam);
                            if (itemsFlag === false) {
                                return;
                            }
                        }
                        try {
                            setLoading(true);
                            const result = await Request(action.api, actionParam);
                            setLoading(false);
                            if (result?.success) {
                                message.success(Object.renderRecord(action.successMsg, objectProps) || '操作成功');

                                if (action.closeForSuccess) {
                                    props.closePage('current', true);
                                } else {
                                    if (!isAdd && formConfig.getApi) {
                                        loadForm(formConfig);
                                    }
                                }
                                props.page?.params?.reloadTable?.();
                                return true;
                            } else {
                                message.error(result.message || '操作失败');
                            }
                        } catch {
                            message.error('服务繁忙，请稍后再试');
                        }
                        return false;
                    } else if (action.type === 'link') {
                        props.openTab(
                            action.pathType === 'RightName'
                                ? action.path
                                : {
                                      rightID: Object.renderRecord(
                                          `tabpage-${action.path}-${actionParam?.key || ''}-${action.multiple ? Date.now() : ''}`,
                                          objectProps
                                      ),
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
                                  },
                            actionParam
                        );
                    } else if (action.type === 'modal') {
                        const modal = ModalLayout.create({
                            ...propsValue,
                            record,
                            input: refForm.current?.getFieldsValue?.(),
                            action,
                            actionParam,
                            modalProps: {
                                onOk: () => {
                                    setTimeout(() => {
                                        if (!isAdd && formConfig.getApi) {
                                            loadForm(formConfig);
                                        }
                                    });
                                },
                            },
                            getModal: () => modal,
                        });
                    } else if (action.type === 'execute') {
                        Object.renderRecord(action.path, objectProps);
                        setProp({ ...prop });
                    } else if (action.type === 'url') {
                        const url = Object.renderRecord(action.path, objectProps);
                        window.open(url);
                    } else if (action.type === 'page-close') {
                        props.closePage('current');
                    } else if (action.type === 'form-reset') {
                        refForm.current?.resetFields?.();
                    } else if (action.type === 'copy-text') {
                        const text = Object.renderRecord(action.copyText, objectProps);
                        if (text) {
                            copyText(text);
                            const successMsg = Object.renderRecord(action.successMsg, objectProps);
                            if (successMsg) {
                                message.info(successMsg);
                            }
                        }
                    } else if (!action.type) {
                        message.error('未配置操作');
                    } else {
                        message.error('不支持的操作：' + action.type);
                    }
                    return true;
                };

                // 按钮
                const buttonList = formButtons
                    .filter(action => !action.right || props.hasRight(action.right))
                    .filter(action => {
                        const objectProps = {
                            ...propsValue,
                            record,
                            input: refForm.current?.getFieldsValue?.(),
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
                                const objectProps = {
                                    ...propsValue,
                                    record,
                                    input: refForm.current?.getFieldsValue?.(),
                                };
                                let disabled;
                                if (action.disabled) {
                                    disabled = Object.renderRecord(action.disabled, objectProps);
                                }
                                const button = (
                                    <Button
                                        type={action.button.type}
                                        danger={action.button.danger}
                                        ghost={action.button.ghost}
                                        disabled={disabled}
                                        loading={loading}
                                        {...(!action.confirm
                                            ? {
                                                  onClick: () => {
                                                      actionFunc(action, record);
                                                  },
                                              }
                                            : {})}
                                    >
                                        {Object.renderRecord(action.name, objectProps)}
                                    </Button>
                                );
                                return action.confirm && !disabled ? (
                                    <Popconfirm
                                        placement="topRight"
                                        title={Object.renderRecord(action.confirmMsg, objectProps)}
                                        onConfirm={() => actionFunc(action, record)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        {button}
                                    </Popconfirm>
                                ) : (
                                    button
                                );
                            })}
                            {buttonGroup.map(group => {
                                const objectProps = {
                                    ...propsValue,
                                    record,
                                    input: refForm.current?.getFieldsValue?.(),
                                };
                                return (
                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                {buttonList
                                                    .filter(b => b.group === group)
                                                    .map((action, index) => {
                                                        return (
                                                            <Menu.Item
                                                                key={index}
                                                                type={action.button.type}
                                                                danger={action.button.danger}
                                                                disabled={action.disabled && Object.renderRecord(action.disabled, objectProps)}
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
            }
            if (buttonDiv) {
                config.buttonDiv = <div className="button-div">{buttonDiv}</div>;
            }
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, prop, loading, record]);

    useEffect(() => {
        if (!isAdd && (formConfig.getApi || defaultRecord || formConfig.record)) {
            loadForm(formConfig);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (formConfig.record) {
            const record = Object.renderObject(Object.clone(formConfig.record), props);
            setRecord(record);
            refForm.current.setFieldsValue(record);
            console.log('setFieldsValue', record);
        }
    }, [formConfig.record, props]);

    const loadItems = async (formItem, formItemConfig) => {
        // 如果有source，则从接口获取并赋值
        if (formItem.source) {
            let param;
            if (typeof formItem.source.param === 'object') {
                param = { ...formItem.source.param };
            } else {
                param = eval(`(${formItem.source.param || '{}'})`);
            }
            param = Object.renderObject(param, props);
            const result = await Request(formItem.source.api, param);
            if (result.success !== false) {
                let items = Object.getValue(result.data || result, formItem.source.field);
                items = formItemConfig.source.map
                    ? Object.renderArray(items, formItemConfig.source.map, {
                          form: refForm.current?.getFieldsValue?.(),
                      })
                    : items;
                formItemConfig.items = items;
                if (
                    formItemConfig.rules &&
                    formItemConfig.rules.filter(item => item.required === true).length > 0 &&
                    !formItemConfig.rules.find(item => item.required === true)?.noCheck
                ) {
                    allItems.current[formItemConfig.name] = formItemConfig;
                }
                setProp(formItem);
            } else {
                console.error(formItem.source);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        formRef: refForm,
        resize: () => {
            console.log('resize0');
        },
        reload: () => {
            console.log('reload');
            if (!isAdd && formConfig.getApi) {
                loadForm(formConfig);
            }
        },
        setState: state => {
            setProp({ ...state });
        },
    }));

    const saveForm = async values => {
        // 点击事件埋点
        Track.trackButtonClick(`BUTTON_保存`);
        setLoading(true);
        const result = await Request(isAdd ? formConfig.addApi : formConfig.saveApi, {
            ...formConfig.param,
            message,
            ...values,
        });
        if (result.success) {
            message.success('保存成功');
            if (isAdd) {
                props.closePage('current');
            }
            props.onModalOk && props.onModalOk();
        } else {
            message.error(result.message || '保存失败');
        }
        setLoading(false);
    };

    // 车牌 接收颜色可选项
    const onColorOptionsChange = (options) => {
        setColorOptions(options);
        // 当前车牌颜色不在可选项中时，需要将表单值重置为可选项中的第一项
        // if (options.length > 0 && !options.includes(+form.getFieldValue('color'))) {
        //     onColorChange(options[0] + '');
        //     form.setFieldValue('color', options[0] + '');
        // }
    }

    //日期 禁止选择之前时间
    const disabledBeforeCurrentDay = current => {
        return current && current < moment().subtract(1, 'day');
    };
    const renderFormItem = formItemConfig => {
        const propsValue = {
            ...props,
            record,
            form: refForm.current?.getFieldsValue?.(),
            input: refForm.current?.getFieldsValue?.(),
            message,
            method: formConfig.method,
        };
        const formItem = Object.renderObject({ ...Object.clone(formItemConfig), filter: undefined }, propsValue);
        if (formItem.hide) {
            return;
        }
        if (formItem.source) {
            if (!formItem.source.refresh && !formItemConfig._source) {
                formItemConfig._source = 'loaded';
                loadItems(formItem, formItemConfig);
            }
            if (formItem.source.refresh && formItemConfig._source !== formItem.source.refresh) {
                formItemConfig._source = formItem.source.refresh;
                loadItems(formItem, formItemConfig);
            }
        }
        if (formItemConfig.filter && formItemConfig.items) {
            formItem.items = formItemConfig.items.filter(item =>
                Object.renderRecord(formItemConfig.filter, { item, form: refForm.current?.getFieldsValue?.() })
            );
        }
        let formItemContent = null;
        const formItemProps = Object.renderObject(formItem.itemProps, propsValue);
        let disabledOnEdit = false;
        if (formItem.disabledOnEdit && !isAdd) {
            disabledOnEdit = true;
        }
        if (formConfig.formProps?.disabled) {
            disabledOnEdit = true;
        }
        switch (formItem.type) {
            case 'input':
                formItemContent = <Input {...formItemProps} disabled={loading || disabledOnEdit} />;
                break;
            case 'textarea':
                formItemContent = <Input.TextArea {...formItemProps} disabled={loading || disabledOnEdit} />;
                break;
            case 'number':
                if (formItem.percent) {
                    formItemContent = (
                        <PercentInputNumber {...formItemProps} precision={formItem.precision} disabled={loading || disabledOnEdit}></PercentInputNumber>
                    );
                } else {
                    formItemContent = <InputNumber {...formItemProps} style={{ width: '100%' }} disabled={loading || disabledOnEdit} />;
                }
                break;
            case 'password':
                formItemContent = <Input.Password {...formItemProps} disabled={loading || disabledOnEdit}></Input.Password>;
                break;
            case 'date':
                formItemContent = (
                    <FormatDatePicker
                        {...formItemProps}
                        showTime={!!formItem.showTime}
                        disabledDate={formItem.disabledBeforeCurrentDay ? disabledBeforeCurrentDay : undefined}
                        style={{ width: '100%' }}
                        disabled={loading || disabledOnEdit}
                    />
                );
                break;
            case 'range-picker':
                formItemContent = <FormatRangePicker {...formItemProps} disabled={loading || disabledOnEdit} />;
                break;
            case 'select':
                let disabledValues = formItem.disabledValues || [];
                const items = formItemConfig.itemFormat ? Object.renderArray(formItem.items, formItemConfig.itemFormat, propsValue) : formItem.items;
                if (formItem.dependency) {
                    if (formItem.dependency === "plate" && colorOptions.length > 0) {
                        let disabledColors = items?.filter(item => !colorOptions.includes(Number(item.value))).map(item => item.value) || [];
                        disabledValues = [...disabledValues, ...disabledColors];
                        if (!colorOptions.includes(Number(propsValue.form?.[formItem.name]))) {
                            setRecord({ ...record, [formItem.name]: colorOptions[0] + ''})
                            refForm.current?.setFieldsValue({
                                [formItem.name]: colorOptions[0] + ''
                            })
                        }
                    }
                }
                formItemContent = (
                    <Select
                        showSearch
                        filterOption={(inputValue, option) => {
                            return option.title.includes(inputValue);
                        }}
                        {...formItemProps}
                        disabled={loading || disabledOnEdit}
                    >
                        {items?.map(item => {
                            let itemValue = item.value;
                            if (formItem.itemValueFormat === 'number') {
                                itemValue = Number(item.value);
                            } else if (formItem.itemValueFormat === 'string') {
                                itemValue = String(item.value);
                            }
                            return (
                                <Select.Option value={itemValue} key={itemValue} title={item.text} disabled={disabledValues.includes(item.value)}>
                                    {item.text}
                                </Select.Option>
                            );
                        })}
                    </Select>
                );
                break;
            case 'radio':
                formItemContent = (
                    <Radio.Group {...formItemProps} disabled={loading || disabledOnEdit}>
                        {formItem.items.map(item => (
                            <Radio value={item.value} key={item.value}>
                                {item.text}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
                break;
            case 'checkbox':
                if (typeof formItem.initialValue === 'string') {
                    formItem.initialValue = formItem.initialValue.split(',');
                }
                formItemContent = (
                    <Checkbox.Group {...formItemProps} disabled={loading || disabledOnEdit}>
                        {formItem.items.map(item => (
                            <Checkbox value={item.value} key={item.value}>
                                {item.text}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
                break;
            case 'switch':
                formItemContent = <Switch {...formItemProps} disabled={loading || disabledOnEdit}></Switch>;
                break;
            case 'licence-plate':
                let color = ''
                if (formItem.dependency) {
                    if (formItem.dependency === "color") {
                        color = propsValue.form?.[formItem.dependency] || '';
                    }
                }
                const SystemConfig = Storage.get('SystemConfig');
                formItemContent = SystemConfig?.useNewLicencePlateInput ? (
                    <LicencePlateInputV2
                        {...formItemProps}
                        plateColorValueFromOutside={Number(color || 1)}
                        type={formItem.licencePlateType || 'input'}
                        disabled={loading || disabledOnEdit}
                        onColorOptionsChange={onColorOptionsChange}
                    ></LicencePlateInputV2>
                ) : (
                    <LicencePlateInput {...formItemProps} disabled={loading || disabledOnEdit}></LicencePlateInput>
                );
                break;
            case 'org-select':
                formItemContent = <FormatOrgSelect {...formItemProps} disabled={loading || disabledOnEdit}></FormatOrgSelect>;
                break;
            case 'new-org-select':
                formItem.initialValue = props.actionParam?.info?.orgID;
                formItemContent = <FormatNewOrgSelect {...formItemProps} {...props} disabled={loading || disabledOnEdit}></FormatNewOrgSelect>;
                break;
            case 'new-org-select-orgdep':
                formItem.initialValue = props.actionParam?.info?.orgID;
                formItemContent = (
                    <FormatNewOrgSelect
                        {...formItemProps}
                        {...props}
                        disabled={loading || disabledOnEdit}
                        disabledFunc={treeNode => treeNode?.attributes?.orgType !== 1}
                    ></FormatNewOrgSelect>
                );
                break;
            case 'park-select':
                formItemContent = <FormatParkSelect {...formItemProps} multiple={formItem.multiple} disabled={loading || disabledOnEdit}></FormatParkSelect>;
                break;
            case 'park-region-select':
                formItemContent = (
                    <FormatRegionSelect {...formItemProps} multiple={formItem.multiple} disabled={loading || disabledOnEdit}></FormatRegionSelect>
                );
                break;
            case 'tel-with-code':
                formItemContent = <TelWithCode {...props} {...formItemProps} disabled={loading || disabledOnEdit}></TelWithCode>;
                break;
            case 'park-tree-with-switch':
                formItemContent = (
                    <FormatParkTreeWithSwitch
                        {...formItemProps}
                        disabled={loading || disabledOnEdit}
                    ></FormatParkTreeWithSwitch>
                );
                break;
            default:
                formItemContent = null;
        }

        const colSpan = formConfig.colSpan;
        let spanConfig = {
            span: 24,
        };

        if (typeof colSpan === 'number' && colSpan > 0) {
            if (colSpan === 1) {
                spanConfig = oneColSpanConfig;
            } else {
                spanConfig = {
                    span: 24 / colSpan,
                };
            }
        } else if (formItem.colSpan) {
            spanConfig = {
                span: formItem.colSpan,
            };
        }

        // 正则处理
        if (formItem.rule?.type === 'pattern') {
            formItem.rule.pattern = new RegExp(formItem.rule.pattern);
        }
        if (formItem.rule?.type === 'phone') {
            formItem.rule.type = 'pattern';
            formItem.rule.pattern = /^1\d{10}$/;
            formItem.rule.message = '不符合手机号码格式';
        }
        if (formItem.rule?.type === 'telWithCode') {
            formItem.rule.type = 'pattern';
            formItem.rule.pattern = Utils.telReg;
            formItem.rule.message = '不符合手机号码格式';
        }
        if (formItem.rule?.type === 'idCard') {
            formItem.rule.type = 'pattern';
            formItem.rule.pattern =
                /(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)|(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/;
            formItem.rule.message = '不符合身份证格式';
        }
        if (formItem.rule?.type === 'email') {
            formItem.rule.type = 'pattern';
            // eslint-disable-next-line no-useless-escape
            formItem.rule.pattern = /^([a-z0-9_\.-]+)@([\da-z\.]+)\.([a-z\.]{2,8})$/g;
            formItem.rule.message = '不符合邮箱格式';
        }
        if (!formItem.rules) {
            formItem.rules = [];
        }
        const rules = [...formItem.rules];
        if (formItem.rule) {
            rules.push(formItem.rule);
        }
        return (
            <Col {...spanConfig} {...formItem.colProps} key={formItem.name}>
                <Form.Item {...formItem} rules={rules}>
                    {formItemContent}
                </Form.Item>
            </Col>
        );
    };
    const groups = useMemo(() => {
        if (!formConfig?.formItems) {
            return [];
        }
        if (formConfig.formItems?.length && formConfig.formItems[0].type !== 'group') {
            return [
                {
                    type: 'group',
                    list: formConfig.formItems,
                },
            ];
        }
        return formConfig.formItems;
    }, [formConfig]);

    return (
        <Form style={formConfig.pageStyle} {...formConfig.formProps} className="layout-form" onValuesChange={setProp} ref={refForm} onFinish={saveForm}>
            <Row className="row-content" gutter={24}>
                {
                    // 非新增，且配置由 record 而不是接口获取时，增加一个隐藏的表单用于存放主键
                    !isAdd && !!formConfig.getFromRecord && (
                        <Form.Item name={formConfig.key} style={{ display: 'none' }}>
                            <Input></Input>
                        </Form.Item>
                    )
                }
                {groups.map((group, index) =>
                    group.type === 'group' && group.title ? (
                        <Collapse
                            {...(group.enabledCollapse ? { defaultActiveKey: ['1'] } : { activeKey: ['1'] })}
                            key={index}
                            expandIconPosition="right"
                            style={{ width: '100%', margin: '10px 20px' }}
                            {...Object.renderObject(Object.clone(group.collapseProps, props))}
                        >
                            <Collapse.Panel
                                header={<Typography.Text {...group.titleProps}>{Object.renderRecord(group.title, props)}</Typography.Text>}
                                key="1"
                                showArrow={!!group.enabledCollapse}
                                {...Object.renderObject(Object.clone(group.collapsePanelProps, props))}
                            >
                                {group.list && group.list.map(renderFormItem)}
                            </Collapse.Panel>
                        </Collapse>
                    ) : (
                        group.list && group.list.map(renderFormItem)
                    )
                )}
            </Row>
            <Row justify="center" className="button-row">
                <Space>
                    {formConfig.buttonDiv
                        ? formConfig.buttonDiv
                        : (formConfig.addApi || formConfig.saveApi) && (
                              <Button type="primary" htmlType="submit" loading={loading}>
                                  保存
                              </Button>
                          )}
                </Space>
            </Row>
        </Form>
    );
});
