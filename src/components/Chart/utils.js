/**
 * Chart 组件工具函数
 */

import { colorPalette, defaultColors } from '../../theme/color-palette';

/**
 * 将 tt-design 主题颜色映射为 ECharts 主题配置
 * @param {string} themeName - 主题名称
 * @returns {Object} ECharts 主题配置
 */
export function getEChartsTheme(themeName) {
  const themeColors = colorPalette[themeName] || colorPalette.geekBlue;
  const primaryColor = themeColors[6];
  const primaryColorHover = themeColors[5];
  const primaryColorActive = themeColors[7];

  return {
    color: [
      primaryColor,
      defaultColors.success,
      defaultColors.warning,
      defaultColors.error,
      defaultColors.info || primaryColor,
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc'
    ],
    backgroundColor: 'transparent',
    textStyle: {},
    title: {
      textStyle: {
        color: defaultColors.text.title
      },
      subtextStyle: {
        color: defaultColors.text.secondary
      }
    },
    line: {
      itemStyle: {
        borderWidth: 1
      },
      lineStyle: {
        width: 2
      },
      symbolSize: 4,
      symbol: 'circle',
      smooth: false
    },
    radar: {
      itemStyle: {
        borderWidth: 1
      },
      lineStyle: {
        width: 2
      },
      symbolSize: 4,
      symbol: 'circle',
      smooth: false
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: '#ccc'
      }
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    },
    candlestick: {
      itemStyle: {
        color: defaultColors.error,
        color0: defaultColors.success,
        borderColor: defaultColors.error,
        borderColor0: defaultColors.success,
        borderWidth: 1
      }
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: '#ccc'
      },
      lineStyle: {
        width: 1,
        color: '#aaa'
      },
      symbolSize: 4,
      symbol: 'circle',
      smooth: false,
      color: [
        primaryColor,
        defaultColors.success,
        defaultColors.warning,
        defaultColors.error,
        defaultColors.info || primaryColor,
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ],
      label: {
        color: '#eee'
      }
    },
    map: {
      itemStyle: {
        areaColor: '#f3f3f3',
        borderColor: '#999999',
        borderWidth: 0.5
      },
      label: {
        color: '#d87c7c'
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#999999',
          borderWidth: 1
        },
        label: {
          color: 'rgb(100,0,0)'
        }
      }
    },
    geo: {
      itemStyle: {
        areaColor: '#f3f3f3',
        borderColor: '#999999',
        borderWidth: 0.5
      },
      label: {
        color: '#d87c7c'
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(255,215,0,0.8)',
          borderColor: '#999999',
          borderWidth: 1
        },
        label: {
          color: 'rgb(100,0,0)'
        }
      }
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#333'
        }
      },
      axisLabel: {
        show: true,
        color: defaultColors.text.body
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
        }
      }
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#333'
        }
      },
      axisLabel: {
        show: true,
        color: defaultColors.text.body
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
        }
      }
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#333'
        }
      },
      axisLabel: {
        show: true,
        color: defaultColors.text.body
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
        }
      }
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#333'
        }
      },
      axisLabel: {
        show: true,
        color: defaultColors.text.body
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#eee'
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
        }
      }
    },
    toolbox: {
      iconStyle: {
        borderColor: defaultColors.text.body
      },
      emphasis: {
        iconStyle: {
          borderColor: primaryColor
        }
      }
    },
    legend: {
      textStyle: {
        color: defaultColors.text.body
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#ccc',
          width: 1
        },
        crossStyle: {
          color: '#ccc',
          width: 1
        }
      }
    },
    timeline: {
      lineStyle: {
        color: primaryColor,
        width: 1
      },
      itemStyle: {
        color: primaryColor,
        borderWidth: 1
      },
      controlStyle: {
        color: primaryColor,
        borderColor: primaryColor,
        borderWidth: 0.5
      },
      checkpointStyle: {
        color: primaryColor,
        borderColor: primaryColor
      },
      label: {
        color: primaryColor
      }
    },
    visualMap: {
      color: [
        primaryColor,
        '#e0ffff',
        '#da70d6',
        '#32cd32',
        '#ff69b4',
        '#9400d3',
        '#ffd700',
        '#ff0000',
        '#c71585'
      ]
    },
    dataZoom: {
      backgroundColor: 'rgba(0,0,0,0)',
      dataBackgroundColor: '#eee',
      fillerColor: 'rgba(222,222,222,0.4)',
      handleColor: primaryColor,
      handleSize: '100%',
      textStyle: {
        color: defaultColors.text.secondary
      }
    },
    markPoint: {
      label: {
        color: '#eee'
      },
      emphasis: {
        label: {
          color: '#eee'
        }
      }
    }
  };
}

/**
 * 获取当前主题的主色调
 * @param {string} themeName - 主题名称
 * @returns {string} 主色值
 */
export function getPrimaryColor(themeName) {
  const themeColors = colorPalette[themeName] || colorPalette.geekBlue;
  return themeColors[6];
}
