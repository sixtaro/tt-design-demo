import React, { useImperativeHandle, useEffect, useState, useRef, useMemo } from 'react';
import TableLayout from './table';
import FormLayout from './form';
import TabsLayout from './tabs';
import ModalLayout from './modal';
import DetailLayout from './detail';
import GridLayout from './grid';
import LoopLayout from './loop';
import { Request, Storage } from '@/utils';
import { Skeleton, message, Tag } from 'antd';
import './index.less';

const PageLayout = React.forwardRef((props, ref) => {
    const pageID = useMemo(() => props.pageID || props.page.pageID, [props.pageID, props.page?.pageID]);
    const [pageConfig, setPageConfig] = useState();
    const pageRef = useRef();
    const [dataSource, setDataSource] = useState({});
    const [show, setShow] = useState(true);

    const _setPageConfig = (config) => {
        if (window._memberCardText) {
            const _c = JSON.parse(JSON.stringify(config).replace(/会员[卡车](?!管理)/g, window._memberCardText));
            setPageConfig(_c);
        } else {
            setPageConfig(config);
        }
    };

    useEffect(() => {
        if (window._pageLayoutKeyDown) {
            return;
        }
        window.addEventListener('keydown', e => {
            if (e.altKey && e.code === 'KeyC') {
                Storage.clear(false, 'pageID');
                message.info('已清除配置页面缓存');
            }
        });
        window._pageLayoutKeyDown = true;
    }, []);
    useEffect(() => {
        const loadPage = async () => {
            if (!pageID) {
                console.log('未传入pageID');
                return;
            }
            let _config = Storage.get(pageID.toLowerCase(), 'pageID');
            if (_config) {
                const config = typeof _config === 'object' ? { ..._config } : eval(`(${_config || '{}'})`);
                _setPageConfig(config);
            } else {
                let pageApi = '../PublicV2/home/sysconfig/getpageconfig'; // props.model?.home?.sysconfig?.getpageconfig || props.getPageConfig;
                if ([12, 13].includes(window.systemID)) {
                    pageApi = '../tongtongpay/ttpage/getpageconfig'; // 商户管理平台和商户平台独立后使用独立的接口
                }
                if ([17].includes(window.systemID)) {
                    pageApi = '../bs/business/sysconfig/getpageconfig'; // 商家平台使用独立的接口
                }
                if (typeof pageApi === 'string') {
                    pageApi = {
                        _url: pageApi,
                    };
                }
                pageApi._catch = '5s';
                let result = await Request(pageApi, {
                    pageIDs: pageID,
                });
                if (result.data?.success) {
                    result = result.data;
                }
                if (result.success) {
                    const pages = result.data.pages;
                    pages.forEach(page => {
                        _config = page.pageConfig;
                        const config = typeof _config === 'object' ? { ..._config } : eval(`(${_config || '{}'})`);
                        if (page.pageType && !config.layout) {
                            config.layout = page.pageType;
                        }
                        Storage.set(page.pageID.toLowerCase(), config, '8h', 'pageID');
                        if (page.pageID.toLowerCase() === pageID.toLowerCase()) {
                            _setPageConfig(config);
                        }
                    });
                } else {
                    message.error(result.message);
                }
            }
        };
        loadPage();
    }, [props.page, pageID, props.model, props.getPageConfig]);
    useEffect(() => {
        const loadApi = async dataSourceConfig => {
            const dataSourceItem = Object.renderObject(Object.clone(dataSourceConfig.source), props);
            let result = await Request(dataSourceItem.api, dataSourceItem.param);
            if (result.data?.success) {
                result = result.data;
            }
            if (result.success) {
                let data = Object.getValue(result.data, dataSourceItem.field);
                if (dataSourceItem.filter) {
                    // eslint-disable-next-line no-new-func
                    const filter = new Function('data', dataSourceItem.filter);
                    data = filter(data);
                }
                dataSource[dataSourceConfig.id] = data;
                setDataSource({ ...dataSource });
            } else {
                message.error(result.message);
            }
        };
        if (pageConfig?.dataSource instanceof Array) {
            pageConfig?.dataSource.forEach(item => {
                if (item.type === 'api' && item.source) {
                    loadApi(item);
                }
                if (item.type === 'static' && item.data) {
                    dataSource[item.id] = item.data;
                    setDataSource({ ...dataSource });
                }
            });
        }
        // 动态添加配置页面样式，如果已添加过则不再添加
        if (!window._page_layer_style) {
            window._page_layer_style = {};
        }
        if (pageConfig?.style && !window._page_layer_style[pageID]) {
            window._page_layer_style[pageID] = true;
            var d = document.createElement('style');
            d.setAttribute('type', 'text/css');
            d.innerHTML = pageConfig.style;
            document.getElementsByTagName('head')[0].appendChild(d);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageConfig]);

    const debug = useRef({
        isDebug: false,
        lastHeart: null,
    });
    useEffect(() => {
        if (!props.page) {
            return;
        }
        if (!props.page.originalTitle) {
            props.page.originalTitle = props.page.title;
        }
        const timer = setInterval(() => {
            if (debug.current.isDebug) {
                // 心跳超时退出预览模式
                if (new Date().getTime() - debug.current.lastHeart > 10000) {
                    debug.current.isDebug && props.pageControl.changePageTitle({ pageID: pageID, newTitle: props.page.originalTitle });
                    debug.current.isDebug = false;
                    Storage.removeListen(debug.current.timer);
                }
            }
        }, 1000);
        if (window.location.hostname === 'localhost') {
            const fetchPageLayoutConfig = () => {
                fetch('/pageLayoutLocalPreview?pageID=' + pageID).then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then((res) => {
                    if (res.success) {
                        if (res.data) {
                            const _config = res.data;
                            const config = typeof _config === 'object' ? { ..._config } : eval(`(${_config || '{}'})`);
                            _setPageConfig(config);
                            // if (!debug.current.isDebug) {
                            //     debug.current.isDebug = true;
                            //     props.pageControl.changePageTitle({ pageID: pageID, newTitle: <><Tag color="orange">开发</Tag>{props.page.originalTitle}</> });
                            // }
                            setTimeout(() => {
                                fetchPageLayoutConfig();
                            }, 1000);
                        } else {
                            // props.pageControl.changePageTitle({ pageID: pageID, newTitle: props.page.originalTitle });
                        }
                    }
                });
            };
            fetchPageLayoutConfig();
        }
        return () => {
            clearInterval(timer);
        };
    }, [props.page, pageID, props.pageControl]);
    useEffect(() => {
        if (!Storage.listen) {
            return;
        }
        // 监听控制台心跳，超过10秒则自动退出预览模式。
        const timer = Storage.listen(
            param => {
                if (param.type === 'enterDebug') {
                    if (!debug.current.isDebug) {
                        Storage.removeListen(debug.current.timer);
                        debug.current.timer = Storage.listen(
                            param => {
                                if (param.type === 'config') {
                                    const _config = param.config;
                                    const config = typeof _config === 'object' ? { ..._config } : eval(`(${_config || '{}'})`);
                                    _setPageConfig(config);
                                }
                            },
                            'config-' + pageID,
                        );
                        props.pageControl.changePageTitle({ pageID: pageID, newTitle: <><Tag color="purple">预览</Tag>{props.page.originalTitle}</> });
                    }
                    debug.current.isDebug = true;
                    debug.current.lastHeart = new Date().getTime();
                }
                if (param.type === 'exitDebug') {
                    if (debug.current.isDebug) {
                        props.pageControl.changePageTitle({ pageID: pageID, newTitle: props.page.originalTitle });
                        Storage.removeListen(debug.current.timer);
                    }
                    debug.current.isDebug = false;
                }
            },
            'debug-' + pageID,
            3000
        );
        return () => {
            Storage.removeListen(timer);
        };
    }, [props.page, props.pageControl, pageID]);
    useImperativeHandle(ref, () => ({
        pageRef,
        resize: () => {
            pageRef?.current?.resize && pageRef.current.resize();
        },
        reload: () => {
            pageRef?.current?.reload && pageRef.current.reload();
        },
        getFixedExtra: () => {
            return pageRef.current?.getFixedExtra?.();
        },
        setState: state => {
            pageRef?.current?.setState && pageRef.current.setState(state);
        },
        show: () => {
            setShow(true);
        },
        hide: () => {
            setShow(false);
        },
        toggle: () => setShow(!show),
        isShow: () => show,
    }), [show]);
    const renderLayout = pageConfig => {
        if (pageConfig.layout === 'table') {
            return (
                <TableLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                ></TableLayout>
            );
        }
        if (pageConfig.layout === 'form') {
            return (
                <FormLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                />
            );
        }
        if (pageConfig.layout === 'tabs') {
            return (
                <TabsLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                />
            );
        }
        if (pageConfig.layout === 'detail') {
            return (
                <DetailLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                />
            );
        }
        if (pageConfig.layout === 'grid') {
            return (
                <GridLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                />
            );
        }
        if (pageConfig.layout === 'loop') {
            return (
                <LoopLayout
                    {...props}
                    dataSource={{ ...props.dataSource, ...dataSource }}
                    pageConfig={pageConfig}
                    ref={pageRef}
                />
            );
        }
        return <></>;
    };

    return show ? <div className={'page-layout-index ' + pageID}>
        {Object.isEmpty(pageConfig) ? <Skeleton active></Skeleton> : renderLayout(pageConfig)}
    </div> : <></>;
});

PageLayout.ModalLayout = ModalLayout;

export default PageLayout;
