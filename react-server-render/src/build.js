import remove from 'remove';
import path from 'path';
import { spawn } from 'child_process';

import buildClient from './build.client';
import buildServerRender from './build.server.render';
import WebpackConfigCreator from './WebpackConfigCreator';

// eslint-disable-next-line no-underscore-dangle
function _interopRequireDefault(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj : {
    default: obj,
  };
}

const cwd = process.cwd();

// eslint-disable-next-line import/no-dynamic-require,no-underscore-dangle
const _webpackConfig = require(path.resolve(cwd, './src/webpack.config.js'));

const webpackConfig = _interopRequireDefault(_webpackConfig).default;

async function build() {
  const { getWebpackConfig } = new WebpackConfigCreator(webpackConfig);

  console.time('total build');

  try {
    remove.removeSync(path.resolve(cwd, './build'));
    remove.removeSync(path.resolve(cwd, './dist'));
  } catch (e) {
    //
  }

  console.time('client build');

  try {
    await buildClient(getWebpackConfig);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  console.timeEnd('client build');

  console.time('ssr build');

  try {
    await buildServerRender(getWebpackConfig);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  console.timeEnd('ssr build');

  console.time('babel build');

  const args = [
    path.resolve(cwd, './node_modules/.bin/babel'),
    'src',
    '--out-dir',
    'build',
    '--copy-files',
    '--ignore',
    'client',
    '--no-babelrc',
    '--presets=env',
    '--plugins=transform-class-properties,transform-decorators-legacy,transform-object-rest-spread,transform-runtime',
    // '--presets=env[{"targets": {"node": "8.9.3"}}]',
    '--colors',
  ];

  const proc = spawn(process.argv[0], args, {
    stdio: ['pipe', 'pipe', process.stderr], // 'inherit'
  });

  proc.on('exit', (code, signal) => {
    process.on('exit', () => {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code);
      }
    });
    console.timeEnd('babel build');
    console.timeEnd('total build');
  });
}

build();
