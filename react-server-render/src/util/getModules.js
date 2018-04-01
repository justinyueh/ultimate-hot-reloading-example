import path from 'path';
import { getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

// eslint-disable-next-line no-underscore-dangle
function _interopRequireDefault(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj : {
    default: obj,
  };
}

/**
 * Import reducers and routes
 * @param {Boolean} dev
 */
export function getServerRenderModules(dev) {
  let reducers;
  let routes;
  if (dev) {
    // eslint-disable-next-line
    const _reducers = require(path.resolve('src/client/reducers/index.js'));
    reducers = _interopRequireDefault(_reducers).default;

    // eslint-disable-next-line
    const _routes = require(path.resolve('src/client/routes.jsx'));
    routes = _interopRequireDefault(_routes).default;
  } else {
    // eslint-disable-next-line
    const _reducers = require(path.resolve(`${babelOutDir}/client/reducers.js`));
    reducers = _interopRequireDefault(_reducers).default;

    // eslint-disable-next-line
    const _routes = require(path.resolve(`${babelOutDir}/client/routes.js`));
    routes = _interopRequireDefault(_routes).default;
  }

  return { reducers, routes };
}

/**
 * Import webpack.config.js
 * @param {Boolean} dev
 */
export function getWebpackConfigModules(dev) {
  let webpackConfig;
  if (dev) {
    // eslint-disable-next-line
    const _webpackConfig = require(path.resolve('src/webpack.config.js'));
    webpackConfig = _interopRequireDefault(_webpackConfig).default;
  } else {
    // eslint-disable-next-line
    const _webpackConfig = require(path.resolve(`${babelOutDir}/webpack.config.js`));
    webpackConfig = _interopRequireDefault(_webpackConfig).default;
  }

  return webpackConfig;
}
