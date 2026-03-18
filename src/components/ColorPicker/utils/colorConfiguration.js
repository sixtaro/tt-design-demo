/**
 * 常量配置文件
 */

// 常量定义
export const MAX_RECENT_COLORS = 20; // 最近使用颜色的最大数量
export const MIN_GRADIENT_STOPS = 2; // 渐变停止点的最小数量

export const hexOption = [
    { value: 'HEX', label: 'HEX' },
    { value: 'CSS', label: 'CSS' },
]

export const optionsRGBA = [
    { value: 'RGBA', label: 'RGBA' },
    { value: 'HSLA', label: 'HSLA' },
    { value: 'HSBA', label: 'HSBA' },
]

// 纯色通用颜色定义
export const commonColorRows = [
    // 第1行：红色到紫色
    ['#D92A21', '#FF4433', '#FF8629', '#FFAA00', '#2E9900', '#11C79B', '#33BBFF', '#2195D9', '#2A21D9', '#8621D9'],
    // 第2行：白色系
    ['#FFFFFF', '#FFF4F0', '#FFF4E6', '#FFFBE6', '#E4FFCC', '#E6FFF4', '#F0FCFF', '#F0F9FF', '#F4F0FF', '#FBF0FF'],
    // 第3行：浅色系
    ['#F5F7FA', '#FFDFD6', '#FFD4A3', '#FFEDA3', '#C4F29B', '#B6FAE0', '#D6F7FF', '#D6EDFF', '#DFD6FF', '#E5ADFF'],
    // 第4行：中浅色系
    ['#DDE1EB', '#FFBCAD', '#FFBD7A', '#FFE07A', '#A2E66E', '#87EDC9', '#ADECFF', '#ADD8FF', '#BCADFF', '#D485FF'],
    // 第5行：中色系
    ['#A8B4C8', '#FF9785', '#FFA352', '#FFD152', '#80D945', '#5CE0B6', '#85DEFF', '#85C0FF', '#9785FF', '#C05CFF'],
    // 第6行：深中色系
    ['#6B7A99', '#FF6F5C', '#FF8629', '#FFBF29', '#5FCC21', '#35D4A7', '#5CCEFF', '#5CA5FF', '#6F5CFF', '#AA33FF'],
    // 第7行：深色系
    ['#223355', '#FF4433', '#FF6600', '#FFAA00', '#2E9900', '#11C79B', '#33BBFF', '#3388FF', '#4433FF', '#8621D9']
]

