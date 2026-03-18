// GradientColorPanel.js - 渐变色模式颜色选择面板
import InputNumber from '../../InputNumber';
import { hsvToRgb } from '../utils/colorConverters';

const GradientColorPanel = ({
    gradientStops,
    selectedStopIndex,
    gradientAngle,
    hsv,
    currentRgb,
    alpha,
    handleSaturationDrag,
    handleHueDrag,
    handleAlphaDrag,
    startDrag,
    setSelectedStopIndex,
    handleStopDrag,
    setGradientAngle,
    handleAddStop,
    saturationRef,
    hueRef,
    alphaRef,
    gradientBarRef
}) => {
    const currentStop = gradientStops[selectedStopIndex] || { hsv, alpha };
    const displayHsv = currentStop.hsv;
    const displayAlpha = currentStop.alpha;
    const pureRgb = hsvToRgb(displayHsv.h, 1, 1);

    return (
        <>
            {/* 渐变控制条 */}
            <div className='tt-color-picker-gradient-control' style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                <div
                    ref={gradientBarRef}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '10px',
                        background: `linear-gradient(to right, ${gradientStops.map(stop => {
                            const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
                            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha}) ${stop.position * 100}%`;
                        }).join(', ')}`,
                        // border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                    onClick={(e) => {
                        handleAddStop(e);
                    }}
                >
                    {gradientStops.map((stop, index) => {
                        const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${stop.position * 100}%`,
                                    top: '50%',
                                    width: '14px',
                                    height: '14px',
                                    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha})`,
                                    // border: '2px solid #ccc',
                                    border: '2px solid #ffffff',
                                    // boxShadow: `0 0 1px 1px #ccc`,
                                    boxShadow: `0 2px 3px 1px #cccccc80`,
                                    borderRadius: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedStopIndex(index)}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    // 将gradientBarRef作为参数传递给handleStopDrag函数
                                    startDrag(handleStopDrag(index, gradientBarRef.current));
                                }}
                            />
                        );
                    })}
                </div>
                <InputNumber
                    style={{ marginLeft: '10px', width: '70px' }}
                    min={0}
                    max={360}
                    formatter={(value) => `${Math.round(value)}°`}
                    parser={(value) => value.replace('°', '')}
                    value={gradientAngle}
                    onChange={setGradientAngle}
                    controls={false}
                />
            </div>

            {/* 饱和度/亮度面板 */}
            <div
                ref={saturationRef}
                className='tt-color-picker-panel'
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '150px',
                    background: `linear-gradient(to top, black 0%, transparent 100%), linear-gradient(to right, white 0%, hsl(${displayHsv.h * 360}, 100%, 50%) 100%)`,
                }}
                onMouseDown={(e) => {
                    handleSaturationDrag(e);
                    startDrag(handleSaturationDrag);
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: `${displayHsv.s * 100}%`,
                        top: `${(1 - displayHsv.v) * 100}%`,
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        // boxShadow: `0 0 1px 1px #ccc`,
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
                                left: `${displayHsv.h * 100}%`,
                                top: '50%',
                                width: '16px',
                                height: '16px',
                                // background: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 1)`,
                                background: `rgba(${pureRgb.r}, ${pureRgb.g}, ${pureRgb.b}, 1)`,
                                boxShadow: `0 2px 3px 1px #cccccc80`,
                                // border: '2px solid #ffffff',
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
                                left: `${displayAlpha * 100}%`,
                                top: '50%',
                                width: '16px',
                                height: '16px',
                                // background: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 1)`,
                                background: `rgba(${pureRgb.r}, ${pureRgb.g}, ${pureRgb.b}, 1)`,
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
                        background: `linear-gradient(${gradientAngle}deg, ${gradientStops.map(stop => {
                            const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
                            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha}) ${stop.position * 100}%`;
                        }).join(', ')})`,
                        borderRadius: '4px'
                    }} />
                </div>
            </div>
        </>
    );
};

export default GradientColorPanel;
