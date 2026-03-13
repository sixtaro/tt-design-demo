import React, { useImperativeHandle, useMemo, useState, useCallback, useEffect } from 'react';
import { Carousel, Image, Row, Col, Empty, message } from 'antd';
import { Request } from '@/utils';
import PageLayout from './index';

export default React.forwardRef((props, ref) => {
    const [prop, setProp] = useState();
    const [list, setList] = useState([]);

    const loadData = useCallback(
        async config => {
            // 从传参的 record 获取
            if (config.loopList) {
                setList(Object.renderRecord(config.loopList, props));
            }
            if (config.getApi) {
                // 从接口获取
                const result = await Request(config.getApi, config.param);
                if (result.success) {
                    let list = Object.getValue(result.data, config.field, result.data);
                    setList(list);
                } else {
                    message.error(result.message || '读取数据失败');
                }
            }
        },
        [props]
    );
    const loopConfig = useMemo(() => {
        if (props.pageConfig) {
            const config =
                typeof props.pageConfig === 'object' ? { ...props.pageConfig } : eval(`(${props.pageConfig || '{}'})`);
            let param;
            if (typeof config.param === 'object') {
                param = { ...config.param };
            } else {
                param = eval(`(${config.param || '{}'})`);
                config.param = {};
            }
            for (const key in param) {
                config.param[key] = Object.getValue(props, param[key]);
            }
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, prop]);
    useEffect(() => {
        if (loopConfig) {
            loadData(loopConfig);
        }
    }, [loopConfig, loadData]);
    useImperativeHandle(ref, () => ({
        resize: () => {},
        reload: () => {},
        setState: state => {
            setProp({ ...state });
        },
    }));

    const getPage = useCallback(
        innerProps => {
            if (innerProps?.type === 'pageID' && innerProps?.pageID) {
                return (
                    <PageLayout
                        {...props}
                        ref={ref => (innerProps.pageRef = ref)}
                        pageID={innerProps.pageID}
                        {...innerProps}
                    />
                );
            }
            if (innerProps?.type === 'path') {
                const PageComponent = props.routes[innerProps.pageID] || Empty;
                return (
                    <PageComponent
                        {...props}
                        page={{ ...props.page }}
                        ref={ref => (innerProps.pageRef = ref)}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={`未找到页面${innerProps.pageID}`}
                        {...innerProps}
                    />
                );
            }
            if (innerProps?.type === 'view' || innerProps?.type === 'web') {
                const PageComponent = props.routes['Web'];
                const page = props.page;
                return (
                    <PageComponent
                        {...props}
                        ref={ref => (innerProps.pageRef = ref)}
                        page={{ ...page }}
                        url={innerProps.pageID}
                        {...innerProps}
                    />
                );
            }
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂未配置页面" {...innerProps} />;
        },
        [props]
    );

    // 外层容器
    // const OuterComponent = useMemo(() => {
    //     if (loopConfig.outer === 'Row') {
    //         return Row;
    //     }
    //     if (loopConfig.outer === 'Carousel') {
    //         return Carousel;
    //     }
    //     const divComponent = props => <div {...props}>{props.children}</div>;
    //     return divComponent;
    // }, [loopConfig]);
    const getComponent = useCallback(loopItem => {
        if (loopItem.component === 'Row') {
            return Row;
        }
        if (loopItem.component === 'Carousel') {
            return Carousel;
        }
        if (loopItem.component === 'Col') {
            return Col;
        }
        if (loopItem.component === 'Image') {
            return Image;
        }
        if (loopItem.component === 'Image.PreviewGroup') {
            return Image.PreviewGroup;
        }
        const divComponent = props => <div {...props}>{props.children}</div>;
        return divComponent;
    }, []);

    // 内层组件
    // const InnerComponent = useMemo(() => {
    //     if (loopConfig.inner === 'Col') {
    //         return Col;
    //     }
    //     if (loopConfig.inner === 'Image') {
    //         return Image;
    //     }
    //     const divComponent = props => <div {...props}>{props.children}</div>;
    //     return divComponent;
    // }, [loopConfig]);

    const getInnerProps = useCallback(
        (item, index, list) => {
            const innerProps = Object.clone(loopConfig.innerProps);
            return Object.renderObject(innerProps, {
                item,
                index,
                list,
            });
        },
        [loopConfig.innerProps]
    );

    const getInnerComponent = useCallback(
        (item, index, list) => {
            let c = <></>;
            const loopInner = Object.clone(loopConfig.loopInner);
            loopInner.reverse().forEach(inner => {
                const Com = getComponent(inner);
                const innerProps = getInnerProps(item, index, list);
                if (inner.innerType === 'page') {
                    c = getPage(innerProps);
                } else {
                    c = (
                        <Com index={index} {...innerProps}>
                            {c}
                        </Com>
                    );
                }
            });
            return c;
        },
        [loopConfig, getComponent, getInnerProps, getPage]
    );

    const OuterComponent = useMemo(() => {
        let c = <>{list.map((item, index) => getInnerComponent(item, index, list))}</>;
        const loopOuter = Object.clone(loopConfig.loopOuter);
        loopOuter.reverse().forEach(outer => {
            const Com = getComponent(outer);
            c = <Com>{c}</Com>;
        });
        return () => c;
    }, [loopConfig, getComponent, getInnerComponent, list]);
    return <OuterComponent {...loopConfig.outerProps}></OuterComponent>;
});
