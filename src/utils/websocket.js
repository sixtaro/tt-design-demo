/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
const useWebSocket = (props) => {
    const { url, verify, useHeart = false, heartTime = 1800000, heartData, reconnetTime = 30000 } = props;
    const ws = useRef(null);
    // socket数据
    const [wsData, setWsData] = useState({});
    // socket状态
    const [readyState, setReadyState] = useState({
        key: 0,
        value: '正在连接中',
    });

    let lockConnect = false;
    let heartInterval = null;

    const sendMessage = useCallback((str) => {
        ws.current?.send(str);
    }, []);

    // 断开心跳
    const clearHeart = useCallback(() => {
        heartInterval && clearInterval(heartInterval);
    }, [heartInterval]);

    // 心跳
    const heart = () => {
        clearHeart();
        heartInterval = setInterval(() => {
            sendMessage(heartData);
        }, heartTime);
    };

    const creatWebSocket = () => {
        const stateArr = [
            { key: 0, value: '正在连接中' },
            { key: 1, value: '已经连接并且可以通讯' },
            { key: 2, value: '连接正在关闭' },
            { key: 3, value: '连接已关闭或者没有连接成功' },
        ];
        try {
            if (url) {
                ws.current = new WebSocket(url);
                ws.current.onopen = () => {
                    console.log('websocket已连接');
                    setReadyState(stateArr[ws.current?.readyState ?? 0]);
                    // 维持心跳
                    // useHeart && heart();
                };
                ws.current.onclose = () => {
                    console.log('websocket已关闭');
                    setReadyState(stateArr[ws.current?.readyState ?? 0]);
                };
                ws.current.onerror = () => {
                    console.log('websocket出错');
                    setReadyState(stateArr[ws.current?.readyState ?? 0]);
                };
                ws.current.onmessage = (e) => {
                    setWsData({ ...JSON.parse(e.data) });
                };
            }
        } catch (error) {
            console.log(error);
        }
    };

    const initWebSocket = () => {
        if (!ws.current || ws.current.readyState === 3) {
            creatWebSocket();
        }
    };

    const closeWebSocket = () => {
        ws.current?.close();
        clearHeart();
    };

    const reConnect = () => {
        try {
            if (lockConnect) {
                return;
            }
            lockConnect = true;
            clearHeart();
            setTimeout(() => {
                closeWebSocket();
                ws.current = null;
                creatWebSocket();
            }, reconnetTime);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        verify && initWebSocket();
        return () => {
            ws.current?.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws, verify]);

    return {
        wsData,
        readyState,
        closeWebSocket,
        reConnect,
        sendMessage,
    };
};

export default useWebSocket;
