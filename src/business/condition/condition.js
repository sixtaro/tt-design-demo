import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Radio, DatePicker, TimePicker, TreeSelect, Cascader } from 'antd';
import moment from 'moment';
import { Request } from '@/utils';
import Filters from '@/business/Selector/components/filters';
import './condition.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class Page extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: {},
            options: Object.clone(this.props.options),
        };
    }

    async componentDidMount() {
        const { options } = this.state;
        let currentValue = {};
        // 使用forEach会导致执行过程重新变回异步，缓存机制失效
        for (let option of options) {
            if (option.type === 'datetime') {
                if (option.defaultValue) {
                    if (option.defaultValue instanceof Array) {
                        if (option.defaultValue[0] instanceof moment) {
                            option.value = option.defaultValue;
                        } else {
                            option.value = [moment(option.defaultValue[0]), moment(option.defaultValue[1])];
                        }
                    } else {
                        option.value = Page.range(option.defaultValue, option);
                    }
                    currentValue = {
                        ...currentValue,
                        ...this.getDateTime(option.value, option, option.defaultValue),
                    };
                }
            } else if (option.type === 'day') {
                if (option.defaultValue) {
                    if (option.defaultValue instanceof Array) {
                        if (option.defaultValue[0] instanceof moment) {
                            option.value = option.defaultValue;
                        } else {
                            option.value = [moment(option.defaultValue[0]), moment(option.defaultValue[1])];
                        }
                    } else {
                        const result = this.getDayTime(option, option.defaultValue);
                        currentValue = {
                            ...currentValue,
                            ...result,
                        };
                    }
                }
            } else {
                currentValue[option.conditionName] = option.defaultValue;
                // 如果有source，则从接口获取并赋值
                if (option.source) {
                    const result = await Request(option.source.api, option.source.param);
                    if (result.success !== false) {
                        let items = Object.getValue(result.data || result, option.source.field);
                        items = option.source.map ? items.map(option.source.map) : items;
                        option.items = option.items ? option.items.concat(items) : items;
                    } else {
                        console.error(option.source);
                    }
                    this.setState({ currentValue });
                }
            }
        } //s);
        if (!Object.isEmpty(currentValue)) {
            this.onChange(currentValue);
        }
    }

    onChange = currentValue => {
        this.props.onChange && this.props.onChange({ ...currentValue });
        this.setState({ currentValue: { ...currentValue } });
    };

    onCustomChange = (e, option) => {
        let { currentValue } = this.state;
        currentValue[option.conditionName] = e.target.value;
        option.value = e.target.value;
        this.onChange(currentValue);
    };

    onCascaderChange = (e, option) => {
        let { currentValue } = this.state;
        currentValue[option.conditionName] = e.join(',');
        option.value = e.join(',');
        this.onChange(currentValue);
    };

    getDateTime = (moments, option, defaultValue) => {
        let { currentValue } = this.state;
        let startTimeName = option.startTimeName || option.conditionName;
        let endTimeName = option.endTimeName || option.conditionName;
        moments = moments || [];
        let value =
            moments.length >= 2
                ? [
                      moments[0].format(option.formatNormal ? 'YYYY-MM-DD HH:mm:ss' : option.hasFilterTime ? 'YYYY-MM-DD HH:mm:00' : 'YYYY-MM-DD 00:00:00'),
                      moments[1].format(option.formatNormal ? 'YYYY-MM-DD HH:mm:ss' : option.hasFilterTime ? 'YYYY-MM-DD HH:mm:59' : 'YYYY-MM-DD 23:59:59'),
                  ]
                : [];
        if (startTimeName !== endTimeName) {
            if (moments.length > 0) {
                currentValue[startTimeName] = value[0];
                currentValue[endTimeName] = value[1];
            } else {
                currentValue[startTimeName] = '';
                currentValue[endTimeName] = '';
            }
        } else {
            if (moments.length > 0) {
                currentValue[option.conditionName] = value;
            } else {
                currentValue[option.conditionName] = [];
            }
        }
        option.value = moments;
        option.defaultValue = defaultValue;
        return currentValue;
    };

    onDateTimeChange = (moments, option, defaultValue) => {
        let _moments = moments;
        if (option?.disabledRangeDate && moments.length >= 2) {
            // 处理不可选时间范围的日期
            _moments = option.disabledRangeDate(moments[0], moments[1]) || moments;
        }
        const currentValue = this.getDateTime(_moments, option, defaultValue);
        this.onChange(currentValue);
    };

    static range(time, option) {
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
            case 'lastmonth':
                startTime = moment().subtract(1, 'month').startOf('month');
                endTime = moment().subtract(1, 'month').endOf('month');
                break;
            case 'lastyear':
                startTime = moment().subtract(1, 'year').startOf('year');
                endTime = moment().subtract(1, 'year').endOf('year');
                break;
            case 'fourteendays':
                startTime = moment().subtract(14, 'day').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            case 'thirtydays':
                startTime = moment().subtract(30, 'day').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            case 'halfyear':
                startTime = moment().subtract(6, 'month').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            case 'oneyear':
                startTime = moment().subtract(1, 'year').startOf('day');
                endTime = moment().subtract(1, 'day').endOf('day');
                break;
            default:
                if (time === 'Week') {
                    time = 'isoWeek';
                }
                startTime = moment().startOf(time);
                endTime = moment().endOf(time);
                break;
        }
        if (option?.disabledRangeDate) {
            // 处理不可选时间范围的日期
            return option.disabledRangeDate(startTime, endTime) || [startTime, endTime];
        }
        return [startTime, endTime];
    }

    // 通过key获得最终数据 例：defaultValue:currentDay  ->  {startTime: 'xxxx', endTime: 'xxxx'}
    getDayTime = (option, defaultValue) => {
        const moments = Filters.range(defaultValue);
        let result;
        const value = Filters.onDateTimeChange(
            moments,
            {
                filter: {
                    ...option,
                    type: option.picker === 'date' ? 'day' : option.picker || option.type,
                },
            },
            defaultValue
        );
        if (option.picker === 'week') {
            if (value[0] && value[0].lastIndexOf('周') !== -1) {
                value[0] = value[0].substr(0, value[0].length - 1);
            }
            if (value[1] && value[1].lastIndexOf('周') !== -1) {
                value[1] = value[1].substr(0, value[1].length - 1);
            }
        }
        if (value[0] instanceof Object) {
            result = { ...value[0] };
        } else {
            result = value;
        }
        option.value = Array.isArray(moments) ? moments?.[0] || moment() : moments;
        option.defaultValue = defaultValue;
        return result;
    };

    render() {
        // layout:less default more
        const { layout, buttonSize, itemClassName, itemSize } = this.props;
        const { options } = this.state;
        const getTimeList = (list, option) => {
            var ranges = [];
            var text = new Map([
                ['oneHour', '近一小时'],
                ['eightHour', '近八小时'],
                ['twentyFourHour', '近24小时'],
                ['lastHour', '上一小时'],
                ['currentHour', '当前小时'],
                ['currentDay', '今天'],
                ['yesterday', '昨天'],
                ['twodaysago', '前天'],
                ['today', '今天'],
                ['lastWeek', '上周'],
                ['currentWeek', '本周'],
                ['currentMonth', '本月'],
                ['lastMonth', '上月'],
                ['currentQuarter', '本季度'],
                ['lastQuarter', '上季度'],
                ['lastYear', '去年'],
                ['currentYear', '本年'],
                ['fourteenDays', '近14日'],
                ['thirtyDays', '近30日'],
                ['halfYear', '近半年'],
                ['oneYear', '近一年'],
            ]);
            list.forEach(time => {
                ranges.push({
                    text: text.get(time),
                    key: time,
                    value: Page.range(time, option),
                });
            });
            return ranges;
        };
        let size = {
            col: {
                sm: 24,
                md: 24,
                lg: 12,
                xl: 8,
            },
            col2: {
                sm: 24,
                md: 24,
                lg: 24,
                xl: 16,
            },
            size: buttonSize ? buttonSize : 'default',
            form: 'inline',
        };
        if (layout === 'less') {
            size = {
                col: {},
                col2: {},
                size: buttonSize ? buttonSize : 'default',
                form: 'inline',
            };
        }
        if (layout === 'more') {
            size = {
                col: {
                    sm: 24,
                    md: 12,
                    lg: 8,
                    xl: 6,
                },
                col2: {
                    sm: 24,
                    md: 12,
                    lg: 8,
                    xl: 6,
                },
                size: buttonSize ? buttonSize : 'default',
                form: 'horizontal',
            };
        }
        return (
            <div className={`condition ${layout || 'default'} ${this.props.className}`} style={this.props.style}>
                <Form layout={size.form}>
                    <Row gutter={8} className="row">
                        {options &&
                            options.map((option, index) => (
                                <Col
                                    key={option.conditionName + index}
                                    className={`col ${itemClassName || ''} ${option.className || ''}`}
                                    style={option.style || {}}
                                    {...(option.type === 'datetime' ? itemSize || size.col2 : size.col)}
                                >
                                    <Form.Item label={layout === 'less' ? null : option.displayName} size={size.size}>
                                        {option.type === 'input' ? (
                                            <Input
                                                placeholder={option.displayName}
                                                size={size.size}
                                                {...{ [option.changeType === 'blur' ? 'onBlur' : 'onChange']: e => this.onCustomChange(e, option) }}
                                            />
                                        ) : (
                                            ''
                                        )}
                                        {option.type === 'custom' ? (
                                            <Radio.Group
                                                buttonStyle="solid"
                                                size={size.size}
                                                ref={ref => {
                                                    option.element = ref;
                                                }}
                                                defaultValue={option.value || option.defaultValue}
                                                onChange={e => this.onCustomChange(e, option)}
                                            >
                                                {option.items.map(item => (
                                                    <Radio.Button value={item.value} key={item.key || item.value}>
                                                        {item.text || item.name}
                                                    </Radio.Button>
                                                ))}
                                            </Radio.Group>
                                        ) : (
                                            ''
                                        )}
                                        {option.type === 'tree' ? (
                                            <TreeSelect
                                                showSearch
                                                style={{ width: 300 }}
                                                value={this.state.value}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={this.onChange}
                                            >
                                                <TreeSelect.TreeNode value="parent 1" title="parent 1" key="0-1">
                                                    <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                                                        <TreeNode value="leaf1" title="my leaf" key="random" />
                                                        <TreeNode value="leaf2" title="your leaf" key="random1" />
                                                    </TreeNode>
                                                    <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                                                        <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                                                    </TreeNode>
                                                </TreeSelect.TreeNode>
                                            </TreeSelect>
                                        ) : (
                                            ''
                                        )}
                                        {option.type === 'datetime' ? (
                                            <div>
                                                <RangePicker
                                                    size={size.size}
                                                    ref={ref => {
                                                        option.element = ref;
                                                    }}
                                                    {...((option.hasFilterTime || option.formatNormal)
                                                        ? {
                                                              showTime: {
                                                                  format: 'HH:mm',
                                                                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                              },
                                                              format: 'YYYY-MM-DD HH:mm',
                                                          }
                                                        : {})}
                                                    defaultValue={option.value}
                                                    value={option.value}
                                                    allowClear={option.allowClear}
                                                    onChange={e => {
                                                        this.onDateTimeChange(e, option, 'other');
                                                    }}
                                                    picker={option.picker}
                                                    disabledDate={option.disabledDate}
                                                    disabledTime={option.disabledTime}
                                                />
                                                <Radio.Group
                                                    buttonStyle="solid"
                                                    className="time-radio"
                                                    size={size}
                                                    ref={ref => {
                                                        option.subElement = ref;
                                                    }}
                                                    defaultValue={option.defaultValue}
                                                    value={option.defaultValue}
                                                    onChange={e => this.onDateTimeChange(Page.range(e.target.value, option), option, e.target.value)}
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    {getTimeList(option.datePeriods || ['currentDay', 'currentWeek', 'currentMonth', 'currentYear'], option).map(
                                                        item => (
                                                            <Radio.Button className="time-radio-item" value={item.key} key={item.value + item.key + item.text}>
                                                                {item.text || item.name}
                                                            </Radio.Button>
                                                        )
                                                    )}
                                                </Radio.Group>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {option.type === 'day' ? (
                                            <div>
                                                <DatePicker
                                                    size={size.size}
                                                    ref={ref => {
                                                        option.element = ref;
                                                    }}
                                                    {...(option.picker === 'date'
                                                        ? {
                                                              format: 'YYYY-MM-DD',
                                                              picker: 'date',
                                                          }
                                                        : {})}
                                                    {...(option.picker === 'week'
                                                        ? {
                                                              format: 'YYYY-wo',
                                                              picker: 'week',
                                                          }
                                                        : {})}
                                                    {...(option.picker === 'month'
                                                        ? {
                                                              format: 'YYYY-MM',
                                                              picker: 'month',
                                                          }
                                                        : {})}
                                                    {...(option.picker === 'quarter'
                                                        ? {
                                                              picker: 'quarter',
                                                          }
                                                        : {})}
                                                    {...(option.picker === 'year'
                                                        ? {
                                                              format: 'YYYY',
                                                              picker: 'year',
                                                          }
                                                        : {})}
                                                    defaultValue={option.value}
                                                    value={option.value}
                                                    allowClear={option.allowClear}
                                                    onChange={(moments, dateString) => {
                                                        if (!moments) {
                                                            return;
                                                        } else {
                                                            let result;
                                                            option.moments = [moment(moments).startOf(option.picker), moment(moments).endOf(option.picker)];
                                                            if ((option.picker === 'week' || option.picker === 'quarter') && !option.showFormat) {
                                                                let value = Filters.onDateTimeChange(
                                                                    option.moments,
                                                                    {
                                                                        filter: {
                                                                            ...option,
                                                                            type: option.picker === 'date' ? 'day' : option.picker || option.type,
                                                                        },
                                                                    },
                                                                    'other',
                                                                    dateString
                                                                );
                                                                if (value[0] && value[0].lastIndexOf('周') !== -1) {
                                                                    value[0] = value[0].substr(0, value[0].length - 1);
                                                                }
                                                                result = value;
                                                            } else {
                                                                const value = Filters.onDateTimeChange(
                                                                    option.moments,
                                                                    {
                                                                        filter: {
                                                                            ...option,
                                                                            type: option.picker === 'date' ? 'day' : option.picker || option.type,
                                                                        },
                                                                    },
                                                                    'other'
                                                                );
                                                                if (value[0] instanceof Object) {
                                                                    result = { ...value[0] };
                                                                } else {
                                                                    result = value;
                                                                }
                                                            }
                                                            option.defaultValue = 'other';
                                                            option.value = moments;
                                                            this.onChange(result);
                                                        }
                                                    }}
                                                />
                                                <Radio.Group
                                                    buttonStyle="solid"
                                                    className="time-radio"
                                                    size={size}
                                                    ref={ref => {
                                                        option.subElement = ref;
                                                    }}
                                                    defaultValue={option.defaultValue}
                                                    value={option.defaultValue}
                                                    onChange={e => {
                                                        const currentValue = e.target.value;
                                                        const result = this.getDayTime(option, currentValue);
                                                        this.onChange(result);
                                                    }}
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    {getTimeList(option.datePeriods || ['currentDay', 'currentWeek', 'currentMonth', 'currentYear'], option).map(
                                                        item => (
                                                            <Radio.Button className="time-radio-item" value={item.key} key={item.value + item.key + item.text}>
                                                                {item.text || item.name}
                                                            </Radio.Button>
                                                        )
                                                    )}
                                                </Radio.Group>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {option.type === 'time' ? <TimePicker onChange={this.onChange}></TimePicker> : ''}
                                        {option.type === 'date' ? <DatePicker onChange={this.onChange}></DatePicker> : ''}
                                        {option.type === 'week' ? <WeekPicker onChange={this.onChange}></WeekPicker> : ''}
                                        {option.type === 'month' ? <MonthPicker onChange={this.onChange}></MonthPicker> : ''}
                                        {option.type === 'cascader' ? (
                                            <Cascader
                                                defaultValue={option.defaultValue || []}
                                                options={option.items}
                                                onChange={e => this.onCascaderChange(e, option)}
                                                placeholder={`请选择${option.displayName}`}
                                                style={{ width: '260px' }}
                                                changeOnSelect={option.changeOnSelect}
                                                multiple={option.multiple}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </Form.Item>
                                </Col>
                            ))}
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Page;
