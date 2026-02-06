import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

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
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled'
    }),
    commonjs(),
    terser()
  ],
  external: ['react', 'react-dom', 'antd']
};
