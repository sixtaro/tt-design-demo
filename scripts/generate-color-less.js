const path = require('path');
const fs = require('fs');
const { colorPalette, defaultColors } = require('../src/theme/color-palette');

const outputPath = path.resolve(__dirname, '../src/style/color.less');

const colorNameMap = {
  dustRed: 'red',
  sunsetOrange: 'orange',
  calendulaGold: 'gold',
  sunriseYellow: 'yellow',
  lime: 'lime',
  polarGreen: 'green',
  mintGreen: 'mint-green',
  cyan: 'cyan',
  skyBlue: 'blue',
  geekBlue: 'geek-blue',
  neonBlue: 'neon-blue',
  goldenPurple: 'purple',
  pulsePink: 'pink',
  rosePink: 'rose-pink',
  grey: 'grey'
};

const colorChineseNames = {
  dustRed: '薄暮红',
  sunsetOrange: '日暮橙',
  calendulaGold: '金盏花',
  sunriseYellow: '日出',
  lime: '青柠',
  polarGreen: '极光绿',
  mintGreen: '薄荷绿',
  cyan: '明青',
  skyBlue: '天际蓝',
  geekBlue: '极客蓝',
  neonBlue: '霓虹蓝',
  goldenPurple: '酱紫',
  pulsePink: '脉冲粉',
  rosePink: '蔷薇粉',
  grey: '中性色'
};

let lessContent = '// Auto-generated file - DO NOT EDIT DIRECTLY\n';
lessContent += '// Generated from src/theme/color-palette.js\n\n';

Object.keys(colorPalette).forEach(colorKey => {
  const lessName = colorNameMap[colorKey];
  const chineseName = colorChineseNames[colorKey];
  const colors = colorPalette[colorKey];

  lessContent += `// ${chineseName}\n`;
  Object.keys(colors).forEach(level => {
    lessContent += `@${lessName}-${level}: ${colors[level]};\n`;
  });
  lessContent += '\n';
});

lessContent += '// 透明度 - 黑色\n';
for (let i = 100; i >= 0; i -= 10) {
  const alpha = i / 100;
  lessContent += `@black-opacity-${i}: rgba(0, 0, 0, ${alpha});\n`;
}
lessContent += '\n';

lessContent += '// 透明度 - 白色\n';
for (let i = 100; i >= 0; i -= 10) {
  const alpha = i / 100;
  lessContent += `@white-opacity-${i}: rgba(255, 255, 255, ${alpha});\n`;
}
lessContent += '\n';

lessContent += '// 字体颜色\n';
lessContent += `@text-title: @grey-8;\n`;
lessContent += `@text-link: @geek-blue-6;\n`;
lessContent += `@text-body: @grey-7;\n`;
lessContent += `@text-danger: @red-6;\n`;
lessContent += `@text-secondary: @grey-6;\n`;
lessContent += `@text-warning: @gold-6;\n`;
lessContent += `@text-success: @mint-green-6;\n`;
lessContent += '\n';

lessContent += '// 功能色别名\n';
lessContent += `@color-primary: @geek-blue-6;\n`;
lessContent += `@color-primary-hover: @geek-blue-5;\n`;
lessContent += `@color-primary-active: @geek-blue-7;\n\n`;
lessContent += `@color-success: @mint-green-6;\n`;
lessContent += `@color-warning: @gold-6;\n`;
lessContent += `@color-error: @red-6;\n`;
lessContent += `@color-info: @geek-blue-6;\n\n`;

lessContent += '// 主题色阶变量（默认映射到 geek-blue）\n';
lessContent += `@primary-1: @geek-blue-1;\n`;
lessContent += `@primary-2: @geek-blue-2;\n`;
lessContent += `@primary-3: @geek-blue-3;\n`;
lessContent += `@primary-4: @geek-blue-4;\n`;
lessContent += `@primary-5: @geek-blue-5;\n`;
lessContent += `@primary-6: @geek-blue-6;\n`;
lessContent += `@primary-7: @geek-blue-7;\n\n`;

lessContent += '// Antd 主题变量别名\n';
lessContent += `@primary-color: @primary-6;\n`;
lessContent += `@primary-color-hover: @primary-5;\n`;
lessContent += `@primary-color-active: @primary-7;\n\n`;

lessContent += '// 背景色\n';
lessContent += `@bg-white: @grey-0;\n`;
lessContent += `@bg-light: @grey-1;\n`;
lessContent += `@bg-lighter: @grey-2;\n`;
lessContent += `@bg-lightest: @grey-3;\n\n`;

lessContent += '// 边框色\n';
lessContent += `@border-color: @grey-4;\n`;
lessContent += `@border-color-light: @grey-3;\n`;
lessContent += `@border-color-dark: @grey-5;\n\n`;

