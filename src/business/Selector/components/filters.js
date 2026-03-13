import React, { PureComponent } from 'react';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Checkbox, DatePicker, Radio, InputNumber, Row, Switch, message } from 'antd';
import moment from 'moment';
import { Storage } from '@/utils';
import UserTreeSelect from '../../tree/userTreeSelect';
import ParkTreeSelect from '../../tree/parkTreeSelect';
import LicencePlateInput from '../../licencePlateInput/licencePlateInput';
import LicencePlateInputV2 from '../../licencePlateInputV2/licencePlateInputV2';
import District from './district';
import CustomCascade from './cascade';

class Filters extends PureComponent {
    static getColumnSearchProps = (column, selector) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                //deleteFlag关闭=1，小重置=2，大重置=0
                const defaultValue = selector.defaultValue[column.field];
                let fetch = false;
                if (deleteFlag === 1 || (selector.currentValue[column.field] !== defaultValue && deleteFlag)) {
                    fetch = true;
                }
                column.filter.value = deleteFlag === 1 ? undefined : defaultValue;
                column.filter.text = deleteFlag === 1 ? undefined : defaultValue;
                const currentDataIndex = column.filter.reverse ? column.filter.reverseDataIndex : column.filter.dataIndex || column.dataIndex || column.key;
                selector.currentValue[currentDataIndex] = deleteFlag === 1 ? undefined : defaultValue;
                selector.filtersList[column.field] = '';
                column.filter.selectedKeys = column.filter.value;
                column.filterDropdownVisible = false;
                fetch && selector.filterChange(selector.currentValue);
                selector.updateState();
            };
            const title = typeof column.title === 'string' ? column.title : column.title?.props?.children?.[0];
            return (
                <div className="selector-filter-box">
                    <Input
                        ref={node => {
                            column.filter.node = node;
                        }}
                        placeholder={column.filter?.placeholder ? column.filter?.placeholder : `搜索 ${title}`}
                        onChange={e => {
                            if (e.target.value.length > 100) {
                                message.warning('搜索框内容长度不能超过100');
                                e.target.value = e.target.value.slice(0, 100);
                            }
                            column.filter.selectedKeys = e.target.value;
                            selector.updateState();
                        }}
                        value={column.filter.selectedKeys}
                        onPressEnter={() => {
                            const value = (column.filter.selectedKeys || '').trim();
                            column.filter.value = value;
                            column.filter.text = value;
                            selector.currentValue[column.field] = value;
                            column.filterDropdownVisible = false;
                            selector.filterChange(this.currentValue);
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button onClick={() => column.filter.clearFilters(2)} size="small" style={{ width: 90, marginRight: 8 }}>
                        重置
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            const value = (column.filter.selectedKeys || '').trim();
                            column.filter.value = value;
                            column.filter.text = value;
                            selector.currentValue[column.field] = value;
                            column.filterDropdownVisible = false;

                            if (column.filter.reverse) {
                                selector.currentValue[column.filter.reverseDataIndex] = column.filter.value;
                                selector.currentValue[column.filter.dataIndex || column.dataIndex || column.key] = undefined;
                                column.filter.text = `排除-${value}`;
                            } else {
                                selector.currentValue[column.filter.dataIndex || column.dataIndex || column.key] = column.filter.value;
                                selector.currentValue[column.filter.reverseDataIndex] = undefined;
                                column.filter.text = value;
                            }

                            selector.filterChange(selector.currentValue);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    {column.filter.reverseDataIndex && (
                        <Switch
                            defaultChecked={false}
                            checked={column.filter.reverse}
                            onChange={checked => {
                                column.filter.reverse = checked;
                                selector.updateState();
                            }}
                            style={{ marginLeft: 4 }}
                            checkedChildren="开启反向"
                            unCheckedChildren="关闭反向"
                        />
                    )}
                </div>
            );
        },
        filterIcon: () => (column.filter.value ? <SearchOutlined className="ant-table-filter-selected" /> : <SearchOutlined style={{ color: '#bfbfbf' }} />),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                column.filterDropdownVisible = true;
                setTimeout(() => column.filter.node?.select?.());
            } else {
                column.filterDropdownVisible = false;
            }
            selector.updateState();
        },
    });

    static getColumnItemsProps = (column, selector) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                //deleteFlag关闭=1，小重置=2，大重置=0
                const defaultValue = selector.defaultValue[column.field];
                let fetch = false;
                if (deleteFlag === 1 || (!Object.equal(selector.state.lastParams[column.field], defaultValue) && deleteFlag)) {
                    fetch = true;
                }
                column.filter.value = deleteFlag === 1 ? undefined : defaultValue;
                column.filter.text = column.filter.items?.filter?.(item => column.filter.value?.includes?.(item.value)).map(item => item.text);
                selector.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                column.filterDropdownVisible = false;
                column.filter.selectedKeys = column.filter.value;
                fetch && selector.filterChange(selector.currentValue);
                selector.updateState();
            };
            return (
                <>
                    {column.filter.showSearch && (
                        <div style={{ padding: '8px 8px 0' }}>
                            <Input
                                placeholder={`请搜索${column.title}`}
                                prefix={<SearchOutlined />}
                                value={column.filterState?.searchText || ''}
                                onChange={e => {
                                    const searchText = e.target.value;
                                    if (!column.filterState) {
                                        column.filterState = {};
                                    }
                                    column.filterState.searchText = searchText;
                                    selector.updateState();
                                }}
                                style={{ width: '100%', borderRadius: 16 }}
                            />
                        </div>
                    )}
                    <ul className="ant-dropdown-menu ant-dropdown-menu-without-submenu ant-dropdown-menu-root ant-dropdown-menu-vertical">
                        <Checkbox.Group
                            value={column.filter.selectedKeys}
                            onChange={value => {
                                let newValue = [...value];
                                if (column.filter.single) {
                                    if (newValue.length === 2) {
                                        newValue = newValue.filter(val => !column.filter.oldSelectedKeys.includes(val));
                                    }
                                }
                                column.filter.selectedKeys = newValue;
                                column.filter.oldSelectedKeys = [...newValue];
                                selector.updateState();
                            }}
                            style={{ width: '100%' }}
                        >
                            {
                                // 筛选中剔除不显示的项
                                column?.filter?.items
                                    ?.filter?.(item => !item.hidden)
                                    ?.filter?.(item => {
                                        if (!column.filterState?.searchText) {
                                            return true;
                                        }
                                        return item.text?.toLowerCase().includes(column.filterState?.searchText.toLowerCase());
                                    })
                                    .map(item => (
                                        <li key={item.value + item.text} className="ant-dropdown-menu-item">
                                            <Checkbox key={item.value + item.text} value={item.value} checked={true} style={{ width: '100%' }}>
                                                {item.text}
                                            </Checkbox>
                                        </li>
                                    ))
                            }
                        </Checkbox.Group>
                    </ul>
                    <div className="ant-table-filter-dropdown-btns">
                        <Button type="link" size="small" onClick={() => column.filter.clearFilters(2)}>
                            重置
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                column.filter.value = column.filter.selectedKeys || [];
                                column.filter.text = column?.filter?.items?.filter?.(item => column.filter.value.includes(item.value)).map(item => item.text);

                                selector.currentValue[column.field] = column.filter.selectedKeys || [];
                                column.filterDropdownVisible = false;
                                selector.filterChange(selector.currentValue);
                            }}
                        >
                            确定
                        </Button>
                    </div>
                </>
            );
        },
        filterIcon: () =>
            !column.filter.value || column.filter.value.length === 0 ? (
                <FilterFilled style={{ color: '#bfbfbf' }} />
            ) : (
                <FilterFilled className="ant-table-filter-selected" />
            ),
        onFilterDropdownVisibleChange: visible => {
            column.filterDropdownVisible = visible;
            selector.updateState();
        },
    });

    static timeText = new Map([
        ['oneHour', '近一小时'],
        ['eightHour', '近八小时'],
        ['twentyFourHour', '近24小时'],
        ['twentyFourHourJustHour', '近24小时'], // 仅以小时为准的近24小时，取值范围是昨天的当前小时起点，到今天的上一小时结束
        ['lastHour', '上一小时'],
        ['currentHour', '当前小时'],
        ['currentDay', '今天'],
        ['yesterday', '昨天'],
        ['twodaysago', '前天'],
        ['today', '今天'],
        ['lastWeek', '上周'],
        ['currentWeek', '本周'],
        ['last7days', '近7天'],
        ['past7days', '近7天'], // 不包含今天
        ['last14days', '近14天'],
        ['past14days', '近14天'], // 不包含今天
        ['currentMonth', '本月'],
        ['last30days', '近30天'],
        ['past30days', '近30天'], // 不包含今天
        ['lastMonth', '上月'],
        ['currentQuarter', '本季度'],
        ['lastQuarter', '上季度'],
        ['lastYear', '去年'],
        ['currentYear', '本年'],
        ['remainThirtyDays', '30天内到期'],
        ['remainFifteenDays', '15天内到期'],
        ['remainFiveDays', '5天内到期'],
        ['remainThreeDays', '3天内到期'],
        ['remainOneDay', '1天内到期'],
        ['overdue', '超期当天'],
        ['overdueFive', '超期5天以上'],
        ['overdueFifteen', '超期15天以上'],
        ['overdueThirty', '超期30天以上'],
        ['overdueSixty', '超期60天以上'],
    ]);

    static getTimeList = list => {
        var ranges = [];
        list &&
            list.forEach(time => {
                ranges.push({
                    text: Filters.timeText.get(time),
                    key: time,
                    value: Filters.range(time),
                });
            });
        return ranges;
    };

    static range(time) {
        if (time === 'none') {
            return [];
        }
        let startTime = moment();
        let endTime = moment();
        if (time.indexOf('current') === 0) {
            time = time.substr(7);
        }
        switch (time.toLowerCase()) {
            case 'onehour':
                startTime = moment().subtract(1, 'hour');
                endTime = moment();
                break;
            case 'eighthour':
                startTime = moment().subtract(8, 'hour');
                endTime = moment();
                break;
            case 'twentyfourhour':
                startTime = moment().subtract(24, 'hour');
                endTime = moment();
                break;
            case 'twentyfourhourjusthour':
                startTime = moment().subtract(24, 'hour').startOf('hour');
                endTime = moment().subtract(1, 'hour').endOf('hour');
                break;
            case 'lasthour':
                startTime = moment().subtract(1, 'hour').startOf('hour');
                endTime = moment().subtract(1, 'hour').endOf('hour');
                break;
            case 'today':
                startTime = moment().startOf('day');
                endTime = moment().endOf('day');
                break;
            case 'yesterday':
                startTime = moment().subtract(1, 'day').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            case 'twodaysago':
                startTime = moment().subtract(2, 'day').startOf('day');
                endTime = moment().subtract(2, 'day').endOf('day');
                break;
            case 'lastweek':
                startTime = moment().subtract(1, 'week').startOf('week');
                endTime = moment().subtract(1, 'week').endOf('week');
                break;
            case 'last7days':
                startTime = moment().subtract(6, 'days').startOf('day');
                endTime = moment().endOf('day');
                break;
            case 'past7days':
                startTime = moment().subtract(7, 'days').startOf('day');
                endTime = moment().subtract(1, 'days').endOf('day');
                break;
            case 'last14days':
                startTime = moment().subtract(13, 'days').startOf('day');
                endTime = moment().endOf('day');
                break;
            case 'past14days':
                startTime = moment().subtract(14, 'days').startOf('day');
                endTime = moment().subtract(1, 'days').endOf('day');
                break;
            case 'last30days':
                startTime = moment().subtract(30, 'days').startOf('day');
                endTime = moment().endOf('day');
                break;
            case 'past30days':
                startTime = moment().subtract(30, 'days').startOf('day');
                endTime = moment().subtract(1, 'days').endOf('day');
                break;
            case 'lastmonth':
                startTime = moment().subtract(1, 'month').startOf('month');
                endTime = moment().subtract(1, 'month').endOf('month');
                break;
            case 'lastyear':
                startTime = moment().subtract(1, 'year').startOf('year');
                endTime = moment().subtract(1, 'year').endOf('year');
                break;
            case 'remainthirtydays':
                startTime = moment().startOf('day');
                endTime = moment().add(29, 'day').endOf('day');
                break;
            case 'remainfifteendays':
                startTime = moment().startOf('day');
                endTime = moment().add(14, 'day').endOf('day');
                break;
            case 'remainfivedays':
                startTime = moment().startOf('day');
                endTime = moment().add(4, 'day').endOf('day');
                break;
            case 'remainthreedays':
                startTime = moment().startOf('day');
                endTime = moment().add(2, 'day').endOf('day');
                break;
            case 'remainoneday':
                startTime = moment().startOf('day');
                endTime = moment().endOf('day');
                break;
            case 'overdue':
                startTime = moment().subtract(1, 'day').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            case 'overduefive':
                startTime = moment('1970-01-01');
                endTime = moment().subtract(5, 'day').endOf('day');
                break;
            case 'overduefifteen':
                startTime = moment('1970-01-01');
                endTime = moment().subtract(15, 'day').endOf('day');
                break;
            case 'overduethirty':
                startTime = moment('1970-01-01');
                endTime = moment().subtract(30, 'day').endOf('day');
                break;
            case 'overduesixty':
                startTime = moment('1970-01-01');
                endTime = moment().subtract(60, 'day').endOf('day');
                break;
            default:
                if (time === 'Week') {
                    time = 'isoWeek';
                }
                startTime = moment().startOf(time);
                endTime = moment().endOf(time);
                break;
        }
        return [startTime, endTime];
    }

    static onDateTimeChange = (moments, column, radioValue, currentText) => {
        // 如果开始时间大于结束时间，则调换顺序
        if (moments.length >= 2 && moments[0].isAfter(moments[1])) {
            [moments[0], moments[1]] = [moments[1], moments[0]];
        }
        let currentValue = Filters.getMomentsValue(moments, column);
        let returnValue;
        let startTimeName = column.filter.startTimeName || column.field;
        let endTimeName = column.filter.endTimeName || column.field;
        if (startTimeName !== endTimeName) {
            returnValue = {};
            if (moments.length > 0) {
                returnValue[startTimeName] = currentValue[0];
                returnValue[endTimeName] = currentValue[1];
            } else {
                returnValue[startTimeName] = undefined;
                returnValue[endTimeName] = undefined;
                radioValue = 'none';
            }
        } else {
            if (moments.length > 0) {
                returnValue = currentValue;
            } else {
                returnValue = [];
                radioValue = 'none';
            }
        }
        column.filter.text = Filters.timeText.get(radioValue);
        column.filter.moments = moments;
        column.filter._moments = moments;
        column.filter.value = returnValue;
        if (!column.filter.text && moments?.length > 0) {
            radioValue = 'other';
            if (currentText) {
                if (column.filter.type === 'weeks') {
                    column.filter.text = currentText[0] + ' ~ ' + currentText[1];
                } else {
                    column.filter.text = currentText;
                }
                if (column.filter.type === 'week') {
                    if (currentText[0] && currentText[0].lastIndexOf('周') !== -1) {
                        currentText[0] = currentText[0].substr(0, currentText[0].length - 1);
                    }
                    if (currentText[1] && currentText[1].lastIndexOf('周') !== -1) {
                        currentText[1] = currentText[1].substr(0, currentText[1].length - 1);
                    }
                }
                returnValue = currentText;
            } else {
                if (moments[0] && moments[1]) {
                    column.filter.text =
                        moments[0].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') +
                        ' ~ ' +
                        moments[1].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD');
                } else if (moments[0]) {
                    column.filter.text = moments[0].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') + '之后';
                } else if (moments[1]) {
                    column.filter.text = moments[1].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') + '之前';
                }
                if (column.filter.type === 'months') {
                    column.filter.text = moments[0].format('YYYY-MM') + ' ~ ' + moments[1].format('YYYY-MM');
                    if (moments[0].format('YYYY-MM') === moments[1].format('YYYY-MM')) {
                        column.filter.text = moments[0].format('YYYY-MM');
                    }
                } else if (column.filter.type === 'month') {
                    column.filter.text = moments[0].format('YYYY-MM');
                } else if (column.filter.type === 'weeks') {
                    column.filter.text = moments[0].format('YYYY-wo') + ' ~ ' + moments[1].format('YYYY-wo');
                    if (moments[0].format('YYYY-wo') === moments[1].format('YYYY-wo')) {
                        column.filter.text = moments[0].format('YYYY-wo');
                    }
                } else if (column.filter.type === 'week') {
                    column.filter.text = moments[0].format('YYYY-wo');
                } else if (column.filter.type === 'years') {
                    column.filter.text = moments[0].format('YYYY') + ' ~ ' + moments[1].format('YYYY');
                    if (moments[0].format('YYYY') === moments[1].format('YYYY')) {
                        column.filter.text = moments[0].format('YYYY');
                    }
                } else if (column.filter.type === 'year') {
                    column.filter.text = moments[0].format('YYYY');
                } else if (column.filter.type === 'day') {
                    column.filter.text = moments[0].format('YYYY-MM-DD') + ' ~ ' + moments[0].format('YYYY-MM-DD');
                    if (moments[0].format('YYYY-MM') === moments[1].format('YYYY-MM')) {
                        if (moments[0].format('DD') === moments[1].format('DD')) {
                            column.filter.text = moments[0].format('YYYY-MM') + '-' + moments[0].format('DD');
                        } else {
                            column.filter.text = moments[0].format('YYYY-MM') + moments[0].format('DD') + '~' + moments[1].format('DD');
                        }
                    }
                }
            }
        }
        column.filter.radioValue = radioValue;
        return returnValue instanceof Array ? returnValue : [returnValue];
    };
    static onRangePickerChange = (moments, column, defaultValue) => {
        let currentValue = {};
        let startTimeName = column.filter.startTimeName || column.children[0].dataIndex;
        let endTimeName = column.filter.endTimeName || column.children[1].dataIndex;
        if (moments.length > 0) {
            currentValue[startTimeName] = moments[0].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm:00' : 'YYYY-MM-DD 00:00:00');
            currentValue[endTimeName] = moments[1].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm:59' : 'YYYY-MM-DD 23:59:59');
        } else {
            currentValue[startTimeName] = undefined;
            currentValue[endTimeName] = undefined;
            defaultValue = 'none';
        }
        column.filter.value = moments;
        column.filter.defaultValue = defaultValue;
        if (defaultValue === 'other') {
            column.filter.text =
                moments[0].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') +
                ' ~ ' +
                moments[1].format(column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD');
        } else {
            column.filter.text = Filters.timeText.get(defaultValue);
        }
        return currentValue;
    };

    // 通过值获取格式化后时间
    static getMomentsValue = (moments, column) => {
        if (!moments.length) {
            return [];
        }
        if (!moments[0]) {
            moments[0] = '';
        }
        if (!moments[1]) {
            moments[1] = '';
        }
        if (column.filter.type === 'months') {
            return [moments[0].startOf('month').format('YYYY-MM-DD 00:00:00'), moments[1].endOf('month').format('YYYY-MM-DD 23:59:59')];
        }
        if (column.filter.type === 'day') {
            return [
                moments[0].startOf('day').format(column.filter.noTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD 00:00:00'),
                moments[0].endOf('day').format(column.filter.noTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD 23:59:59'),
            ];
        }
        if (column.filter.type === 'week') {
            return [moments[0].startOf('week').format('YYYY-wo')];
        }
        if (column.filter.type === 'weeks') {
            return [moments[0].startOf('week').format('YYYY-wo'), moments[1].startOf('week').format('YYYY-wo')];
        }
        return [
            moments[0].format(column.filter.noTime ? 'YYYY-MM-DD' : column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm:00' : 'YYYY-MM-DD 00:00:00'),
            moments[1].format(column.filter.noTime ? 'YYYY-MM-DD' : column.filter.hasFilterTime ? 'YYYY-MM-DD HH:mm:59' : 'YYYY-MM-DD 23:59:59'),
        ];
    };

    // maxDay 最大可选的天数。设置后，一次只能选择该天数范围内的日期
    static disabledDate = (current, column) => {
        if (typeof column.filter.disabledDate === 'function') {
            return column.filter.disabledDate(current, column);
        }
        if (column.filter.maxDay) {
            if (column.filter._moments) {
                // return current > column.filter.moments[0] && current.diff(column.filter.moments[0], 'days') > column.filter.maxDay;
                const tooLate = column.filter._moments[0] && current.diff(column.filter._moments[0], 'days') > column.filter.maxDay;
                const tooEarly = column.filter._moments[1] && column.filter._moments[1].diff(current, 'days') > column.filter.maxDay;
                return tooEarly || tooLate;
            }
        }
        return false;
    };
    static getColumnDateProps = (column, selector) => ({
        filterDropdown: ({ close }) => {
            column.filter.clearFilters = deleteFlag => {
                if (column.filter.defaultValue !== undefined && deleteFlag !== 1) {
                    if (column.filter.defaultValue instanceof Array) {
                        if (column.filter.defaultValue[0] instanceof moment) {
                            column.filter.value = column.filter.defaultValue;
                        } else {
                            column.filter.value = [moment(column.filter.defaultValue[0]), moment(column.filter.defaultValue[1])];
                        }
                    } else {
                        column.filter.value = Filters.range(column.filter.defaultValue);
                    }

                    let currentValue = Filters.onDateTimeChange(column.filter.value, column, column.filter.defaultValue);
                    if (column.filter.type === 'week') {
                        if (currentValue[0] && currentValue[0].lastIndexOf('周') !== -1) {
                            currentValue[0] = currentValue[0].substr(0, currentValue[0].length - 1);
                        }
                        if (currentValue[1] && currentValue[1].lastIndexOf('周') !== -1) {
                            currentValue[1] = currentValue[1].substr(0, currentValue[1].length - 1);
                        }
                    }
                    if (currentValue[0] instanceof Object) {
                        selector.currentValue = { ...selector.defaultValue, ...currentValue[0] };
                    } else {
                        selector.currentValue[column.field] = currentValue;
                    }
                } else {
                    column.filteredValue = column.filter.value = [];
                    column.filter.text = '';
                    column.filter.moments = [];
                    column.filter.radioValue = 'none';
                    column.filteredValue = Filters.onDateTimeChange([], column, column.filter.radioValue);
                    if (column.filteredValue[0] instanceof Object) {
                        selector.currentValue = { ...selector.currentValue, ...column.filteredValue[0] };
                    } else {
                        selector.currentValue[column.field] = column.filteredValue;
                    }
                }
                column.filterDropdownVisible = false;
                if (deleteFlag) {
                    selector.filterChange();
                }
            };
            const allRanges = {
                本年: [moment().startOf('year'), moment().endOf('year')],
                去年: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
                上季度: [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
            };
            let ranges = {};
            const SystemConfig = Storage.get('SystemConfig');
            // showBottomRanges 默认不配置时，显示，false 不显示
            if (SystemConfig?.tableFilterDatePickerRanges && column.filter.showBottomRanges !== false) {
                SystemConfig.tableFilterDatePickerRanges.forEach(range => {
                    if (allRanges[range]) {
                        ranges[range] = allRanges[range];
                    }
                });
            }
            return (
                <div className="selector-filter-box">
                    <DatePicker.RangePicker
                        allowClear={column.filter.allowClear === undefined ? false : column.filter.allowClear}
                        value={column.filter._moments || column.filter.moments}
                        {...(column.filter.hasFilterTime
                            ? {
                                  showTime: {
                                      format: column.filter.format || 'HH:mm',
                                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                  },
                                  format: 'YYYY-MM-DD',
                              }
                            : {})}
                        {...(column.filter.type === 'months'
                            ? {
                                  format: 'YYYY-MM',
                                  picker: 'month',
                              }
                            : {})}
                        {...(column.filter.type === 'weeks'
                            ? {
                                  format: 'YYYY-wo',
                                  picker: 'week',
                              }
                            : {})}
                        {...(column.filter.type === 'years'
                            ? {
                                  format: 'YYYY',
                                  picker: 'year',
                              }
                            : {})}
                        disabledDate={current => Filters.disabledDate(current, column, selector)}
                        open={column.filter._open}
                        onCalendarChange={val => {
                            if (column.filter.maxDay) {
                                if (!val[0]) {
                                    val[0] = moment(val[1]).subtract(column.filter.maxDay, 'days');
                                }
                                if (!val[1] || val[1].diff(val[0], 'days') > column.filter.maxDay) {
                                    val[1] = moment(val[0]).add(column.filter.maxDay, 'days');
                                    message.warn(`最多只能查询${column.filter.maxDay}天的数据`);
                                }
                            }
                            column.filter._moments = val;
                        }}
                        onOpenChange={open => {
                            // if (open) {
                            //     column.filter._moments = [];
                            // } else {
                            //     column.filter._moments = undefined;
                            // }
                            column.filter._open = open;
                            selector.updateState();
                            if (!open) {
                                close && close();
                            }
                            // delete column.filter._justOneValue;
                        }}
                        onChange={(moments, dateString) => {
                            if (!moments) {
                                column.filter.moments = moments;
                            } else {
                                if (column.filter.hasFilterTime) {
                                    column.filter.moments = moments;
                                    const value = Filters.onDateTimeChange(moments, column, 'other');
                                    if (value[0] instanceof Object) {
                                        selector.currentValue = { ...selector.currentValue, ...value[0] };
                                    } else {
                                        selector.currentValue[column.field] = value;
                                    }
                                } else {
                                    if (column.filter.type === 'weeks' && !column.filter.showFormat) {
                                        const value = Filters.onDateTimeChange(moments, column, 'other', dateString);
                                        if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                            value[0] = value[0].substr(0, value[0].length - 1);
                                        }
                                        if (value[1] && value[1].lastIndexOf('周') !== -1) {
                                            value[1] = value[1].substr(0, value[1].length - 1);
                                        }
                                        selector.currentValue[column.field] = value;
                                    } else {
                                        const value = Filters.onDateTimeChange(moments, column, 'other');
                                        if (column.filter.type === 'week') {
                                            if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                                value[0] = value[0].substr(0, value[0].length - 1);
                                            }
                                            if (value[1] && value[1].lastIndexOf('周') !== -1) {
                                                value[1] = value[1].substr(0, value[1].length - 1);
                                            }
                                        }
                                        if (value[0] instanceof Object) {
                                            selector.currentValue = { ...selector.currentValue, ...value[0] };
                                        } else {
                                            selector.currentValue[column.field] = value;
                                        }
                                    }
                                }
                                // if (column.filter._justOneValue) {
                                //     column.filterDropdownVisible = false;
                                //     column.filter._open = false;
                                // } else {
                                //     column.filter._justOneValue = true;
                                // }
                                selector.filterChange();
                            }
                        }}
                        onOk={moments => {
                            const value = Filters.onDateTimeChange(moments, column, 'other');
                            if (column.filter.type === 'week') {
                                if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                    value[0] = value[0].substr(0, value[0].length - 1);
                                }
                                if (value[1] && value[1].lastIndexOf('周') !== -1) {
                                    value[1] = value[1].substr(0, value[1].length - 1);
                                }
                            }
                            if (value[0] instanceof Object) {
                                selector.currentValue = { ...selector.currentValue, ...value[0] };
                            } else {
                                selector.currentValue[column.field] = value;
                            }
                            // column.filterDropdownVisible = false;
                            // column.filter._open = false;
                            // close && close();
                            selector.filterChange();
                        }}
                        ranges={ranges}
                    />
                    <Radio.Group
                        buttonStyle="solid"
                        className="time-radio"
                        value={column.filter.radioValue}
                        defaultValue={column.filter.defaultValue}
                        onChange={e => {
                            const currentValue = e.target.value;
                            const moments = Filters.range(currentValue);
                            const value = Filters.onDateTimeChange(moments, column, currentValue);
                            if (column.filter.type === 'week') {
                                if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                    value[0] = value[0].substr(0, value[0].length - 1);
                                }
                                if (value[1] && value[1].lastIndexOf('周') !== -1) {
                                    value[1] = value[1].substr(0, value[1].length - 1);
                                }
                            }
                            if (value[0] instanceof Object) {
                                selector.currentValue = { ...selector.currentValue, ...value[0] };
                            } else {
                                selector.currentValue[column.field] = value;
                            }
                            column.filterDropdownVisible = false;
                            selector.filterChange();
                        }}
                    >
                        {column.filter.type === 'weeks' || column.filter.type === 'years'
                            ? Filters.getTimeList(column.filter.datePeriods).map(item => (
                                  <Radio.Button className="time-radio-item" style={{ width: '50%' }} value={item.key} key={item.value}>
                                      {item.text || item.name}
                                  </Radio.Button>
                              ))
                            : Filters.getTimeList(column.filter.datePeriods).map(item => (
                                  <Radio.Button className="time-radio-item" value={item.key} key={item.key}>
                                      {item.text || item.name}
                                  </Radio.Button>
                              ))}
                    </Radio.Group>
                </div>
            );
        },
        filterIcon: () =>
            !column.filter.radioValue || column.filter.radioValue === 'none' ? (
                <FilterFilled style={{ color: '#bfbfbf' }} />
            ) : (
                <FilterFilled className={'ant-table-filter-selected'} />
            ),
        onFilterDropdownVisibleChange: visible => {
            column.filterDropdownVisible = visible;
            selector.updateState();
        },
    });

    static getColumnDayProps = (column, selector) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                if (column.filter.defaultValue !== undefined && deleteFlag !== 1) {
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
                    if (column.filter.type === 'week') {
                        if (currentValue[0] && currentValue[0].lastIndexOf('周') !== -1) {
                            currentValue[0] = currentValue[0].substr(0, currentValue[0].length - 1);
                        }
                        if (currentValue[1] && currentValue[1].lastIndexOf('周') !== -1) {
                            currentValue[1] = currentValue[1].substr(0, currentValue[1].length - 1);
                        }
                    }
                    if (currentValue[0] instanceof Object) {
                        selector.currentValue = { ...selector.defaultValue, ...currentValue[0] };
                    } else {
                        selector.currentValue[column.field] = currentValue;
                    }
                } else {
                    column.filteredValue = column.filter.value = [];
                    column.filter.text = '';
                    column.filter.moments = [];
                    column.filter.radioValue = 'none';
                    column.filteredValue = Filters.onDateTimeChange([], column, column.filter.radioValue);
                    if (column.filteredValue[0] instanceof Object) {
                        selector.currentValue = { ...selector.currentValue, ...column.filteredValue[0] };
                    } else {
                        selector.currentValue[column.field] = column.filteredValue;
                    }
                }
                column.filterDropdownVisible = false;
                if (deleteFlag) {
                    selector.filterChange();
                }
            };
            return (
                <div className="selector-filter-box">
                    <DatePicker
                        allowClear={column.filter.allowClear === undefined ? false : column.filter.allowClear}
                        value={Array.isArray(column.filter.moments) ? column.filter.moments?.[0] || moment() : column.filter.moments}
                        {...(column.filter.type === 'day'
                            ? {
                                  format: 'YYYY-MM-DD',
                                  picker: 'date',
                              }
                            : {})}
                        {...(column.filter.type === 'week'
                            ? {
                                  format: 'YYYY-wo',
                                  picker: 'week',
                              }
                            : {})}
                        {...(column.filter.type === 'month'
                            ? {
                                  format: 'YYYY-MM',
                                  picker: 'month',
                              }
                            : {})}
                        {...(column.filter.type === 'quarter'
                            ? {
                                  picker: 'quarter',
                              }
                            : {})}
                        {...(column.filter.type === 'year'
                            ? {
                                  format: 'YYYY',
                                  picker: 'year',
                              }
                            : {})}
                        {...(column.filter.disabledToday
                            ? {
                                  disabledDate: date => {
                                      return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') || moment(date).isAfter(moment());
                                  },
                              }
                            : {})}
                        open={column.filter._open}
                        onOpenChange={open => {
                            column.filter._open = open;
                            selector.updateState();
                        }}
                        onChange={(moments, dateString) => {
                            if (!moments) {
                                column.filter.moments = moments;
                                selector.updateState();
                            } else {
                                column.filter.moments = [moment(moments).startOf(column.filter.type), moment(moments).endOf(column.filter.type)];
                                if ((column.filter.type === 'week' || column.filter.type === 'quarter') && !column.filter.showFormat) {
                                    let value = Filters.onDateTimeChange(column.filter.moments, column, 'other', dateString);
                                    if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                        value[0] = value[0].substr(0, value[0].length - 1);
                                    }
                                    selector.currentValue[column.field] = value;
                                } else {
                                    const value = Filters.onDateTimeChange(column.filter.moments, column, 'other');
                                    if (value[0] instanceof Object) {
                                        selector.currentValue = { ...selector.currentValue, ...value[0] };
                                    } else {
                                        selector.currentValue[column.field] = value;
                                    }
                                }
                                column.filterDropdownVisible = false;
                                column.filter._open = false;
                                selector.filterChange();
                            }
                        }}
                    />
                    <Radio.Group
                        buttonStyle="solid"
                        className="day-radio"
                        value={column.filter.radioValue}
                        defaultValue={column.filter.defaultValue}
                        onChange={e => {
                            const currentValue = e.target.value;
                            const moments = Filters.range(currentValue);
                            const value = Filters.onDateTimeChange(moments, column, currentValue);
                            if (column.filter.type === 'week') {
                                if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                    value[0] = value[0].substr(0, value[0].length - 1);
                                }
                                if (value[1] && value[1].lastIndexOf('周') !== -1) {
                                    value[1] = value[1].substr(0, value[1].length - 1);
                                }
                            }
                            if (value[0] instanceof Object) {
                                selector.currentValue = { ...selector.currentValue, ...value[0] };
                            } else {
                                selector.currentValue[column.field] = value;
                            }
                            column.filterDropdownVisible = false;
                            selector.filterChange();
                        }}
                    >
                        {Filters.getTimeList(column.filter.datePeriods).map(item => (
                            <Radio.Button className="time-radio-item" value={item.key} key={item.value}>
                                {item.text || item.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            );
        },
        filterIcon: () =>
            !column.filter.radioValue || column.filter.radioValue === 'none' ? (
                <FilterFilled style={{ color: '#bfbfbf' }} />
            ) : (
                <FilterFilled className="ant-table-filter-selected" />
            ),
        onFilterDropdownVisibleChange: visible => {
            column.filterDropdownVisible = visible;
            selector.updateState();
        },
    });

    static getColumnRangeProps = column => ({
        filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => {
            column.filter.clearFilters = () => {
                if (column.filter.initialValue !== undefined) {
                    column.filter.defaultValue = column.filter.initialValue;
                    Filters.onRangePickerChange(Filters.range(column.filter.defaultValue), column, column.filter.defaultValue);
                } else {
                    column.filter.value = [];
                    column.filter.text = '';
                    column.filter.defaultValue = 'none';
                }
                clearFilters();
            };
            return (
                <div className="selector-filter-box range-picker">
                    <DatePicker.RangePicker
                        allowClear={column.filter.allowClear === undefined ? false : column.filter.allowClear}
                        value={column.filter.value}
                        onChange={e => {
                            const value = Filters.onRangePickerChange(e, column, 'other');
                            setSelectedKeys(value);
                            confirm();
                        }}
                    />
                    <Radio.Group
                        buttonStyle="solid"
                        className="time-radio"
                        value={column.filter.defaultValue}
                        onChange={e => {
                            const value = Filters.onRangePickerChange(Filters.range(e.target.value), column, e.target.value);
                            setSelectedKeys(value);
                            confirm();
                        }}
                    >
                        {Filters.getTimeList(column.filter.datePeriods).map(item => (
                            <Radio.Button className="time-radio-item" value={item.key} key={item.value}>
                                {item.text || item.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            );
        },
        // filteredValue: {a: 1},
        filterIcon: () => <FilterFilled className={column.filter.defaultValue === 'none' ? '' : 'ant-table-filter-selected'} />,
    });

    static async getColumnOperatorsProps(column, param, selector) {
        // 人员筛选器的树结构接口查询车场人员需要通过parkID查询，所以使用人员树筛选器的页面要传进来parkID
        return {
            filterDropdown: () => {
                // const param = (column.filter.param instanceof Function ? column.filter.param(column) : column.filter.param) ||
                //             selector.props.param;
                column.filter.clearFilters = deleteFlag => {
                    //deleteFlag关闭=1，小重置=2，大重置=0
                    const defaultValue = selector.defaultValue[column.field];
                    let fetch = false;
                    if (deleteFlag === 1 || (!Object.equal(selector.state.lastParams[column.field], defaultValue) && deleteFlag)) {
                        fetch = true;
                    }
                    column.filter.value = deleteFlag === 1 ? [] : defaultValue;
                    // column.filter.text = column.filter.items?.filter?.(item => column.filter.value?.includes?.(item.value)).map(item => item.text);
                    column.filter.text = deleteFlag === 1 ? [] : column.filter.defaultText;
                    selector.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                    column.filterDropdownVisible = false;
                    column.filter.selectedLabels = column.filter.selectedKeys = column.filter.value;
                    fetch && selector.filterChange(selector.currentValue);
                    selector.updateState();
                };
                return (
                    <div className="selector-filter-box">
                        <Button
                            onClick={() => {
                                column.filter.clearFilters(2);
                            }}
                            size="small"
                            style={{ width: 90, marginBottom: 10 }}
                        >
                            重置
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                column.filter.value = column.filter.selectedKeys;
                                column.filter.text = column.filter.selectedLabels;
                                selector.currentValue[column.field] = column.filter.value;
                                column.filterDropdownVisible = false;
                                selector.filterChange(selector.currentValue);
                            }}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90, float: 'right' }}
                        >
                            搜索
                        </Button>
                        <UserTreeSelect
                            param={param}
                            value={column.filter.selectedKeys?.map?.(item => 'user_' + item) || []}
                            selectableType="user"
                            onChange={(value, label) => {
                                const userids = value.map(item => item.replace('user_', ''));
                                column.filter.selectedKeys = userids;
                                column.filter.selectedLabels = label;
                                selector.updateState();
                            }}
                            treeSelectProps={{
                                multiple: true,
                                allowClear: true,
                                style: { width: 250 },
                                placeholder: '点击选择人员',
                            }}
                        />
                    </div>
                );
            },
            filterIcon: () =>
                !Object.isEmpty(column.filter.value) ? <FilterFilled className={'ant-table-filter-selected'} /> : <FilterFilled style={{ color: '#bfbfbf' }} />,
            onFilterDropdownVisibleChange: visible => {
                column.filterDropdownVisible = visible;
                selector.updateState();
            },
        };
    }

    static async getColumnParkTreeProps(column, selector) {
        return {
            filterDropdown: () => {
                column.filter.clearFilters = deleteFlag => {
                    //deleteFlag关闭=1，小重置=2，大重置=0
                    const defaultValue = selector.defaultValue[column.field];
                    let fetch = false;
                    if (deleteFlag === 1 || (!Object.equal(selector.state.lastParams[column.field], defaultValue) && deleteFlag)) {
                        fetch = true;
                    }
                    column.filter.value = deleteFlag === 1 ? [] : defaultValue;
                    column.filter.text = deleteFlag === 1 ? [] : column.filter.defaultText;
                    selector.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                    column.filterDropdownVisible = false;
                    column.filter.selectedLabels = column.filter.selectedKeys = column.filter.value;
                    fetch && selector.filterChange(selector.currentValue);
                    selector.updateState();
                };
                return (
                    <div className="selector-filter-box">
                        <Button
                            onClick={() => {
                                column.filter.clearFilters(2);
                            }}
                            size="small"
                            style={{ width: 90, marginBottom: 10 }}
                        >
                            重置
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                column.filter.value = column.filter.selectedKeys;
                                column.filter.text = column.filter.selectedLabels;
                                selector.currentValue[column.field] = column.filter.value;
                                column.filterDropdownVisible = false;
                                selector.filterChange(selector.currentValue);
                            }}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90, float: 'right' }}
                        >
                            搜索
                        </Button>
                        <ParkTreeSelect
                            orgCanSelect={column.filter.orgCanSelect || false}
                            value={column.filter.selectedKeys || []}
                            onChange={(value, label) => {
                                column.filter.selectedKeys = Array.isArray(value) ? value : value ? [value] : [];
                                column.filter.selectedLabels = label;
                                selector.updateState();
                            }}
                            treeSelectProps={{
                                multiple: column.filter.multiple === false ? false : true,
                                allowClear: true,
                                style: { width: 250 },
                                placeholder: '点击选择车场',
                            }}
                        />
                    </div>
                );
            },
            filterIcon: () =>
                !Object.isEmpty(column.filter.value) ? <FilterFilled className={'ant-table-filter-selected'} /> : <FilterFilled style={{ color: '#bfbfbf' }} />,
            onFilterDropdownVisibleChange: visible => {
                column.filterDropdownVisible = visible;
                selector.updateState();
            },
        };
    }

    static getColumnLicencePlateProps = (column, selector) => {
        return {
            filterDropdown: () => {
                column.filter.clearFilters = deleteFlag => {
                    //deleteFlag关闭=1，小重置=2，大重置=0
                    const defaultValue = selector.defaultValue[column.field];
                    let fetch = false;
                    if (deleteFlag === 1) {
                        fetch = true;
                    } else {
                        let context =
                            selector.currentValue[column.field] !== defaultValue ||
                            selector.currentValue[column.filter.reverseDataIndex] !== undefined ||
                            selector.currentValue[column.filter.multipleDataIndex || 'plates'] !== undefined;
                        if (context && deleteFlag) {
                            fetch = true;
                        }
                    }
                    column.filter.value = deleteFlag === 1 ? undefined : defaultValue;
                    column.filter.text = deleteFlag === 1 ? undefined : defaultValue;
                    let currentDataIndex = column.filter.dataIndex || column.dataIndex || column.key;
                    if (column.filter.reverse) {
                        currentDataIndex = column.filter.reverseDataIndex;
                    }
                    if (column.filter.multipleSearch) {
                        // 批量搜索字段名，默认为 plates
                        currentDataIndex = column.filter.multipleDataIndex || 'plates';
                    }
                    selector.currentValue[currentDataIndex] = deleteFlag === 1 ? undefined : defaultValue;
                    selector.filtersList[column.field] = '';
                    column.filter.selectedKeys = column.filter.value || '';
                    // 清除备份
                    column.filter.selectedKeysBackup = '';
                    column.filterDropdownVisible = false;
                    fetch && selector.filterChange(selector.currentValue);
                    selector.updateState();
                };
                const handleSubmit = () => {
                    const value = (column.filter.selectedKeys || '').trim();
                    column.filter.selectedKeys = value;
                    column.filter.value = value;
                    // selector.currentValue[column.field] = value;
                    column.filterDropdownVisible = false;

                    if (column.filter.reverse) {
                        selector.currentValue[column.filter.reverseDataIndex] = column.filter.value;
                        selector.currentValue[column.filter.dataIndex || column.dataIndex || column.key] = undefined;
                        column.filter.text = `排除-${value}`;
                    } else if (column.filter.multipleSearch) {
                        let dataIndex = column.filter.multipleDataIndex || 'plates';
                        selector.currentValue[dataIndex] = column.filter.value;
                        selector.currentValue[column.filter.dataIndex || column.dataIndex || column.key] = undefined;
                        column.filter.text = '批量搜索';
                    } else {
                        selector.currentValue[column.filter.dataIndex || column.dataIndex || column.key] = column.filter.value;
                        selector.currentValue[column.filter.reverseDataIndex] = undefined;
                        selector.currentValue[column.filter.multipleDataIndex || 'plates'] = undefined;
                        column.filter.text = value;
                    }

                    selector.filterChange(selector.currentValue);
                };
                const SystemConfig = Storage.get('SystemConfig');
                return (
                    <div className="selector-filter-box" style={{ paddingRight: column.filter.reverseDataIndex || column.filter.enableMultiple ? 36 : 45 }}>
                        {column.filter.multipleSearch ? (
                            // 文本域
                            <>
                                <div style={{ marginBottom: 8 }}>批量搜索请使用中文逗号分隔车牌号，或者一行一个车牌号</div>
                                <Input.TextArea
                                    value={column.filter.selectedKeys}
                                    onChange={e => {
                                        column.filter.selectedKeys = e.target.value;
                                        selector.updateState();
                                    }}
                                    showCount
                                    maxLength={column.filter.multipleMaxLength || 1000}
                                    placeholder={column.filter.multiplePlaceholder || '请输入车牌'}
                                    style={{ zIndex: 99, width: 380 }}
                                    autoSize={{
                                        minRows: 4,
                                        maxRows: 10,
                                    }}
                                ></Input.TextArea>
                            </>
                        ) : SystemConfig?.useNewLicencePlateInput ? (
                            <LicencePlateInputV2
                                type={'search'}
                                value={column.filter.selectedKeys}
                                onChange={value => {
                                    column.filter.selectedKeys = value;
                                    selector.updateState();
                                }}
                                onKeyPress={e => {
                                    if (e.keyCode === 13 && column.filterDropdownVisible) {
                                        handleSubmit();
                                    }
                                }}
                                popoverToTop={true}
                                style={{ zIndex: 99 }}
                            ></LicencePlateInputV2>
                        ) : (
                            <LicencePlateInput
                                value={column.filter.selectedKeys}
                                popoverToTop={true}
                                onChange={value => {
                                    column.filter.selectedKeys = value;
                                    selector.updateState();
                                }}
                                onKeyPress={e => {
                                    if (e.keyCode === 13 && column.filterDropdownVisible) {
                                        handleSubmit();
                                    }
                                }}
                                style={{ zIndex: 99 }}
                            />
                        )}
                        <Row align="middle" style={{ marginTop: column.filter.multipleSearch ? 24 : 10 }}>
                            {/* <LicencePlateInput
                                value={column.filter.selectedKeys}
                                onChange={value => {
                                    column.filter.selectedKeys = value;
                                    selector.updateState();
                                }}
                            /> */}
                            <Button onClick={() => column.filter.clearFilters(2)} size="small" style={{ width: 80, marginRight: 10 }}>
                                重置
                            </Button>
                            <Button type="primary" onClick={handleSubmit} icon={<SearchOutlined />} size="small" style={{ width: 80 }}>
                                搜索
                            </Button>
                            {column.filter.reverseDataIndex && (
                                <Checkbox
                                    defaultChecked={false}
                                    checked={column.filter.reverse}
                                    onChange={e => {
                                        column.filter.reverse = e.target.checked;
                                        selector.updateState();
                                    }}
                                    style={{ marginLeft: 8 }}
                                >
                                    反向搜索
                                </Checkbox>
                            )}
                            {column.filter.enableMultiple && !column.filter.reverseDataIndex && (
                                <Switch
                                    defaultChecked={false}
                                    checked={column.filter.multipleSearch}
                                    onChange={checked => {
                                        column.filter.multipleSearch = checked;
                                        // if (!checked) {
                                        //     // 备份
                                        //     column.filter.selectedKeysBackup = column.filter.selectedKeys;
                                        //     column.filter.selectedKeys = '';
                                        // } else {
                                        //     // 恢复
                                        //     column.filter.selectedKeys = column.filter.selectedKeysBackup || '';
                                        // }
                                        column.filter.selectedKeys = '';
                                        selector.updateState();
                                    }}
                                    style={{ marginLeft: 8 }}
                                    checkedChildren="批量搜索"
                                    unCheckedChildren="单个搜索"
                                />
                            )}
                        </Row>
                    </div>
                );
            },
            filterIcon: () => (column.filter.value ? <FilterFilled className={'ant-table-filter-selected'} /> : <FilterFilled style={{ color: '#bfbfbf' }} />),
            onFilterDropdownVisibleChange: visible => {
                column.filterDropdownVisible = visible;
                selector.updateState();
            },
        };
    };

    static getColumnNumberProps = (column, selector) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                //deleteFlag关闭=1，小重置=2，大重置=0
                const defaultValue = selector.defaultValue[column.field];
                let fetch = false;
                let minName = column.filter.minName;
                let maxName = column.filter.maxName;
                // 有 minName 或 maxName 且值发生了变化(只填了最大值、最小值的重置，用或)
                let nameValueChange =
                    (!!minName && selector.state.lastParams[minName] !== defaultValue?.[0]) ||
                    (!!maxName && selector.state.lastParams[maxName] !== defaultValue?.[1]);
                if (deleteFlag === 1 || (!Object.equal(selector.state.lastParams[column.field], defaultValue) && deleteFlag) || nameValueChange) {
                    fetch = true;
                }
                column.filter.value = deleteFlag === 1 ? ['', ''] : defaultValue;
                column.filter.text = deleteFlag === 1 ? '' : defaultValue;
                const [minNum, maxNum] = [defaultValue?.[0] || -(2 ** 31 - 1), defaultValue?.[1] || 2 ** 31 - 1];
                if (minName && maxName) {
                    if (deleteFlag === 1 || !defaultValue) {
                        delete selector.currentValue[column.filter.minName];
                        delete selector.currentValue[column.filter.maxName];
                    } else {
                        selector.currentValue[column.filter.minName] = minNum;
                        selector.currentValue[column.filter.maxName] = maxNum;
                    }
                } else {
                    if (deleteFlag === 1 || !defaultValue) {
                        delete selector.currentValue[column.field];
                    } else {
                        selector.currentValue[column.field] = [minNum, maxNum];
                    }
                }
                column.filterDropdownVisible = false;
                column.filter.selectedKeys = column.filter.value;
                fetch && selector.filterChange(selector.currentValue);
                selector.updateState();
            };
            const onOk = () => {
                column.filter.value = column.filter.selectedKeys || [];
                let [minNum, maxNum] = column.filter.value;
                if (typeof minNum === 'number' && typeof maxNum === 'number') {
                    if (minNum > maxNum) {
                        [minNum, maxNum] = [maxNum, minNum];
                        column.filter.value = [minNum, maxNum];
                    }
                    if (minNum === maxNum) {
                        column.filter.text = String(minNum);
                    } else {
                        column.filter.text = `${minNum}-${maxNum}`;
                    }
                } else if (typeof minNum === 'number') {
                    column.filter.text = `≥${minNum}`;
                    maxNum = 2 ** 31 - 1;
                } else if (typeof maxNum === 'number') {
                    column.filter.text = `≤${maxNum}`;
                    minNum = -(2 ** 31 - 1);
                } else {
                    column.filter.text = '';
                }
                column.filterDropdownVisible = false;
                if (column.filter.minName && column.filter.maxName) {
                    selector.currentValue[column.filter.minName] = minNum;
                    selector.currentValue[column.filter.maxName] = maxNum;
                } else {
                    selector.currentValue[column.field] = [minNum, maxNum];
                }
                if (!column.filter.text) {
                    if (column.filter.minName && column.filter.maxName) {
                        delete selector.currentValue[column.filter.minName];
                        delete selector.currentValue[column.filter.maxName];
                    } else {
                        delete selector.currentValue[column.field];
                    }
                }
                selector.filterChange();
            };
            return (
                <div className="selector-filter-box">
                    <div className="ant-number-group">
                        <InputNumber
                            {...column.filter.minProps}
                            ref={node => {
                                column.filter.node1 = node;
                            }}
                            placeholder={column.filter.minPlaceholder || `最小值`}
                            value={column.filter.selectedKeys?.[0]}
                            onChange={e => {
                                column.filter.selectedKeys = [e, typeof column.filter.selectedKeys?.[1] === 'number' ? column.filter.selectedKeys?.[1] : ''];
                                selector.updateState();
                            }}
                            onPressEnter={onOk}
                            style={{ marginRight: '8px' }}
                        />
                        <InputNumber
                            {...column.filter.maxProps}
                            ref={node => {
                                column.filter.node2 = node;
                            }}
                            placeholder={column.filter.maxPlaceholder || `最大值`}
                            value={column.filter.selectedKeys?.[1]}
                            onChange={e => {
                                column.filter.selectedKeys = [typeof column.filter.selectedKeys?.[0] === 'number' ? column.filter.selectedKeys?.[0] : '', e];
                                selector.updateState();
                            }}
                            onPressEnter={onOk}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            column.filter.clearFilters(2);
                        }}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        重置
                    </Button>
                    <Button type="primary" onClick={onOk} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        搜索
                    </Button>
                </div>
            );
        },
        filterIcon: () =>
            column.filter.value && (column.filter.value[0] || column.filter.value[1]) ? (
                <FilterFilled className="ant-table-filter-selected" />
            ) : (
                <FilterFilled style={{ color: '#bfbfbf' }} />
            ),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                column.filterDropdownVisible = true;
                setTimeout(() => column.filter.node1?.select?.());
            } else {
                column.filterDropdownVisible = false;
            }
            selector.updateState();
        },
    });

    static getColumnDistrict = (column, selector, districtProps) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                //deleteFlag关闭=1，小重置=2，大重置=0
                const defaultValue = selector.defaultValue[column.field];
                let fetch = false;
                if (deleteFlag === 1 || (selector.currentValue[column.field] !== defaultValue && deleteFlag)) {
                    fetch = true;
                }
                column.filter.value = deleteFlag === 1 ? undefined : defaultValue?.map?.(item => item.value);
                column.filter.text = deleteFlag === 1 ? undefined : defaultValue?.map?.(item => item.label).join('/');
                selector.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                column.filter.selectedKeys = column.filter.value;
                column.filter.selectedOptions = defaultValue;
                column.filterDropdownVisible = false;
                fetch && selector.filterChange(selector.currentValue);
                selector.updateState();
            };
            const title = typeof column.title === 'string' ? column.title : column.title?.props?.children?.[0];
            return (
                <div className="selector-filter-box" style={{ width: 300 }}>
                    <Button onClick={() => column.filter.clearFilters(2)} size="small" style={{ width: 90, marginRight: 8, marginBottom: 10 }}>
                        重置
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            const value = column.filter.selectedOptions || [];
                            column.filter.value = column.filter.selectedKeys;
                            column.filter.text = value.map(item => item.label).join('/');
                            selector.currentValue[column.field] = value.map(item => item.label);
                            column.filterDropdownVisible = false;
                            selector.filterChange();
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, float: 'right' }}
                    >
                        搜索
                    </Button>
                    <District
                        districtProps={districtProps}
                        // ref={node => {
                        //     column.filter.node = node;
                        // }}
                        placeholder={`搜索 ${title}`}
                        onChange={(value, selectedOptions) => {
                            column.filter.selectedKeys = value;
                            column.filter.selectedOptions = selectedOptions;
                            selector.updateState();
                        }}
                        value={column.filter.selectedKeys}
                        style={{ width: 284, marginBottom: 8, display: 'block' }}
                    />
                </div>
            );
        },
        filterIcon: () => (column.filter.value ? <SearchOutlined className="ant-table-filter-selected" /> : <SearchOutlined style={{ color: '#bfbfbf' }} />),
        onFilterDropdownVisibleChange: visible => {
            column.filterDropdownVisible = visible;
            selector.updateState();
        },
    });

    static getColumnCascade = (column, selector, appUID, dataSourceUID, requestApi, requestParam) => ({
        filterDropdown: () => {
            column.filter.clearFilters = deleteFlag => {
                //deleteFlag关闭=1，小重置=2，大重置=0
                const defaultValue = selector.defaultValue[column.field];
                let fetch = false;
                if (deleteFlag === 1 || (selector.currentValue[column.field] !== defaultValue && deleteFlag)) {
                    fetch = true;
                }
                column.filter.value = deleteFlag === 1 ? undefined : defaultValue?.map?.(item => item.value);
                column.filter.text = deleteFlag === 1 ? undefined : defaultValue?.map?.(item => item.label).join('/');
                selector.currentValue[column.field] = deleteFlag === 1 ? undefined : defaultValue;
                column.filter.selectedKeys = column.filter.value;
                column.filter.selectedOptions = defaultValue;
                column.filterDropdownVisible = false;
                fetch && selector.filterChange(selector.currentValue);
                selector.updateState();
            };
            return (
                <div className="selector-filter-box" style={{ width: 300 }}>
                    <Button onClick={() => column.filter.clearFilters(2)} size="small" style={{ width: 90, marginRight: 8, marginBottom: 10 }}>
                        重置
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            let _value = column.filter.selectedKeys;
                            let _text = column.filter.selectedOptions?.map(item => item.label).join('/');
                            if (column.filter.cascadeProps?.multiple) {
                                // 多选选中的为最底层子节点数据
                                _value = column.filter.selectedKeys?.map(item => item?.[item.length - 1]) || [];
                                _text = column.filter.selectedOptions?.map(item => item?.[item.length - 1].label).join('/') || '';
                            }
                            column.filter.value = _value;
                            column.filter.text = _text;
                            selector.currentValue[column.field] = _value;
                            column.filterDropdownVisible = false;
                            selector.filterChange(selector.currentValue);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, float: 'right' }}
                    >
                        搜索
                    </Button>
                    <CustomCascade
                        dataSource={dataSourceUID}
                        appUID={appUID}
                        menuType={1}
                        // ref={node => {
                        //     column.filter.node = node;
                        // }}
                        requestApi={requestApi}
                        requestParam={requestParam}
                        onChange={(value, selectedOptions) => {
                            column.filter.selectedKeys = value;
                            column.filter.selectedOptions = selectedOptions;
                            selector.updateState();
                        }}
                        value={column.filter.selectedKeys}
                        cascadeProps={column.filter.cascadeProps || {}}
                        style={{ width: 284, marginBottom: 8, display: 'block' }}
                    />
                </div>
            );
        },
        filterIcon: () => (column.filter.value ? <SearchOutlined className="ant-table-filter-selected" /> : <SearchOutlined style={{ color: '#bfbfbf' }} />),
        onFilterDropdownVisibleChange: visible => {
            column.filterDropdownVisible = visible;
            selector.updateState();
        },
    });
}

export default Filters;
