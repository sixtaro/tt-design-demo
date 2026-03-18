// useDragHandler.js - 拖拽处理自定义Hook
import { useRef, useEffect } from 'react';

/**
 * 拖拽处理自定义Hook
 * @returns {Object} - 包含startDrag函数的对象
 */
const useDragHandler = () => {
    // 存储所有活跃的拖拽事件处理函数，用于组件卸载时清理
    const activeDragHandlers = useRef([]);

    /**
     * 启动拖拽
     * @param {Function} handler - 拖拽移动时的处理函数
     */
    const startDrag = (handler) => {
        const onMouseMove = (e) => handler(e);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            // 从活跃处理函数列表中移除
            activeDragHandlers.current = activeDragHandlers.current.filter(
                pair => pair.onMouseMove !== onMouseMove
            );
        };

        // 添加事件监听器
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // 记录到活跃处理函数列表
        activeDragHandlers.current.push({ onMouseMove, onMouseUp });
    };

    // 组件卸载时清理所有拖拽事件监听器
    useEffect(() => {
        return () => {
            // 获取当前活跃的拖拽事件处理函数
            const handlers = [...activeDragHandlers.current];

            // 清空列表（在移除监听器之前）
            activeDragHandlers.current = [];

            // 移除所有活跃的拖拽事件监听器
            handlers.forEach(({ onMouseMove, onMouseUp }) => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            });
        };
    }, []);

    return { startDrag };
};

export default useDragHandler;
