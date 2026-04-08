import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
const path = require('path');
const packageJson = require('./package.json');

const isDev = process.env.NODE_ENV === 'development';

const peerDependencies = Object.keys(packageJson.peerDependencies || {});
// Prefer peerDependencies as the single source of truth for host-provided runtime deps.
// Keep this list only for packages we intentionally externalize without asking consumers
// to install them as peers.
const alwaysExternalPackages = ['mockjs'];
const externalPackages = [...new Set([...alwaysExternalPackages, ...peerDependencies])];

const isExternal = id => {
  const normalizedId = id.replace(/\\/g, '/');

  return externalPackages.some(pkg => {
    const normalizedPackagePath = `/node_modules/${pkg}/`;
    return normalizedId === pkg || normalizedId.startsWith(`${pkg}/`) || normalizedId.includes(normalizedPackagePath);
  });
};

export default {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: isDev,
      entryFileNames: 'index.js',
      inlineDynamicImports: true,
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
      sourcemap: isDev,
      entryFileNames: 'index.js',
      inlineDynamicImports: true,
    },
  ],
  watch: {
    buildDelay: 300,
    clearScreen: false,
    include: 'src/**',
    exclude: 'node_modules/**',
  },
  plugins: [
    image(),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    }),
    json(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['module', 'main'],
      preferBuiltins: false,
    }),
    postcss({
      extensions: ['.less', '.css'],
      use: {
        less: {},
      },
      minimize: !isDev,
      sourceMap: isDev,
      extract: true,
      plugins: [
        url({
          url: 'inline',
          maxSize: Infinity, // 内联所有图片，无论大小
        }),
      ],
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
      babelHelpers: 'bundled',
    }),
    commonjs(),
    !isDev && terser(),
  ].filter(Boolean),
  external: isExternal,
};
