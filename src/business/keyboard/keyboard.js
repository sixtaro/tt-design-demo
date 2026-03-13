import React, { useState, useEffect, useMemo } from 'react';
import './keyboard.less';

const disabledKeys = ['I', 'O'];
const layouts = {
    en: [
        ['1','2','3','4','5','6','7','8','9','0'],
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['字', 'Z','X','C','V','B','N','M','⌫']
    ],
    zh: [
        ["京","津","冀","辽","蒙","鲁","豫","贵"],
        ["渝","云","沪","黑","湘","皖","新","苏"],
        ["浙","赣","鄂","桂","甘","晋","陕","吉"],
        ["闽","粤","青","藏","川","宁","琼","台"],
        ["领","警","学","挂","港","澳","试","超","使"],
        ['EN',"无牌","非机动车","电","U",'⌫'],
    ]
};

export default function Keyboard(props) {
    const [currentMode, setCurrentMode] = useState('en');

    useEffect(() => {
        if (layouts[props.mode]) {
            setCurrentMode(props.mode);
        } else {
            setCurrentMode('en');
        }
    }, [props.mode]);

    const processedLayout = useMemo(() => {
        return layouts[currentMode]?.map(row =>
            row.map(text => ({
                text,
                disabled: disabledKeys.includes(text)
            }))
        ) || [];
    }, [currentMode]);

    const handleContentMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleClick = (e, key) => {
        e.preventDefault();
        e.stopPropagation();
        if (key === '字') {
            setCurrentMode('zh') ;
        } else if (key === 'EN') {
            setCurrentMode('en') ;
        } else if (key === '⌫') {
            props.onSelected?.('Backspace');
        } else if (!disabledKeys.includes(key)) {
            props.onSelected?.(key);
        }
    }

    return (
        <div
            class="keyboard-container"
            onMouseDown={handleContentMouseDown}
            onTouchStart={handleContentMouseDown}
        >
            <div class="virtual-keyboard">
                {
                    processedLayout.map((item, index) => (
                        <div class="key-row" key={index}>
                            {
                                item.map(key => (
                                    <span
                                        key={key.text}
                                        class={`key ${key.disabled ? 'key-disabled' : ''}`}
                                        onClick={(e) => handleClick(e, key.text)}
                                    >
                                        { key.text }
                                    </span>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
