import React, { Component } from 'react';
import { Input, Select, Button, AutoComplete, Popover } from 'antd';
import PropTypes from 'prop-types';
import './licencePlate.less';
import Keyboard from '@/business/keyboard/keyboard';
import { Storage } from '@/utils';

const provinceBriefList = [
    '京', '冀', '津', '豫', '鲁', '贵', '渝', '云',
    '辽', '沪', '黑', '湘', '皖', '新', '苏', '浙',
    '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉',
    '闽', '粤', '青', '藏', '川', '宁', '琼', '使',
    '电',
];

const specialBriefList = ['无牌', '未登记'];

const provinceDic = new Map([
    [62, '甘'], // 甘肃省
    [63, '青'], // 青海省
    [64, '宁'], // 宁夏回族自治区
    [65, '新'], // 新疆维吾尔自治区
    [71, '台'], // 台湾省
    [81, '港'], // 香港特别行政区
    [82, '澳'], // 澳门特别行政区
    [11, '京'], // 北京市
    [12, '津'], // 天津市
    [13, '冀'], // 河北省
    [14, '晋'], // 山西省
    [15, '蒙'], // 内蒙古自治区
    [21, '辽'], // 辽宁省
    [22, '吉'], // 吉林省
    [23, '黑'], // 黑龙江省
    [31, '沪'], // 上海市
    [32, '苏'], // 江苏省
    [33, '浙'], // 浙江省
    [34, '皖'], // 安徽省
    [35, '闽'], // 福建省
    [36, '赣'], // 江西省
    [37, '鲁'], // 山东省
    [41, '豫'], // 河南省
    [42, '鄂'], // 湖北省
    [43, '湘'], // 湖南省
    [44, '粤'], // 广东省
    [45, '桂'], // 广西壮族自治区
    [46, '琼'], // 海南省
    [50, '渝'], // 重庆市
    [51, '川'], // 四川省
    [52, '贵'], // 贵州省
    [53, '云'], // 云南省
    [54, '藏'], // 西藏自治区
    [61, '陕'] // 陕西省
])

export default class LicencePlateInput extends Component {
    static propTypes = {
        /** 车牌号 */
        value: PropTypes.string,
        /** 选中项改变时触发的事件 */
        onChange: PropTypes.func,
        /** 牌号输入框失去焦点时触发的事件 */
        onBlur: PropTypes.func,
        /** disabled属性 */
        disabled: PropTypes.bool,
        /** 自动补全选项 */
        autoCompleteOptions: PropTypes.array,
        /** 车牌录入时，无牌 需要输入虚拟车牌 */
        canInputKeys: PropTypes.array,
        /** 不需要的省份开头 */
        hideBrief: PropTypes.array,
        /** blur后是否调用onChange */
        blurHandleChange: PropTypes.bool,
        /** 键盘浮窗是否距离输入区域有一定距离 */
        popoverToTop: PropTypes.bool,
        /** 按下键盘键时的触发事件 */
        onKeyPress: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
        canInputKeys: [],
        hideBrief: [],
        popoverToTop: false,
        blurHandleChange: true,
    }

    autoCompleteRef = React.createRef();

    inputRef = React.createRef();

    state = {
        value: this.props.value || '',
    }

    get value() {
        // 在props没传value的时候才用state
        return this.props.value === undefined ? this.state.value : this.props.value;
    }

    get brief() {
         // 车牌录入时，无牌 需要输入虚拟车牌
        if (~this.props.canInputKeys.indexOf(this.value.slice(0, 2))) {
            return this.props.canInputKeys[this.props.canInputKeys.indexOf(this.value.slice(0, 2))];
        }
        if (~specialBriefList.indexOf(this.value)) {
            return this.value;
        }
        if (~provinceBriefList.indexOf(this.value.slice(0, 1))) {
            return this.value.slice(0, 1);
        }
        return '';
    }

    get code() {
        return this.value.slice(this.brief.length, this.value.length);
    }

    handleKeyPress = e => {
        e.stopPropagation();
        let temp = this.value.toUpperCase();
        this.setState({
            value: temp
        })
        this.props.onChange && this.props.onChange(temp);
        this.props.onKeyPress && this.props.onKeyPress(e);
    }

    componentDidMount() {
        if (this.props.onKeyPress) {
            window.addEventListener('keypress', this.handleKeyPress);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress);
    }

    onChange = value => {
        this.setState({
            value,
        });
        this.props.onChange && this.props.onChange(value);
    }

    onOriginSelectChange = value => {
        // 判断clear触发的情况
        if (value === undefined) {
            this.onChange(this.code);
        }
    }

    onFocus = () => {
        const userGroup = Storage.get("userGroup");
        if (userGroup.provinceID && provinceDic.has(userGroup.provinceID)) {
            this.onChange(provinceDic.get(userGroup.provinceID) + this.code);
        }
    }

