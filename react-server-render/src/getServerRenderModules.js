import path from 'path';

// eslint-disable-next-line no-underscore-dangle
function _interopRequireDefault(obj) {
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj : {
    default: obj,
  };
}

export default function getServerRenderModules(dev) {
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
    const _reducers = require(path.resolve('build/client/reducers.js'));
    reducers = _interopRequireDefault(_reducers).default;

    // eslint-disable-next-line
    const _routes = require(path.resolve('build/client/routes.js'));
    routes = _interopRequireDefault(_routes).default;
  }

  return { reducers, routes };
}