lessContent += '// ==================== CSS 自定义属性（运行时主题）====================\n';
lessContent += ':root {\n';

lessContent += '  // 主题色阶变量（跟随当前主题）\n';
for (let i = 1; i <= 7; i++) {
  lessContent += `  --tt-color-primary-${i}: @primary-${i};\n`;
}

lessContent += '\n  // 语义化颜色\n';
lessContent += '  --tt-color-primary: @primary-6;\n';
lessContent += '  --tt-color-primary-hover: @primary-5;\n';
lessContent += '  --tt-color-primary-active: @primary-7;\n';
lessContent += '  --tt-color-success: @mint-green-6;\n';
lessContent += '  --tt-color-success-hover: @mint-green-5;\n';
lessContent += '  --tt-color-success-active: @mint-green-7;\n';
lessContent += '  --tt-color-warning: @gold-6;\n';
lessContent += '  --tt-color-warning-hover: @gold-5;\n';
lessContent += '  --tt-color-warning-active: @gold-7;\n';
lessContent += '  --tt-color-error: @red-6;\n';
lessContent += '  --tt-color-error-hover: @red-5;\n';
lessContent += '  --tt-color-error-active: @red-7;\n';
lessContent += '  --tt-color-info: @primary-6;\n\n';

lessContent += '  // 文本颜色\n';
lessContent += '  --tt-text-title: @grey-8;\n';
lessContent += '  --tt-text-body: @grey-7;\n';
lessContent += '  --tt-text-secondary: @grey-6;\n';
lessContent += '  --tt-text-link: @geek-blue-6;\n';
lessContent += '  --tt-text-danger: @red-6;\n';
lessContent += '  --tt-text-warning: @gold-6;\n';
lessContent += '  --tt-text-success: @mint-green-6;\n\n';

lessContent += '  // 背景色\n';
lessContent += '  --tt-bg-white: @grey-0;\n';
lessContent += '  --tt-bg-light: @grey-1;\n';
lessContent += '  --tt-bg-lighter: @grey-2;\n';
lessContent += '  --tt-bg-lightest: @grey-3;\n\n';

lessContent += '  // 边框色\n';
lessContent += '  --tt-border-color: @grey-4;\n';
lessContent += '  --tt-border-color-light: @grey-3;\n';
lessContent += '  --tt-border-color-dark: @grey-5;\n\n';

lessContent += '  // 红色色阶\n';
for (let i = 1; i <= 10; i++) {
  lessContent += `  --tt-color-red-${i}: @red-${i};\n`;
}

lessContent += '\n  // 灰色色阶\n';
for (let i = 0; i <= 9; i++) {
  lessContent += `  --tt-color-grey-${i}: @grey-${i};\n`;
}

lessContent += '}\n\n';

lessContent += '// ==================== 工具类（可选）====================\n';

lessContent += '// 文字色类\n';
for (let i = 1; i <= 7; i++) {
  lessContent += `.tt-text-primary-${i} { color: var(--tt-color-primary-${i}); }\n`;
}
lessContent += '.tt-text-primary { color: var(--tt-color-primary); }\n';
lessContent += '.tt-text-success { color: var(--tt-color-success); }\n';
lessContent += '.tt-text-warning { color: var(--tt-color-warning); }\n';
lessContent += '.tt-text-error { color: var(--tt-color-error); }\n';
lessContent += '.tt-text-info { color: var(--tt-color-info); }\n\n';

lessContent += '// 背景色类\n';
for (let i = 1; i <= 7; i++) {
  lessContent += `.tt-bg-primary-${i} { background-color: var(--tt-color-primary-${i}); }\n`;
}
lessContent += '.tt-bg-primary { background-color: var(--tt-color-primary); }\n';
lessContent += '.tt-bg-success { background-color: var(--tt-color-success); }\n';
lessContent += '.tt-bg-warning { background-color: var(--tt-color-warning); }\n';
lessContent += '.tt-bg-error { background-color: var(--tt-color-error); }\n';
lessContent += '.tt-bg-info { background-color: var(--tt-color-info); }\n\n';

lessContent += '// 边框色类\n';
for (let i = 1; i <= 7; i++) {
  lessContent += `.tt-border-primary-${i} { border-color: var(--tt-color-primary-${i}); }\n`;
}
lessContent += '.tt-border-primary { border-color: var(--tt-color-primary); }\n';
lessContent += '.tt-border-success { border-color: var(--tt-color-success); }\n';
lessContent += '.tt-border-warning { border-color: var(--tt-color-warning); }\n';
lessContent += '.tt-border-error { border-color: var(--tt-color-error); }\n';
lessContent += '.tt-border-info { border-color: var(--tt-color-info); }\n';

fs.writeFileSync(outputPath, lessContent, 'utf8');
console.log(`✅ Generated color.less at: ${outputPath}`);
