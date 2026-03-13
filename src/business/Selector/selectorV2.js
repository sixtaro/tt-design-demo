import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    CloseOutlined,
    ReloadOutlined,
    UploadOutlined,
    ClearOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import anime from 'animejs';
import { sortBy, debounce } from 'lodash';
import { Resizable } from 'react-resizable';
import { Table, Switch, Select, Button, Modal } from '@/components';
import { message, Tag, Tooltip, Typography, Image, Skeleton } from 'antd';
import { Storage, Request } from '@/utils';
import { getIcon } from '@/business';
import ExcelExport from '@/business/excelExport';
import CopyIcon from '@/business/CopyIcon';
import { ENUM_SELECTOR_RENDER_ORDER } from '@/model/enum';
import { Filters, LineWrap, TableConfig, CustomPagination, Empty } from './components';
import './selectorV2.less';

const ResizableTitle = props => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle-space"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false,
            }}
        >
            <th {...restProps} />
        </Resizable>
    );
};
const A = props => <a {...props}>{props.children}</a>;

// iot接口，传参处理
function hasValidValue(value) {
    if (value === undefined || value === null || value === '') {
        return false;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value;
}

function IOTParamsFormatter(params, columns) {
    const resultParams = Object.clone(params);
    const filters = [];
    columns.forEach(item => {
        const value = params[item.dataIndex];
        if (hasValidValue(value)) {
            // 'eq' 'ne' 'gt' 'lt' 'ge' 'le' 'like' 'in' 'between'
            let operator = 'like';
            if (Array.isArray(value)) {
                operator = 'between';
            }
            if (item.filter?.items?.length > 0 || item.source) {
                operator = 'in';
            }

            // 构建filters格式
            filters.push({
                name: item.dataIndex,
                values: Array.isArray(value) ? value : [value],
                operator: operator,
            });
        }
    });
    // 添加filters参数
    filters.forEach((filter, index) => {
        const filterKey = index + 1;
        resultParams[`filters.${filterKey}.name`] = filter.name;
        resultParams[`filters.${filterKey}.operator`] = filter.operator;
        filter.values.forEach((val, valIndex) => {
            resultParams[`filters.${filterKey}.values.${valIndex + 1}`] = val;
        });
    });
    return {
        current_page: params.currentPage,
        page_size: params.rows,
        application_id: window._request_params?.applicationID,
        system_id: window._request_params?.systemID,
        ...resultParams,
    };
}

class Selector extends PureComponent {
    tableRef = React.createRef();

    static propTypes = {
        // 数据集
        data: PropTypes.array,
        // 列
        columns: PropTypes.array.isRequired,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        // table组件的补充属性
        table: PropTypes.object,
        // 表格是否自适应高度
        autoHeight: PropTypes.bool,
        // 表格是否自适应宽度
        autoWidth: PropTypes.bool,
        // 查询参数
        param: PropTypes.object,
        // 接口
        api: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        // 总条数字段
        totalField: PropTypes.string,
        // 列表字段
        listField: PropTypes.string,
        // 加载后的回调
        callback: PropTypes.func,
        //首次加载不需要调用接口
        nocallapi: PropTypes.bool,
        // 不显示操作栏
        noTagGroup: PropTypes.bool,
        // 是否显示已筛选项
        showFilterValue: PropTypes.bool,
        //是否预留二级表头高度
        childrenHeight: PropTypes.bool,
        //是否传入单独导出接口参数
        exportApi: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        //导出参数  exportOptions.onlySelected 是否禁用'仅导出已选数据'按钮
        exportOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        // 是否显示序号
        showSerialNumber: PropTypes.bool,
        // 是否多个字段排序
        moreFieldSorter: PropTypes.bool,
        //是否显示表格动态配置
        showConfig: PropTypes.bool,
        //列表项是否支持配置
        notControl: PropTypes.bool,
        //列表标识（列表配置时用来标识）
        tableID: PropTypes.string,
        //列表首次配置
        isFirstConfig: PropTypes.bool,
        //列表配置重置
        isReset: PropTypes.bool,
        // 父级是否Tabs，并且需要将表格的按钮放到父级的Tabs的Extea里
        hasTabsExtra: PropTypes.bool,
        // 接口请求报错提示是否显示
        hideErrorMessage: PropTypes.bool,
        // 是否显示刷新按钮
        refresh: PropTypes.bool,
        // 刷新后的回调
        onRefresh: PropTypes.func,
        // 根据传参进行一定的格式化操作
        paramsFormatter: PropTypes.func,
        // 固定表格高度
        tableBodyHeight: PropTypes.number,
        // 是否显示重置筛选
        reset: PropTypes.bool,
        // 每次请求前的参数预处理，若返回Table_Request.Abort 则中止请求
        filterParamFunc: PropTypes.func,
        // 表头resize时的columns数据回调，针对子表格宽度的修改，现金扎帐页面使用
        onHeaderCellResize: PropTypes.func,
        // message字段,
        messageField: PropTypes.string,
        // 列配置保存后触发，对于总计行手写时需要拿到配置后的列的顺序，充电营收报表中使用
        handleConfigColumnsChange: PropTypes.func,
        // 接口返回错误时，是否显示弹窗提示
        falseMessageModal: PropTypes.object,
        // tab下的表格绑定一个onchange事件时，因代码中的delete onChange事件导致绑定的事件无法触发，不太清楚delete的原因，暂增加一个参数避免造成其他影响
        isTabTable: PropTypes.bool,
        // 是否是iot接口
        iotApi: PropTypes.bool,
    };

    static defaultProps = {
        columns: [],
        totalField: 'totalNum',
        listField: 'list',
        totalRecordField: 'totalRecord',
        table: {},
        autoHeight: true,
        autoWidth: true,
        enabledExport: true,
        nocallapi: false,
        showFilterValue: true,
        childrenHeight: false,
        showSerialNumber: false,
        moreFieldSorter: false,
        showConfig: false,
        notControl: false,
        hasTabsExtra: false,
        hideErrorMessage: false,
        refresh: true,
        reset: true,
        messageField: 'message',
        falseMessageModal: {},
    };

    static Table_Request = {
        Abort: Symbol('Abort'),
    };

    constructor(props) {
        super(props);
        this.disabledTime = 0;
        this.filtersList = [];
        this.currentValue = {}; //当前筛选状态的值
        this.defaultValue = {}; //当重置时筛选的值
        this.initialValue = {}; //初始化时筛选的值
        this.lastRequestIndex = 0; //防快速点击时的优化
        this.state = {
            data: this.props.data || [],
            pagination:
                this.props.pagination === false
                    ? false
                    : {
                        position: ['topRight'],
                        pageSizeOptions: ['10', '20', '50', '100', '1000'],
                        showQuickJumper: true,
                        showSizeChanger: true,
                        ...this.props.pagination,
                        pageSize: this.getPageSize(),
                    },
            loading: true,
            columns: Object.clone(this.props.columns),
            configColumns: [],
            selectedRowKeys: [],
            activeRowKeys: [],
            tagColumn: {
                key: 'no-one-on-selected',
            },
            totalNum: 0,
            isFirstConfig: true,
            hasTabsExtra: this.props.hasTabsExtra,
            // 是否设置过列宽
            hasColumnsWidth: false,
        };
        this.event = {};
        this.initing = true;
    }

    get hasTotal() {
        const checkTotal = (columns) => {
            for (let item of columns) {
                if (item.total) {
                    return true;
                }
                if (Array.isArray(item.children)) {
                    if (checkTotal(item.children)) {
                        return true;
                    }
                }
            }
            return false;
        };

        return checkTotal(this.state.columns);
    }

    async componentDidMount() {
        this.initing = true;
        await this.initConfig();
    }

    componentWillUnmount() {
        const { timer } = this.state;
        clearTimeout(timer);
        window.removeEventListener('resize', () => this.resize());
    }

    // 获取表格的唯一标识，如果没有传tableID，则通过列和接口地址来生成一个
    getID = () => {
        const { tableID, columns, api } = this.props;
        if (tableID) {
            return tableID;
        }
        const columnStr = columns.map(col => `${col.dataIndex || col.key}-${col.title}`).join(',');
        let apiStr = '';
        if (api) {
            switch (typeof api) {
                case 'string':
                    apiStr = api;
                    break;
                case 'object':
                    apiStr = api._url;
                    break;
                default:
                    apiStr = api;
                    break;
            }
        }
        return `${columnStr}|${apiStr}`;
    };

    // 初始化就需要排序时
    initDefaultSort = () => {
        const defaultSortCol = this.props.columns.find(col => col.defaultSortOrder);
        if (!defaultSortCol) {
            return;
        }
        const order = new Map([['ascend', 'asc'], ['descend', 'desc']]).get(defaultSortCol.defaultSortOrder);
        this.currentValue = {
            ...this.currentValue,
            sortColumn: defaultSortCol.dataIndex || defaultSortCol.key,
            order,
        };
    }

    initRender = async tableArr => {
        setTimeout(() => {
            this.resize();
        });
        window.addEventListener('resize', () => this.resize());

        this.loadingColumn = true;
        await this.getFilterItem(tableArr);
        this.initDefaultSort();

        if (this.props.nocallapi) {
            this.setState({ loading: false });
            if (this.props.dataSource) {
                this.setState({ totalData: this.props.dataSource });
            }
        } else {
            this.load(
                this.setPaginationParam(
                    {
                        ...this.props.param,
                        ...this.defaultValue,
                        ...this.initialValue,
                        ...this.currentValue,
                    },
                    true
                )
            );
        }
        if (this.props.onFirstRender) {
            this.props.onFirstRender({
                ...this.props.param,
                ...this.currentValue,
            });
        }

        this.loadingColumn = false;
    };
    initConfig = async () => {
        let tableArrConfig = [];
        let tableArrJson = [];
        for (let option of tableArrConfig) {
            if (option.configKey === this.props.tableID) {
                tableArrJson = option;
            }
        }
        if (this.props.showConfig) {
            if (!tableArrJson || tableArrJson.length < 1 || this.props.tableConfigVersion !== tableArrJson.configVersion) {
                this.initConfigColumns();
            }
        } else {
            this.initRender();
            this.initing = false;
        }
    };
    initConfigColumns = async () => {
        const { tableID } = this.props;
        let param = {
            configKeys: this.props.tableID,
        };
        // 页面配置接口都走PublicV2
        let columnConfigUrl = `../PublicV2/home/sysconfig/getcolumnconfig`;
        const systemID = this.props.getSystemID?.();
        if (systemID === 12) {
            // 商户平台
            columnConfigUrl = `../tongtongpay/mch/sys-config/get-config-list`;
            param.configType = 1;
            param.configKeyList = this.props.tableID;
        } else if (systemID === 13) {
            // 商户平台管理端
            columnConfigUrl = `../tongtongpay/manager/user/sys-config/get-config-list`;
            param.configType = 1;
            param.configKeyList = this.props.tableID;
        }
        const result = await Request(
            {
                _url: `${columnConfigUrl}?${new Date().getTime()}`,
                // _type: 'post',
            },
            param
        );
        if (result.success) {
            let config = [12, 13].includes(systemID) ? result.data : result.data?.config;
            let currentConfig = config?.filter(item => item.configKey === tableID);
            let currentValue = [];
            if (currentConfig.length < 1) {
                currentValue = Object.clone(this.props.columns);

                // 递归处理列配置，支持任意深度的嵌套结构
                const processColumnsRecursively = (columns) => {
                    return columns.map(item => {
                        // 如果是不可控列，直接返回
                        if (item.notControl) {
                            return item;
                        }

                        // 处理子列
                        if (item.children && item.children.length > 0) {
                            item.children = processColumnsRecursively(item.children);
                        } else if (item.dataIndex && !item.hidden) {
                            // 处理当前列
                            item.checked = true;
                        }

                        return item;
                    });
                };

                // 应用递归处理
                currentValue = processColumnsRecursively(currentValue);
            } else {
                currentValue = JSON.parse(currentConfig[0].configValue);
                // columns.forEach((col, index) => {
                //     if (!col.dataIndex && !col.children) {
                //         return;
                //     }
                //     const find = currentValue.find(c => c.title === col.title);
                //     if (!find) {
                //         col.checked = true;
                //         col.hidden = false;
                //         currentValue.splice(index, 0, col);
                //     }
                //     if (find && col.children) {
                //         if (!find.children) {
                //             find.children = [];
                //         }
                //         col.children.forEach((child, i) => {
                //             if (!find.children.find(c => c.dataIndex === child.dataIndex)) {
                //                 child.checked = true;
                //                 child.hidden = false;
                //                 find.children.splice(i, 0, child);
                //             } else {
                //                 child.hidden = !!find.children.find(c => c.dataIndex === child.dataIndex).hidden;
                //                 child.checked = !child.hidden;
                //             }
                //         });
                //         const _sortArr = Object.clone(find.children);
                //         find.children = Array.intersect('dataIndex', col.children, find.children);
                //         find.children = find.children.sort((a, b) => {
                //             return _sortArr.findIndex(item => item.dataIndex === a.dataIndex) - _sortArr.findIndex(item => item.dataIndex === b.dataIndex)
                //         })
                //     }
                //     if (find && !col.children) {
                //         col.hidden = !!find.hidden;
                //         col.checked = !col.hidden;
                //     }
                // });
                // const _sortArr = Object.clone(currentValue);
                // currentValue = Array.intersect('title', currentValue, columns);
                // currentValue = currentValue.sort((a, b) => {
                //     return _sortArr.findIndex(item => item.dataIndex === a.dataIndex) - _sortArr.findIndex(item => item.dataIndex === b.dataIndex)
                // })
            }
            // currentValue = currentValue.filter(item => !(item.notControl && item.fixed === 'right')).concat(currentValue.filter(item => (item.notControl && item.fixed === 'right')));
            // currentValue.forEach(item => {
            //     if ((item.key === 'action' || item.key?.includes('action-')) && !item.render && item.notControl) {
            //         let propsColumns = this.props.columns;
            //         item.render = propsColumns.find(item2 => (item2.key === 'action' || item2.key?.includes('action-')))?.render;
            //     }
            // });
            // let tableArrConfig = Storage.get('tableArrConfig') || [];
            // tableArrConfig.push({
            //     configKey: tableID,
            //     configVersion: tableConfigVersion,
            //     configValue: currentValue,
            // });
            this.setState({
                configColumns: currentValue,
                isFirstConfig: currentConfig.length > 0 ? false : true,
            });
            this.configColumns = currentValue;
            // Storage.set('tableArrConfig', tableArrConfig);
            this.initRender(currentValue);
            this.props.handleConfigColumnsChange?.(currentValue);

            this.initing = false;
        } else {
            message.warning(result.data.message || '页面配置失败');
            return false;
        }
    };
    getColumnsFilter = value => {
        let filter;
        let render;
        let totalRender;

        // 递归查找列
        const findColumn = (columns, dataIndex) => {
            for (let item of columns) {
                if (item.dataIndex && item.dataIndex === dataIndex) {
                    return item;
                }
                if (item.children && item.children.length > 0) {
                    const found = findColumn(item.children, dataIndex);
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        };

        // 在 this.props.columns 中查找
        const foundColumn = findColumn(this.props.columns, value);
        if (foundColumn) {
            filter = Object.clone(foundColumn.filter);
            render = foundColumn.render;
            totalRender = foundColumn.totalRender;
        }

        return [filter, render, totalRender];
    };
    getConfigColumns = value => {
        let columns = Object.clone(this.props.columns);
        let configColumns = !Object.isEmpty(this.state.configColumns) ? this.state.configColumns : this.configColumns || [];
        if (value) {
            configColumns = value;
        }
        // let newColumns = [];
        if (configColumns?.length > 0) {
            // configColumns.map(item => {
            //     let allChecked = [];
            //     if (item.notControl) {
            //         if (item.children) {
            //             item.children.forEach(child => {
            //                 if (child.dataIndex) {
            //                     let newFilter = this.getColumnsFilter(child.dataIndex);
            //                     if (newFilter[0]) {
            //                         child.filter = Object.clone(newFilter[0]);
            //                     }
            //                     if (newFilter[1]) {
            //                         child.render = newFilter[1];
            //                     }
            //                     if (newFilter[2]) {
            //                         child.totalRender = newFilter[2];
            //                     }
            //                 }
            //             });
            //         } else if (item.dataIndex) {
            //             let newFilter = this.getColumnsFilter(item.dataIndex);
            //             if (newFilter[0]) {
            //                 item.filter = Object.clone(newFilter[0]);
            //             }
            //             if (newFilter[1]) {
            //                 item.render = newFilter[1];
            //             }
            //             if (newFilter[2]) {
            //                 item.totalRender = newFilter[2];
            //             }
            //         }
            //         return item;
            //     } else {
            //         if (item.children) {
            //             item.children.forEach(child => {
            //                 if (child.checked === false) {
            //                     child.hidden = true;
            //                 } else {
            //                     allChecked.push(item);
            //                     child.hidden = false;
            //                     child.checked = true;
            //                 }
            //                 if (child.dataIndex) {
            //                     let newFilter = this.getColumnsFilter(child.dataIndex);
            //                     if (newFilter[0]) {
            //                         child.filter = Object.clone(newFilter[0]);
            //                     }
            //                     if (newFilter[1]) {
            //                         child.render = newFilter[1];
            //                     }
            //                     if (newFilter[2]) {
            //                         child.totalRender = newFilter[2];
            //                     }
            //                 }
            //             });
            //         } else if (item.dataIndex) {
            //             if (item.checked === false) {
            //                 item.hidden = true;
            //             } else {
            //                 allChecked.push(item);
            //                 item.hidden = false;
            //                 item.checked = true;
            //             }
            //             let newFilter = this.getColumnsFilter(item.dataIndex);
            //             if (newFilter[0]) {
            //                 item.filter = Object.clone(newFilter[0]);
            //             }
            //             if (newFilter[1]) {
            //                 item.render = newFilter[1];
            //             }
            //             if (newFilter[2]) {
            //                 item.totalRender = newFilter[2];
            //             }
            //         }
            //     }
            //     if (allChecked.length < 1) {
            //         //所有子节点都没有选中
            //         item.hidden = true;
            //         item.checked = false;
            //     } else {
            //         item.hidden = false;
            //         item.checked = true;
            //     }
            //     return item;
            // });
            // const getColumn = item => {
            //     return this.props.columns.find(it => (item.dataIndex && it.dataIndex === item.dataIndex) || (item.title && it.title === item.title));
            // };

            const findColumn = (column, _level, parentCol) => {
                return Array.loopItem(configColumns, (item, index, { level, parent }) => {
                    if (_level === 0 && level === 0) {
                        if (
                            (column.dataIndex && column.dataIndex === item.dataIndex) ||
                            (column.key && column.key === item.key) ||
                            (column.title && column.title === item.title)
                        ) {
                            return item;
                        }
                    } else if (
                        _level === level &&
                        ((parentCol.title && parentCol.title === parent.title) || (parentCol.dataIndex && parentCol.dataIndex === parent.dataIndex))
                    ) {
                        if (
                            (column.dataIndex && column.dataIndex === item.dataIndex) ||
                            (column.key && column.key === item.key) ||
                            (column.title && column.title === item.title)
                        ) {
                            return item;
                        }
                    }
                });
            };
            // configColumns.forEach(item => {
            //     if (item.checked) {
            //         const col = getColumn(item);
            //         col && newColumns.push(Object.clone(col));
            //     }
            // });

            const processNestedColumns = (columns, parentCol, level) => {
                columns.forEach((child, childIndex) => {
                    const find = findColumn(child, level, parentCol); // 可能需要根据实际层级调整level
                    if (find) {
                        if (find.checked === false) {
                            child.hidden = true;
                        }
                        if (find.checked === true && child.showInColumnConfig) {
                            child.hidden = false;
                        }
                        child.order = find.order;
                    } else {
                        // 解决隐藏列排序时不生效问题，未赋值order导致排序不生效
                        child.originalOrder = childIndex;
                    }

                    // 如果子列还有嵌套的children，递归处理
                    if (child.children) {
                        processNestedColumns(child.children, child, level + 1);
                    }
                });

                // 所有子列被隐藏时，父列也隐藏
                if (columns.length > 0 && columns.filter(c => c.hidden).length === columns.length) {
                    parentCol.hidden = true;
                }
            };

            columns.forEach((column, index) => {
                const find = findColumn(column, 0);
                if (find) {
                    if (find.checked === false) {
                        column.hidden = true;
                    }
                    // 初始时不显示隐藏列(hidden:true)，但列配置中需要显示(showInColumnConfig:true)，后续勾选上，列表需要显示列
                    if (find.checked === true && column.showInColumnConfig) {
                        column.hidden = false;
                    }
                    column.order = find.order;
                } else {
                    // 解决隐藏列排序时不生效问题，未赋值order导致排序不生效
                    column.originalOrder = index;
                }
                if (column.children) {
                    // column.children.sort((a, b) => a.order - b.order);
                    // column.children.sort((a, b) => {
                    //     if (a.order === undefined && b.order === undefined) {
                    //         a.order = -1;
                    //         b.order = -2;
                    //     }
                    //     if (b.order === undefined) {
                    //         b.order = a.order - 1;
                    //     }
                    //     if (a.order === undefined) {
                    //         a.order = column.children[a.originalOrder - 1]?.order;
                    //     }
                    //     return a.order - b.order;
                    // });

                    processNestedColumns(column.children, column, 1);
                }
            });
            // 由于sort对于不同浏览器a,b顺序不同，compareFn需要遵循反对称性，下面排序未遵循，导致排序不一致问题
            // columns.sort((a, b) => {
            //     if (a.order === undefined && b.order === undefined) {
            //         a.order = -1;
            //         b.order = -2;
            //     }
            //     if (b.order === undefined) {
            //         b.order = a.order - 1;
            //     }
            //     if (a.order === undefined) {
            //         a.order = columns[a.originalOrder - 1]?.order;
            //     }
            //     return a.order - b.order;
            // });

            // 排序函数
            // 列配置中有的列放到findedArr数组，并进行order排序
            // 列配置中没有的列(新增或列配置隐藏的列)放到result数组，且位置与原始位置保持一致
            function sortFunction(_columns, level, parent = {}) {
                let result = Array.from(new Array(_columns.length));
                let findedArr = [];
                _columns?.forEach((column, index) => {
                    const find = findColumn(column, level, parent);
                    if (find) {
                        findedArr.push(column);
                    } else {
                        result[index] = column;
                    }
                    if (column.children) {
                        column.children = sortFunction(column.children, level + 1, column);
                    }
                });
                // 未配置过列配置，初始order使用index
                findedArr = findedArr.map((item, index) => ({ ...item, order: item.order || index }));
                findedArr.sort((a, b) => a.order - b.order);
                // result中有undefined，需要填充findedArr
                result.forEach((column, index) => {
                    if (!column) {
                        result[index] = findedArr.shift();
                    }
                });
                // findedArr中有剩余，直接添加到result中
                findedArr.forEach(column => {
                    result.push(column);
                });
                result = result.filter(item => !!item);
                return result;
            }
            columns = sortFunction(columns, 0);
        }
        return columns;
    };
    setPaginationParam = (param, reset) => {
        if (this.state.pagination) {
            const pagination = { ...this.state.pagination };
            Object.assign(param, {
                offset: reset ? 0 : (pagination.current - 1) * pagination.pageSize,
                rows: pagination.pageSize,
                currentPage: reset ? 1 : pagination.current,
            });
        }
        return param;
    };

    setLastRequestIndex = () => {
        let lastRequestIndex = this.lastRequestIndex + 1;
        this.lastRequestIndex = lastRequestIndex;
        return lastRequestIndex;
    };

    // 保存本表格上次使用的每页条数
    savePageSize = pageSize => {
        Storage.set('pageSize:' + this.getID(), pageSize);
    };
    // 获取上次保存的每页条数
    getPageSize = () => {
        const columnsSize = Storage.get('pageSize:' + this.getID()) || this.props.pagination?.pageSize || 20;
        return columnsSize;
    };

    // 保存列宽度配置
    saveColumnsSize = columns => {
        const columnsSize = [];
        Array.loopItem(columns, item => {
            if ((item.key || item.dataIndex) && item.changeWidth) {
                columnsSize.push({
                    dataIndex: item.dataIndex,
                    key: item.key,
                    width: item.changeWidth,
                    calcWidth: item.calcWidth,
                });
            }
        });
        Storage.set('columnsSize:' + this.getID(), columnsSize);
        this.setState({ hasColumnsWidth: true });
    };

    // 通过dataIndex获取列宽
    getColumnWidth = (dataIndex, key) => {
        const columnsSize = Storage.get('columnsSize:' + this.getID()) || [];
        for (const col of columnsSize) {
            if ((dataIndex && col.dataIndex === dataIndex) || (key && col.key === key)) {
                return col.width;
            }
        }
    };

    // 重置列宽
    resizeColumnWidth = () => {
        const { columns } = this.state;
        for (const col of columns) {
            col.width = col.calcWidth;
            if (col.children?.length) {
                for (const child of col.children) {
                    child.width = child.calcWidth;
                }
            }
        }
        Storage.remove('columnsSize:' + this.getID());
        this.setState({ hasColumnsWidth: false, columns: [...columns] });
        this.props.onHeaderCellResize?.([...columns]);
    };

    async getFilterItem(value) {
        const { table } = this.props;
        const columns = this.getConfigColumns(value);
        const hasColumnsWidth = !!Storage.get('columnsSize:' + this.getID())?.length;
        this.currentValue = {};
        this.defaultValue = {};
        this.initialValue = {};
        let defaultValue = {};
        let width = 0;
        let lastIndex;
        if (table.rowSelection) {
            if (table.rowSelection.columnWidth) {
                width += table.rowSelection.columnWidth;
            } else if (table.rowSelection.columnTitle && typeof table.rowSelection.columnTitle === 'string') {
                table.rowSelection.columnWidth = table.rowSelection.columnTitle.length * 15 + 40;
                width += table.rowSelection.columnWidth;
            } else {
                width += 60;
            }
        }
        if (this.props.showSerialNumber) {
            columns.splice(0, 0, {
                title: this.props.serialNumberTitle || '序号',
                key: 'serialNumber',
                width: 70,
                noTooltip: true,
                render: (text, record, index) => {
                    return (this.state.pagination.current - 1) * this.state.pagination.pageSize + index + 1;
                },
            });
        }
        if (table.expandedRowRender) {
            width += 50;
        }

        // 递归处理多级表头
        const processNestedChildren = async (children, parentWidth, columnsArray, parentColumn) => {
            for (let child of children) {
                defaultValue = await this.renderColumn(child, defaultValue, 'datetime');
                if (typeof child.width === 'string' && child.width.endsWith('%')) {
                    child.width = (parseFloat(child.width) * this.refs.selector?.offsetWidth) / 100;
                }
                child.scrollLeft = parentWidth;
                parentColumn.width += child.width;
                child.calcWidth = child.width;
                // 匹配已存储的列配置 matching column config
                if (hasColumnsWidth && this.getColumnWidth(child.dataIndex, child.key)) {
                    child.width = this.getColumnWidth(child.dataIndex, child.key);
                }
                // 列头拖拽控制宽度 Column header drag control width
                const title = child.title;
                // eslint-disable-next-line no-loop-func
                child.onHeaderCell = () => ({
                    width: child.width,
                    onResize: (_, { size }) => {
                        child.width = size.width;
                        child.title = title;
                        child.changeWidth = child.width;
                        this.setState({ columns: [...columnsArray] });
                        this.props.onHeaderCellResize?.([...columnsArray]);
                        const saveColumnsSizeEvent = () => {
                            this.saveColumnsSize(columnsArray);
                            document.removeEventListener('mouseup', saveColumnsSizeEvent);
                        };
                        document.addEventListener('mouseup', saveColumnsSizeEvent);
                    },
                });

                // 如果子列还有嵌套的children，递归处理
                if (child.children) {
                    await processNestedChildren(child.children, parentWidth, columnsArray, parentColumn);
                }
            }
        };

        for (let index in columns) {
            const column = columns[index];
            defaultValue = await this.renderColumn(column, defaultValue);
            if (column.children) {
                column.width = 0;
                await processNestedChildren(column.children, width + column.width, columns, column);
            }
            if (typeof column.width === 'string' && column.width.endsWith('%')) {
                column.width = (parseFloat(column.width) * this.refs.selector?.offsetWidth) / 100;
            }
            column.calcWidth = column.width;
            // 没有子列的情况
            if (!column.children?.length) {
                // 匹配已存储的列配置 matching column config
                if (hasColumnsWidth && this.getColumnWidth(column.dataIndex, column.key)) {
                    column.width = this.getColumnWidth(column.dataIndex, column.key);
                }
                // 列头拖拽控制宽度 Column header drag control width
                const title = column.title;
                // eslint-disable-next-line no-loop-func
                column.onHeaderCell = () => ({
                    width: column.width,
                    onResize: (_, { size }) => {
                        column.width = size.width;
                        column.title = title;
                        column.changeWidth = column.width;
                        columns[index] = column;
                        this.setState({ columns: [...columns] });
                        this.props.onHeaderCellResize?.([...columns]);
                        const saveColumnsSizeEvent = () => {
                            this.saveColumnsSize(columns);
                            document.removeEventListener('mouseup', saveColumnsSizeEvent);
                        };
                        document.addEventListener('mouseup', saveColumnsSizeEvent);
                    },
                });
            }
            column.scrollLeft = width;
            width += column.width;
            if (!column.fixed && !column.solidWidth) {
                lastIndex = index;
            }
        }

        const leftColumns = columns.filter(c => c.fixed === 'left' || c.fixed === true);
        if (leftColumns?.length) {
            leftColumns[leftColumns.length - 1].leftLast = true;
        }
        // 计算右侧固定列的宽度
        let widthRight = 0;
        const rightColumns = columns.filter(c => c.fixed === 'right');
        rightColumns.reverse().forEach((c, i) => {
            if (i === rightColumns.length - 1) {
                c.rightFirst = true;
            }
            c.scrollRight = widthRight;
            widthRight += c.width;
        });
        if (lastIndex !== undefined) {
            // delete columns[lastIndex].width;
            // columns[lastIndex].lastColumn = true;
            // delete columns[lastIndex].calcWidth;
        }
        if (columns[0] && !this.props.table?.rowSelection) {
            columns[0].total = this.props.totalRecordText || '总计';
        }

        // 多字段的排序
        let sort = {};
        if (this.props.moreFieldSorter) {
            let s = columns.filter(item => item.order && item.sorterDefaultIndex);
            let sortList = s.length > 0 ? sortBy(s, item => item.sorterDefaultIndex) : []; // 字段优先级
            sort.sortColumn = [];
            sort.order = [];
            sortList.forEach(item => {
                sort.sortColumn.push(item.dataIndex);
                sort.order.push(item.order);
            });
            sort.sortColumn = sort.sortColumn.length > 0 ? JSON.stringify(sort.sortColumn) : undefined;
            sort.order = sort.order.length > 0 ? JSON.stringify(sort.order) : undefined;
        }
        this.currentValue = Object.extend({}, this.defaultValue, this.initialValue, sort);
        this.setState({ defaultValue, columns, width, lastParams: {}, hasColumnsWidth });
    }

    // 通过dataIndex查找当前列
    findColumn(dataIndex) {
        return Array.loopItem(this.state.columns, (item) => {
            if (dataIndex === item.dataIndex || dataIndex === item.key) {
                return item;
            }
        });
    }
    async renderColumn(column, defaultValue, columnType) {
        let width = 120;
        // 如果是车场名称，默认给个宽度
        if (column.dataIndex === 'parkName' && !column.width) {
            width = 300;
        }
        if (columnType === 'date') {
            width = 150;
        }
        if (columnType === 'datetime') {
            width = 180;
        }
        if (column.total === true) {
            width = 80;
        }
        if (column.filter?.dataIndex && column.filter?.dataIndex !== column.dataIndex) {
            column.field = column.filter.dataIndex;
        } else if (column.source?.dataIndex && column.source?.dataIndex !== column.dataIndex) {
            column.field = column.source.dataIndex;
        } else {
            column.field = column.dataIndex || column.key;
        }

        if (column.defaultValue !== undefined && column.defaultValue !== null) {
            defaultValue[column.field] = column.defaultValue;
            this.defaultValue[column.field] = column.defaultValue;
            column.defaultFilteredValue = column.defaultValue;
        }
        if (column.initialValue !== undefined) {
            this.initialValue[column.field] = column.initialValue;
        }

        const oldRender = column.render;
        const render = (text, record, index) => {
            const filters = (column.filter && column.filter.items) || column.filters || [];
            // 针对多选类型 都需要匹配文本
            const split = column.filter?.split || ',';
            const finder = text =>
                filters.find(data => {
                    if (Array.isArray(data.value)) {
                        return data.value.some(value => {
                            return parseInt(value, 10) === text || parseInt(text, 10) === value || value === text;
                        });
                    } else {
                        return parseInt(data.value, 10) === text || parseInt(text, 10) === data.value || data.value === text;
                    }
                });
            const find = finder(text);
            let value = (find && find.text) || column.otherValue || text;
            let finds = [{ ...find, text: value }];
            if ((filters.length && split && typeof text === 'string') || text instanceof Array) {
                const ids = text instanceof Array ? text : text.split(split);
                finds = ids.map(id => finder(id) || { text: id });
                value = finds.map(find => find.text).join(',');
            }
            value = oldRender ? oldRender(text, record, index, value, this.state.pagination) : value;

            let returnValue = value;

            // key 为 image 的判断是最初进行的一个处理，目前云控制台里配置的时候使用 columnType 来判断
            if (column.key === 'image' || column.columnType === 'image') {
                const customProps = Object.renderObject(Object.clone(column.customProps), { record }) || {};
                let openNew = !customProps.previewInPage;
                // 过去的 open 字段的判断逻辑看起来比较难受，因此更换了新的参数和判断逻辑，此处防止过去有页面使用过 open 这个字段，进行兼容
                if (customProps.open !== undefined) {
                    openNew = customProps.open !== false;
                }
                //
                const getImg = text =>
                    text ? (
                        <div
                            onClick={() => {
                                if (openNew) {
                                    window.open(`${text}`, '_blank');
                                }
                            }}
                            style={{ marginRight: 6 }}
                        >
                            <Image
                                className="selector_column_Image"
                                src={`${text}`}
                                alt={customProps.noAlt ? '' : column.title}
                                height={customProps.height || 30}
                                width={customProps.width || 30}
                                preview={!openNew}
                            />
                        </div>
                    ) : (
                        ''
                    );
                returnValue =
                    customProps.urls?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {customProps.urls.map(url => {
                                if (customProps.fn) {
                                    url = customProps.fn(url);
                                }
                                return getImg(url);
                            })}
                        </div>
                    ) : (
                        getImg(text)
                    );
            } else if (column.renderType === 'Switch') {
                const componentProps = Object.renderObject(Object.clone(column.componentProps), {
                    record,
                    column,
                    value,
                });
                returnValue = <Switch {...componentProps} onChange={checked => column.componentChange(record, checked)} />;
            } else if (column.renderType === 'Select') {
                const componentProps = Object.renderObject(Object.clone(column.componentProps), {
                    record,
                    column,
                    value,
                });
                returnValue = <Select {...componentProps} onChange={checked => column.componentChange(record, checked)}></Select>;
            } else if (column.noTooltip) {
                returnValue = value;
            } else {
                if (filters[0]?.type === 'Tag') {
                    returnValue = finds.map(find => (
                        <Tag color={find.color}>
                            {find.icon ? <span style={{ marginRight: 4 }}>{getIcon(find.icon)}</span> : ''}
                            {find.text}
                        </Tag>
                    ));
                } else if (!column.noTooltip) {
                    returnValue = (
                        <LineWrap
                            enabledHtml={column.enabledHtml}
                            split={column.split}
                            noEllipsis={column.noEllipsis}
                            overlayClassName={column.overlayClassName}
                            tooltipTitleFormatter={column.tooltipTitleFormatter}
                            renderParams={{ text, record, index }}
                            event={this.event}
                            maxLength={column.columnMaxLength}
                        >
                            {value}
                        </LineWrap>
                    );
                }
            }

            // 提供复制快捷图标
            if (column.copyable) {
                column.shouldCellUpdate = () => true;
                returnValue = (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {returnValue}
                        <CopyIcon
                            text={typeof column.copyable === 'string' ? Object.renderRecord(column.copyable, { record, column, value }) : value}
                        ></CopyIcon>
                    </div>
                );
            }
            return returnValue;
        };
        // 如果有source，则从接口获取并赋值
        if (column.source) {
            const param = column.source.param instanceof Function ? column.source.param(column) : column.source.param;
            const result = await Request(column.source.api, param);
            if (result.success !== false) {
                let items = Object.getValue(result.data || result, column.source.field);
                items = column.source.map ? items.map(column.source.map) : items;
                if (column.source.template) {
                    items = items.map(item =>
                        Object.renderObject(Object.clone(column.source.template), {
                            column,
                            item,
                        })
                    );
                }
                if (!column.filter) {
                    column.filter = {};
                }
                if (Array.isArray(column.source.extraItems)) {
                    items = items.concat(column.source.extraItems);
                }
                column.filter.items = items || [];
            } else {
                console.error(column.source);
            }
        }
        if (column.hidden && column.filter) {
            column.filter.clearFilters = deleteFlag => {
                const defaultValue = this.defaultValue[column.field];
                column.filter.value = deleteFlag === 1 ? undefined : defaultValue;
                column.filter.text = deleteFlag === 1 ? undefined : defaultValue;
                this.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                this.filtersList[column.field] = '';
                this.filterChange(this.currentValue);
            };
        }
        if (column.filter) {
            if (column.filter.defaultValue || column.filter.defaultValue === 0) {
                this.defaultValue[column.field] = column.filter.defaultValue instanceof Array ? column.filter.defaultValue : [column.filter.defaultValue];
            }
            if (column.filter.initialValue !== undefined) {
                this.initialValue[column.field] = column.filter.initialValue instanceof Array ? column.filter.initialValue : [column.filter.initialValue];
            }
            column.filter.allowClear = column.filter.allowClear === false ? false : true;
            // 允许清除筛选值的关联筛选属性
            // column.filter.allowClearAssociationFields = [];
            // 允许清除筛选值的关联属性最小数量
            // column.filter.allowClearAssociationMinCount = 1;
            if (column.filter.allowClearAssociationFields?.length) {
                let count = 0;
                if (!Object.isEmpty(column.filter.value)) {
                    count++;
                }
                column.filter.allowClearAssociationFields.forEach(field => {
                    const col = this.findColumn(field);
                    if (col && !Object.isEmpty(col.filter.value)) {
                        count++;
                    }
                });
                column.filter.allowClear = count > column.filter.allowClearAssociationMinCount;
            }
            if (column.filter.type === 'input') {
                Object.assign(column, Filters.getColumnSearchProps(column, this));
                width = 120;
                if (column.filter.defaultValue) {
                    column.filter.value = [column.filter.defaultValue];
                    column.filter.text = [column.filter.defaultValue];
                    column.filter.selectedKeys = column.filter.value;
                    this.defaultValue[column.field] = column.filter.defaultValue;
                }
                if (column.filter.initialValue) {
                    column.filter.value = column.filter.initialValue;
                    column.filter.text = column.filter.initialValue;
                    column.filter.selectedKeys = column.filter.value;
                    this.initialValue[column.field] = column.filter.initialValue;
                }
            }
            if (column.filter.type === 'number') {
                column.filter.value = ['', ''];
                Object.assign(column, Filters.getColumnNumberProps(column, this));
                if (column.filter.defaultValue) {
                    column.filter.value = [...(column.filter.defaultValue || ['', ''])];
                    this.defaultValue[column.field] = column.filter.value;
                    let minNum = column.filter.value[0];
                    let maxNum = column.filter.value[1];
                    if (typeof minNum === 'number' && typeof maxNum === 'number') {
                        if (minNum > maxNum) {
                            column.filter.value[0] = maxNum;
                            column.filter.value[1] = minNum;
                        }
                        column.filter.text = `${column.filter.value[0]}-${column.filter.value[1]}`;
                    } else if (typeof minNum === 'number') {
                        column.filter.text = `≥${minNum}`;
                    } else if (typeof column.filter.value[1] === 'number') {
                        column.filter.text = `≤${maxNum}`;
                    } else {
                        column.filter.text = '';
                    }
                }
                if (column.filter.initialValue) {
                    column.filter.value = [...(column.filter.initialValue || ['', ''])];
                    this.initialValue[column.field] = column.filter.value;
                    let minNum = column.filter.value[0];
                    let maxNum = column.filter.value[1];
                    if (typeof minNum === 'number' && typeof maxNum === 'number') {
                        if (minNum > maxNum) {
                            column.filter.value[0] = maxNum;
                            column.filter.value[1] = minNum;
                        }
                        column.filter.text = `${column.filter.value[0]}-${column.filter.value[1]}`;
                    } else if (typeof minNum === 'number') {
                        column.filter.text = `≥${minNum}`;
                    } else if (typeof column.filter.value[1] === 'number') {
                        column.filter.text = `≤${maxNum}`;
                    } else {
                        column.filter.text = '';
                    }
                    column.filter.selectedKeys = column.filter.value;
                }
                if (column.filter.defaultValue) {
                    column.filter.value = [...(column.filter.defaultValue || ['', ''])];
                    Object.assign(column, Filters.getColumnNumberProps(column, this));
                    this.defaultValue[column.field] = column.filter.value;
                    let minNum = column.filter.value[0];
                    let maxNum = column.filter.value[1];
                    if (typeof minNum === 'number' && typeof maxNum === 'number') {
                        if (minNum > maxNum) {
                            column.filter.value[0] = maxNum;
                            column.filter.value[1] = minNum;
                        }
                        column.filter.text = `${column.filter.value[0]}-${column.filter.value[1]}`;
                    } else if (typeof minNum === 'number') {
                        column.filter.text = `≥${minNum}`;
                    } else if (typeof column.filter.value[1] === 'number') {
                        column.filter.text = `≤${maxNum}`;
                    } else {
                        column.filter.text = '';
                    }
                    column.filter.selectedKeys = column.filter.value;
                }
                width = 80;
            }
            if (column.filter.type === 'date' || column.filter.type === 'months') {
                column.filter.hasTime = column.filter.hasTime === false ? false : true;
                column.filter.hasFilterTime = column.filter.hasTime;
                column.filter.datePeriods =
                    column.filter.datePeriods ||
                    {
                        date: ['currentDay', 'currentWeek', 'currentMonth', 'lastMonth'],
                        months: ['currentMonth', 'lastMonth', 'currentYear', 'lastYear'],
                    }[column.filter.type];
                if (column.filter.defaultValue) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [moment(column.filter.defaultValue[0]), moment(column.filter.defaultValue[1])];
                        }
                    } else {
                        if (column.filter.defaultValue === 'currentDay' && column.filter.datePeriods.includes('today')) {
                            column.filter.defaultValue = 'today';
                        } else if (column.filter.defaultValue === 'today' && column.filter.datePeriods.includes('currentDay')) {
                            column.filter.defaultValue = 'currentDay';
                        }
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }

                    let currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    if (currentValue[0] instanceof Object) {
                        defaultValue = { ...defaultValue, ...currentValue[0] };
                        this.defaultValue = { ...this.defaultValue, ...currentValue[0] };
                    } else {
                        defaultValue[column.field] = currentValue;
                        this.defaultValue[column.field] = currentValue;
                    }
                    column.defaultFilteredValue = currentValue;
                }
                if (column.filter.initialValue) {
                    if (column.filter.initialValue instanceof Array) {
                        if (column.filter.initialValue[0] instanceof moment) {
                            column.filter.value = column.filter.initialValue;
                        } else {
                            column.filter.value = [moment(column.filter.initialValue[0]), moment(column.filter.initialValue[1])];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    if (currentValue[0] instanceof Object) {
                        defaultValue = { ...defaultValue, ...currentValue[0] };
                        this.defaultValue = { ...this.defaultValue, ...currentValue[0] };
                    } else {
                        defaultValue[column.field] = currentValue;
                        this.defaultValue[column.field] = currentValue;
                    }
                    column.defaultFilteredValue = currentValue;
                }
                Object.assign(column, Filters.getColumnDateProps(column, this));

                width = 180;
                if (column.filter.hasTime === false) {
                    width = 150;
                }
                if (column.filter.type === 'months') {
                    column.filter.hasFilterTime = false;
                    width = 120;
                }
            }
            if (column.filter.type === 'day') {
                column.filter.hasTime = false;
                column.filter.hasFilterTime = false;
                column.filter.datePeriods = column.filter.datePeriods || ['today', 'yesterday'];
                if (column.filter.defaultValue) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [moment(column.filter.defaultValue[0]), moment(column.filter.defaultValue[1])];
                        }
                    } else {
                        if (column.filter.defaultValue === 'currentDay' && column.filter.datePeriods.includes('today')) {
                            column.filter.defaultValue = 'today';
                        } else if (column.filter.defaultValue === 'today' && column.filter.datePeriods.includes('currentDay')) {
                            column.filter.defaultValue = 'currentDay';
                        }
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }

                    let currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    if (currentValue[0] instanceof Object) {
                        defaultValue = { ...defaultValue, ...currentValue[0] };
                        this.defaultValue = { ...this.defaultValue, ...currentValue[0] };
                    } else {
                        defaultValue[column.field] = currentValue;
                        this.defaultValue[column.field] = currentValue;
                    }
                    column.defaultFilteredValue = currentValue;
                }
                if (column.filter.initialValue) {
                    if (column.filter.initialValue instanceof Array) {
                        if (column.filter.initialValue[0] instanceof moment) {
                            column.filter.value = column.filter.initialValue;
                        } else {
                            column.filter.value = [moment(column.filter.initialValue[0]), moment(column.filter.initialValue[1])];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.initialValue);
                    if (currentValue[0] instanceof Object) {
                        this.initialValue = { ...this.initialValue, ...currentValue[0] };
                    } else {
                        this.initialValue[column.field] = currentValue;
                    }
                }
                Object.assign(column, Filters.getColumnDayProps(column, this));
                width = 150;
            }
            if (
                column.filter.type === 'week' ||
                column.filter.type === 'month' ||
                column.filter.type === 'year' ||
                column.filter.type === 'quarter' ||
                column.filter.type === 'weeks' ||
                column.filter.type === 'years'
            ) {
                column.filter.hasTime = false;
                column.filter.hasFilterTime = false;
                let str;
                if (column.filter.type === 'weeks' || column.filter.type === 'years') {
                    let strType = column.filter.type.substr(0, column.filter.type.length - 1);
                    str = strType.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
                } else {
                    str = column.filter.type.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
                }
                column.filter.datePeriods = column.filter.datePeriods || ['current' + str, 'last' + str];
                if (column.filter.defaultValue) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [moment(column.filter.defaultValue[0]), moment(column.filter.defaultValue[1])];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }
                    let currentValue;
                    if (column.filter.defaultValue.lastIndexOf('-') === 4) {
                        let currentText;
                        if (column.filter.type === 'week') {
                            currentText = column.filter.defaultValue + '周';
                        } else {
                            currentText = column.filter.defaultValue;
                        }
                        currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue, currentText);
                    } else {
                        currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    }
                    if (currentValue[0] && currentValue[0].lastIndexOf && currentValue[0].lastIndexOf('周') !== -1) {
                        currentValue[0] = currentValue[0].substr(0, currentValue[0].length - 1);
                    }
                    if (currentValue[1] && currentValue[1].lastIndexOf && currentValue[1].lastIndexOf('周') !== -1) {
                        currentValue[1] = currentValue[1].substr(0, currentValue[1].length - 1);
                    }
                    if (currentValue[0] instanceof Object) {
                        defaultValue = { ...defaultValue, ...currentValue[0] };
                        this.defaultValue = { ...this.defaultValue, ...currentValue[0] };
                    } else {
                        defaultValue[column.field] = currentValue;
                        this.defaultValue[column.field] = currentValue;
                    }
                    column.defaultFilteredValue = currentValue;
                }
                if (column.filter.initialValue) {
                    if (column.filter.initialValue instanceof Array) {
                        if (column.filter.initialValue[0] instanceof moment) {
                            column.filter.value = column.filter.initialValue;
                        } else {
                            column.filter.value = [moment(column.filter.initialValue[0]), moment(column.filter.initialValue[1])];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue;
                    if (column.filter.defaultValue.lastIndexOf('-') === 4) {
                        currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue, column.filter.defaultValue + '周');
                    } else {
                        currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    }
                    if (currentValue[0] && currentValue[0].lastIndexOf('周') !== -1) {
                        currentValue[0] = currentValue[0].substr(0, currentValue[0].length - 1);
                    }
                    if (currentValue[1] && currentValue[1].lastIndexOf('周') !== -1) {
                        currentValue[1] = currentValue[1].substr(0, currentValue[1].length - 1);
                    }
                    if (currentValue[0] instanceof Object) {
                        this.initialValue = { ...this.initialValue, ...currentValue[0] };
                    } else {
                        this.initialValue[column.field] = currentValue;
                    }
                }
                if (column.filter.type === 'weeks' || column.filter.type === 'years') {
                    Object.assign(column, Filters.getColumnDateProps(column, this));
                } else {
                    Object.assign(column, Filters.getColumnDayProps(column, this));
                }
                width = 150;
            }

            if (column.filter.type === 'operator') {
                const param = column.filter.param instanceof Function ? column.filter.param(column) : column.filter.param;
                const result = await Request(
                    {
                        _url: '../PublicV2/home/parking/operatelog/tree',
                        _type: 'get',
                        _cache: '10m',
                    },
                    param
                );
                if (column.filter.defaultValue !== undefined) {
                    const defaultValue = Array.isArray(column.filter.defaultValue) ? column.filter.defaultValue : [column.filter.defaultValue];
                    column.filter.selectedKeys = column.filter.value = this.defaultValue[column.field] = defaultValue;
                    let nodes = [];
                    const loop = children => {
                        children.forEach(node => {
                            if (!!defaultValue.find(id => `user_${id}` === node.id)) {
                                nodes.push(node);
                            } else if (node.children && node.children.length > 0) {
                                loop(node.children);
                            }
                        });
                    };
                    loop(result);
                    const userTexts = nodes.map(node => node.text);
                    column.filter.text = column.filter.defaultText = userTexts;
                }
                if (column.filter.initialValue !== undefined) {
                    const initialValue = Array.isArray(column.filter.initialValue) ? column.filter.initialValue : [column.filter.initialValue];
                    column.filter.selectedKeys = column.filter.value = this.initialValue[column.field] = initialValue;
                    let nodes = [];
                    const loop = children => {
                        children.forEach(node => {
                            if (!!initialValue.find(id => `user_${id}` === node.id)) {
                                nodes.push(node);
                            } else if (node.children && node.children.length > 0) {
                                loop(node.children);
                            }
                        });
                    };
                    loop(result);
                    const userTexts = nodes.map(node => node.text);
                    column.filter.text = userTexts;
                }
                const newColumn = await Filters.getColumnOperatorsProps(column, param, this);
                Object.assign(column, newColumn);
                width = 120;
            }
            if (column.filter.type === 'parkTree') {
                const result = await Request(
                    {
                        _url: '../PublicV2/home/group/usergrouporg/orgtree;',
                        _type: 'get',
                        _cache: '10m',
                    },
                    { sysVersion: 4 }
                );
                // const valueType = column.filter.valueType || 0; // 默认值的类型  0-车场  1-组织机构
                const orgCanSelect = column.filter.orgCanSelect || false; // 是否可选机构，可选机构（传参orgID），只选车场（传参parkID）
                if (column.filter.defaultValue !== undefined) {
                    const defaultValue = Array.isArray(column.filter.defaultValue) ? column.filter.defaultValue : [column.filter.defaultValue];
                    column.filter.value = this.defaultValue[column.field] = defaultValue;
                    column.filter.selectedKeys = defaultValue;
                    let nodes = [];
                    const loop = children => {
                        children.forEach(node => {
                            if (
                                !!defaultValue.find(id => (orgCanSelect ? `${id}` === `${node.attributes?.orgID}` : `${id}` === `${node.attributes?.parkID}`))
                            ) {
                                nodes.push(node);
                            } else if (node.children && node.children.length > 0) {
                                loop(node.children);
                            }
                        });
                    };
                    loop(result);
                    const userTexts = nodes.map(node => node.text);
                    column.filter.text = column.filter.defaultText = userTexts;
                }
                if (column.filter.initialValue !== undefined) {
                    const initialValue = Array.isArray(column.filter.initialValue) ? column.filter.initialValue : [column.filter.initialValue];
                    column.filter.value = this.initialValue[column.field] = initialValue;
                    column.filter.selectedKeys = initialValue;
                    let nodes = [];
                    const loop = children => {
                        children.forEach(node => {
                            if (
                                !!initialValue.find(id => (orgCanSelect ? `${id}` === `${node.attributes?.orgID}` : `${id}` === `${node.attributes?.parkID}`))
                            ) {
                                nodes.push(node);
                            } else if (node.children && node.children.length > 0) {
                                loop(node.children);
                            }
                        });
                    };
                    loop(result);
                    const userTexts = nodes.map(node => node.text);
                    column.filter.text = userTexts;
                }
                const newColumn = await Filters.getColumnParkTreeProps(column, this);
                Object.assign(column, newColumn);
                width = 120;
            }
            if (column.filter.type === 'licence-plate') {
                if (column.filter.defaultValue !== undefined) {
                    column.filter.selectedKeys = column.filter.text = column.filter.value = this.defaultValue[column.field] = column.filter.defaultValue;
                }
                if (column.filter.initialValue !== undefined) {
                    column.filter.selectedKeys = column.filter.text = column.filter.value = this.initialValue[column.field] = column.filter.initialValue;
                }
                Object.assign(column, Filters.getColumnLicencePlateProps(column, this));
                width = 110;
            }
            if (column.filter.type === 'district') {
                Object.assign(column, Filters.getColumnDistrict(column, this, this.props.districtProps));
                if (column.filter.defaultValue) {
                    // [{label: '湖北省', value: 11}, {label: '武汉市', value: 1101}]
                    column.filter.value = column.filter.defaultValue?.map?.(item => item.value);
                    column.filter.text = column.filter.defaultValue?.map?.(item => item.label).join('/');
                    column.filter.selectedKeys = column.filter.value;
                    this.defaultValue[column.field] = column.filter.defaultValue;
                }
                if (column.filter.initialValue) {
                    column.filter.value = column.filter.initialValue?.map?.(item => item.value);
                    column.filter.text = column.filter.initialValue?.map?.(item => item.label).join('/');
                    column.filter.selectedKeys = column.filter.value;
                    this.initialValue[column.field] = column.filter.initialValue;
                }
            }
            if (column.filter.type === 'cascade') {
                Object.assign(
                    column,
                    Filters.getColumnCascade(
                        column,
                        this,
                        column.filter.appUID,
                        column.filter.dataSourceUID,
                        column.filter.requestApi,
                        column.filter.requestParam
                    )
                );
                if (column.filter.defaultValue) {
                    column.filter.value = column.filter.defaultValue?.map?.(item => item.value);
                    column.filter.text = column.filter.defaultValue?.map?.(item => item.label).join('/');
                    column.filter.selectedKeys = column.filter.value;
                    this.defaultValue[column.field] = column.filter.defaultValue;
                }
                if (column.filter.initialValue) {
                    column.filter.value = column.filter.initialValue?.map?.(item => item.value);
                    column.filter.text = column.filter.initialValue?.map?.(item => item.label).join('/');
                    column.filter.selectedKeys = column.filter.value;
                    this.initialValue[column.field] = column.filter.initialValue;
                }
            }
            if (column.filter.items) {
                width = 100;
                column.filter.items = column.filters ? column.filter.items.concat(column.filters) : column.filter.items;
                delete column.filters;
                if (column.filter.defaultValue !== undefined && column.filter.defaultValue !== null) {
                    defaultValue[column.field] = column.filter.defaultValue;
                    const defaultItems = column?.filter?.items?.filter?.(
                        i => String(i.value) === String(column.filter.defaultValue) || column.filter.defaultValue.includes?.(i.value)
                    );
                    column.filter.value = defaultItems.map(di => di.value);
                    column.filter.text = defaultItems.map(di => di.text);
                    column.filter.selectedKeys = column.filter.value;
                    column.filter.antdBug = column.filter.defaultValue instanceof Array ? column.filter.defaultValue : [column.filter.defaultValue];
                }
                if (column.filter.initialValue !== undefined) {
                    const defaultItems = column?.filter?.items?.filter?.(
                        i => String(i.value) === String(column.filter.initialValue) || column.filter.initialValue.includes?.(i.value)
                    );
                    column.filter.value = defaultItems.map(di => di.value);
                    column.filter.text = defaultItems.map(di => di.text);
                    column.filter.selectedKeys = column.filter.value;
                    column.filter.antdBug = column.filter.defaultValue instanceof Array ? column.filter.defaultValue : [column.filter.defaultValue];
                }
                if (column.filter.type !== 'none') {
                    Object.assign(column, Filters.getColumnItemsProps(column, this));
                }
            }
            if (column.filter.defaultValue || column.filter.defaultValue === 0) {
                column.defaultFilteredValue = column.filter.defaultValue instanceof Array ? column.filter.defaultValue : [column.filter.defaultValue];
            }
        }
        if (!column.filter && !column.source && !column.sorter) {
            column.ellipsis = true;
        }
        //  else if (typeof column.title === "string") {
        //     const title = column.title;
        //     column.title = () => <span className='ant-table-column-title'>{title}</span>;
        // }
        if (!(column.key === 'action' || column.solidRender)) {
            column.render = render;
        }
        // renders 渲染数组，按顺序先后进行渲染， Before 在渲染之前，Content 渲染， After 在渲染之后，Attach 附加渲染， Finally 最终渲染
        if (column.renders) {
            if (column.render) {
                column.renders.push({
                    order: ENUM_SELECTOR_RENDER_ORDER.Content,
                    render: column.render,
                });
            }
            column.renders.sort((a, b) => a.order - b.order);
            column.render = (text, record, index) => {
                let content;
                for (const r of column.renders) {
                    content = r.render(text, record, index, content, this.state.pagination);
                }
                return content;
            };
        }

        let minWidth = column.title?.length * 14 + 33;
        if (column.filter) {
            minWidth += 16;
        }
        if (column.sorter) {
            minWidth += 20;
        }
        if (column.titleTooltip) {
            let titleTooltip = column.titleTooltip;
            column._title = column.title;
            if (typeof column.titleTooltip === 'string') {
                titleTooltip = {
                    icon: 'QuestionCircleOutlined',
                    content: column.titleTooltip,
                    iconProps: {},
                    tooltipProps: {},
                };
            }
            column.title = (
                <>
                    {column.title}
                    <Tooltip title={titleTooltip.content} {...titleTooltip.tooltipProps}>
                        <span style={{ marginLeft: 2 }}>
                            {getIcon(titleTooltip.icon || 'QuestionCircleOutlined', { className: 'tooltip-icon', ...titleTooltip.iconProps })}
                        </span>
                    </Tooltip>
                </>
            );
            minWidth += 20;
        }
        // 针对奇葩分辨率电脑，修复表格列宽度计算后显示不下的问题
        if (window.devicePixelRatio !== parseInt(window.devicePixelRatio, 10)) {
            minWidth++;
        }
        if (!column.width) {
            column.width = Math.max(width, minWidth);
            column.autoWidth = true;
        }
        column.className = `selector-tag-${column.field} ${column.className}`;
        // column.sortDirections = ["asc", "desc"];
        return defaultValue;
    }

    componentDidUpdate(prevProps) {
        const updateColumns = () => {
            this.setState({ columns: Object.clone(this.props.columns) }, async () => {
                // 若已有在处理的情况下被父组件更新，则在上个请求处理完成后再处理。
                const timer = setInterval(async () => {
                    if (this.loadingColumn) {
                        return;
                    }
                    this.loadingColumn = true;
                    clearInterval(timer);
                    await this.getFilterItem();
                    // 在切换车场的时候清除选中的行
                    this.onRowSelectChange([], [], 'DidUpdate');
                    const lastParams = this.setPaginationParam(
                        {
                            ...this.state.lastParams,
                            ...this.props.param,
                        },
                        true
                    );
                    this.setState({ lastParams });
                    this.fetch(lastParams);
                    this.loadingColumn = false;
                }, 100);
            });
        };
        if (!Object.equal(this.props.columns, prevProps.columns) || this.props.showSerialNumber !== prevProps.showSerialNumber) {
            updateColumns();
        } else if (!Object.equal(this.props.param, prevProps.param)) {
            // 在切换车场的时候清除选中的行
            this.onRowSelectChange([], [], 'DidUpdate');
            // 当非首次请求并且不在请求状态中时，才允许请求
            if (this.state.lastParams && !this.state.loadding) {
                this.fetch(
                    this.setPaginationParam(
                        {
                            ...this.state.lastParams,
                            ...this.props.param,
                        },
                        true
                    )
                );
            }
            // 判断变更的参数
            const changes = Object.changeList(this.props.param, prevProps.param);
            this.state.columns.forEach(column => {
                if (column.changeOf) {
                    if (column.changeOf instanceof Array) {
                        column.changeOf.forEach(change => {
                            if (changes.includes(change)) {
                                this.renderColumn(column);
                            }
                        });
                    } else {
                        if (changes.includes(column.changeOf)) {
                            this.renderColumn(column);
                        }
                    }
                }
            });
        }
        if (!Object.equal(this.props.pagination, prevProps.pagination)) {
            const pagination = this.props.pagination && {
                ...this.state.pagination,
                ...this.props.pagination,
            };
            pagination.pageSize = this.getPageSize();
            this.setState({ pagination });
        }
        // 外部选中数据改变时，执行Change事件
        if (!this.props.inRelateRecord && !Object.equal(this.props.table?.rowSelection?.selectedRowKeys, prevProps.table?.rowSelection?.selectedRowKeys)) {
            this.onRowSelectChange(this.props.table?.rowSelection?.selectedRowKeys || [], [], 'DidUpdate');
        }
    }
    animeExport = () => {
        const center = {
            x: -document.body.clientWidth / 2 + 150,
            y: document.body.clientHeight / 2,
        };
        anime({
            targets: this.refs.exportfile,
            keyframes: [
                {
                    translateX: center.x,
                    translateY: center.y,
                    opacity: 0,
                },
                {
                    translateX: center.x,
                    translateY: center.y,
                    opacity: 1,
                },
                {
                    translateX: 0,
                    translateY: 0,
                    opacity: 0.5,
                },
                {
                    translateX: 0,
                    translateY: 0,
                    opacity: 0,
                },
                {
                    translateX: 0,
                    translateY: -50,
                    opacity: 0,
                },
            ],
            duration: 1800,
            easing: 'easeInOutSine',
        });
    };

    handlePaginationChange = pagination => {
        const { lastParams } = this.state;

        if (!Object.isEmpty(pagination)) {
            let param = {
                ...lastParams,
                offset: (pagination.current - 1) * pagination.pageSize,
                rows: pagination.pageSize,
                currentPage: pagination.current,
                current: pagination.current,
            };
            this.fetch(param, true);
            this.setState({
                pagination,
            });
            this.refs.selector.querySelector('.ant-table-body')?.scrollTo({ top: 0, behavior: 'smooth' });
            if (pagination.pageSize > 0) {
                this.savePageSize(pagination.pageSize);
            }
        }
    };

    handleTableChange = (pagination, filters, sorter) => {
        const { lastParams } = this.state;

        if (Date.now() < this.disabledTime) {
            return;
        }
        // 解决 排序时，order无值（第三次点击），但多传了sortColumn字段的问题
        let sortColumn = sorter.order ? sorter.column?.sorterField || sorter.field : undefined;
        let order = new Map([
            ['ascend', 'asc'],
            ['descend', 'desc'],
            ['', ''],
        ]).get(sorter.order);

        // 多字段排序
        if (this.props.moreFieldSorter) {
            sortColumn = order ? JSON.stringify([sortColumn]) : undefined;
            order = order ? JSON.stringify([order]) : undefined;
        }

        let param = {
            ...lastParams,
            sortColumn: sortColumn,
            order: order,
            ...this.props.param,
        };
        this.currentValue = {
            ...this.currentValue,
            sortColumn: sortColumn,
            order: order,
        };
        // if (!Object.isEmpty(pagination)) {
        //     param = {
        //         ...param,
        //         offset: (pagination.current - 1) * pagination.pageSize,
        //         rows: pagination.pageSize,
        //         currentPage: pagination.current,
        //     };
        // }
        this.fetch(param);
    };

    fetch = async (params = {}, scrollTop) => {
        if (!this.props.api) {
            return;
        }
        this.setState({ loading: true });
        // 不知道当初为什么这么写，暂时注释
        // if (this.state.lastParams) {
        //     for (let key2 in this.state.lastParams) {
        //         if (params[key2] === undefined) {
        //             params[key2] = this.state.lastParams[key2];
        //         }
        //     }
        // }
        params = {
            ...params,
            ...this.currentValue,
        };
        await this.load(params, scrollTop);
    };

    reload = (callback, clear, configColumns) => {
        if (clear) {
            this.setState({ totalData: null, selectedRowKeys: [] });
            // 在reload的时候清除选中的行
            this.onRowSelectChange([], []);
        }
        this.setState({ loading: true }, async () => {
            let { lastParams, columns } = this.state;
            let newColunms = configColumns || columns;
            newColunms.forEach(async column => {
                if (column.source?.reload) {
                    const param = column.source.param instanceof Function ? column.source.param(column) : column.source.param;
                    const result = await Request(column.source.api, param);
                    if (result.success !== false) {
                        let items = Object.getValue(result.data || result, column.source.field);
                        items = column.source.map ? items.map(column.source.map) : items;
                        if (column.source.template) {
                            items = items.map(item =>
                                Object.renderObject(Object.clone(column.source.template), {
                                    column,
                                    item,
                                })
                            );
                        }
                        if (!column.filter) {
                            column.filter = {};
                        }
                        column.filter.items = items || [];
                    } else {
                        console.error(column.source);
                    }
                }
            });
            // await this.getFilterItem();
            await this.load(lastParams);
            callback && callback();
            this.resize();
            this.props.onRefresh?.();
        });
    };

    load = debounce(async (params, scrollTop) => {
        let { totalData, totalNum, selectedRowKeys, columns } = this.state;
        const { rowKey, table, filterParamFunc, hideErrorMessage, paramsFormatter, messageField, falseMessageModal } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        let lastRequest = this.setLastRequestIndex();
        this.setState({ loading: true }, () => {
            this.resize();
        });
        try {
            if (filterParamFunc) {
                params = filterParamFunc(params, columns);
                // 如果返回特定值，则请求终止
                if (params === Selector.Table_Request.Abort) {
                    return;
                }
            }
            this.currentFilter = Object.toStr(this.props.param) + Object.toStr(this.currentValue);
            const currentFilter = this.currentFilter;
            let result;
            let _params = params;
            // iot接口，传参处理
            if (this.props.iotApi) {
                _params = IOTParamsFormatter(params, columns);
            }
            if (typeof paramsFormatter === 'function') {
                _params = paramsFormatter(Object.clone(params));
            }
            this.setState({ lastParams: _params });
            if (this.props.headers) {
                result = await Request(
                    this.props.api,
                    { ..._params },
                    {
                        headers: this.props.headers,
                        transformRequest: [p => JSON.stringify(p)],
                    }
                );
            } else {
                result = await Request(this.props.api, { ..._params });
            }

            // 如果在某种情况下触发了多次请求，为了避免出现因接口响应速度使得返回结果顺序变化，导致出现显示问题，只对最后一次请求所得到的结果做处理
            if (lastRequest !== this.lastRequestIndex) {
                return;
            }
            if (currentFilter !== this.currentFilter) {
                console.log('丢弃过期数据：', currentFilter);
                return;
            }
            if (result.data?.success) {
                result = result.data;
            }
            let totalField = this.props.totalField;
            let listField = this.props.listField;
            let totalRecordField = this.props.totalRecordField;
            if (result.success || result.code === 'Success') {
                if (!result.data) {
                    result.data = {};
                }
                const { pagination } = this.state;
                totalNum = this.props.noDataField ? Object.getValue(result, totalField, 0) : Object.getValue(result.data, totalField, 0);
                if (pagination) {
                    pagination.total = totalNum;
                    pagination.current = params.currentPage;
                }
                let list = this.props.noDataField ? Object.getValue(result, listField, []) : Object.getValue(result.data, listField, []);
                if (typeof this.props.listDataFormatter === 'function') {
                    list = this.props.listDataFormatter(list, result.data);
                }
                const totalRecord = Object.getValue(result.data, totalRecordField, {});
                // 在load该页无数据且不为第一页的情况下，需要重新请求上一页的数据，解决最后一页数据被删除后页码跟展示数据不一致的问题
                let needReloadForEmpty = false;
                if (list.length === 0 && params.currentPage > 1) {
                    pagination.current = params.currentPage = params.currentPage - 1;
                    params.offset = (pagination.current - 1) * pagination.pageSize;
                    needReloadForEmpty = true;
                }
                if (tableRowKey) {
                    if (!pagination || (pagination.current === 1 && this.currentFilter !== this.lastFilter) || !totalData) {
                        totalData = list;
                        // 如果table.rowSelection.selectedRowKeys有值的情况下，以这个值作为初始值
                        selectedRowKeys = this.props.table?.rowSelection?.selectedRowKeys || [];
                    } else {
                        const _totalData = [];
                        _totalData.push(...list);
                        const listKey = list.map(record => (typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey]));
                        totalData.forEach(record => {
                            const key = typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey];
                            if (!listKey.includes(key)) {
                                _totalData.push(record);
                            }
                        });
                        totalData = _totalData;
                    }
                }
                this.lastFilter = this.currentFilter;
                let footer = {};
                // 递归处理列的总计数据
                const processColumnTotals = (columns, footer, totalRecord) => {
                    for (let column of columns) {
                        delete column.filteredValue;
                        if (column.total && totalRecord[column.dataIndex] !== undefined) {
                            footer[column.dataIndex] = totalRecord[column.dataIndex];
                        }
                        // 递归处理子列
                        if (column.children) {
                            processColumnTotals(column.children, footer, totalRecord);
                        }
                    }
                };
                // 使用递归函数处理所有层级的列
                processColumnTotals(this.state.columns, footer, totalRecord);
                // console.log(footer, 1111111)

                // this.props.callback && this.props.callback(result.data);
                this.setState(
                    {
                        loading: false,
                        data: list,
                        totalData,
                        pagination,
                        totalRecord,
                        footer: footer,
                        totalNum,
                        selectedRowKeys,
                    },
                    () => {
                        this.onRowSelectChange(this.state.selectedRowKeys, []);
                        this.props.callback && this.props.callback(result.data);
                        setTimeout(() => {
                            try {
                                const tableDOM = ReactDOM.findDOMNode(this.refs.selector);
                                const tableHeaderDOM = tableDOM.querySelector('.ant-table-header');
                                const tableBodyDOM = tableDOM.querySelector('.ant-table-body');
                                if (tableBodyDOM) {
                                    tableBodyDOM.scrollLeft = tableHeaderDOM.scrollLeft;
                                    scrollTop && (tableBodyDOM.scrollTop = 0);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        });
                        // 重新load
                        if (needReloadForEmpty) {
                            this.reload();
                        }
                    }
                );
            } else {
                if (!hideErrorMessage) {
                    const msg = result[messageField] || '系统繁忙，请稍后重试';
                    // 需要弹窗提示
                    if (Object.isNotEmpty(falseMessageModal) || result.data?.popupPrompt === 1) {
                        // 有校验规则且校验通过 或 无校验规则 或配置了弹窗提示
                        if (!falseMessageModal.reg || new RegExp(falseMessageModal.reg).test(msg) || result.data?.popupPrompt === 1) {
                            const config = {
                                okText: '确定',
                                content: msg,
                                bodyStyle: {
                                    padding: '20px',
                                },
                                ...falseMessageModal,
                            };
                            if (result.data?.popupPromptTitle) {
                                config.title = result.data?.popupPromptTitle;
                            }
                            Modal.info(config);
                        } else {
                            message.error(msg);
                        }
                    } else {
                        message.error(msg);
                    }
                }
                console.log(params, result);
                const { pagination } = this.state;
                if (pagination) {
                    pagination.total = 0;
                    pagination.current = 0;
                }
                // this.props.callback?.(false, result);
                this.setState(
                    {
                        loading: false,
                        data: [],
                        pagination,
                        footer: null,
                        totalNum: 0,
                    },
                    () => {
                        this.props.callback?.(false, result);
                    }
                );
            }
        } catch (ex) {
            console.log(ex);
            !hideErrorMessage && message.error(ex);
        }
    }, 100);

    getCurrentFilter = () => {
        return {
            ...this.props.param,
            ...this.currentValue,
        };
    };

    getColumns = () => {
        return this.props.columns;
    };

    getColumnsLevel = () => {
        const calculateLevel = (columns) => {
            if (!columns || columns.length === 0) {
                return 0;
            }

            let maxLevel = 1;
            for (let column of columns) {
                if (column.children && column.children.length > 0) {
                    const childLevel = calculateLevel(column.children);
                    maxLevel = Math.max(maxLevel, childLevel + 1);
                }
            }

            return maxLevel;
        };

        return calculateLevel(this.state.columns);
    };

    getTotalNum = () => {
        return this.state.totalNum;
    };

    getApi = () => {
        return this.props.api;
    };

    onRowSelectSelect = (record, selected) => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        const selectType = table?.rowSelection?.type;
        let selectedRowKeys = [...this.state.selectedRowKeys];
        const key = typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey];
        if (selected) {
            if (selectType === 'radio') {
                selectedRowKeys = [key];
            } else {
                selectedRowKeys = Array.uniq([...selectedRowKeys, key]);
            }
        } else {
            selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
        }
        this.onRowSelectChange(selectedRowKeys);
    };

    onRowSelectSelectAll = (selected, selectedRows, changeRows) => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        let selectedRowKeys = [...this.state.selectedRowKeys];
        const keys = changeRows.map(row => (typeof tableRowKey === 'function' ? tableRowKey(row) : row[tableRowKey]));
        if (selected) {
            selectedRowKeys = Array.uniq([...selectedRowKeys, ...keys]);
        } else {
            keys.forEach(key => selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1));
        }
        this.onRowSelectChange(selectedRowKeys);
    };

    onRowSelectChange = (selectedRowKeys = [], selectedRows = [], source) => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        const { totalData, totalRecord, columns } = this.state;
        const nextSelectedRowKeys = [];
        const nextSelectedRows = [];
        selectedRowKeys = [...selectedRowKeys];
        if (selectedRowKeys.length !== selectedRows.length || selectedRows.some(row => row === undefined)) {
            totalData?.forEach(record => {
                const key = typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey];
                if (selectedRowKeys.includes(key) && !nextSelectedRowKeys.includes(key)) {
                    nextSelectedRowKeys.push(key);
                    nextSelectedRows.push(record);
                }
            });
            selectedRowKeys = nextSelectedRowKeys;
            selectedRows = nextSelectedRows;
        }
        if (this.tableRowSelectionOnChange && this.tableRowSelectionOnChange !== this.onRowSelectChange && source !== 'DidUpdate') {
            this.tableRowSelectionOnChange(selectedRowKeys, selectedRows);
            setTimeout(() => {
                this.props.onParentRender?.();
            });
        }
        //复选框勾选改变时 若有勾选项计算勾选项总和 反之则获取totalRecord中值
        let footer = {};
        if (selectedRows && selectedRows.length) {
            // 递归处理列的合计数据
            const processColumnTotals = (columns, isSelection = false) => {
                for (let column of columns) {
                    delete column.filteredValue;
                    if (column.total === true) {
                        let value = 0;
                        selectedRows.forEach(record => {
                            value += record[column.dataIndex] || 0;
                        });
                        footer[column.dataIndex] = Number.toFix(value, 2);
                    }
                    // 递归处理子列
                    if (column.children) {
                        processColumnTotals(column.children, isSelection);
                    }
                }
            };

            processColumnTotals(columns, true);

            if (columns?.[0] && !this.props.table?.rowSelection) {
                columns[0].total = '已选合计';
                if (columns[0].children) {
                    columns[0].children[0].total = '已选合计';
                }
            }
        } else if (totalRecord && this.hasTotal) {
            // 递归处理列的总计数据
            const processColumnTotals = (columns, totalRecord) => {
                for (let column of columns) {
                    delete column.filteredValue;
                    if (column.total === true && totalRecord[column.dataIndex] !== undefined) {
                        footer[column.dataIndex] = totalRecord[column.dataIndex];
                    }
                    // 递归处理子列
                    if (column.children) {
                        processColumnTotals(column.children, totalRecord);
                    }
                }
            };

            processColumnTotals(columns, totalRecord);

            if (columns?.[0] && !this.props.table?.rowSelection) {
                columns[0].total = this.props.totalRecordText || '总计';
                if (columns[0].children) {
                    columns[0].children[0].total = this.props.totalRecordText || '总计';
                }
            }
        }

        this.setState({ selectedRowKeys, selectedRows, footer }, () => {
            source !== 'DidUpdate' && this.props.onParentRender?.();
        });
    };

    resize = (callback = this.props.onParentRender) => {
        if (this.props.noResize) {
            return;
        }
        const el = this.refs.selector;
        if (el && el.offsetParent) {
            const tagHeight = this.refs.tags ? this.refs.tags.offsetHeight : this.refs.batchGroup ? this.refs.batchGroup.offsetHeight : 0;
            // const extraHeight = (this.extraRef && !this.state.hasTabsExtra) ? this.extraRef.offsetHeight : 0;
            const height = el.offsetParent.offsetHeight - el.offsetTop - tagHeight;
            this.setState({ height });
        }

        if (this.props.autoHeight) {
            const nodeList = this.refs.selector && (this.refs.selector.querySelectorAll('.ant-table-body-outer') || []);
            nodeList?.forEach(node => {
                node.classList.add('auto-height');
            });
        }
        callback?.();
    };

    setActiveRowKeys = (activeRowKeys, timeout = 3000) => {
        const rowKeys = activeRowKeys;
        this.setState({
            activeRowKeys,
            timer:
                timeout &&
                setTimeout(() => {
                    this.setState({
                        timer: 0,
                        activeRowKeys: activeRowKeys.filter(key => !rowKeys.includes(key)),
                    });
                }, timeout),
        });
    };

    rowClassName = record => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        const { activeRowKeys } = this.state;
        return activeRowKeys.includes(typeof tableRowKey === 'function' ? tableRowKey(record) : record?.[tableRowKey]) ? 'ant-table-row-active' : '';
    };

    onTagClose = (column, e) => {
        column.filter.clearFilters(1);
        e.stopPropagation();
    };

    onTagClick = column => {
        const tableDom = ReactDOM.findDOMNode(this.refs.selector);
        // const tableHeaderDom = tableDom.querySelector('.ant-table-header');
        const tableBodyDom = tableDom.querySelector('.ant-table-body');
        let timespan = 100;
        if (tableDom && tableBodyDom) {
            const scrollLeft = column.scrollLeft - tableDom.offsetWidth / 2 + (column.width ? column.width / 2 : 0);
            tableBodyDom.scrollTo({
                left: scrollLeft > 0 ? scrollLeft : 0,
                behavior: 'smooth',
            });
            timespan = Math.min(Math.abs(scrollLeft - tableBodyDom.scrollLeft) / 2, 600);
            this.setState({
                tagColumn: column,
            });
        }
        setTimeout(() => {
            this.state.columns.forEach(col => {
                col.filterDropdownVisible = col === column;
            });
            this.renderData();
        }, timespan);

        setTimeout(() => {
            this.setState({
                tagColumn: {
                    key: 'no-one-on-selected',
                },
            });
        }, 2000);
    };

    onTagReset = () => {
        this.reset();
    };

    reset = () => {
        this.disabledTime = Date.now() + 1000;
        this.state.columns
            .filter(column => column.filter)
            .forEach(column => {
                column.filter.clearFilters && column.filter.clearFilters();
            });
        this.state.columns
            .filter(column => column.children)
            .forEach(column => {
                column.children
                    .filter(col => col.filter)
                    .forEach(col => {
                        col.filter.clearFilters && col.filter.clearFilters();
                    });
            });

        // 在reload的时候清除选中的行
        this.onRowSelectChange([], []);
        this.load(
            this.setPaginationParam(
                {
                    ...this.props.param,
                    ...this.currentValue,
                },
                true
            )
        );
    };

    filterChange = () => {
        this.updateState();
        this.load(
            this.setPaginationParam(
                {
                    ...this.props.param,
                    ...this.currentValue,
                },
                true
            )
        );
        this.onRowSelectChange([], []);
        this.props.onFilterChange &&
            this.props.onFilterChange({
                ...this.props.param,
                ...this.currentValue,
            });
    };

    getHasValueColumns = () => {
        const { columns } = this.state;
        let getHasValue = [];
        function getColumnsArr(columns) {
            columns.forEach(column => {
                if (column.children) {
                    getColumnsArr(column.children);
                } else {
                    if (column.filter) {
                        if (column.filter.type === 'number') {
                            if (column.filter.value && column.filter.value.length === 2) {
                                if (typeof column.filter.value[0] === 'number' || typeof column.filter.value[1] === 'number') {
                                    getHasValue.push(column);
                                }
                            }
                        } else {
                            if (typeof column.filter.value === 'object') {
                                if (!Object.isEmpty(column.filter.value)) {
                                    for (const key in column.filter.value) {
                                        if (column.filter.value[key] !== undefined) {
                                            getHasValue.push(column);
                                            break;
                                        }
                                    }
                                }
                            } else if (column.filter.value !== undefined && column.filter.value !== null) {
                                getHasValue.push(column);
                            }
                        }
                    }
                }
            });
            return getHasValue;
        }
        return getColumnsArr(columns);
        // return columns.filter(column => {
        //     if (!column.filter) {
        //         return false;
        //     }
        //     console.log(column);
        //     if (column.filter.type === "number") {
        //         if (column.filter.value && column.filter.value.length === 2) {
        //             return typeof column.filter.value[0] === "number" || typeof column.filter.value[1] === "number";
        //         } else {
        //             return false;
        //         }
        //     }
        //     return column.filter.value && (column.filter.value instanceof Array ? (column.filter.value.length > 0) : true);
        // });
    };

    getFixedExtra = () => {
        // const { hasTabsExtra } = this.props;
        // if (!hasTabsExtra && !this.state.hasTabsExtra) {
        //     this.setState({
        //         hasTabsExtra: true,
        //     });
        // }
        // setTimeout(() => this.resize(null));
        // return this.extraAfter;
        return;
    };

    hasDoubleTitle = () => {
        const { columns } = this.state;
        return columns.find(c => c.children?.length);
    };

    // render
    renderData = () => {
        if (this.props.dataSource) {
            this.setState({ dataSource: [...this.props.dataSource] });
        } else {
            this.setState({ data: [...this.state.data] });
        }
    };

    updateState() {
        Array.loopItem(this.state.columns, column => {
            if (column.filter?.allowClearAssociationFields?.length) {
                let count = 0;
                if (!Object.isEmpty(column.filter.value)) {
                    count++;
                }
                column.filter.allowClearAssociationFields.forEach(field => {
                    const col = this.findColumn(field);
                    if (col && !Object.isEmpty(col.filter.value)) {
                        count++;
                    }
                });
                column.filter.allowClear = count > column.filter.allowClearAssociationMinCount;
            }
        });
        this.setState({ now: Date.now() });
    }
    updateConfigColumns = value => {
        this.setState({ columns: Object.clone(this.props.columns), configColumns: value, isFirstConfig: false }, async () => {
            this.props.handleConfigColumnsChange?.(value);
            await this.getFilterItem(value);
            // 在切换车场的时候清除选中的行
            this.onRowSelectChange([], []);
            this.fetch(
                this.setPaginationParam(
                    {
                        ...this.state.lastParams,
                        ...this.props.param,
                    },
                    true
                )
            );
        });
    };
    onPageSizeChange = value => {
        const { pagination } = this.state;

        this.setState({
            pagination: {
                ...pagination,
                pageSize: value,
            },
        });
    };

    updateColumns = async () => {
        const { lastParams } = this.state;
        await this.getFilterItem();
        this.setState({ lastParams });
    };

    get extraAfter() {
        const { extraTagAfter, extraTagAfterFixed, hideTabs } = this.props;
        return !hideTabs ? (
            <div ref={ref => (this.extraRef = ref)} className={classnames('selector-extra-wrap', { 'in-tabs': this.state.hasTabsExtra })}>
                {extraTagAfter && extraTagAfter}
                {extraTagAfterFixed && extraTagAfterFixed}
            </div>
        ) : (
            ''
        );
    }

    get exportButton() {
        const { api, exportEvents, onExportClick } = this.props;
        // 兼容云平台的全局导出权限
        let exportRight = window.projectName === 'public' ? window.hasRight('NAV_PUBLIC_EXPORT_RIGHT') : true;
        if (window.projectName === 'desktop' && window.appInfo?.rootNavRight === 'NAVIGATION_PUBLIC_V2_GROUP') {
            exportRight = window.hasRight('NAV_PUBLIC_EXPORT_RIGHT');
        }
        return (
            api &&
            api._export !== false &&
            this.props.enabledExport !== false &&
            !this.props.iotApi &&
            exportRight && (
                <>
                    <Tooltip title="导出数据" mouseEnterDelay={0} mouseLeaveDelay={0}>
                        <UploadOutlined
                            className="tag-icon"
                            onClick={() => {
                                if (onExportClick) {
                                    onExportClick();
                                } else {
                                    this.setState({ exportVisible: true });
                                }
                            }}
                        />
                    </Tooltip>
                    {!Object.isEmpty(exportEvents) &&
                        exportEvents.map((event, index) => {
                            return (
                                <Button
                                    key={index}
                                    disabled={event.disabled}
                                    type="link"
                                    onClick={() => {
                                        event.func();
                                    }}
                                    {...event.props}
                                >
                                    {event.name}
                                </Button>
                            );
                        })}
                </>
            )
        );
    }

    render() {
        if (this.initing) {
            return <Skeleton active style={{ padding: 20 }}></Skeleton>;
        }
        const {
            data,
            loading,
            pagination,
            selectedRowKeys,
            exportVisible,
            exportVisiblePic,
            height,
            columns,
            footer,
            tagColumn,
            totalNum,
            configVisible,
            configColumns,
            isFirstConfig,
            // hasTabsExtra,
            // width,
        } = this.state;
        const {
            rowKey,
            table,
            autoHeight,
            autoWidth,
            api,
            showFilterValue,
            extraTagBefore,
            bordered,
            childrenHeight,
            exportApi,
            exportOptions,
            tableID,
            isReset,
            tableWrapClassName,
            tableBodyHeight,
            batchButtons,
            viewType,
            noTagGroup,
            showTotalRecord,
            tagGroupBefore,
        } = this.props;
        console.log('ttdesign selector');
        const tableRowKey = rowKey || table.rowKey;
        let tableSize = this.props.tableSize || 'small';
        const hasValueColumns = this.getHasValueColumns();
        // 是否有已筛选项
        const hasFilterValue = showFilterValue && hasValueColumns.length > 0;
        if (tableSize === 'auto') {
            if (window.innerHeight < 750) {
                tableSize = 'small';
            } else if (window.innerHeight < 1250) {
                tableSize = 'middle';
            } else {
                tableSize = 'default';
            }
        }

        let lineHeight = 46;
        if (tableSize === 'default') {
            lineHeight = 46;
        } else if (tableSize === 'middle') {
            lineHeight = 40;
        } else if (tableSize === 'small') {
            lineHeight = 34;
        }
        if (this.hasDoubleTitle()) {
            // lineHeight = 58;
        }
        if (table.rowSelection) {
            if (!this.tableRowSelectionOnChange) {
                this.tableRowSelectionOnChange = table.rowSelection.onChange;
            }
            if (!this.props.isTabTable) {
                delete table.rowSelection.onChange;
            }
            table.rowSelection.onSelect = this.onRowSelectSelect;
            table.rowSelection.onSelectAll = this.onRowSelectSelectAll;
            table.rowSelection.columnWidth = table.rowSelection.columnWidth || (this.hasTotal && 80) || 32;
        }
        if (!table.scroll) {
            table.scroll = {
                // x: 'max-content',
                x: '100%',
            };
        }
        table.scroll.scrollToFirstRowOnChange = true;
        const hasFooter = !Object.isEmpty(footer) && (!!totalNum || showTotalRecord);
        if (autoHeight) {
            const level = this.getColumnsLevel();
            const _height = height - lineHeight * ((level - 1) || 0) - 4;
            if (!isNaN(_height)) {
                table.scroll.y = _height - lineHeight;
                table.bodyStyle = { height: `${_height}px` };
            }
            const body = this.refs.selector ? this.refs.selector.querySelector('.ant-table-body') : false;
            if (body) {
                body.style.overflow = 'scroll';
                body.style.height = (tableBodyHeight || table.scroll.y) + 'px';
                body.style.maxHeight = (tableBodyHeight || table.scroll.y) + 'px';
            }
            if (childrenHeight) {
                const placeholder = this.refs.selector ? this.refs.selector.querySelector('.ant-table-placeholder') : false;
                if (placeholder) {
                    placeholder.style.top = '110px';
                }
            }
        }
        if (autoWidth) {
            // table.scroll.x = width;
        }
        const className = [];
        if (table.className) {
            className.push(...table.className.split(' '));
        }
        hasFooter && className.push('has-footer');
        window.isMac && className.push('mac');
        table.className = Array.uniq(className).join(' ');
        let index = 0;
        // 列配置的操作列render方法不会被保存，用于临时获取操作列的render方法
        // columns.forEach(item => {
        //     if (item.key === 'action-') {
        //         // console.log(this.props.columns)
        //         console.log(item.render.toString());
        //     }
        //     if ((item.key === 'action' || item.key?.includes('action-')) && !item.render) {
        //         let propsColumns = this.props.columns;
        //
        //
        //         item.render = propsColumns.find(item2 => (item2.key === 'action' || item2.key?.includes('action-')))?.render;
        //     }
        // });
        // console.log(columns);
        // console.log(columns, this.props.columns);
        // 剔除不展示的column列
        const tableData = !!api ? data : this.props.data;
        let visibleColumns = columns.concat();
        if (this.props.actionWidth) {
            visibleColumns = visibleColumns.map(col => {
                return col.key === 'action' ? { ...col, width: this.props.actionWidth + 20 } : col;
            });
        }
        if (this.props.noAction || !tableData?.length) {
            visibleColumns = visibleColumns.filter(col => col.key !== 'action');
        }
        const filterColumn = column => {
            if (column.children) {
                column.children = column.children.filter(filterColumn);
            }
            return !column.hidden;
        };
        visibleColumns = visibleColumns.filter(filterColumn);

        return (
            <div
                className={`selector-v2 ${this.hasDoubleTitle() ? 'double-title' : ''} ${this.hasDoubleTitle() || bordered ? 'has-bordered' : ''} ${tableWrapClassName ? tableWrapClassName : ''
                    } ${tableData?.length > 0 ? 'has-table-data' : 'no-table-data'}`}
                ref="selector"
                onMouseMove={event => (this.event.mouse = event)}
            >
                {/* {!hasTabsExtra && !viewType && this.extraAfter} */}
                {selectedRowKeys.length > 0 && viewType ? (
                    <div className="batch-group" ref="batchGroup">
                        <div className="batch-title">
                            已选择{selectedRowKeys.length}条记录
                            <Tooltip title="清空已选项" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                <CloseOutlined onClick={() => this.onRowSelectChange([], [])} />
                            </Tooltip>
                        </div>
                        <div>
                            {this.props.refresh && (
                                <Tooltip title="刷新数据" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    <ReloadOutlined className="tag-icon" onClick={() => this.reload()} />
                                </Tooltip>
                            )}
                            {this.exportButton}
                            {!!pagination && <CustomPagination config={pagination} handlePaginationChange={this.handlePaginationChange}></CustomPagination>}
                            <div className="selector-extra-wrap">{batchButtons}</div>
                        </div>
                    </div>
                ) : noTagGroup ? null : (
                    <div className="tag-group" ref="tags">
                        {extraTagBefore && <div className="tag-buttons tag-buttons-left">{extraTagBefore}</div>}
                        <div className="tag-group-right">
                            {tagGroupBefore}
                            {hasValueColumns.map(column => {
                                const title = typeof column.title === 'string' ? column.title : column.title?.props?.children?.[0];
                                if (column.filter.text instanceof Array && column.filter.text.length > 0) {
                                    return (
                                        <Tooltip
                                            key={column.field}
                                            title={column.filter.text.join('、')}
                                        // getPopupContainer={triggerNode => triggerNode.parentElement}
                                        >
                                            <Tag
                                                closable={column.filter.allowClear}
                                                onClose={e => this.onTagClose(column, e)}
                                                onClick={() => this.onTagClick(column)}
                                            >
                                                <span className="tag-name">{title}</span>
                                                <span className="tag-value">
                                                    {column.filter.text.length > 1
                                                        ? `${column.filter.text[0]}…等${column.filter.text.length}项`
                                                        : column.filter.text[0]}
                                                </span>
                                            </Tag>
                                        </Tooltip>
                                    );
                                } else if (column.filter.allowClear === false) {
                                    return (
                                        <Tooltip
                                            key={column.field}
                                            title={column.filter.notAllowClearTitle || '此筛选项不能清空'}
                                        // getPopupContainer={triggerNode => triggerNode.parentElement}
                                        >
                                            <Tag
                                                key={column.field}
                                                closable={column.filter.allowClear}
                                                onClose={e => this.onTagClose(column, e)}
                                                onClick={() => this.onTagClick(column)}
                                            >
                                                <span className="tag-name">{title}</span>
                                                <span className="tag-value">
                                                    <Typography.Text ellipsis>{column.filter.text}</Typography.Text>
                                                </span>
                                            </Tag>
                                        </Tooltip>
                                    );
                                } else {
                                    return (
                                        <Tag
                                            key={column.field}
                                            closable={column.filter.allowClear}
                                            onClose={e => this.onTagClose(column, e)}
                                            onClick={() => this.onTagClick(column)}
                                        >
                                            <span className="tag-name">{title}</span>
                                            <span className="tag-value">
                                                <Typography.Text ellipsis>{column.filter.text}</Typography.Text>
                                            </span>
                                        </Tag>
                                    );
                                }
                            })}
                            {hasFilterValue && this.props.reset && (
                                <Tooltip title="重置筛选" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    {getIcon('icon-quxiaoshaixuan', { className: 'tag-icon', onClick: () => this.onTagReset(hasValueColumns) })}
                                </Tooltip>
                            )}
                            {this.props.refresh && (
                                <Tooltip title="刷新数据" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    <ReloadOutlined className="tag-icon" onClick={() => this.reload()} spin={loading} />
                                </Tooltip>
                            )}
                            {this.state.hasColumnsWidth && (
                                <Tooltip title="还原默认列宽" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    <ClearOutlined className="tag-icon" onClick={() => this.resizeColumnWidth()} />
                                </Tooltip>
                            )}
                            {this.exportButton}
                            {table.rowSelection && !viewType && (
                                <span className="total-count">
                                    {/*  */}
                                    {table && table.rowSelection && !viewType && `已选${selectedRowKeys.length}条`}
                                    {table && table.rowSelection && selectedRowKeys.length ? (
                                        <Tooltip title="清空已选项" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                            <CloseOutlined onClick={() => this.onRowSelectChange([], [])} />
                                        </Tooltip>
                                    ) : (
                                        ''
                                    )}
                                    {api && api._export !== false && this.props.enabledExport !== false && api._exportPic && (
                                        <A className="exportButton" onClick={() => this.setState({ exportVisiblePic: true })}>
                                            导出图片
                                        </A>
                                    )}
                                    {/* {this.props.showConfig && (
                                            <>
                                                {table && table.rowSelection && <span style={{ marginLeft: '10px' }}>|</span>}
                                                <A className="exportButton" onClick={() => this.setState({ configVisible: true })}>
                                                    <span>{getIcon('icon-peizhi')} </span>
                                                    列配置
                                                </A>
                                            </>
                                        )} */}
                                </span>
                            )}
                            {this.props.showConfig && (
                                <Tooltip title="列配置" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    {getIcon('icon-peizhi', { className: 'tag-icon', onClick: () => this.setState({ configVisible: true }) })}
                                </Tooltip>
                            )}
                            {!!pagination && <CustomPagination config={pagination} handlePaginationChange={this.handlePaginationChange}></CustomPagination>}
                            {this.extraAfter}
                        </div>
                        <style>
                            {`.ant-table-thead > tr > th.selector-tag-${tagColumn.dataIndex || tagColumn.key} {background: #f5f5f5;}
                            .ant-table-tbody > tr > td.selector-tag-${tagColumn.dataIndex || tagColumn.key} {background: rgba(0, 0, 0, 0.04);}`}
                        </style>
                    </div>
                )}

                <Table
                    // ref={this.tableRef}
                    columns={visibleColumns}
                    dataSource={tableData instanceof Array ? tableData : console.error('data not array', tableData) || []}
                    // pagination={pagination}
                    pagination={false}
                    showSorterTooltip={false}
                    loading={loading}
                    bordered={this.hasDoubleTitle() || bordered}
                    onChange={this.handleTableChange}
                    rowKey={tableRowKey || (() => index++)}
                    components={{
                        header: {
                            cell: ResizableTitle,
                        },
                    }}
                    {...(hasFooter
                        ? {
                            summary:
                                this.props.sunmmary ||
                                (() => {
                                    let summaryIndex = 0;
                                    // 递归渲染嵌套列的合计单元格
                                    const renderSummaryCells = (cols) => {
                                        return cols
                                            .filter(c => !c.hidden)
                                            .map((c, index) => {
                                                if (c.children && c.children.length > 0) {
                                                    // 如果有子列，递归渲染子列的合计单元格
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {renderSummaryCells(c.children)}
                                                        </React.Fragment>
                                                    );
                                                } else {
                                                    // 普通列的合计单元格
                                                    return (
                                                        <Table.Summary.Cell key={index} index={summaryIndex++} colSpan={c.colSpan ?? 1}>
                                                            {c.total &&
                                                                (c.totalRender
                                                                    ? c.totalRender(footer[c.dataIndex] ?? c.total, footer, c)
                                                                    : footer[c.dataIndex] ?? c.total)}
                                                        </Table.Summary.Cell>
                                                    );
                                                }
                                            });
                                    };

                                    return (
                                        <Table.Summary.Row>
                                            {table.expandedRowRender && <Table.Summary.Cell index={summaryIndex++} />}
                                            {table.rowSelection && (
                                                <Table.Summary.Cell index={summaryIndex++}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        {!!this.hasTotal && (!!selectedRowKeys?.length ? '已选合计' : this.props.totalRecordText || '总计')}
                                                    </div>
                                                </Table.Summary.Cell>
                                            )}
                                            {renderSummaryCells(columns)}
                                        </Table.Summary.Row>
                                    );
                                }),
                        }
                        : {})}
                    rowClassName={table.rowClassName || this.rowClassName}
                    size={tableSize}
                    {...table}
                    locale={{
                        emptyText: <Empty />,
                    }}
                ></Table>

                <ExcelExport
                    onExportJob={this.animeExport}
                    exportApi={exportApi}
                    visible={exportVisible}
                    {...this.props}
                    {...this.state}
                    exportOptions={exportOptions === true ? {} : exportOptions}
                    onClose={() => this.setState({ exportVisible: false })}
                />
                {exportVisiblePic && (
                    <ExcelExport
                        onExportJob={this.animeExport}
                        visible
                        onClose={() => this.setState({ exportVisiblePic: false })}
                        {...this.props}
                        {...this.state}
                        exportOptions={{ exportTitle: api?._exportPicTitle, exportPic: true }}
                    />
                )}
                {/* <div className="export-file" ref="exportfile">
                    <Avatar icon={<FileExcelOutlined />} style={{ backgroundColor: '#87d068' }} />
                </div> */}
                {configVisible && (
                    <TableConfig
                        {...this.props}
                        {...this.state}
                        // key={Math.random()}
                        isFirstConfig={isFirstConfig}
                        configColumns={configColumns}
                        defaultColumns={this.props.columns}
                        updateConfigColumns={this.updateConfigColumns}
                        onExportJob={this.animeExport}
                        visible={configVisible}
                        onClose={() => this.setState({ configVisible: false })}
                        tableID={tableID}
                        api={api}
                        isReset={isReset}
                    />
                )}
            </div>
        );
    }
}

export default Selector;
