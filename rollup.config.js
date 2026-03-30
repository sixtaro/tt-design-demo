import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
const path = require('path');

export default {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      entryFileNames: 'index.js',
      inlineDynamicImports: true,
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
      sourcemap: false,
      entryFileNames: 'index.js',
      inlineDynamicImports: true,
    },
  ],
  watch: {
    buildDelay: 300,
    clearScreen: false,
  },
  plugins: [
    image(),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ]
    }),
    json(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['module', 'main'],
      preferBuiltins: false
    }),
    postcss({
      extensions: ['.less', '.css'],
      use: {
        less: {},
      },
      minimize: true, // 压缩 CSS
      sourceMap: false, // 不生成 sourcemap
      extract: true, // 提取 CSS 到单独文件
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
      babelHelpers: 'bundled',
    }),
    commonjs(),
    terser(),
  ],
  external: [
    'react',
    'react-dom',
    'antd',
    '@wangeditor/editor',
    '@wangeditor/editor-for-react',
    'animejs',
    'axios',
    'echarts',
    'mockjs',
    'pinyin-pro',
    'react-beautiful-dnd',
    'react-resizable',
    'sa-sdk-javascript',
    'swiper',
    'xlsx',
    'xlsx-js-style',
  ],
};
