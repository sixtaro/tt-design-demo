import React, { useState, useEffect, useRef } from 'react';

export const useVisibility = (isTabActive = true) => {
    // 状态1: 浏览器页面是否可见（标签页在前台）
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
    // 状态2: 组件是否处于完全可见状态（页面可见且Tab激活）
    const [isFullyVisible, setIsFullyVisible] = useState(isTabActive && !document.hidden);
    const isTabActiveRef = useRef(isTabActive);
    isTabActiveRef.current = isTabActive;
    const updateFullyVisible = (pageVisible, tabActive) => {
        setIsFullyVisible(pageVisible && tabActive);
    };

    useEffect(() => {
        const handlePageVisibilityChange = () => {
            const pageVisible = !document.hidden;
            setIsPageVisible(pageVisible);
            updateFullyVisible(pageVisible, isTabActiveRef.current);
        };
        document.addEventListener('visibilitychange', handlePageVisibilityChange);
        updateFullyVisible(!document.hidden, isTabActiveRef.current);
        return () => {
            document.removeEventListener('visibilitychange', handlePageVisibilityChange);
        };
    }, []);

    useEffect(() => {
        updateFullyVisible(isPageVisible, isTabActive);
    }, [isTabActive, isPageVisible]);

    return {
        isPageVisible, // 浏览器页面是否可见
        isTabActive, // 内部Tab是否激活
        isFullyVisible, // 是否完全可见（页面可见且Tab激活）
    };
};

export function withVisibility(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            const isTabActive = props.tabsRef.state.activeKey === props.page.key;
            this.state = {
                isPageVisible: !document.hidden,
                isTabActive: isTabActive,
                isFullyVisible: isTabActive && !document.hidden,
            };

            this.isTabActiveRef = isTabActive;
            this.handlePageVisibilityChange = this.handlePageVisibilityChange.bind(this);
        }

        componentDidMount() {
            document.addEventListener('visibilitychange', this.handlePageVisibilityChange);
            this.updateFullyVisible(!document.hidden, this.isTabActiveRef);
        }

        componentWillUnmount() {
            document.removeEventListener('visibilitychange', this.handlePageVisibilityChange);
        }

        componentDidUpdate(prevProps) {
            const isTabActive = prevProps.tabsRef.state.activeKey === this.props.page.key;
            if (this.isTabActiveRef !== isTabActive) {
                this.updateFullyVisible(this.state.isPageVisible, isTabActive);
                this.isTabActiveRef = isTabActive;
            }
        }

        handlePageVisibilityChange() {
            const isPageVisible = !document.hidden;
            this.setState({ isPageVisible });
            this.updateFullyVisible(isPageVisible, this.isTabActiveRef);
        }

        updateFullyVisible = (pageVisible, tabActive) => {
            this.setState({ isFullyVisible: pageVisible && tabActive });
        };

        render() {
            const visibilityProps = {
                isPageVisible: this.state.isPageVisible,
                isTabActive: this.isTabActiveRef,
                isFullyVisible: this.state.isFullyVisible,
            };

            return <WrappedComponent {...this.props} visiblity={visibilityProps} />;
        }
    };
}

export default withVisibility;