    onInputChange = e => {
        if (Array.isArray(this.props.autoCompleteOptions)) {
            const value = e;
            // 判断clear触发的情况
            if (value === undefined) {
                this.onChange(this.brief);
                this.autoCompleteRef.current.focus();
            } else {
                if (~provinceBriefList.indexOf(value.slice(0, 1))) { // select时，value = 京123456，不需要加brief
                    this.onChange(value);
                } else {
                    this.onChange(this.brief + value);
                }
            }
        } else {
            const value = e.target.value;
            this.onChange(this.brief + value);
        }
    }

    onBlur = (value, e) => {
        value = value.toString().toUpperCase();
        this.setState({
            value,
        });
        this.props.blurHandleChange && this.props.onChange && this.props.onChange(value);
        this.props.onBlur && this.props.onBlur(value, e);
    }

    onSelected = (key) => {
        const inputElement = this.inputRef.current.input;
        if (!inputElement) {
            return;
        }
        inputElement.focus();

        const startPos = inputElement.selectionStart;
        const endPos = inputElement.selectionEnd;
        const currentValue = inputElement.value;

        if (key === 'Backspace') {
            if (startPos === endPos && startPos > 0) {
                // 删除前一个字符
                inputElement.value = currentValue.substring(0, startPos - 1) + currentValue.substring(endPos);
                inputElement.setSelectionRange(startPos - 1, startPos - 1);
            } else if (startPos !== endPos) {
                // 删除选中文本
                inputElement.value = currentValue.substring(0, startPos) + currentValue.substring(endPos);
                inputElement.setSelectionRange(startPos, startPos);
            }
        } else {
            inputElement.value = currentValue.substring(0, startPos) + key + currentValue.substring(endPos);
            inputElement.setSelectionRange(startPos + 1, startPos + 1);
        }
        this.onChange(this.brief + inputElement.value);
    }

    render() {
        const {disabled, autoCompleteOptions, canInputKeys, hideBrief, popoverToTop} = this.props;

        return (
            <div className="licence-plate">
                {/* 这里必须要添加一个容器然后调用preventDefault来解决Select组件的一个bug */}
                <div onMouseDown={e => e.preventDefault()}>
                    <Select
                        allowClear
                        showArrow={false}
                        disabled={disabled}
                        style={{ width: 68, marginRight: 10, color: this.brief ? 'inherit' : '#ccc' }}
                        value={this.brief || '省'}
                        popupClassName={`licence-popup${popoverToTop ? " distanceToTop1" : ""}`}
                        onChange={this.onOriginSelectChange}
                        onFocus={this.onFocus}
                        onBlur={e => this.props.onBlur?.(this.value, e)}
                        getPopupContainer={triggerNode => {
                            return popoverToTop ? triggerNode.parentNode : document.body;
                        }}
                        dropdownStyle={{ overflow: 'visible', boxShadow: 'unset' }}
                        dropdownRender={() => (
                            <div className="licence-plate__dropdown">
                                {
                                    provinceBriefList.filter(item => !hideBrief.includes(item)).map(item => (
                                        <Button
                                            key={item}
                                            type={item === this.brief ? 'primary' : ''}
                                            onClick={this.onChange.bind(this, item + this.code)}
                                        >
                                            {item}
                                        </Button>
                                    ))
                                }
                                {
                                    specialBriefList.filter(item => !hideBrief.includes(item)).map(item => (
                                        <Button
                                            key={item}
                                            type={item === this.brief ? 'primary' : ''}
                                            onClick={this.onChange.bind(this, canInputKeys.includes(item) ? item + this.code : item)}
                                        >
                                            {item}
                                        </Button>
                                    ))
                                }
                            </div>
                        )}
                    />
                </div>
                {
                    Array.isArray(autoCompleteOptions) ?
                        <AutoComplete
                            ref={this.autoCompleteRef}
                            allowClear
                            className="licence-plate-input"
                            value={this.code}
                            placeholder="牌号"
                            disabled={disabled || ~specialBriefList.filter(item => !canInputKeys.includes(item)).indexOf(this.brief)}
                            onChange={this.onInputChange}
                            onBlur={e => this.onBlur(this.brief + e.target.value, e)}
                            options={autoCompleteOptions}
                            onSelect={e => this.props.onSelect?.(e)}
                        /> :

                        <Popover
                            overlayClassName={popoverToTop ? "distanceToTop2" : ""}
                            content={<Keyboard mode={'en'} onSelected={this.onSelected} />}
                            getPopupContainer={triggerNode => {
                                return popoverToTop ? triggerNode.parentNode : document.body;
                            }}
                            trigger="focus"
                            placement="bottom"
                        >
                            <Input
                                allowClear
                                className="licence-plate-input"
                                value={this.code}
                                placeholder="牌号"
                                disabled={disabled || ~specialBriefList.filter(item => !canInputKeys.includes(item)).indexOf(this.brief)}
                                onChange={this.onInputChange}
                                onBlur={e => this.onBlur(this.brief + e.target.value, e)}
                                ref={this.inputRef}
                            />
                        </Popover>
                }
            </div>
        );
    }
}
