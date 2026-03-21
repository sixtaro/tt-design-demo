import React, { useEffect, useMemo, useRef, useState } from 'react';
import Popover from '@/components/Popover';
import Button from '@/components/Button';
import { CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '@/utils/version-config';
import CopyIcon from '@/business/CopyIcon';
import './index.less';
import Keyboard from '@/business/keyboard/keyboard';
import { provinceBriefList, specialBriefList, visualBriefList } from './utils';

/*
 * 新版车牌输入组件支持传入：
 *
 *  - value （作为表单控件的必要属性）
 *  - onChange （作为表单控件的必要属性）
 *  - onBlur
 *  - disabled，禁用
 *  - autoCompleteOptions，自动补全选项
 *  - canInputKeys：canInputKeys 中包含的文本作为第一位时，后续允许输入车牌号
 *  - hideBrief，需要隐藏的省份开头
 *  - type，组件类型：
 *
 *      1. search - 车牌搜索。类型为 search 时，plateColorValueFromOutSide 配置不生效，组件颜色只与车牌输入内容有关。
 *                  当输入内容为 8 位时，显示为绿色，否则展示为蓝色。
 *
 *      2. input - 车牌录入。类型为 input 时，plateColorValueFromOutSide 配置生效，组件颜色既存在内部逻辑，也与外部传入有关。
 *
 *      3. single-input - 车牌录入，但仅为单个的车牌输入，外部没有车牌颜色控件，组件颜色仅与输入内容有关
 *
 *  - plateColorValueFromOutside，外部传入车牌颜色，有 -2-非黄牌 -1-未知 0/4-黄色 1-蓝色 2-白色 3-黑色 5-绿色 6-黄绿色
 *  - popoverToTop，悬浮键盘与输入框底部距离是否扩大，默认为 28 px
 *
 * 车牌最少 8 位（最后一位可以为新能源标识），输入虚拟车牌时，可支持 13 位
 *
 */

function Plate(props) {
  const {
    disabled = false,
    canInputKeys = [],
    hideBrief = [],
    plateColorValueFromOutside,
    type = 'search',
    onColorOptionsChange,
    popoverToTop,
    copy = true,
  } = props;
  // const { value, onChange, onBlur, autoCompleteOptions } = props;

  // 当前光标位置
  const [cursor, setCursor] = useState(0);
  // 是否聚焦
  const [focus, setFocus] = useState(false);

  // 计算出外部传入的车牌颜色
  const plateColorFromOutside = useMemo(() => {
    if (plateColorValueFromOutside === 0 || plateColorValueFromOutside === 4) {
      return 'yellow';
    } else if (plateColorValueFromOutside === 1) {
      return 'blue';
    } else if (plateColorValueFromOutside === 2) {
      return 'white';
    } else if (plateColorValueFromOutside === 3) {
      return 'black';
    } else if (plateColorValueFromOutside === 5) {
      return 'green';
    } else if (plateColorValueFromOutside === 6) {
      return 'yellow-green';
    } else {
      return '';
    }
  }, [plateColorValueFromOutside]);

  const [innerValue, setInnerValue] = useState(props.value || '');
  const value = useMemo(() => {
    return props.value === undefined ? innerValue : props.value;
  }, [props.value, innerValue]);
  // 当前组件长度，一般为 8 位，输入虚拟车牌时，可支持 13 位
  const plateLength = useMemo(() => {
    if (value[0] === 'U' || value[0] === '电') {
      return 13;
    } else {
      return 8;
    }
  }, [value]);

  // 外部车牌颜色可选值，为空时表示全部可选
  const [colorOptions, setColorOptions] = useState([]);
  useEffect(() => {
    onColorOptionsChange && onColorOptionsChange(colorOptions);
  }, [colorOptions, onColorOptionsChange]);

  // 控件值变化时，超出长度截取掉
  const onChange = value => {
    setInnerValue(value);
    props.onChange && props.onChange(value);
  };

  // 车牌颜色
  const plateColor = useMemo(() => {
    let color = '';
    // 类型为 search，此时车牌颜色只与输入内容有关
    if (type === 'search') {
      if (plateLength === 8) {
        color = value.length === 8 ? 'green' : '';
      }
      setColorOptions([]);
    } else if (type === 'input') {
      // 类型为 input，此时车牌颜色由输入内容以及外部传入颜色决定
      // 有外部传入，优先使用外部传入
      // 无外部传入，根据输入内容计算
      if (/^[A-TV-Z0-9]$/.test(value[0])) {
        // 第一位为数字或U以外的大写字母，为港澳车牌，自动修改为黑色，支持选择白色、黑色
        color = plateColorFromOutside ? plateColorFromOutside : 'black';
        setColorOptions([2, 3]);
      } else if (value[0] === 'U' || value[0] === '电') {
        // 虚拟车牌输入框，自动修改为蓝色，支持选择白色、黑色
        color = plateColorFromOutside ? plateColorFromOutside : 'blue';
        setColorOptions([1, 2, 3]);
      } else if (provinceBriefList.indexOf(value[0]) > -1) {
        // 第一位为省份缩写
        if (value.length < 8) {
          // 长度不足 8 位，自动修改为蓝色，支持选择蓝色、黄色、白色、黑色
          color = plateColorFromOutside ? plateColorFromOutside : 'blue';
          setColorOptions([1, 0, 4, 2, 3]);
        } else {
          // 长度为 8
          if (/^[A-Z]$/.test(value[2])) {
            // 第三位为字母时，自动修改为绿色
            color = plateColorFromOutside ? plateColorFromOutside : 'green';
            setColorOptions([5]);
          } else if (/^[A-Z]$/.test(value[7])) {
            // 第八位为字母时，自动修改为黄绿色
            color = plateColorFromOutside ? plateColorFromOutside : 'yellow-green';
            setColorOptions([6]);
          } else {
            // 其他情况，自动修改为蓝色
            color = plateColorFromOutside ? plateColorFromOutside : 'blue';
            setColorOptions([]);
          }
        }
      } else {
        color = plateColorFromOutside ? plateColorFromOutside : 'blue';
        setColorOptions([]);
      }
    } else if (type === 'single-input') {
      // 类型为 single-input，此时车牌颜色由输入内容决定
      if (/^[A-TV-Z0-9]$/.test(value[0])) {
        // 第一位为数字或U以外的大写字母，为港澳车牌，自动修改为白色
        color = 'white';
      } else if (value[0] === 'U' || value[0] === '电') {
        // 虚拟车牌输入框，自动修改为蓝色
        color = 'blue';
      } else if (provinceBriefList.indexOf(value[0]) > -1) {
        // 第一位为省份缩写
        if (value.length < 8) {
          // 长度不足 8 位，自动修改为蓝色，支持选择蓝色、黄色、白色、黑色
          color = 'blue';
        } else {
          // 长度为 8
          if (/^[A-Z]$/.test(value[2])) {
            // 第三位为字母时，自动修改为绿色
            color = 'green';
          } else if (/^[A-Z]$/.test(value[7])) {
            // 第八位为字母时，自动修改为黄绿色
            color = 'yellow-green';
          } else {
            // 其他情况，自动修改为蓝色
            color = 'blue';
          }
        }
      } else {
        color = 'blue';
      }
      setColorOptions([]);
    }
    return color;
  }, [value, plateColorFromOutside, type, plateLength]);

  const plateNumberBoxClass = useMemo(() => {
    return classNames('tt-licence-plate-box', {
      'with-dot': plateLength === 8,
      [plateColor]: plateColor,
    });
  }, [plateLength, plateColor]);

  // 车牌输入字符串（最后一位可以为空，新能源车）
  const plateCharList = useMemo(() => {
    let list = value.split('');
    // 长度小于 plateLength，补全
    if (value.length < plateLength) {
      for (let i = 0; i < plateLength - value.length; i++) {
        list.push('');
      }
    }
    // 长度大于 plateLength，截取
    if (list.length > plateLength) {
      list = list.slice(0, plateLength);
    }
    return list;
  }, [value, plateLength]);

  const brief = useMemo(() => {
    // 车牌录入时，无牌 或 U 可以输入虚拟车牌
    if (~canInputKeys.indexOf(value.slice(0, 2))) {
      return canInputKeys[canInputKeys.indexOf(value.slice(0, 2))];
    }
    if (~specialBriefList.indexOf(value)) {
      return value;
    }
    if (~provinceBriefList.indexOf(value.slice(0, 1))) {
      return value.slice(0, 1);
    }
    if (~visualBriefList.indexOf(value.slice(0, 1))) {
      return value.slice(0, 1);
    }
    // 第一位支持键盘输入大写字母或数字
    if (/^[A-Z0-9]$/.test(value.slice(0, 1))) {
      return value.slice(0, 1);
    }
    return '';
  }, [canInputKeys, value]);

  const code = useMemo(() => {
    return value.slice(brief.length, value.length);
  }, [brief, value]);

  // 省份输入
  const [isVisual, setIsVisual] = useState(false);
  const onBriefChange = newVal => {
    // 省份输入后，如果当前位置上已有值，则属于修改省份缩写，不需要后移游标
    !value[cursor] && setCursor(cursor + 1);
    // 省份由 U、电 变为其他值时，需要将超出 8 位的部分截取掉
    let nowVisual = newVal[0] === 'U' || newVal[0] === '电';
    if (isVisual && !nowVisual && newVal.length > 8) {
      onChange(newVal.slice(0, 8));
    } else {
      onChange(newVal);
    }
    setIsVisual(nowVisual);
  };

  // popover 隐藏时，解除聚焦
  const _handleKeyboardOpenChange = open => {
    if (!open) {
      setFocus(open);
    }
  };

  // 点击各单元格时聚焦到最后一位
  const _handleCursor = index => {
    if (disabled) {
      return;
    }
    let nowIndex = index;
    for (let i = nowIndex; i > 0 && !plateCharList[i] && !plateCharList[i - 1]; i--) {
      nowIndex--;
    }
    setCursor(nowIndex);
    setFocus(true);
  };

  // 中文输入法
  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = () => {
    setIsComposing(true);
  };
  const handleCompositionEnd = e => {
    setIsComposing(false);
    e.preventDefault();
    if (cursor >= 0 && !disabled) {
      const chineseChar = e.data.toUpperCase();
      e.target.textContent = chineseChar.substring(0, 1);
      const nowValue = value;
      let newValue = nowValue.substring(0, cursor) + chineseChar + nowValue.substring(cursor + 1);
      if (newValue.length >= plateLength) {
        onChange(newValue.substring(0, plateLength));
        setCursor(cursor < plateLength - 1 ? cursor + 1 : cursor);
      } else {
        onChange(newValue);
        if (nowValue[cursor]) {
          setCursor(cursor);
        } else {
          setCursor(newValue.length);
        }
      }
    }
  };

  // 英文数字键盘输入
  const onKeyboardSelected = key => {
    if (isComposing) {
      return;
    }
    const pos = cursor;
    const nowValue = value;

    if (key === 'Backspace') {
      if (pos > 0) {
        // 如果当前位置上有值，则优先删除当前位置的字符，游标不动
        if (nowValue[pos]) {
          onChange(nowValue.substring(0, pos) + nowValue.substring(pos + 1));
        } else {
          // 删除前一个字符，游标前移
          onChange(nowValue.substring(0, pos - 1) + nowValue.substring(pos));
          setCursor(pos - 1);
        }
      } else if (pos === 0 && nowValue[pos]) {
        onChange(nowValue.substring(0, pos) + nowValue.substring(pos + 1));
      }
    } else {
      // 输入字符时，如果当前位置有值，则优先修改当前位置的值，没有值时，才填入字符并将游标后移（最后一位时不后移）
      if (nowValue[pos]) {
        // 如果当前位置有值，则优先修改当前位置的值并将游标后移（最后一位时不后移）
        onChange(nowValue.substring(0, pos) + key + nowValue.substring(pos + 1));
        pos < plateLength - 1 && setCursor(pos + 1);
      } else {
        // 没有值时，才填入字符并将游标后移（最后一位时不后移）
        onChange(nowValue.substring(0, pos) + key + nowValue.substring(pos));
        pos < plateLength - 1 && setCursor(pos + 1);
      }
    }
  };

  // 支持键盘输入
  const onBriefKeyDown = e => {
    if (isComposing) {
      return;
    }
    // e.preventDefault();
    if (!e.ctrlKey && focus && !disabled) {
      switch (e.key) {
        case 'ArrowLeft':
          if (cursor > 0) {
            setCursor(cursor - 1);
            setFocus(true);
          }
          break;
        case 'ArrowRight':
          if (cursor < plateLength - 1 && value[cursor]) {
            setCursor(cursor + 1);
            setFocus(true);
          }
          break;
        case 'Backspace':
          if (cursor >= 0) {
            onKeyboardSelected('Backspace');
          }
          break;
        default:
          // 其他键由 contentEditable input 处理
          break;
      }
    }
  };

  // contentEditable input
  const handleInput = e => {
    e.stopPropagation();
    if (isComposing) {
      return;
    }
    let value = e.target.textContent.replace(/\s/g, '').substring(0, 1);
    if (/^[A-Z0-9\u4e00-\u9fa5]$/.test(value.toUpperCase()) && value) {
      e.target.textContent = value.toUpperCase();
      onKeyboardSelected(value.toUpperCase());
    } else {
      // 禁止除英文数字汉字以外的输入
      e.target.textContent = e.target.textContent.replace(/[^A-Z0-9\u4e00-\u9fa5]/g, '').substring(0, 1);
    }
  };

  // 粘贴
  const handlePaste = event => {
    // 获取到粘贴板数据
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('Text').toUpperCase().replace(/\s/g, '');
    if (focus && !disabled && cursor >= 0) {
      let nowValue = value;
      let pre = nowValue.slice(0, cursor);
      let post = nowValue.slice(cursor, nowValue.length);
      let res = pre + pastedText + post;
      onChange(res.slice(0, plateLength));
    }
  };
  const handleKeyPress = e => {
    props.onKeyPress && props.onKeyPress(e);
  };
  useEffect(() => {
    // 监听粘贴事件
    window.addEventListener('paste', handlePaste);
    // 搜索模式下，监听键盘按键事件，触发外部定义处理函数
    if (type === 'search') {
      window.addEventListener('keypress', handleKeyPress);
    }
    return () => {
      // 销毁事件
      window.removeEventListener('paste', handlePaste);
      if (type === 'search') {
        window.removeEventListener('keypress', handleKeyPress);
      }
    };
    // eslint-disable-next-line
  }, [focus, cursor, disabled, value, plateLength]);

  // 清空
  const clear = e => {
    e.stopPropagation();
    if (value.length > 0 && !disabled) {
      setCursor(0);
      setFocus(true);
      onChange('');
    }
  };

  // 点击外围时同样聚焦
  const handleClickAround = e => {
    e.stopPropagation();
    if (!disabled) {
      // 无焦点时，将光标移至末尾
      !focus && setFocus(true);
      !focus && setCursor(value.length === plateLength ? plateLength - 1 : value.length);
    }
  };

  // 搜索模式下，需自动聚焦第一位（disabled 状态下不执行）
  const licencePlateRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !disabled) {
          // 元素出现在页面上时触发的回调，稍微等待后再聚焦
          setTimeout(() => {
            setCursor(0);
            setFocus(true);
          }, 200);
        }
      });
    });
    const ref = licencePlateRef.current;
    if (ref && type === 'search') {
      observer.observe(ref);
    }

    // 清除观察者，防止内存泄漏
    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
    // eslint-disable-next-line
  }, [disabled]);

  // 输入时跟随聚焦（disabled 状态下不执行）
  const inputRefs = useRef([]);
  useEffect(() => {
    if (!disabled && focus && cursor >= 0 && inputRefs.current[cursor]) {
      const el = inputRefs.current[cursor];
      el.focus();
      // 移动光标到末尾（适用于已有内容）
      // const range = document.createRange()
      // range.selectNodeContents(el)
      // range.collapse(false)
      // const sel = window.getSelection();
      // sel.removeAllRanges();
      // sel.addRange(range);
    }
  }, [focus, cursor, disabled]);

  return (
    <div className="tt-licence-plate-v2" ref={licencePlateRef} data-component-version={componentVersions.Plate || '1.0.0'}>
      <div className={plateNumberBoxClass} tabIndex="0" onClick={handleClickAround}>
        <Popover
          overlayClassName={classNames('tt-licence-plate-popover', {
            'cursor-at-start': cursor === 0,
            'popover-to-top': popoverToTop,
          })}
          content={
            cursor === 0 ? (
              <div className="tt-licence-plate-dropdown">
                {provinceBriefList
                  .filter(item => !hideBrief.includes(item))
                  .map(item => (
                    <Button
                      key={item}
                      type={item === brief ? 'primary' : ''}
                      onClick={e => {
                        e.stopPropagation();
                        onBriefChange(item + code);
                      }}
                      version={Button.version}
                    >
                      {item}
                    </Button>
                  ))}
                {specialBriefList
                  .filter(item => !hideBrief.includes(item))
                  .map(item => (
                    <Button
                      key={item}
                      type={item === brief ? 'primary' : ''}
                      onClick={e => {
                        e.stopPropagation();
                        onBriefChange(canInputKeys.includes(item) ? item + code : item);
                      }}
                      version={Button.version}
                    >
                      {item}
                    </Button>
                  ))}
                {visualBriefList
                  .filter(item => !hideBrief.includes(item))
                  .map(item => (
                    <Button
                      key={item}
                      type={item === brief ? 'primary' : ''}
                      onClick={e => {
                        e.stopPropagation();
                        onBriefChange(item + code);
                      }}
                      version={Button.version}
                    >
                      {item}
                    </Button>
                  ))}
              </div>
            ) : (
              <Keyboard mode={'en'} onSelected={onKeyboardSelected} />
            )
          }
          trigger={'click'}
          open={!disabled && focus}
          placement="bottom"
          getPopupContainer={triggerNode => {
            return triggerNode.parentNode;
          }}
          onOpenChange={_handleKeyboardOpenChange}
        >
          {plateCharList &&
            plateCharList.map((item, index) => {
              const className = classNames('tt-licence-plate-input-box', {
                focus: index === cursor && focus,
                xinnengyuan: index === plateLength - 1 && !plateCharList[index],
              });
              return (
                <div
                  id={'licenceInputBox' + index}
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  className={className}
                  onClick={e => {
                    e.stopPropagation();
                    _handleCursor(index);
                  }}
                  inputMode="none"
                  contentEditable={!disabled && index === cursor && focus}
                  suppressContentEditableWarning
                  style={{ outline: 'none', ...(isComposing && index === cursor ? { width: 'fit-content' } : {}) }}
                  onInput={handleInput}
                  onKeyDown={onBriefKeyDown}
                  onPaste={handlePaste}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  dangerouslySetInnerHTML={{ __html: plateCharList[index] || '' }}
                ></div>
              );
            })}
        </Popover>
        {!disabled && <CloseOutlined className="tt-licence-plate-clear" onClick={clear} />}
        {copy && (
          <div className="tt-licence-plate-copy" style={{ right: !disabled ? '-38px' : '-20px' }}>
            <CopyIcon text={value || ''} />
          </div>
        )}
      </div>
    </div>
  );
}

// 组件版本号
Plate.version = componentVersions.Plate || '1.0.0';

// 组件参数校验
Plate.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  autoCompleteOptions: PropTypes.array,
  canInputKeys: PropTypes.array,
  hideBrief: PropTypes.array,
  type: PropTypes.oneOf(['search', 'input', 'single-input']),
  plateColorValueFromOutside: PropTypes.number,
  popoverToTop: PropTypes.bool,
  copy: PropTypes.bool,
  onColorOptionsChange: PropTypes.func,
  onKeyPress: PropTypes.func,
};

// 组件默认属性
Plate.defaultProps = {
  disabled: false,
  canInputKeys: [],
  hideBrief: [],
  type: 'search',
  copy: true,
};

export default Plate;
