import ts2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  ts2({
    useTsconfigDeclarationDir: true,
    objectHashIgnoreUnknownHack: true,
    clean: true
  })
];
const output = [
  {
    file: pkg.main.replace(/\.js$/, isProduction ? '.min.js' : '.js'),
    format: 'cjs'
  },
  {
    file: pkg.module.replace(/\.js$/, isProduction ? '.min.js' : '.js'),
    format: 'es'
  }
];

if (isProduction) {
  plugins.push(terser());
}

export default {
  input: 'src/index.ts',
  output,
  plugins
};
