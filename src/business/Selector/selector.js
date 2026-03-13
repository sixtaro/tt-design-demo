import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './selector.less';
import { FileExcelOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Table, Statistic, message, Tag, Tooltip, Typography, Avatar, Switch, Select, Image } from 'antd';
import { Filters, LineWrap, TableConfig } from './components';
import { Storage, Request, Utils } from '@/utils';
import moment from 'moment';
import anime from 'animejs';
import sortBy from 'lodash/sortBy';
import { getIcon } from '@/business';
import { ENUM_SELECTOR_RENDER_ORDER } from '@/model/enum';
import ExcelExport from '@/business/excelExport';

const A = props => <a {...props}>{props.children}</a>;
const { copyText } = Utils;
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
        // 是否显示已筛选项
        showFilterValue: PropTypes.bool,
        //是否预留二级表头高度
        childrenHeight: PropTypes.bool,
        //是否传入单独导出接口参数
        exportOption: PropTypes.string,
        //导出参数
        exportOptions: PropTypes.object,
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
        notControl: false
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
                        pageSize: Object.getValue(window, '_user.UserConfig.pageSize', 10),
                        pageSizeOptions: ['10', '20', '50', '100', '1000'],
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: (current, size) => {
                            const { pagination } = this.state;
                            pagination.current = current;
                            pagination.pageSize = size;
                            this.setState({ pagination });
                        },
                        ...this.props.pagination,
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
        };
    }

    async componentDidMount() {
        await this.initConfig();
    }

    componentWillUnmount() {
        const { timer } = this.state;
        clearTimeout(timer);
        window.removeEventListener('resize', this.resize);
    }
    initRender = async (tableArr) => {
        setTimeout(() => {
            this.resize();
        });
        window.addEventListener('resize', this.resize);
        await this.getFilterItem(tableArr);

        if (this.props.nocallapi || this.props.dataSource) {
            this.setState({ loading: false });
            if (this.props.dataSource) {
                this.setState({ totalData: this.props.dataSource });
            }
            return;
        } else {
            this.load(
                this.setPaginationParam(
                    {
                        ...this.props.param,
                        ...this.defaultValue,
                        ...this.initialValue,
                    },
                    true
                )
            );
        }
    }
    initConfig = async () => {
        let tableArrConfig = Storage.get("tableArrConfig") || [];
        let tableArrJson = [];
        for (let option of tableArrConfig) {
            if (option.configKey === this.props.tableID) {
                tableArrJson = option;
            }
        }
        if (this.props.showConfig) {
            if (!tableArrJson || tableArrJson.length < 1) {
                this.initConfigColumns();
            } else {
                let tableArr = tableArrJson?.configValue;
                this.setState({
                    configColumns: tableArr,
                    isFirstConfig: false,
                });
                this.initRender(tableArr);
            }
        } else {
            this.initRender();
        }
    };
    initConfigColumns = async () => {
        const { tableID, user } = this.props;
        const userGroupID = user?.userGroupID;

        let param = {
            userGroupID: userGroupID,
            configKeys: this.props.tableID,
        };
        // 页面配置接口都走PublicV2
        let base = '/PublicV2/';
        const result = await Request({
            _url: `..${base || window._baseURL}home/usergroupsysconfig/common/getconfig?${new Date().getTime()}`,
            _type: 'post',
        }, param);
        if (result.success) {
            let config = result.data.config;
            let currentConfig = config.filter((item => item.configKey === tableID));
            let currentValue = [];
            if (currentConfig.length < 1) {
                currentValue = Object.clone(this.props.columns);
                currentValue.map(item => {
                    if (item.notControl) {
                        return item;
                    } else {
                        if (item.children) {
                            item.children.forEach(child => {
                                if (child.dataIndex) {
                                    child.checked = true;
                                }
                            });
                        } else if (item.dataIndex) {
                            item.checked = true;
                        }
                    }
                    return item;
                });
            } else {
                currentValue = JSON.parse(currentConfig[0].configValue);
            }
            let tableArrConfig = Storage.get("tableArrConfig") || [];
            tableArrConfig.push({
                configKey: tableID,
                configValue: currentValue
            });
            this.setState({
                configColumns: currentValue,
                isFirstConfig: currentConfig.length > 0 ? false : true,
            });
            Storage.set("tableArrConfig", tableArrConfig);
            this.initRender(currentValue);
        } else {
            message.warning(result.data.message || '页面配置失败');
            return false;
        }
    };
    getColumnsFilter = (value) => {
        let filter;
        let render;
        let totalRender;
        this.props.columns.forEach(item => {
            if (item.children) {
                item.children.forEach(child => {
                    if (child.dataIndex && child.dataIndex === value) {
                        filter = Object.clone(child.filter);
                        render = child.render;
                        totalRender = child.totalRender;
                    }
                });
            } else if (item.dataIndex && item.dataIndex === value) {
                filter = Object.clone(item.filter);
                render = item.render;
                totalRender = item.totalRender;
            }
        });
        return [filter, render, totalRender];
    }
    getConfigColumns = (value) => {
        let { configColumns } = this.state;
        if (value) {
            configColumns = value;
        }
        let newColumns = [];
        if (configColumns?.length > 0) {
            configColumns.map(item => {
                let allChecked = [];
                if (item.notControl) {
                    if (item.children) {
                        item.children.forEach(child => {
                            if (child.dataIndex) {
                                let newFilter = this.getColumnsFilter(child.dataIndex);
                                if (newFilter[0]) {
                                    child.filter = Object.clone(newFilter[0]);
                                }
                                if (newFilter[1]) {
                                    child.render = newFilter[1];
                                }
                                if (newFilter[2]) {
                                    child.totalRender = newFilter[2];
                                }
                            }
                        });
                    } else if (item.dataIndex) {
                        let newFilter = this.getColumnsFilter(item.dataIndex);
                        if (newFilter[0]) {
                            item.filter = Object.clone(newFilter[0]);
                        }
                        if (newFilter[1]) {
                            item.render = newFilter[1];
                        }
                        if (newFilter[2]) {
                            item.totalRender = newFilter[2];
                        }
                    }
                    return item;
                } else {
                    if (item.children) {
                        item.children.forEach(child => {
                            if (!child.checked) {
                                child.hidden = true;
                            } else {
                                allChecked.push(item);
                                child.hidden = false;
                            }
                            if (child.dataIndex) {
                                let newFilter = this.getColumnsFilter(child.dataIndex);
                                if (newFilter[0]) {
                                    child.filter = Object.clone(newFilter[0]);
                                }
                                if (newFilter[1]) {
                                    child.render = newFilter[1];
                                }
                                if (newFilter[2]) {
                                    child.totalRender = newFilter[2];
                                }
                            }
                        });
                    } else if (item.dataIndex) {
                        if (!item.checked) {
                            item.hidden = true;
                        } else {
                            allChecked.push(item);
                            item.hidden = false;
                        }
                        let newFilter = this.getColumnsFilter(item.dataIndex);
                        if (newFilter[0]) {
                            item.filter = Object.clone(newFilter[0]);
                        }
                        if (newFilter[1]) {
                            item.render = newFilter[1];
                        }
                        if (newFilter[2]) {
                            item.totalRender = newFilter[2];
                        }
                    }
                }
                if (allChecked.length < 1) {//所有子节点都没有选中
                    item.hidden = true;
                }
                return item;
            });
            newColumns = Object.clone(configColumns);
        } else {
            newColumns = Object.clone(this.props.columns);
        }
        return newColumns;
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
    }

    async getFilterItem(value) {
        const { table } = this.props;
        const columns = this.getConfigColumns(value);
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
                title: '序号',
                key: 'serialNumber',
                width: 70,
                render: (text, record, index) => {
                    return (this.state.pagination.current - 1) * this.state.pagination.pageSize + index + 1;
                }
            });
        }
        if (table.expandedRowRender) {
            width += 50;
        }
        for (let index in columns) {
            const column = columns[index];
            defaultValue = await this.renderColumn(column, defaultValue);
            if (column.children) {
                column.width = 0;
                for (let child of column.children) {
                    defaultValue = await this.renderColumn(child, defaultValue, 'datetime');
                    child.scrollLeft = width + column.width;
                    column.width += child.width;
                    child.caclWidth = child.width;
                }
            }
            column.scrollLeft = width;
            width += column.width;
            column.calcWidth = column.width;
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
        if (columns[0]) {
            columns[0].total = '总计';
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
        this.setState({ defaultValue, columns, width, lastParams: {} });
    }

    async renderColumn(column, defaultValue, columnType) {
        let width = 120;
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
            const find =
                filters.find(
                    data => {
                        if (Array.isArray(data.value)) {
                            return data.value.some(value => {
                                return parseInt(value, 10) === text || parseInt(text, 10) === value || value === text;
                            });
                        } else {
                            return parseInt(data.value, 10) === text || parseInt(text, 10) === data.value || data.value === text;
                        }
                    }
                ) || {};
            let value = (find && find.text) || column.otherValue || text;
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
                returnValue = <div onClick={() => {
                    if (openNew) {
                        window.open(`${text}`, '_blank');
                    }
                }}>
                    <Image className="selector_column_Image" src={`${text}`} alt={column.title} height={customProps.height || 30} width={customProps.width || 30} preview={!openNew} />
                </div>;
            } else if (column.renderType === 'Switch') {
                const componentProps = Object.renderObject(Object.clone(column.componentProps), { record, column, value });
                returnValue = <Switch {...componentProps} onChange={(checked) => column.componentChange(record, checked)} />;
            } else if (column.renderType === 'Select') {
                const componentProps = Object.renderObject(Object.clone(column.componentProps), { record, column, value });
                returnValue = <Select {...componentProps} onChange={(checked) => column.componentChange(record, checked)}></Select>;
            } else if (column.noTooltip) {
                returnValue = value;
            } else if (typeof value === "string" || value?.$$typeof === Symbol.for('react.element')) {
                if (find.type === 'Tag') {
                    returnValue = <Tag color={find.color}>{value}</Tag>;
                } else if (!column.noTooltip) {
                    returnValue = <LineWrap enabledHtml={column.enabledHtml}>{value}</LineWrap>;
                }
            }

            // 提供复制快捷图标
            if (column.copyable) {
                column.shouldCellUpdate = () => true;
                const copyableKey = `_copyable_${this.state.pagination.current}_${index}`;
                returnValue = (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {returnValue}
                        {!column[copyableKey] ? (
                            <CopyOutlined
                                className="theme-color"
                                style={{ marginLeft: '4px' }}
                                onClick={() => {
                                    if (typeof column.copyable === "string") {
                                        copyText(Object.renderRecord(column.copyable, { record, column, value }));
                                    } else {
                                        copyText(value);
                                    }
                                    column[copyableKey] = true;
                                    this.renderData();
                                    setTimeout(() => {
                                        column[copyableKey] = false;
                                        this.renderData();
                                    }, 3000);
                                }}
                            />
                        ) : (
                            <CheckOutlined style={{ color: '#52c41a', marginLeft: '4px' }} />
                        )}
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
                            item
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
                this.defaultValue[column.field] =
                    column.filter.defaultValue instanceof Array
                        ? column.filter.defaultValue
                        : [column.filter.defaultValue];
            }
            if (column.filter.initialValue !== undefined) {
                this.initialValue[column.field] =
                    column.filter.initialValue instanceof Array
                        ? column.filter.initialValue
                        : [column.filter.initialValue];
            }
            column.filter.allowClear = column.filter.allowClear === false ? false : true;
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
                }
                width = 80;
            }
            if (column.filter.type === 'date' || column.filter.type === 'months') {
                column.filter.hasTime = column.filter.hasTime === false ? false : true;
                column.filter.hasFilterTime = column.filter.hasTime;
                column.filter.datePeriods =
                    column.filter.datePeriods ||
                    {
                        date: ['currentDay', 'currentWeek', 'currentMonth', 'currentYear'],
                        months: ['currentMonth', 'lastMonth', 'currentYear', 'lastYear'],
                    }[column.filter.type];
                if (column.filter.defaultValue) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [
                                moment(column.filter.defaultValue[0]),
                                moment(column.filter.defaultValue[1]),
                            ];
                        }
                    } else {
                        if (
                            column.filter.defaultValue === 'currentDay' &&
                            column.filter.datePeriods.includes('today')
                        ) {
                            column.filter.defaultValue = 'today';
                        } else if (
                            column.filter.defaultValue === 'today' &&
                            column.filter.datePeriods.includes('currentDay')
                        ) {
                            column.filter.defaultValue = 'currentDay';
                        }
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }

                    let currentValue = Filters.onDateTimeChange(
                        column.filter.value,
                        column,
                        column.filter.defaultValue
                    );
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
                            column.filter.value = [
                                moment(column.filter.initialValue[0]),
                                moment(column.filter.initialValue[1]),
                            ];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue = Filters.onDateTimeChange(
                        column.filter.value,
                        column,
                        column.filter.defaultValue
                    );
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
                            column.filter.value = [
                                moment(column.filter.defaultValue[0]),
                                moment(column.filter.defaultValue[1]),
                            ];
                        }
                    } else {
                        if (
                            column.filter.defaultValue === 'currentDay' &&
                            column.filter.datePeriods.includes('today')
                        ) {
                            column.filter.defaultValue = 'today';
                        } else if (
                            column.filter.defaultValue === 'today' &&
                            column.filter.datePeriods.includes('currentDay')
                        ) {
                            column.filter.defaultValue = 'currentDay';
                        }
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }

                    let currentValue = Filters.onDateTimeChange(
                        column.filter.value,
                        column,
                        column.filter.defaultValue
                    );
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
                            column.filter.value = [
                                moment(column.filter.initialValue[0]),
                                moment(column.filter.initialValue[1]),
                            ];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue = Filters.onDateTimeChange(
                        column.filter.value,
                        column,
                        column.filter.initialValue
                    );
                    if (currentValue[0] instanceof Object) {
                        this.initialValue = { ...this.initialValue, ...currentValue[0] };
                    } else {
                        this.initialValue[column.field] = currentValue;
                    }
                }
                Object.assign(column, Filters.getColumnDayProps(column, this));
                width = 150;
            }
            if (column.filter.type === 'week' || column.filter.type === 'month' || column.filter.type === 'year' || column.filter.type === 'quarter'
                || column.filter.type === 'weeks' || column.filter.type === 'years'
            ) {
                column.filter.hasTime = false;
                column.filter.hasFilterTime = false;
                let str;
                if (column.filter.type === 'weeks' || column.filter.type === 'years') {
                    let strType = (column.filter.type).substr(0, (column.filter.type).length - 1);
                    str = strType.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
                } else {
                    str = column.filter.type.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
                }
                column.filter.datePeriods = column.filter.datePeriods || ['current' + str, 'last' + str];
                if (column.filter.defaultValue) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [
                                moment(column.filter.defaultValue[0]),
                                moment(column.filter.defaultValue[1]),
                            ];
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
                        currentValue = Filters.onDateTimeChange(
                            column.filter.value,
                            column,
                            column.filter.defaultValue,
                            currentText
                        );
                    } else {
                        currentValue = Filters.onDateTimeChange(
                            column.filter.value,
                            column,
                            column.filter.defaultValue
                        );
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
                            column.filter.value = [
                                moment(column.filter.initialValue[0]),
                                moment(column.filter.initialValue[1]),
                            ];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.initialValue);
                    }

                    let currentValue;
                    if (column.filter.defaultValue.lastIndexOf('-') === 4) {
                        currentValue = Filters.onDateTimeChange(
                            column.filter.value,
                            column,
                            column.filter.defaultValue,
                            column.filter.defaultValue + '周',
                        );
                    } else {
                        currentValue = Filters.onDateTimeChange(
                            column.filter.value,
                            column,
                            column.filter.defaultValue
                        );
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
                const param =
                    column.filter.param instanceof Function ? column.filter.param(column) : column.filter.param;
                const systemID = window.systemID;
                const result = await Request(
                    {
                        _url: systemID === 4 ? '../Manager/home/sysuser/getallsysuserlist' : '../PublicV2/home/parking/operatelog/tree',
                        _type: 'get',
                        _cache: '10m',
                    },
                    param
                );
                if (column.filter.defaultValue !== undefined) {
                    const defaultValue = Array.isArray(column.filter.defaultValue) ? column.filter.defaultValue : [column.filter.defaultValue];
                    column.filter.selectedKeys = column.filter.value = this.defaultValue[
                        column.field
                    ] = defaultValue;
                    let nodes = [];
                    const loop = (children) => {
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
                    column.filter.selectedKeys = column.filter.value = this.initialValue[
                        column.field
                    ] = initialValue;
                    let nodes = [];
                    const loop = (children) => {
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
                const valueType = column.filter.valueType || 0; // 默认值的类型  0-车场  1-组织机构
                const orgCanSelect = column.filter.orgCanSelect || false; // 是否可选机构，可选机构（传参orgID），只选车场（传参parkID）
                if (column.filter.defaultValue !== undefined) {
                    const defaultValue = Array.isArray(column.filter.defaultValue) ? column.filter.defaultValue : [column.filter.defaultValue];
                    column.filter.value = this.defaultValue[
                        column.field
                    ] = defaultValue;
                    column.filter.selectedKeys = defaultValue?.map(item => `${valueType}_${item}`);
                    let nodes = [];
                    const loop = (children) => {
                        children.forEach(node => {
                            if (!!defaultValue.find(id => orgCanSelect ? `${id}` === `${node.attributes?.orgID}` : `${id}` === `${node.attributes?.parkID}`)) {
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
                    column.filter.value = this.initialValue[
                        column.field
                    ] = initialValue;
                    column.filter.selectedKeys = initialValue?.map(item => `${valueType}_${item}`);
                    let nodes = [];
                    const loop = (children) => {
                        children.forEach(node => {
                            if (!!initialValue.find(id => orgCanSelect ? `${id}` === `${node.attributes?.orgID}` : `${id}` === `${node.attributes?.parkID}`)) {
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
                    column.filter.selectedKeys = column.filter.text = column.filter.value = this.defaultValue[
                        column.field
                    ] = column.filter.defaultValue;
                }
                if (column.filter.initialValue !== undefined) {
                    column.filter.selectedKeys = column.filter.text = column.filter.value = this.initialValue[
                        column.field
                    ] = column.filter.initialValue;
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
            if (column.filter.items) {
                width = 100;
                column.filter.items = column.filters ? column.filter.items.concat(column.filters) : column.filter.items;
                delete column.filters;
                if (column.filter.defaultValue !== undefined && column.filter.defaultValue !== null) {
                    defaultValue[column.field] = column.filter.defaultValue;
                    const defaultItems = column?.filter?.items?.filter?.(
                        i => i.value === column.filter.defaultValue || column.filter.defaultValue.includes?.(i.value)
                    );
                    column.filter.value = defaultItems.map(di => di.value);
                    column.filter.text = defaultItems.map(di => di.text);
                    column.filter.selectedKeys = column.filter.value;
                    column.filter.antdBug =
                        column.filter.defaultValue instanceof Array
                            ? column.filter.defaultValue
                            : [column.filter.defaultValue];
                }
                if (column.filter.initialValue !== undefined) {
                    const defaultItems = column?.filter?.items?.filter?.(
                        i => i.value === column.filter.initialValue || column.filter.initialValue.includes?.(i.value)
                    );
                    column.filter.value = defaultItems.map(di => di.value);
                    column.filter.text = defaultItems.map(di => di.text);
                    column.filter.selectedKeys = column.filter.value;
                    column.filter.antdBug =
                        column.filter.defaultValue instanceof Array
                            ? column.filter.defaultValue
                            : [column.filter.defaultValue];
                }
                if (column.filter.type !== 'none') {
                    Object.assign(column, Filters.getColumnItemsProps(column, this));
                }
            }
            if (column.filter.defaultValue || column.filter.defaultValue === 0) {
                column.defaultFilteredValue =
                    column.filter.defaultValue instanceof Array
                        ? column.filter.defaultValue
                        : [column.filter.defaultValue];
            }
        }
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
            column.renders.sort((a,b) => a.order - b.order);
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
        // 针对奇葩分辨率电脑，修复表格列宽度计算后显示不下的问题
        if (window.devicePixelRatio !== parseInt(window.devicePixelRatio, 10)) {
            minWidth++;
        }
        if (!column.width) {
            column.width = Math.max(width, minWidth);
            column.autoWidth = true;
        }
        column.className = `selector-tag-${column.field}`;
        // column.sortDirections = ["asc", "desc"];
        return defaultValue;
    }

    componentDidUpdate(prevProps) {
        const updateColumns = () => {
            this.setState({ columns: Object.clone(this.props.columns) }, async () => {
                await this.getFilterItem();
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
        if (!Object.equal(this.props.columns, prevProps.columns) || this.props.showSerialNumber !== prevProps.showSerialNumber) {
            updateColumns();
        } else if (!Object.equal(this.props.param, prevProps.param)) {
            // 在切换车场的时候清除选中的行
            this.onRowSelectChange([], []);
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
            this.setState({
                pagination: this.props.pagination && {
                    ...this.state.pagination,
                    ...this.props.pagination,
                }
            });
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

    handleTableChange = (pagination, filters, sorter) => {
        if (Date.now() < this.disabledTime) {
            return;
        }
        let sortColumn = sorter.field;
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
            sortColumn: sortColumn,
            order: order,
            ...this.props.param,
        };
        this.currentValue = {
            ...this.currentValue,
            sortColumn: sortColumn,
            order: order,
        };
        if (!Object.isEmpty(pagination)) {
            param = {
                ...param,
                offset: (pagination.current - 1) * pagination.pageSize,
                rows: pagination.pageSize,
                currentPage: pagination.current,
            };
        }
        this.fetch(param);
    };

    fetch = async (params = {}) => {
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
        await this.load(params);
    };

    reload = (callback, clear, configColumns) => {
        if (clear) {
            this.setState({ totalData: null, selectedRowKeys: [] });
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
                                    item
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
            // 在reload的时候清除选中的行
            this.onRowSelectChange([], []);
            // await this.getFilterItem();
            await this.load(lastParams);
            callback && callback();
            this.resize();
        });
    };

    load = async params => {
        let { totalData, totalNum, selectedRowKeys, columns } = this.state;
        const { rowKey, table, filterParamFunc } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        let lastRequest = this.setLastRequestIndex();
        this.setState({ loading: true }, () => {
            this.resize();
        });
        try {
            if (filterParamFunc) {
                params = filterParamFunc(params, columns);
            }
            this.currentFilter = Object.toStr(this.props.param) + Object.toStr(this.currentValue);
            const currentFilter = this.currentFilter;
            let result = await Request(this.props.api, { ...params });
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
            if (result.success) {
                if (!result.data) {
                    result.data = {};
                }
                const { pagination } = this.state;
                totalNum = Object.getValue(result.data, totalField, 0);
                if (pagination) {
                    pagination.total = totalNum;
                    pagination.current = params.currentPage;
                }
                const list = Object.getValue(result.data, listField, []);
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
                        const listKey = list.map(record => typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey]);
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
                for (let column of this.state.columns) {
                    delete column.filteredValue;
                    if (column.total && totalRecord[column.dataIndex] !== undefined) {
                        footer[column.dataIndex] = totalRecord[column.dataIndex];
                    }
                    if (column.children) {
                        for (let child of column.children) {
                            delete child.filteredValue;
                            if (child.total && totalRecord[child.dataIndex] !== undefined) {
                                footer[child.dataIndex] = totalRecord[child.dataIndex];
                            }
                        }
                    }
                }
                this.props.callback && this.props.callback(result.data);
                this.setState(
                    {
                        loading: false,
                        data: list,
                        totalData,
                        pagination,
                        totalRecord,
                        lastParams: params,
                        footer: footer,
                        totalNum,
                        selectedRowKeys,
                    },
                    () => {
                        this.onRowSelectChange(this.state.selectedRowKeys, []);
                        setTimeout(() => {
                            try {
                                const tableDOM = ReactDOM.findDOMNode(this.refs.selector);
                                const tableHeaderDOM = tableDOM.querySelector('.ant-table-header');
                                const tableBodyDOM = tableDOM.querySelector('.ant-table-body');
                                if (tableBodyDOM) {
                                    tableBodyDOM.scrollLeft = tableHeaderDOM.scrollLeft;
                                } else if (tableBodyDOM) {
                                    tableBodyDOM.scrollLeft = tableHeaderDOM.scrollLeft;
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
                message.error(result.message || '系统繁忙，请稍后重试');
                console.log(params, result);
                const { pagination } = this.state;
                if (pagination) {
                    pagination.total = 0;
                    pagination.current = 0;
                }
                this.setState({
                    loading: false,
                    data: [],
                    lastParams: params,
                    pagination,
                    footer: null,
                    totalNum: 0,
                });
            }
        } catch (ex) {
            console.log(ex);
            message.error(ex);
        }
    };

    getCurrentFilter = () => {
        return {
            ...this.props.param,
            ...this.currentValue,
        };
    };

    getColumns = () => {
        return this.props.columns;
    };

    getTotalNum = () => {
        return this.state.totalNum;
    };

    getApi = () => {
        return this.props.api;
    }

    onRowSelectSelect = (record, selected) => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        const selectType = table?.rowSelection?.type;
        let { selectedRowKeys } = this.state;
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
        let { selectedRowKeys } = this.state;
        const keys = changeRows.map(row => (typeof tableRowKey === 'function' ? tableRowKey(row) : row[tableRowKey]));
        if (selected) {
            selectedRowKeys = Array.uniq([...selectedRowKeys, ...keys]);
        } else {
            keys.forEach(key => selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1));
        }
        this.onRowSelectChange(selectedRowKeys);
    };

    onRowSelectChange = (selectedRowKeys = [], selectedRows = []) => {
        const { rowKey, table } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        const { totalData, totalRecord, columns } = this.state;
        const nextSelectedRowKeys = [];
        const nextSelectedRows = [];
        selectedRowKeys = [...selectedRowKeys];
        if (selectedRowKeys.length !== selectedRows.length || selectedRows.some(row => row === undefined)) {
            totalData.forEach(record => {
                const key = typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey];
                if (selectedRowKeys.includes(key) && !nextSelectedRowKeys.includes(key)) {
                    nextSelectedRowKeys.push(key);
                    nextSelectedRows.push(record);
                }
            });
            selectedRowKeys = nextSelectedRowKeys;
            selectedRows = nextSelectedRows;
        }
        if (this.tableRowSelectionOnChange && this.tableRowSelectionOnChange !== this.onRowSelectChange) {
            this.tableRowSelectionOnChange(selectedRowKeys, selectedRows);
        }
        //复选框勾选改变时 若有勾选项计算勾选项总和 反之则获取totalRecord中值
        let footer = {};
        if (selectedRows && selectedRows.length) {
            for (let column of columns) {
                delete column.filteredValue;
                if (column.total === true) {
                    let value = 0;
                    selectedRows.forEach(record => {
                        value += record[column.dataIndex];
                    });
                    footer[column.dataIndex] = Number.toFix(value, 2);
                }
                if (column.children) {
                    for (let child of column.children) {
                        delete child.filteredValue;
                        if (child.total === true) {
                            let value = 0;
                            selectedRows.forEach(record => {
                                value += record[child.dataIndex];
                            });
                            footer[child.dataIndex] = Number.toFix(value, 2);
                        }
                    }
                }
            }
            if (columns?.[0]) {
                columns[0].total = '已选合计';
                if (columns[0].children) {
                    columns[0].children[0].total = '已选合计';
                }
            }
        } else if (totalRecord) {
            for (let column of columns) {
                delete column.filteredValue;
                if (column.total === true && totalRecord[column.dataIndex] !== undefined) {
                    footer[column.dataIndex] = totalRecord[column.dataIndex];
                }
                if (column.children) {
                    for (let child of column.children) {
                        delete child.filteredValue;
                        if (child.total && totalRecord[child.dataIndex] !== undefined) {
                            footer[child.dataIndex] = totalRecord[child.dataIndex];
                        }
                    }
                }
            }
            if (columns?.[0]) {
                columns[0].total = '总计';
                if (columns[0].children) {
                    columns[0].children[0].total = '总计';
                }
            }
        }

        this.setState({ selectedRowKeys, selectedRows, footer }, () => {
            this.props.onParentRender && this.props.onParentRender();
        });
    };

    resize = () => {
        const el = this.refs.selector;
        if (el && el.offsetParent) {
            const tagHeight = this.refs.tags ? this.refs.tags.offsetHeight : 0;
            const height = el.offsetParent.offsetHeight - el.offsetTop - tagHeight;
            this.setState({ height });
        }

        if (this.props.autoHeight) {
            const nodeList = this.refs.selector && (this.refs.selector.querySelectorAll('.ant-table-body-outer') || []);
            nodeList?.forEach(node => {
                node.classList.add('auto-height');
            });
        }
        this.props.onParentRender && this.props.onParentRender();
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
        return activeRowKeys.includes(typeof tableRowKey === 'function' ? tableRowKey(record) : record[tableRowKey])
            ? 'ant-table-row-active'
            : '';
    };

    onTagClose = (column, e) => {
        column.filter.clearFilters(1);
        e.stopPropagation();
    };

    onTagClick = column => {
        const tableDom = ReactDOM.findDOMNode(this.refs.selector);
        // const tableHeaderDom = tableDom.querySelector('.ant-table-header');
        const tableBodyDom = tableDom.querySelector('.ant-table-content') || tableDom.querySelector('.ant-table-body');
        if (tableDom && tableBodyDom) {
            tableBodyDom.scrollLeft =
                column.scrollLeft - tableBodyDom.offsetWidth / 2 + (column.width ? column.width / 2 : 0);
            this.setState({
                tagColumn: column,
            });
        }
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
                                if (
                                    typeof column.filter.value[0] === 'number' ||
                                    typeof column.filter.value[1] === 'number'
                                ) {
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
        const { showFilterValue, extraTagBefore, extraTagAfter, extraTagAfterFixed } = this.props;
        const hasValueColumns = this.getHasValueColumns();
        // 是否有已筛选项
        const hasFilterValue = showFilterValue && hasValueColumns.length > 0;
        return !(hasFilterValue || extraTagBefore || extraTagAfter) && extraTagAfterFixed;
    };

    hasDoubleTitle = () => {
        const { columns } = this.state;
        return columns.find(c => c.children?.length);
    }

    // render
    renderData = () => {
        if (this.props.dataSource) {
            this.setState({ dataSource: [...this.props.dataSource] });
        } else {
            this.setState({ data: [...this.state.data] });
        }
    }
    updateConfigColumns = (value) => {
        this.setState({ columns: Object.clone(this.props.columns) }, async () => {
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

    hasExportRight = () => {
        return window.projectName === 'public' ? window.hasRight('NAV_PUBLIC_EXPORT_RIGHT') : true;
    }

    render() {
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
            extraTagAfter,
            extraTagAfterFixed,
            bordered,
            childrenHeight,
            exportOption,
            tableID,
            isReset,
            tableWrapClassName,
            dataSource
        } = this.props;
        const tableRowKey = rowKey || table.rowKey;
        let tableSize = this.props.tableSize || Object.getValue(window, '_user.UserConfig.tableSize', 'auto');
        const hasValueColumns = this.getHasValueColumns();
        // 是否有已筛选项
        const hasFilterValue = showFilterValue && hasValueColumns.length > 0;
        if (tableSize === 'auto') {
            if (window.innerHeight < 550) {
                tableSize = 'small';
            } else if (window.innerHeight < 750) {
                tableSize = 'middle';
            } else {
                tableSize = 'default';
            }
        }

        let lineHeight = 54;
        if (tableSize === 'default') {
            lineHeight = 54;
            if (this.hasDoubleTitle()) {
                lineHeight += 30;
            }
        } else if (tableSize === 'middle') {
            lineHeight = 47;
            if (this.hasDoubleTitle()) {
                lineHeight += 26;
            }
        } else if (tableSize === 'small') {
            lineHeight = 39;
            if (this.hasDoubleTitle()) {
                lineHeight += 20;
            }
        }
        if (table.rowSelection) {
            if (!this.tableRowSelectionOnChange) {
                this.tableRowSelectionOnChange = table.rowSelection.onChange;
            }
            delete table.rowSelection.onChange;
            table.rowSelection.onSelect = this.onRowSelectSelect;
            table.rowSelection.onSelectAll = this.onRowSelectSelectAll;
            table.rowSelection.columnWidth = table.rowSelection.columnWidth || 60;
        }
        if (!table.scroll) {
            table.scroll = {};
        }
        table.scroll.scrollToFirstRowOnChange = true;

        const hasFooter = !Object.isEmpty(footer) && !!totalNum;
        if (autoHeight) {
            const _height = height - lineHeight - 13;
            if (!isNaN(_height)) {
                table.scroll.y = _height - lineHeight;
                table.bodyStyle = { height: `${_height}px` };
            }
            const body = this.refs.selector ? this.refs.selector.querySelector('.ant-table-body') : false;
            if (body) {
                body.style.height = table.scroll.y + 'px';
            }
            if (childrenHeight) {
                const placeholder = this.refs.selector
                    ? this.refs.selector.querySelector('.ant-table-placeholder')
                    : false;
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

        // 剔除不展示的column列
        let visibleColumns = columns.concat();
        const filterColumn = column => {
            if (column.children) {
                column.children = column.children.filter(filterColumn);
            }
            return !column.hidden;
        };
        visibleColumns = visibleColumns.filter(filterColumn);

        return (
            <div className={`selector ${this.hasDoubleTitle() ? 'double-title' : ''} ${tableWrapClassName ? tableWrapClassName : ''}`} ref="selector">
                {(hasFilterValue || extraTagBefore || extraTagAfter) && (
                    <div className="tag-group clearfix" ref="tags">
                        {extraTagBefore && <div className="tag-buttons tag-buttons-left">{extraTagBefore}</div>}
                        {hasFilterValue && <Tag onClick={() => this.onTagReset(hasValueColumns)}>重置</Tag>}
                        {hasValueColumns.map(column => {
                            if (column.filter.text instanceof Array && column.filter.text.length > 0) {
                                return (
                                    <Tooltip
                                        key={column.field}
                                        title={column.filter.text.join('、')}
                                        getPopupContainer={triggerNode => triggerNode.parentElement}
                                    >
                                        <Tag
                                            closable={column.filter.allowClear}
                                            onClose={e => this.onTagClose(column, e)}
                                            onClick={() => this.onTagClick(column)}
                                        >
                                            <span className="tag-name">{column.title}</span>
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
                                        title={'此筛选项不能清空'}
                                        getPopupContainer={triggerNode => triggerNode.parentElement}
                                    >
                                        <Tag
                                            key={column.field}
                                            closable={column.filter.allowClear}
                                            onClose={e => this.onTagClose(column, e)}
                                            onClick={() => this.onTagClick(column)}
                                        >
                                            <span className="tag-name">{column.title}</span>
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
                                        <span className="tag-name">{column.title}</span>
                                        <span className="tag-value">
                                            <Typography.Text ellipsis>{column.filter.text}</Typography.Text>
                                        </span>
                                    </Tag>
                                );
                            }
                        })}
                        {extraTagAfter && <div className="tag-buttons">{extraTagAfter}</div>}
                        {(hasFilterValue || extraTagBefore || extraTagAfter) && (
                            <div className="tag-buttons">{extraTagAfterFixed}</div>
                        )}
                        <style>
                            {`.ant-table-thead > tr > th.selector-tag-${tagColumn.dataIndex ||
                                tagColumn.key} {background: #f5f5f5;}
                            .ant-table-tbody > tr > td.selector-tag-${tagColumn.dataIndex ||
                                tagColumn.key} {background: rgba(0, 0, 0, 0.04);}`}
                        </style>
                    </div>
                )}
                <Table
                    // ref={this.tableRef}
                    columns={visibleColumns}
                    dataSource={dataSource || data}
                    pagination={pagination}
                    loading={loading}
                    bordered={bordered}
                    onChange={this.handleTableChange}
                    rowKey={tableRowKey || (() => index++)}
                    {...(hasFooter
                        ? {
                            summary: () => {
                                let summaryIndex = 0;
                                return (
                                    <Table.Summary.Row>
                                        {
                                            table.expandedRowRender && <Table.Summary.Cell index={summaryIndex++} />
                                        }
                                        {
                                            table.rowSelection && <Table.Summary.Cell index={summaryIndex++} />
                                        }
                                        {columns
                                            .filter(c => !c.hidden)
                                            .map((c, index) =>
                                                c.children ? (
                                                    <React.Fragment key={index}>
                                                        {c.children.map(ch => (
                                                            <Table.Summary.Cell index={summaryIndex + index} colSpan={ch.colSpan ?? 1}>
                                                                {ch.total &&
                                                                    (ch.totalRender
                                                                        ? ch.totalRender(footer[ch.dataIndex] ?? ch.total, footer, ch)
                                                                        : footer[ch.dataIndex] ?? ch.total)}
                                                            </Table.Summary.Cell>
                                                        ))}
                                                    </React.Fragment>
                                                ) : (
                                                    <Table.Summary.Cell key={index} index={summaryIndex + index} colSpan={c.colSpan ?? 1}>
                                                        {c.total &&
                                                            (c.totalRender
                                                                ? c.totalRender(footer[c.dataIndex] ?? c.total, footer, c)
                                                                : footer[c.dataIndex] ?? c.total)}
                                                    </Table.Summary.Cell>
                                                )
                                            )}
                                    </Table.Summary.Row>);
                            }
                        }
                        : {})}
                    rowClassName={table.rowClassName || this.rowClassName}
                    size={tableSize}
                    {...table}
                ></Table>

                {totalNum ? (
                    <div className="totalCount">
                        共<Statistic value={totalNum} />
                        条数据
                        {table && table.rowSelection ? `，已选${selectedRowKeys.length}条` : ''}
                        {table && table.rowSelection && selectedRowKeys.length ? (
                            <A onClick={() => this.onRowSelectChange([], [])}> 清空已选项</A>
                        ) : (
                            ''
                        )}
                        {api && api._export !== false && this.props.enabledExport !== false && this.hasExportRight() && (
                            <A className="exportButton" onClick={() => this.setState({ exportVisible: true })}>
                                导出结果
                            </A>
                        )}
                        {api && api._export !== false && this.props.enabledExport !== false && this.hasExportRight() && api._exportPic && (
                            <A className="exportButton" onClick={() => this.setState({ exportVisiblePic: true })}>
                                导出图片
                            </A>
                        )}
                        {
                            this.props.showConfig && (
                                <>
                                    <span style={{ marginLeft: '10px' }}>|</span>
                                    <A className="exportButton" onClick={() => this.setState({ configVisible: true })}>
                                        <span>{getIcon('icon-peizhi')} </span>
                                        页面配置
                                    </A>
                                </>
                            )
                        }
                    </div>
                ) : (
                    ''
                )}
                <ExcelExport
                    onExportJob={this.animeExport}
                    exportOption={exportOption}
                    visible={exportVisible}
                    onClose={() => this.setState({ exportVisible: false })}
                    {...this.props}
                    {...this.state}
                />
                <ExcelExport
                    onExportJob={this.animeExport}
                    visible={exportVisiblePic}
                    onClose={() => this.setState({ exportVisiblePic: false })}
                    {...this.props}
                    {...this.state}
                    exportOptions={{ exportTitle: api?._exportPicTitle, exportPic: true }}
                />
                <div className="export-file" ref="exportfile">
                    <Avatar icon={<FileExcelOutlined />} style={{ backgroundColor: '#87d068' }} />
                </div>
                {
                    configVisible &&
                    <TableConfig
                        key={Math.random()}
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
                        {...this.props}
                        {...this.state}
                    />
                }

            </div>
        );
    }
}

export default Selector;