// 渐变色通用颜色定义
export const commonGradients = [
    // 第1行
    [
        'linear-gradient(135deg, #6B7A99 0%, #223355 100%)',
        'linear-gradient(135deg, #FF7962 0%, #FF4433 100%)',
        'linear-gradient(135deg, #FF9F00 0%, #FF6600 100%)',
        'linear-gradient(135deg, #FFD400 0%, #FFAA00 100%)',
        'linear-gradient(135deg, #84E13E 0%, #2E9900 100%)',
        'linear-gradient(135deg, #27E5CB 0%, #11C79B 100%)',
        'linear-gradient(135deg, #62DFFF 0%, #33BBFF 100%)',
        'linear-gradient(135deg, #62BDFF 0%, #3388FF 100%)',
        'linear-gradient(135deg, #7962FF 0%, #4433FF 100%)',
        'linear-gradient(135deg, #BB45EE 0%, #8621D9 100%)'
    ],
    // 第2行
    [
        'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)',
        'linear-gradient(135deg, #FFFAF9 0%, #FFF4F0 100%)',
        'linear-gradient(135deg, #FFFAF4 0%, #FFF4E6 100%)',
        'linear-gradient(135deg, #FFFDF4 0%, #FFFBE6 100%)',
        'linear-gradient(135deg, #E4FFCC 0%, #E4FFCC 100%)',
        'linear-gradient(135deg, #F4FFFA 0%, #E6FFF4 100%)',
        'linear-gradient(135deg, #F9FEFF 0%, #F0FCFF 100%)',
        'linear-gradient(135deg, #F9FDFF 0%, #F0F9FF 100%)',
        'linear-gradient(135deg, #FAF9FF 0%, #F4F0FF 100%)',
        'linear-gradient(135deg, #FDF9FF 0%, #FBF0FF 100%)'
    ],
    // 第3行
    [
        'linear-gradient(135deg, #F5F7FA 0%, #DDE1EB 100%)',
        'linear-gradient(135deg, #FFF1ED 0%, #FFDFD6 100%)',
        'linear-gradient(135deg, #FFECD0 0%, #FFD4A3 100%)',
        'linear-gradient(135deg, #FFF7D0 0%, #FFEDA3 100%)',
        'linear-gradient(135deg, #F6FFED 0%, #C4F29B 100%)',
        'linear-gradient(135deg, #DCFDF2 0%, #B6FAE0 100%)',
        'linear-gradient(135deg, #EDFCFF 0%, #D6F7FF 100%)',
        'linear-gradient(135deg, #EDF7FF 0%, #D6EDFF 100%)',
        'linear-gradient(135deg, #F1EDFF 0%, #DFD6FF 100%)',
        'linear-gradient(135deg, #F4D6FF 0%, #E5ADFF 100%)'
    ],
    // 第4行
    [
        'linear-gradient(135deg, #DDE1EB 0%, #A8B4C8 100%)',
        'linear-gradient(135deg, #FFDFD6 0%, #FFBCAD 100%)',
        'linear-gradient(135deg, #FFE0B2 0%, #FFBD7A 100%)',
        'linear-gradient(135deg, #FFF2B2 0%, #FFE07A 100%)',
        'linear-gradient(135deg, #EAFFD6 0%, #A2E66E 100%)',
        'linear-gradient(135deg, #BCF7E6 0%, #87EDC9 100%)',
        'linear-gradient(135deg, #D6F7FF 0%, #ADECFF 100%)',
        'linear-gradient(135deg, #D6EEFF 0%, #ADD8FF 100%)',
        'linear-gradient(135deg, #DFD6FF 0%, #BCADFF 100%)',
        'linear-gradient(135deg, #ECBBFF 0%, #D485FF 100%)'
    ],
    // 第5行
    [
        'linear-gradient(135deg, #A8B4C8 0%, #6B7A99 100%)',
        'linear-gradient(135deg, #FFC8BB 0%, #FF9785 100%)',
        'linear-gradient(135deg, #FFD08A 0%, #FFA352 100%)',
        'linear-gradient(135deg, #FFEA8A 0%, #FFD152 100%)',
        'linear-gradient(135deg, #DCFFBB 0%, #80D945 100%)',
        'linear-gradient(135deg, #27E5CB 0%, #11C79B 100%)',
        'linear-gradient(135deg, #62DFFF 0%, #33BBFF 100%)',
        'linear-gradient(135deg, #62BDFF 0%, #3388FF 100%)',
        'linear-gradient(135deg, #7962FF 0%, #4433FF 100%)',
        'linear-gradient(135deg, #BB45EE 0%, #8621D9 100%)'
    ],
    // 第6行
    [
        'linear-gradient(135deg, #6B7A99 0%, #223355 100%)',
        'linear-gradient(135deg, #FFA895 0%, #FF6F5C 100%)',
        'linear-gradient(135deg, #FFBB53 0%, #FF8629 100%)',
        'linear-gradient(135deg, #FFE153 0%, #FFBF29 100%)',
        'linear-gradient(135deg, #C3FA90 0%, #5FCC21 100%)',
        'linear-gradient(135deg, #27E5CB 0%, #11C79B 100%)',
        'linear-gradient(135deg, #62DFFF 0%, #33BBFF 100%)',
        'linear-gradient(135deg, #62BDFF 0%, #3388FF 100%)',
        'linear-gradient(135deg, #7962FF 0%, #4433FF 100%)',
        'linear-gradient(135deg, #BB45EE 0%, #8621D9 100%)'
    ],
    // 第7行
    [
        'linear-gradient(135deg, #223355 0%, #000000 100%)',
        'linear-gradient(135deg, #FF7962 0%, #FF4433 100%)',
        'linear-gradient(135deg, #FF9F00 0%, #FF6600 100%)',
        'linear-gradient(135deg, #FFD400 0%, #FFAA00 100%)',
        'linear-gradient(135deg, #84E13E 0%, #2E9900 100%)',
        'linear-gradient(135deg, #27E5CB 0%, #11C79B 100%)',
        'linear-gradient(135deg, #62DFFF 0%, #33BBFF 100%)',
        'linear-gradient(135deg, #62BDFF 0%, #3388FF 100%)',
        'linear-gradient(135deg, #7962FF 0%, #4433FF 100%)',
        'linear-gradient(135deg, #BB45EE 0%, #8621D9 100%)'
    ],
]

