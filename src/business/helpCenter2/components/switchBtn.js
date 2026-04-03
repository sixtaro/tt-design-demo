import React, { useState } from 'react';
import { Storage } from '@/utils';

const SwitchBtn = props => {
    const { setOpen, open } = props;
    const helpCenterConfig = Storage.get('helpCenterConfig') || {};
    const { helpCenterChecked } = helpCenterConfig;
    // 箭头方向
    const [dir, setDir] = useState('right');
    // 是否悬浮在按钮上
    const [isHover, setIsHover] = useState(false);

    const handleQuesEnter = () => {
        setIsHover(true);
    };

    const handleQuesLeave = () => {
        setIsHover(false);
    };

    const handleQuesClick = () => {
        setOpen(true);
        setIsHover(false);
    };

    const handleArrowClick = () => {
        setDir(dir === 'right' ? 'left' : 'right');
    };

    return (helpCenterChecked || helpCenterChecked == null) && !open ? (
        <div className="help-center-switch">
            {dir === 'right' ? (
                <span className="switch-btn-tips" onClick={handleQuesClick} onMouseEnter={handleQuesEnter} onMouseLeave={handleQuesLeave}>
                    {isHover ? <span className="tips-text">帮助中心</span> : <span className="icon-wrapper tips-icon"></span>}
                </span>
            ) : (
                ''
            )}
            <span className="switch-btn-arrow" onClick={handleArrowClick}>
                {dir === 'right' ? <span className="icon-wrapper right-icon"></span> : <span className="icon-wrapper left-icon"></span>}
            </span>
        </div>
    ) : (
        ''
    );
};

export default SwitchBtn;
