import { useCallback, useEffect, useRef, useState } from 'react';
import { useTrack } from '@/business/track/useTrack';
import { getPageView } from './utils';

export default function PageComponent(props) {
    const { tabsRef, page } = props;
    const { trackPageEnter, trackPageLeave } = useTrack();
    const [isVisible, setIsVisible] = useState(!document.hidden);
    const pageInited = useRef(false);

    // 监听可见性变化的处理函数
    const handleVisibilityChange = () => {
        const visible = !document.hidden;
        setIsVisible(visible);
    };
    // 处理子组件tab变化的回调函数
    const onTabChangeCallback = useCallback(
        (prevTab, currentTab, viewNameMap) => {
            const { pageID, pageName } = getPageView(page);
            // 执行离开前一个tab的事件
            if (prevTab) {
                trackPageLeave(pageID, {
                    pageName: pageName,
                    viewId: `${pageID}_VIEW_${prevTab}`,
                    viewName: `${pageName}_${viewNameMap?.[prevTab]}`,
                });
            }
            // 执行进入当前tab的事件
            if (currentTab) {
                trackPageEnter(pageID, {
                    pageName: pageName,
                    viewId: `${pageID}_VIEW_${currentTab}`,
                    viewName: `${pageName}_${viewNameMap?.[currentTab]}`,
                });
            }
        },
        [page, trackPageEnter, trackPageLeave]
    );

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (tabsRef.state.activeKey === page.key) {
            if (pageInited.current) {
                console.log(`${page?.data?.displayName}, 页面可见性变化: ${isVisible}`);
                const { pageID, pageName, viewID, viewName } = getPageView(page);
                if (isVisible) {
                    trackPageEnter(pageID, {
                        pageId: pageID,
                        pageName,
                        viewId: viewID,
                        viewName,
                    });
                } else {
                    trackPageLeave(pageID, {
                        pageId: pageID,
                        pageName,
                        viewId: viewID,
                        viewName,
                    });
                }
            } else {
                pageInited.current = true;
            }
        }
        // 解决监听page变化，可能多次触发问题，由于page.showTree可能变化，导致多次触发
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.key, page.data?.displayName, page.data?.path, trackPageEnter, trackPageLeave, isVisible, tabsRef]);

    return (
        <>
            <props.page.component {...props} onTabChangeCallback={onTabChangeCallback} />
        </>
    );
}
