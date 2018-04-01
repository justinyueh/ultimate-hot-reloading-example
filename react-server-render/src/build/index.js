import remove from 'remove';
import path from 'path';

import buildClient from './build.client';
import buildServerRender from './build.server.render';
import buildServer from './build.server';
import WebpackConfigCreator from '../WebpackConfigCreator';
import { getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

// eslint-disable-next-line no-underscore-dangle
function _interopRequireDefault(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj : {
    default: obj,
  };
}

async function build() {
  console.time('total build');

  try {
    remove.removeSync(path.resolve(babelOutDir));
    remove.removeSync(path.resolve('dist'));
  } catch (e) {
    //
  }

  try {
    console.time('babel build');
    await buildServer();
    console.timeEnd('babel build');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  // eslint-disable-next-line
  const _webpackConfig = require(path.resolve(`${babelOutDir}/webpack.config.js`));

  const webpackConfig = _interopRequireDefault(_webpackConfig).default;

  const { getWebpackConfig } = new WebpackConfigCreator(webpackConfig);

  try {
    console.time('client build');
    await buildClient(getWebpackConfig);
    console.timeEnd('client build');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  try {
    console.time('ssr build');
    await buildServerRender(getWebpackConfig);
    console.timeEnd('ssr build');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }


  console.timeEnd('total build');
}

build();
