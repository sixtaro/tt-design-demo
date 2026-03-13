import { forwardRef, useImperativeHandle, useMemo, useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { Slider, DatePicker, Button } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Request } from '@/utils';
import { getIcon } from '@/business';
import moment from 'moment';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
// import 'swiper/css/effect-coverflow';
import './pictureSwiper.less';
import nopicture from '@/images/nopicture.png';
import ReactDOM from 'react-dom';
import ParkSpaceCanvas from './parkSpaceCanvas';

// [
//     {title: '车牌A', description: '特征图', url: 'https://t7.baidu.com/it/u=3435942975,1552946865&fm=193&f=GIF'},
//     {title: '车牌B', description: '特征图', url: 'https://t7.baidu.com/it/u=3569419905,626536365&fm=193&f=GIF' },
//     {title: '车牌C', description: '特征图', url: 'https://t7.baidu.com/it/u=3779234486,1094031034&fm=193&f=GIF'},
//     {title: '车牌D', description: '特征图', url: 'https://t7.baidu.com/it/u=2763645735,2016465681&fm=193&f=GIF'},
//     {title: '车牌E', description: '特征图', url: 'https://t7.baidu.com/it/u=3435942975,1552946865&fm=193&f=GIF'},
//     {title: '车牌F', description: '特征图', url: 'https://t7.baidu.com/it/u=3569419905,626536365&fm=193&f=GIF' },
//     {title: '车牌G', description: '特征图', url: 'https://t7.baidu.com/it/u=3779234486,1094031034&fm=193&f=GIF'},
//     {title: '车牌H', description: '特征图', url: 'https://t7.baidu.com/it/u=2763645735,2016465681&fm=193&f=GIF'},
// ] ||
const PictureSwiper = forwardRef((props, ref) => {
    const [list, setList] = useState(props.list instanceof Array ? props.list : console.log('props.list 不是数组', props.list) || []);

    const swiperRef = useRef();
    const swiper = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const visible = useMemo(() => props.visible, [props.visible]);
    const [startTime, setStartTime] = useState(moment(props.startTime).startOf('day'));
    const [endTime, setEndTime] = useState(moment(props.endTime).endOf('day'));
    const [params, setParams] = useState(props.param); // 获取图片的传参
    const [scale, setScale] = useState(1);
    const [currentRecord, setCurrentRecord] = useState(props.record); // 当前记录，用于获取上下记录使用
    // 是否显示滚动条、时间轴、放大缩小、上下记录切换，默认不显示
    const showSilderBar = useMemo(
        () =>
            Object.renderRecord(props.action?.param?.showSilderBar !== undefined ? props.action.param.showSilderBar : props.showSilderBar, {
                ...props,
                record: currentRecord,
            }),
        [props, currentRecord]
    );
    const showScrollBar = useMemo(() => props.showScrollBar, [props.showScrollBar]);
    const showZoomBar = useMemo(() => props.showZoomBar, [props.showZoomBar]); // 放大缩小按钮
    const showChangeRecordBar = useMemo(() => props.showChangeRecordBar, [props.showChangeRecordBar]); // 切换上下记录按钮
    const [loadedImg, setLoadedImg] = useState([]);
    const [loadedErrorImg, setloadedErrorImg] = useState([]);
    const [imageSizes, setImageSizes] = useState({}); // 记录图片所在元素的大小，绘制车位的缩放比例使用

    const recordList = useMemo(() => props.callbackData?.[props.listField || 'list'] || [], [props.callbackData, props.listField]);
    const onClose = useCallback(() => (props.onCancel || props.onClose)(), [props.onCancel, props.onClose])

    const defaultIndex = useMemo(
        () =>
            typeof props.defaultIndex === 'number' ? props.defaultIndex : Object.renderRecord(props.defaultIndex, { ...props, list, record: currentRecord }),
        [props, list, currentRecord]
    );
    const recordKey = useMemo(() => props.recordKey || 'recordID', [props.recordKey]);

    useLayoutEffect(() => {
        if (visible !== false) {
            swiper.current = new Swiper(swiperRef.current, {
                // mousewheel: true,
                // initialSlide: 1,
                preloadImages: false,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 3,
                },
                effect: 'coverflow',
                slidesPerView: 2,
                centeredSlides: true,
                zoom: true,
                coverflowEffect: {
                    rotate: 60,
                    stretch: '30%',
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                },
                scrollbar: {
                    el: '.swiper-scrollbar',
                    draggable: true,
                },
                on: {
                    slideChange: function (swiper, e) {
                        swiper.zoom?.out?.(e);
                        setActiveIndex(this.activeIndex);
                        setScale(1);
                    },
                    click: function (swiper, e) {
                        if (String(this.activeIndex) === e.target.dataset.index) {
                            swiper.zoom?.scale > 1 ? swiper.zoom?.out?.(e) : swiper.zoom?.in?.(e);
                            setScale(swiper.zoom?.scale);
                        } else {
                            setScale(1);
                        }
                    },
                    doubleClick: function (swiper, e) {
                        if (String(this.activeIndex) === e.target.dataset.index) {
                            swiper.zoom?.scale > 1 ? swiper.zoom?.out?.(e) : swiper.zoom?.in?.(e);
                            setScale(swiper.zoom?.scale);
                        } else {
                            setScale(1);
                        }
                    },
                },
            });
            return () => swiper.current.destroy();
        }
    }, [visible, list]);

    useLayoutEffect(() => {
        const ev = e => {
            if (e.keyCode === 27) {
                onClose?.();
            }
        };
        window.addEventListener('keyup', ev);
        return () => window.removeEventListener('keyup', ev);
    }, [props, onClose]);

    useLayoutEffect(() => {
        if (defaultIndex > -1) {
            setTimeout(() => {
                swiper.current?.slideTo?.(defaultIndex);
            }, 100);
        }
    }, [defaultIndex]);

    useImperativeHandle(
        ref,
        () => ({
            getIndex: () => activeIndex,
        }),
        [activeIndex]
    );
    const marks = useMemo(
        () =>
            list.map((item, index) => {
                if (defaultIndex === index) {
                    return {label: item.description};
                }
                return {label: ' '};
            }),
        [list, defaultIndex]
    );

    useEffect(() => {
        const getData = async () => {
            // Object.renderObject(props.param, props);
            const result = await Request(props.api, {
                // ...props.param,
                ...params,
                startTime: startTime.format('yyyy-MM-DD HH:mm:ss'),
                endTime: endTime.format('yyyy-MM-DD HH:mm:ss'),
            });
            if (result.success) {
                const list = Object.renderArray(Object.getValue(result.data, props.listField || 'list', []), Object.clone(props.itemRender || {}), { ...props, record: currentRecord });
                if (Object.isEmpty(list)) {
                    list[0] = { title: Object.renderRecord(props.itemRender?.title || '', { ...props, record: currentRecord }), description: '暂无图片', url: nopicture };
                }
                setList(list);
            }
        };
        if (props.api) {
            getData();
        }
    }, [startTime, endTime, props, params, currentRecord]);
    useEffect(() => {
        if (props.list) {
            if (showChangeRecordBar) {
                const _list = Object.renderObject(props.action?.param?.list, { ...props, record: currentRecord });
                setList(_list);
            } else {
                setList(props.list);
            }
        }
    }, [props, showChangeRecordBar, currentRecord]);

    useLayoutEffect(() => {
        swiper.current?.update();
    }, [list]);
    const el = useRef(document.createElement('div'));
    useLayoutEffect(() => {
        document.body.appendChild(el.current);
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            document.body.removeChild(el.current);
        };
    }, []);

    // 切换上下一条记录
    const handleRecord = (type) => {
        const list = props.callbackData?.[props.listField || 'list'] || [];
        const currentIndex = list.findIndex(item => item[recordKey] === currentRecord?.[recordKey]);
        const index = type === 'pre' ? currentIndex - 1 : currentIndex + 1;
        const record = list[index];
        setCurrentRecord(record);
        setActiveIndex(0);
        const param = Object.renderObject(Object.clone(props.action?.param?.param), {...props, record: record});
        setParams(param);
    };

    return ReactDOM.createPortal(
        visible === false ? <div></div> :
        <div className="picture-swiper">
            <div className="swiper-title">{list[activeIndex]?.title}</div>
            {
                list[activeIndex]?.description && <div className="swiper-description">{list[activeIndex]?.description}</div>
            }
            <div ref={swiperRef} className="swiper">
                <div
                    className="swiper-wrapper"
                    onWheel={e => {
                        if (e.target.dataset.index === String(activeIndex)) {
                            e.nativeEvent.wheelDelta > 0 ? swiper.current.zoom.in(e) : swiper.current.zoom.out(e);
                            setScale(e.nativeEvent.wheelDelta > 0 ? 3 : 1);
                            e.stopPropagation();
                            // e.preventDefault();
                        }
                    }}
                >
                    {list.map((item, index) => (
                        <div className="swiper-slide" key={`${item.url}-${index}`} onClick={() => swiper.current.slideTo(index)}>
                            <div className="swiper-zoom-container">
                                <img
                                    data-src={item.url}
                                    alt=""
                                    data-index={index}
                                    onError={e => {
                                        e.target.src = nopicture;
                                        setloadedErrorImg(imgs => imgs.concat(item.url));
                                    }}
                                    onLoad={() => setLoadedImg(imgs => imgs.concat(item.url))}
                                    className="swiper-lazy"
                                ></img>
                                {!!item.mark && loadedImg.includes(item.url) && !loadedErrorImg.includes(item.url) && (
                                    <ParkSpaceCanvas
                                        dataIndex={index}
                                        config={item.mark}
                                        backgroundImageUrl={item.url}
                                        scale={index === activeIndex ? scale : 1}
                                        imageSizes={imageSizes}
                                        setImageSizes={setImageSizes}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!!showZoomBar && <div className="swiper-control">
                <div className="swiper-control-icon swiper-control-in" onClick={() => swiper.current.zoom.in()}>
                    {getIcon('icon-fangda')}
                </div>
                {/* <div className="swiper-control-icon swiper-control-in" onClick={() => swiper.current.zoom.in()}>
                    {getIcon('icon-one-one')}
                </div> */}
                <div className="swiper-control-icon swiper-control-out" onClick={() => swiper.current.zoom.out()}>
                    {getIcon('icon-suoxiao')}
                </div>
            </div>}
            {showSilderBar ? (
                <>
                    <div className="swiper-bar swiper-silder">
                        <DatePicker
                            showTime={{
                                format: 'HH:mm',
                                defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            value={startTime}
                            onChange={value => setStartTime(value)}
                            allowClear={false}
                            format="YYYY-MM-DD HH:mm"
                            placement="topLeft"
                        />
                        <DatePicker
                            showTime={{
                                format: 'HH:mm',
                                defaultValue: moment('23:59:59', 'HH:mm:ss'),
                            }}
                            value={endTime}
                            onChange={value => setEndTime(value)}
                            allowClear={false}
                            format="YYYY-MM-DD HH:mm"
                            placement="topRight"
                        />
                        {(list.length > 1 && defaultIndex > -1) ? (
                            <div className="swiper-button" onClick={() => swiper.current.slideTo(defaultIndex)}>
                                回到当前
                            </div>
                        ) : (
                            ''
                        )}
                        <Slider
                            marks={marks}
                            included={false}
                            value={activeIndex}
                            dots
                            tooltip={{formatter: () => list[activeIndex]?.sliderTooltipFormatter}}
                            max={list.length - 1}
                            onChange={index => swiper.current.slideTo(index)}
                        />
                    </div>
                </>
            ) : (
                ''
            )}
            {showScrollBar ? (
                <>
                    <div className="swiper-scrollbar swiper-bar"></div>
                </>
            ) : (
                ''
            )}
            <div className="swiper-close" onClick={() => onClose?.()}>
                <CloseOutlined />
            </div>
            {!!showChangeRecordBar && (
                <div className="swiper-change-record">
                    <Button
                        type="link"
                        icon={<LeftOutlined />}
                        disabled={recordList.findIndex(item => item[recordKey] === currentRecord[recordKey]) === 0}
                        onClick={() => handleRecord('pre')}
                    ></Button>
                    <Button
                        type="link"
                        icon={<RightOutlined />}
                        disabled={recordList.findIndex(item => item[recordKey] === currentRecord[recordKey]) === recordList.length - 1}
                        onClick={() => handleRecord('next')}
                    ></Button>
                </div>
            )}
        </div>, el.current
    );
});

export default PictureSwiper;
