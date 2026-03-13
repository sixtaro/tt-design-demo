import { useRef, useCallback, useLayoutEffect, useMemo, useEffect } from 'react';

const lineWidth = 3;

export default props => {
    const canvasRef = useRef();
    const config = useMemo(() => (props.config ? JSON.parse(props.config) : {}), [props.config]);
    const imageSize = useMemo(() => props.imageSizes[props.backgroundImageUrl] || { width: 0, height: 0 }, [props.imageSizes, props.backgroundImageUrl]);

    const imageScale = useMemo(() => {
        let scale = 1;
        if (imageSize.width > 0 && imageSize.height > 0 && config.templateImage?.width && config.templateImage?.height) {
            const scaleWidth = imageSize.width / config.templateImage.width;
            const scaleHeight = imageSize.height / config.templateImage.height;
            if (scaleWidth > 1 && scaleHeight > 1) {
                scale = Math.max(scaleWidth, scaleHeight);
            } else {
                scale = Math.min(scaleWidth, scaleHeight);
            }
        }
        return scale;
    }, [imageSize, config.templateImage]);

    useEffect(() => {
        if (!props.imageSizes[props.backgroundImageUrl]) {
            const imgDom = document.querySelector(`img[src="${props.backgroundImageUrl}"]`);
            if (imgDom) {
                let size = Object.clone(props.imageSizes);
                size[props.backgroundImageUrl] = { width: imgDom.width, height: imgDom.height };
                props.setImageSizes(size);
            }
        }
    }, [props.backgroundImageUrl, props]);

    // 绘制单个多边形
    const drawPolygon = useCallback(
        points => {
            if (points.length > 0) {
                let ctx = canvasRef.current.getContext('2d');
                const color = getComputedStyle(document.documentElement).getPropertyValue('--ant-primary-color');
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth / imageScale;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        },
        [imageScale]
    );

    // 绘制所有图形
    const draw = useCallback(
        els => {
            let ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
            els.forEach(points => {
                drawPolygon(points);
            });
        },
        [drawPolygon]
    );

    useLayoutEffect(() => {
        setTimeout(() => {
            draw(config.elements?.map(item => item.points) || []);
        }, 200);
    }, [draw, config]);

    return (
        <div
            style={{
                width: config.templateImage.width,
                height: config.templateImage.height,
                position: 'absolute',
                // zoom: imageScale * (props.scale || 1),
                transform: `scale(${imageScale * (props.scale || 1)})`,
            }}
        >
            <canvas
                ref={canvasRef}
                width={config.templateImage.width}
                height={config.templateImage.height}
                data-index={props.dataIndex}
                // style={{ background: `url(${props.backgroundImageUrl})` }}
            ></canvas>
            <div class="container">
                {config.elements
                    ?.filter(item => !!item.parkSpace?.name)
                    .map((item, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                padding: '4px 10px',
                                color: '#fff',
                                background: 'var(--ant-primary-color)',
                                outline: 'none',
                                transform: `scale(${1 / imageScale})`,
                                transformOrigin: 'left top',
                                ...(item.parkSpace.style || {}),
                            }}
                        >
                            {item.parkSpace.name}
                        </div>
                    ))}
            </div>
        </div>
    );
};
