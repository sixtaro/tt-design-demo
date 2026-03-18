// PureColorPanel.js - 纯色模式颜色选择面板
import React from 'react';
import { hsvToRgb } from '../utils/colorConverters';

const PureColorPanel = ({
    hsv,
    currentRgb,
    alpha,
    handleSaturationDrag,
    handleHueDrag,
    handleAlphaDrag,
    startDrag,
    saturationRef,
    hueRef,
    alphaRef
}) => {
    const pureRgb = hsvToRgb(hsv.h, 1, 1);
    return (
        <>
            {/* 饱和度/亮度面板 */}
            <div
                ref={saturationRef}
                className='tt-color-picker-panel'
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '150px',
                    background: `linear-gradient(to top, black 0%, transparent 100%), linear-gradient(to right, white 0%, hsl(${hsv.h * 360}, 100%, 50%) 100%)`,
                }}
                onMouseDown={(e) => {
                    handleSaturationDrag(e);
                    startDrag(handleSaturationDrag);
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: `${hsv.s * 100}%`,
                        top: `${(1 - hsv.v) * 100}%`,
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        boxShadow: `0 2px 3px 1px #cccccc80`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        cursor: 'pointer',
                    }}
                />
            </div>

            <div className='tt-color-picker-settings'>
                <div className='tt-color-picker-slider'>
                    {/* 色调滑块 */}
                    <div
                        ref={hueRef}
                        className='tt-color-picker-tone'
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '10px',
                            marginTop: '10px',
                            background: 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onMouseDown={(e) => {
                            handleHueDrag(e);
                            startDrag(handleHueDrag);
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: `${hsv.h * 100}%`,
                                top: '50%',
                                width: '16px',
                                height: '16px',
                                // background: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 1)`,
                                background: `rgba(${pureRgb.r}, ${pureRgb.g}, ${pureRgb.b}, 1)`,
                                // border: '1px solid #ffffff',
                                // boxShadow: `0 0 1px 1px #ccc`,
                                boxShadow: `0 2px 3px 1px #cccccc80`,
                                borderRadius: '50%',
                                transform: 'translateX(-50%) translateY(-50%)',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>

                    {/* Alpha 滑块 */}
                    <div
                        ref={alphaRef}
                        className='tt-color-picker-alpha'
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '10px',
                            marginTop: '10px',
                            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
                            backgroundSize: '10px 10px',
                            backgroundPosition: '0 0, 5px 5px',
                            borderRadius: '5px',
                        }}
                        onMouseDown={(e) => {
                            handleAlphaDrag(e);
                            startDrag(handleAlphaDrag);
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(to right, rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 0) 0%, rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 1) 100%)`,
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: `${alpha * 100}%`,
                                top: '50%',
                                width: '16px',
                                height: '16px',
                                // background: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 1)`,
                                background: `rgba(${pureRgb.r}, ${pureRgb.g}, ${pureRgb.b}, 1)`,
                                // border: '1px solid #ffffff',
                                // boxShadow: `0 0 1px 1px #ccc`,
                                boxShadow: `0 2px 3px 1px #cccccc80`,
                                borderRadius: '50%',
                                transform: 'translateX(-50%) translateY(-50%)',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* 颜色预览 */}
                <div className='tt-color-picker-view'>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        background: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alpha})`,
                        borderRadius: '4px'
                    }} />
                </div>
            </div>
        </>
    );
};

export default PureColorPanel;
