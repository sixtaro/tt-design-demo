import React, { useCallback, useEffect, useRef, forwardRef } from 'react';
import Track from './track.js';

export function useTrack() {
    const isMounted = useRef(true);
    // 组件卸载时标记
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // 跟踪通用事件
    const trackEvent = useCallback((eventName, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.track(eventName, properties);
    }, []);

    // 跟踪按钮点击
    const trackButtonClick = useCallback((buttonName, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackButtonClick(buttonName, properties);
    }, []);

    // 跟踪应用进入
    const trackAppEnter = useCallback((appID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackAppEnter(appID, properties);
    }, []);
    // 跟踪应用离开
    const trackAppLeave = useCallback((appID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackAppLeave(appID, properties);
    }, []);

    // 跟踪页面加载
    const trackPageLoad = useCallback((pageID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackPageLoad(pageID, properties);
    }, []);

    // 跟踪视图加载
    const trackViewLoad = useCallback((viewID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackViewLoad(viewID, properties);
    }, []);

    // 跟踪页面进入
    const trackPageEnter = useCallback((pageID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackPageEnter(pageID, properties);
    }, []);
    // 跟踪页面离开
    const trackPageLeave = useCallback((pageID, properties = {}) => {
        // if (!isMounted.current) {
        //     return;
        // }
        Track.trackPageLeave(pageID, properties);
    }, []);
    // 跟踪视图进入
    const trackViewEnter = useCallback((viewID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackViewEnter(viewID, properties);
    }, []);
    // 跟踪视图离开
    const trackViewLeave = useCallback((viewID, properties = {}) => {
        if (!isMounted.current) {
            return;
        }
        Track.trackViewLeave(viewID, properties);
    }, []);

    return {
        isInitialized: Track.isInitialized,
        trackEvent,
        trackButtonClick,
        trackPageLoad,
        trackAppEnter,
        trackAppLeave,
        trackPageEnter,
        trackPageLeave,
        trackViewEnter,
        trackViewLeave,
        trackViewLoad,
    };
}

export function withTrack(WrappedComponent) {
    class WithTrackComponent extends React.Component {
        constructor(props) {
            super(props);
            this._isMounted = true;

            // 绑定所有跟踪方法
            this.trackEvent = this.trackEvent.bind(this);
            this.trackButtonClick = this.trackButtonClick.bind(this);
            this.trackAppEnter = this.trackAppEnter.bind(this);
            this.trackAppLeave = this.trackAppLeave.bind(this);
            this.trackPageLoad = this.trackPageLoad.bind(this);
            this.trackPageEnter = this.trackPageEnter.bind(this);
            this.trackPageLeave = this.trackPageLeave.bind(this);
            this.trackViewEnter = this.trackViewEnter.bind(this);
            this.trackViewLeave = this.trackViewLeave.bind(this);
            this.trackViewLoad = this.trackViewLoad.bind(this);
        }

        componentWillUnmount() {
            this._isMounted = false;
        }

        trackEvent(eventName, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.track(eventName, properties);
        }

        trackButtonClick(buttonName, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackButtonClick(buttonName, properties);
        }

        trackAppEnter(appID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackAppEnter(appID, properties);
        }
        trackAppLeave(appID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackAppLeave(appID, properties);
        }

        trackPageLoad(pageID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackPageLoad(pageID, properties);
        }

        trackPageEnter(pageID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackPageEnter(pageID, properties);
        }

        trackPageLeave(pageID, properties = {}) {
            // if (!this._isMounted) {
            //     return;
            // }
            Track.trackPageLeave(pageID, properties);
        }

        trackViewEnter(viewID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackViewEnter(viewID, properties);
        }

        trackViewLeave(viewID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackViewLeave(viewID, properties);
        }
        trackViewLoad(viewID, properties = {}) {
            if (!this._isMounted) {
                return;
            }
            Track.trackViewLoad(viewID, properties);
        }

        render() {
            const { forwardedRef, ...rest } = this.props;
            const trackProps = {
                isInitialized: Track.isInitialized,
                trackEvent: this.trackEvent,
                trackButtonClick: this.trackButtonClick,
                trackAppEnter: this.trackAppEnter,
                trackAppLeave: this.trackAppLeave,
                trackPageLoad: this.trackPageLoad,
                trackPageEnter: this.trackPageEnter,
                trackPageLeave: this.trackPageLeave,
                trackViewEnter: this.trackViewEnter,
                trackViewLeave: this.trackViewLeave,
                trackViewLoad: this.trackViewLoad,
            };

            return <WrappedComponent {...rest} ref={forwardedRef} track={trackProps} />;
        }
    }
    return forwardRef((props, ref) => {
        return <WithTrackComponent {...props} forwardedRef={ref} />;
    });
}
