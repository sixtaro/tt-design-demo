import React, { Fragment, useEffect, useMemo, useRef, useState, useContext } from 'react';
import { Modal, Checkbox, Row, Col, Typography, Statistic, message } from 'antd';
import { Storage, Request, Utils } from '@/utils';
import { exportTable } from './xlsx';
import './exportExcel.less';
import { ReplaceContext } from '@/utils/replaceProvider';

const { reFixUrl, fixUrl } = Utils;
const ExcelExportModal = props => {
    const {
        columns,
        exportOptions = {},
        lastParams,
        listField,
        totalRecordField,
        page,
        exportOption,
        exportUrl,
        api,
        totalNum,
        useExportJob,
        onExportJob,
        onClose,
        visible,
        showInQueue = true,
        setStatus,
        setExportProcess,
        getExportProcess,
        selectedRowKeys = [],
        selectedRows = [],
        pagination,
        data,
        paramsFormatter,
    } = props;

    const [checkedList, setCheckedList] = useState([]);
    const [exportColumns, setExportColumns] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(true);
    const [loading, setLoading] = useState(false);

    const [selectedOnly, setSelectedOnly] = useState(selectedRowKeys.length > 0);

    const formExport = useRef();

    const totalNumber = useMemo(() => (pagination ? totalNum : data.length), [totalNum, pagination, data]);

    // 隐藏列是否支持导出 默认支持
    const isHiddenColumnCanExport = useMemo(() => window.getConfig?.('isHiddenColumnCanExport') === false ? false : true, []);

    const memberCardText = useContext(ReplaceContext)?.textReplacements?.memberCard || '会员卡';

    useEffect(() => {
        if (visible) {
            setStatus('wait');
            setExportProcess({});
        }
    }, [visible, setStatus, setExportProcess]);

    useEffect(() => {
        const updateColumns = () => {
            let exportColumns = [];
            let checkedColumns = [];
            columns.forEach(column => {
                if (column.children) {
                    column.children.forEach(child => {
                        if (child.dataIndex && (!child.hidden || (isHiddenColumnCanExport && child.hidden))) {
                            child.mergeName = column.titleName || column._title || column.title;
                            !child.noExport && exportColumns.push(child);
                            if (child.defaultExportChecked !== false && !child.noExport && !child.hidden) {
                                checkedColumns.push(child);
                            }
                        }

                        // 后端只加了三级表头情况，前端暂时也不好写成递归
                        if (child.children) {
                            child.children.forEach(c_child => {
                                if (c_child.dataIndex && (!c_child.hidden || (isHiddenColumnCanExport && c_child.hidden))) {
                                    c_child.groupName = child.titleName || child._title || child.title;
                                    c_child.mergeName = column.titleName || column._title || column.title;
                                    !c_child.noExport && exportColumns.push(c_child);
                                    if (c_child.defaultExportChecked !== false && !c_child.noExport && !c_child.hidden) {
                                        checkedColumns.push(c_child);
                                    }
                                }
                            })

                        }
                    });
                } else if (column.dataIndex && (!column.hidden || (isHiddenColumnCanExport && column.hidden))) {
                    !column.noExport && exportColumns.push(column);
                    if (column.defaultExportChecked !== false && !column.noExport && !column.hidden) {
                        checkedColumns.push(column);
                    }
                }
            });
            setExportColumns(exportColumns.filter(item => (item.titleName || item._title || item.title)?.length));
            setCheckedList(checkedColumns);
        };
        updateColumns();
    }, [columns, isHiddenColumnCanExport]);

    useEffect(() => {
        setSelectedOnly(selectedRowKeys.length > 0 && !exportOptions.exportPic);
    }, [selectedRowKeys, exportOptions.exportPic]);

    const onChange = checkedList => {
        setCheckedList(checkedList);
        setIndeterminate(!!checkedList.length && checkedList.length < exportColumns.length);
        setCheckAll(checkedList.length === exportColumns.length);
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? exportColumns : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const handleCancel = () => {
        setLoading(false);
        typeof onClose === 'function' && onClose();
    };

    const handleOk = async () => {
        let showInQueueVar = showInQueue;
        let paramsObj = Object.clone(lastParams);
        if (typeof paramsFormatter === 'function') {
            paramsObj = paramsFormatter(paramsObj);
        }
        for (let key in paramsObj) {
            if (paramsObj[key] === undefined) {
                delete paramsObj[key];
            }
        }
        const headerData = [];
        checkedList.filter(item => item.titleName || item._title || item.title).forEach(item => {
            const isExport = Object.renderRecord(item.export, { ...props });
            if ((item.exportIndex || item.dataIndex) && isExport !== false) {
                //refer说明：
                //格式：
                //{
                //	"format":"场时已有${referText}",//格式化支持${referText},
                //  "column":"",要替换的字段,
                //	"type":"ifnull" //替换的条件 ifnull[字段空时替换],replace[始终替换],append[附加在在字段],appendReferNotNull[关联字段不空才替换]
                //}
                const basicData = (item.noExportFilter ? [] : (item.filter && item.filter.items) || (item.filter && item.filter.cascadeItems) || item.filters || []).map(it => {
                    return { key: it.value, value: it.text };
                });
                const header = {
                    colName: item.exportIndex || item.dataIndex,
                    exportName: item.titleName || item._title || item.title,
                    basicData: basicData,
                    refer: item.refer || {},
                    sum: item.total === true,
                    width: item.width,
                };
                // width是本地导出使用的，接口如果传了不识别的参数会报错。
                if (!selectedOnly) {
                    delete header.width;
                }
                if (item.groupName) {
                    header.groupName = item.groupName;
                }
                if (item.mergeName) {
                    header.mergeName = item.mergeName;
                }
                headerData.push(header);
            }
        });

        let apiUrl = exportUrl || api;
        let requestType = 'get';
        if (typeof apiUrl === 'object') {
            requestType = apiUrl._type || requestType;
            paramsObj = { ...paramsObj, ...(apiUrl._params || {}) };
            apiUrl = apiUrl._url;
        }
        // 导出接口都走PublicV2
        let base = '/PublicV2/';
        // 部分平台的用户登录信息不通用，继续走原来的路径
        let extraSystemIDs = [12, 17];
        if (extraSystemIDs.includes(+window.systemID)) {
            base = window._baseURL;
            showInQueueVar = false;
            // 商家平台走异步导出
            if (+window.systemID === 17) {
                showInQueueVar = true;
            }
        }
        // if (apiUrl.indexOf('../') === 0) {
        //     base = apiUrl.split('../').filter(item => !!item)[0];
        //     base = base.substr(0, base.indexOf('/'));
        //     base = `/${base}/`;
        // }
        // 增加user信息，为了能够兼容外面url不加user登录信息的接口
        var GlobalToken = Storage.get('GlobalToken');
        var user = window._user || Storage.get('user') || {};
        var paramUser = {
            ...(GlobalToken || {}),
            ...window._request_params,
        };
        if (props.getSystemID) {
            // 正常使用云门户的systemID，兼容监管平台云门户中，使用先前的监管平台的systemID（B16029）
            if (props.getSystemID() === 14 || props.getSystemID() === 11) {
                paramUser.systemID = props.getSystemID();
            }
        }
        if (user.userID) {
            paramUser.loginUserID = user.userID;
        }
        if (user.user_id) {
            paramUser.loginUserID = user.user_id;
        }
        if (user.password) {
            paramUser.loginUserPassword = user.password;
        }
        var paramTemp = {
            ...paramsObj,
            ...paramUser,
        };
        paramTemp.offset = 0;
        paramTemp.rows = 999999; //防止接口漏判，导致导出数据缺失
        paramTemp.currentPage = -2;

        if (user.userID) {
            paramTemp.loginUserID = user.userID;
        }
        if (user.password) {
            paramTemp.loginUserPassword = user.password;
        }

        //获取是否有选中参数,进行部分导出
        // if (exportOptions.exportData) {
        //     var selectedRows = this.getSelectedRows();
        //     var exportDataID = exportOptions.exportData; //获取需要筛选的参数字段
        //     var exportDataIDs = [];
        //     Y.Array.each(selectedRows, function (item) {
        //         if (item['' + exportDataID + '']) {
        //             exportDataIDs.push(item['' + exportDataID + '']);
        //         }
        //     });
        //     paramTemp.exportDataIDs = exportDataIDs.join(",");
        // }
        var isHasPage = 1; //是否使用分页
        // if (!this.get("autoPaginationOption")) {
        //     isHasPage = 0;
        // }
        if (!apiUrl.startsWith('http') && !apiUrl.startsWith('//')) {
            if (window._develop) {
                apiUrl = 'http://dev.ttpark.cn/' + window._baseURL + (/\/$/.test(window._baseURL) ? '' : '/') + (apiUrl.startsWith('/') ? apiUrl.substr(1) : apiUrl);
            } else {
                apiUrl = window.location.origin + window._baseURL_prefix + window._baseURL + (/\/$/.test(window._baseURL) ? '' : '/') + (apiUrl.startsWith('/') ? apiUrl.substr(1) : apiUrl);
            }
        }
        var param = {
            exportUrl: requestType === 'get' ? reFixUrl(apiUrl, paramTemp) : reFixUrl(apiUrl, paramUser),
            headerData: JSON.stringify(headerData),
            fileBaseName: exportOptions.exportTitle || (api && api._name) || Object.getValue(page, 'title', ''),
            sheetName: exportOptions.exportTitle || (api && api._name) || Object.getValue(page, 'title', ''),
            hasPage: isHasPage,
            requestType,
        };

        if (window._memberCardText) {
            param.fileBaseName = param.fileBaseName.replace(/会员[卡车](?!管理)/g, window._memberCardText);
            param.sheetName = param.sheetName.replace(/会员[卡车](?!管理)/g, window._memberCardText);
        }

        if (exportOptions.sheetDesc) {
            param.sheetDesc = exportOptions.sheetDesc; // 导出报表描述
        }
        if (user.user_id) {
            param.loginUserID = user.user_id;
        }

        param.exportUrl = fixUrl(param.exportUrl);

        var exportInterface = exportOption ? exportOption : '/excelExportResultInfo';
        var paraData = [];
        if (requestType !== 'get') {
            for (let key in paramsObj) {
                let value = paramsObj[key];
                if (value instanceof Array) {
                    value.forEach(val => {
                        paraData.push({
                            key: key,
                            value: val,
                        });
                    });
                } else {
                    paraData.push({
                        key: key,
                        value: value,
                    });
                }
            }
        }
        param.paraData = JSON.stringify(paraData);
        param.listName = exportOptions.listName || listField;
        param.totalName = exportOptions.exportPic ? '' : exportOptions.totalRecordField || totalRecordField;
        param = {
            ...window._request_params,
            ...param,
        };
        console.log('export param:', param);
        // if (totalNum > threshold || exportOptions.exportPic || useExportJob) {
        // 是否展示在导入导出异步队列，默认为true
        if (selectedOnly) {
            await exportTable({ data: selectedRows, headerData, sheetName: param.sheetName });
            handleCancel();
        } else if (showInQueueVar || useExportJob || exportOptions.exportPic) {
            setLoading(true);
            const result = await Request(
                {
                    // 商家中心走business，其他走home
                    _url: `..${base || window._baseURL}${(+window.systemID) === 17 ? 'business' : 'home'}/submitexportjob`,
                    _type: 'post',
                },
                param
            );
            if (result.success) {
                const jobID = result.data?.jobID;
                getExportProcess(jobID);
                onExportJob();
                handleCancel();
            } else {
                message.error(result.message || '系统繁忙，请稍后重试');
                setExportProcess({});
                setLoading(false);
            }
        } else {
            let form = formExport.current;
            while (form.hasChildNodes()) {
                form.removeChild(form.firstChild);
            }
            for (let key in param) {
                let input = document.createElement('input');
                input.name = key;
                input.value = param[key];
                formExport.current.appendChild(input);
            }
            formExport.current.action = (base || window._baseURL) + exportInterface;
            formExport.current.submit();
            handleCancel();
            // var url = reFixUrl(window._baseURL + exportInterface, param);
            // this.refs.iframeExport.src = url;
        }
    };

    const pageTitle = useMemo(() => {
        return exportOptions?.exportTitle || (api && api._name) || Object.getValue(page, 'title', '');
    }, [exportOptions, api, page]);

    return (
        <div>
            <Modal
                title={`导出${pageTitle ? '-' + pageTitle.replace(/会员[卡车](?!管理)/g, memberCardText) : ''}`}
                visible={visible}
                onOk={handleOk}
                okButtonProps={{
                    disabled: checkedList.length < 2,
                    loading: loading,
                }}
                width={900}
                okText="导出"
                onCancel={handleCancel}
                className="selector-export-excel"
            >
                <div>
                    {exportOptions.exportPic ? (
                        '导出图片时间较长，确定导出吗？'
                    ) : (
                        <Fragment>
                            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    选择所有
                                    {checkedList.length < 2 && '(需至少选择2列)'}
                                </Checkbox>
                            </div>
                            <br />
                            <Checkbox.Group value={checkedList} onChange={onChange} style={{ width: '100%' }}>
                                <Row>
                                    {exportColumns &&
                                        exportColumns.map(column => (
                                            <Col span={6} key={column.exportIndex || column.dataIndex}>
                                                <Typography.Text ellipsis style={{ width: '100%' }}>
                                                    <Checkbox value={column}>
                                                        {/* exportTitleName：解决子表头相同需要显示不同导出文案，但excel中不需要，因为有父级表头 */}
                                                        <span
                                                            title={((column.mergeName && !column.exportTitleName) ? column.mergeName + '-' : '') + ((column.groupName && !column.exportTitleName) ? column.groupName + '-' : '') + (
                                                                column.exportTitleName || column.titleName || column._title || column.title
                                                            )}
                                                        >
                                                            {(column.mergeName && !column.exportTitleName) ? column.mergeName + '-' : ''}
                                                            {(column.groupName && !column.exportTitleName) ? column.groupName + '-' : ''}
                                                            {column.exportTitleName || column.titleName || column._title || column.title}
                                                        </span>
                                                    </Checkbox>
                                                </Typography.Text>
                                            </Col>
                                        ))}
                                </Row>
                            </Checkbox.Group>
                        </Fragment>
                    )}
                    <div className="totalCount">
                        {!exportOptions.exportPic && (
                            <Checkbox disabled={!selectedRowKeys.length || exportOptions?.onlySelected} checked={selectedOnly} onChange={e => setSelectedOnly(e.target.checked)}>
                                仅导出已选数据
                            </Checkbox>
                        )}
                        <span>
                            导出结果数：{!selectedOnly && '约'}
                            <Statistic value={selectedOnly ? selectedRowKeys.length : totalNumber} />条
                        </span>
                        {/* <iframe ref="iframeExport" className="iframe-export" title="export-excel" /> */}
                        <form className="form-export" method="post" ref={formExport} target="_blank"></form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExcelExportModal;
