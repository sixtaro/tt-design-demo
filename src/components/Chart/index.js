import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as echarts from 'echarts';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import { Spin } from 'antd';
import { getEChartsTheme } from './utils';
import './index.less';

const Chart = forwardRef(({
  option,
  theme,
  loading = false,
  loadingOptions = {},
  onEvents = {},
  notMerge = false,
  lazyUpdate = false,
  style = {},
  className,
  autoResize = true,
  version,
  ...props
}, ref) => {
  const chartDomRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const chartClassName = classNames(
    'tt-chart',
    className
  );

  // 获取或创建图表实例
  const getChartInstance = useCallback(() => {
    if (!chartInstanceRef.current && chartDomRef.current) {
      const echartsTheme = theme ? getEChartsTheme(theme) : null;
      chartInstanceRef.current = echarts.init(chartDomRef.current, echartsTheme);
    }
    return chartInstanceRef.current;
  }, [theme]);

  // 设置图表配置
  const setOption = useCallback((opt, merge = notMerge, update = lazyUpdate) => {
    const chart = getChartInstance();
    if (chart && opt) {
      chart.setOption(opt, merge, update);
    }
  }, [getChartInstance, notMerge, lazyUpdate]);

  // 调整图表大小
  const resize = useCallback((opts) => {
    const chart = getChartInstance();
    if (chart) {
      chart.resize(opts);
    }
  }, [getChartInstance]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => getChartInstance(),
    resize,
    setOption,
    dispatchAction: (payload) => {
      const chart = getChartInstance();
      if (chart) {
        chart.dispatchAction(payload);
      }
    },
    convertToPixel: (finder, value) => {
      const chart = getChartInstance();
      if (chart) {
        return chart.convertToPixel(finder, value);
      }
      return null;
    },
    convertFromPixel: (finder, value) => {
      const chart = getChartInstance();
      if (chart) {
        return chart.convertFromPixel(finder, value);
      }
      return null;
    }
  }), [getChartInstance, resize, setOption]);

  // 绑定事件
  useEffect(() => {
    const chart = getChartInstance();
    if (!chart) return;

    // 解绑之前的事件
    chart.off();

    // 绑定新事件
    Object.keys(onEvents).forEach(eventName => {
      const handler = onEvents[eventName];
      if (typeof handler === 'function') {
        chart.on(eventName, handler);
      }
    });
  }, [getChartInstance, onEvents]);

  // 设置配置
  useEffect(() => {
    if (option) {
      setOption(option);
    }
  }, [option, setOption]);

  // 处理 loading 状态
  useEffect(() => {
    const chart = getChartInstance();
    if (!chart) return;

    if (loading) {
      chart.showLoading(loadingOptions);
    } else {
      chart.hideLoading();
    }
  }, [loading, loadingOptions, getChartInstance]);

  // 处理主题变化
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
    }
    if (option) {
      setTimeout(() => {
        setOption(option, true);
      }, 0);
    }
  }, [theme]);

  // 自动响应窗口大小变化
  useEffect(() => {
    if (!autoResize) return;

    const handleResize = () => {
      resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [autoResize, resize]);

  // 使用 ResizeObserver 监听容器大小变化
  useEffect(() => {
    if (!autoResize || !chartDomRef.current || typeof ResizeObserver === 'undefined') return;

    resizeObserverRef.current = new ResizeObserver(() => {
      resize();
    });

    resizeObserverRef.current.observe(chartDomRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [autoResize, resize]);

  // 组件卸载时销毁实例
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={chartClassName}
      style={style}
      {...props}
      data-component-version={version}
    >
      {loading && (
        <div className="tt-chart-loading">
          <Spin />
        </div>
      )}
      <div
        ref={chartDomRef}
        className="tt-chart-dom"
      />
    </div>
  );
});

Chart.displayName = 'Chart';

Chart.version = componentVersions.Chart || '1.0.0';

Chart.propTypes = {
  /** ECharts 配置对象 */
  option: PropTypes.object.isRequired,
  /** 主题名称或主题对象 */
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** 是否显示加载状态 */
  loading: PropTypes.bool,
  /** Loading 配置 */
  loadingOptions: PropTypes.object,
  /** 事件监听对象 */
  onEvents: PropTypes.objectOf(PropTypes.func),
  /** setOption 的 notMerge 参数 */
  notMerge: PropTypes.bool,
  /** setOption 的 lazyUpdate 参数 */
  lazyUpdate: PropTypes.bool,
  /** 容器样式 */
  style: PropTypes.object,
  /** 容器类名 */
  className: PropTypes.string,
  /** 是否自动响应窗口大小变化 */
  autoResize: PropTypes.bool,
  /** 组件版本号 */
  version: PropTypes.string,
};

export default Chart;
