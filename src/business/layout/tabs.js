import React, { useImperativeHandle, useLayoutEffect, useMemo, useState, createRef, useCallback } from 'react';
import { Tabs, Empty } from 'antd';
import PageLayout from './index';
import './tabs.less'

// 生成tab标题映射表 用于埋点
function generateViewNameMap(tabs) {
    const viewNameMap = {};
    tabs?.forEach(tab => {
        viewNameMap[tab.key] = tab.title;
    });
    return viewNameMap;
}

export default React.forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars
    const [prop, setProp] = useState();
    const [activeKey, setActiveKey] = useState(null);
    const orgID = props.page?.org;

    const tabsConfig = useMemo(() => {
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
            config.param = { ...config.param };
            const objectProps = {
                ...props,
            };
            // 循环找出第一个可用的选项卡
            let _activeKey = null;
            // 如果传参中指定了 activeKey，进行应用
            let paramsActiveKey = props.page?.params?.activeKey || props.paramsActiveKey || null;
            if (paramsActiveKey !== undefined && paramsActiveKey !== null) {
                let tab = config.tabs[paramsActiveKey];
                if (tab && !tab.disabled && !tab.hide) {
                    _activeKey = `tab-${paramsActiveKey}`;
                }
            }
            config.tabs.forEach((tab, index) => {
                if (!tab.key) {
                    tab.key = `tab-${index}`;
                }
                if (tab.disabled) {
                    tab._disabled = Object.renderRecord(tab.disabled, objectProps);
                }
                if (tab.hide) {
                    tab._hide = Object.renderRecord(tab.hide, objectProps);
                }
                let hasRight = true;
                if (tab.right && !props.page.hasRight(tab.right) && !props.hasRight?.(tab.right)) {
                    hasRight = false;
                }
                if (!tab._disabled && !tab._hide && _activeKey === null && hasRight) {
                    _activeKey = tab.key;
                }
            });
            // 如果首次进入，或者当前选项卡变的不可用，则自动切换到可用选项卡
            if (
                activeKey === null ||
                config.tabs.find(t => t.key === activeKey)?.disabled ||
                config.tabs.find(t => t.key === activeKey)?._hide
            ) {
                setActiveKey(`${_activeKey}`);
                // tab初始埋点
                props.onTabChangeCallback?.(null, _activeKey, generateViewNameMap(config.tabs));
                if (config.tabs.find(t => t.key === `${_activeKey}`)?.noShowTree === true) {
                    props.changePageShowTree(false);
                }
            }
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, prop, orgID]);

    // 页面下有权限 或 系统有该权限（某页面部分内容引用其他页面，需要判断是否有其他页面的权限）
    const tabs = useMemo(
        () => tabsConfig.tabs.filter(tab => !tab.right || props.page.hasRight(tab.right) || props.hasRight?.(tab.right)).filter(tab => !tab._hide),
        // eslint-disable-next-line
        [props, tabsConfig.tabs, orgID]
    );

    // 页面有关联需要刷新所有tab页
    const reloadAllTabs = useCallback(() => {
        tabs.forEach(tab => tab?.pageRef?.current?.reload?.());
    }, [tabs]);

    // 刷新指定 index 的 tab 页
    const reloadTabByKey = useCallback((key) => {
        const tab = tabs.find(tab => tab.key === key);
        if (tab?.pageRef?.current?.reload) {
            tab.pageRef.current.reload();
        }
    }, [tabs]);

    const onChange = (key) => {
        // tab切换埋点
        props.onTabChangeCallback?.(activeKey, key, generateViewNameMap(tabs));
        setActiveKey(key);
        const lastTab = tabs.find(tab => tab.key === activeKey);
        const tab = tabs.find(tab => tab.key === key);
        const noShowTreeArr = tabs.filter(tab => tab?.noShowTree === true);
        if (noShowTreeArr.length > 0) {
            props.changePageShowTree(tab.noShowTree === true ? false : true);
        }
        const noShowTree = props.page?.params?.noShowTree || [];
        const showTree = props.page?.params?.showTree || [];
        if (noShowTree.includes(tab?.pageID)) {
            props.changePageShowTree(false);
        }
        if (showTree.includes(tab?.pageID)) {
            props.changePageShowTree(true);
        }
        if (tab.onTabChange && tab?.pageRef?.current?.[tab.onTabChange]) {
            tab.pageRef.current[tab.onTabChange](tab, lastTab);
        }
        // 触发浏览器resize事件，防止切换页面后布局不适配
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        });
    }

    const getPage = tab => {
        if (!tab.pageRef) {
            tab.pageRef = createRef();
        }
        if (tab.type === 'pageID') {
            return (
                <PageLayout
                    {...props}
                    ref={tab.pageRef}
                    pageID={tab.pageID}
                    parent={ref}
                    hasTabsExtra
                    reloadAllTabs={reloadAllTabs}
                    reloadTabByKey={reloadTabByKey}
                    tabLayoutProps={{ ...tab }}
                />
            );
        }
        if (tab.type === 'path') {
            const PageComponent = props.routes[tab.pageID] || Empty;
            return (
                <PageComponent
                    {...props}
                    page={{ ...props.page }}
                    ref={tab.pageRef}
                    parent={ref}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={`未找到页面${tab.pageID}`}
                    hasTabsExtra
                    reloadAllTabs={reloadAllTabs}
                    reloadTabByKey={reloadTabByKey}
                    tabLayoutProps={{ ...tab }}
                />
            );
        }
        if (tab.type === 'view' || tab.type === 'web') {
            const PageComponent = props.routes['Web'];
            const page = props.page;
            return <PageComponent {...props} ref={tab.pageRef} page={{ ...page }} url={tab.pageID} />;
        }
    };

    const currentTab = useMemo(() => tabs.find(tab => tab.key === activeKey), [tabs, activeKey]);

    const [extra, setExtra] = useState(currentTab?.pageRef?.current?.getFixedExtra?.());
    // 页面加载后，为了确保Extra内容能正常显示，所以再渲染一次
    useLayoutEffect(() => {
        setTimeout(() => {
            setExtra(currentTab?.pageRef?.current?.getFixedExtra?.());
        }, 100);
    }, [currentTab]);

    useImperativeHandle(ref, () => ({
        resize: () => {
            const activeTab = tabsConfig.tabs.find(t => t.key === activeKey);
            activeTab?.pageRef?.current?.resize && activeTab.pageRef.current.resize();
        },
        reload: () => {
            const activeTab = tabsConfig.tabs.find(t => t.key === activeKey);
            activeTab?.pageRef?.current?.reload && activeTab.pageRef.current.reload();
        },
        setState: (state) => {
            currentTab?.pageRef?.current?.pageRef?.current && setExtra(currentTab?.pageRef?.current?.getFixedExtra?.());
            // 针对非配置tab页面，也需要重新渲染tabs，拿到新的props（切换车场需重新调用接口）
            setProp({ ...state });
        },
        activeKey,
        currentTab,
    }), [activeKey, currentTab, tabsConfig.tabs]);
    return (
        <Tabs
            className="web-tabs layout-tabs"
            activeKey={activeKey}
            onChange={onChange}
            tabBarExtraContent={extra}
        >
            {tabs.map(tab => {
                const objectProps = {
                    ...props,
                };
                let hide;
                if (tab.hide) {
                    hide = Object.renderRecord(tab.hide, objectProps);
                }
                return !hide ? <Tabs.TabPane tab={tab.title} key={tab.key} disabled={tab._disabled}>
                    {tab.pageID ? (
                        getPage(tab)
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂未配置页面" />
                    )}
                </Tabs.TabPane> : '';
            })}
        </Tabs>
    );
});
