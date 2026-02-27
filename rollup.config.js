import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true
    }
  ],
  watch: {
    buildDelay: 300,
    clearScreen: false
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['module', 'main'],
      preferBuiltins: false
    }),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        }
      ]
    }),
    postcss({
      extensions: ['.less', '.css'],
      use: {
        less: {},
      },
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
      babelHelpers: 'bundled'
    }),
    commonjs(),
    terser()
  ],
  external: ['react', 'react-dom', 'antd']
};
