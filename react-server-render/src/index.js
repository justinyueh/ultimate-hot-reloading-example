import path from 'path';
import chokidar from 'chokidar';
import cssModulesRequireHook from 'css-modules-require-hook';
import assetRequireHook from 'asset-require-hook';
import webpack from 'webpack';
import { renderToStaticMarkup } from 'react-dom/server';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import debug from 'debug';

import getRootComponent from './getRootComponent';
import toHtmlString from './util/toHtmlString';
import WebpackConfigCreator from './WebpackConfigCreator';
import {
  getServerRenderModules,
  getWebpackConfigModules,
} from './util/getModules';
import {
  outputPublicPath,
  getGenerateScopedName,
  fileLoaderName,
  getEnvConfig,
} from './config';

const envConfig = getEnvConfig();
const log = debug('ssr');
const cwd = process.cwd();

const myApp = {
  dev: envConfig.dev,
  app: null,
  compiler: null,
  ssr: envConfig.ssr,
  staticPath: envConfig.staticPath,
  port: envConfig.port,
};

export const setExpressMiddleware = () => {
  const {
    dev, compiler, app,
  } = myApp;

  if (dev) {
    // Serve hot-reloading bundle to client
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: outputPublicPath,
    }));
    app.use(webpackHotMiddleware(compiler));
  }
};

export default function ReactServerRender({ app }) {
  myApp.app = app;

  const { dev } = myApp;

  if (dev) {
    const { getWebpackConfig } = new WebpackConfigCreator(getWebpackConfigModules(dev));
    myApp.compiler = webpack(getWebpackConfig({ dev: true, ssr: false }));
    // The require hook compiles CSS Modules in runtime
    cssModulesRequireHook({ generateScopedName: getGenerateScopedName(dev) });
    assetRequireHook({
      extensions: ['png', 'jpg', 'jpeg'],
      name: fileLoaderName,
      publicPath: outputPublicPath,
    });
  }

  setExpressMiddleware();
}

/**
 * express router for react server render
 *
 * @param {string=} pathname - express router path
 * @param {string=} entry - webpack entry name
 * @param {string=} view - view file name with file suffix, like 'index.html'
 * @public
 */
export function ReactServerRenderRouter(pathname = null, entry = 'app', view = '') {
  const {
    dev, app, ssr, staticPath,
  } = myApp;

  // Anything else gets passed to the client app's server rendering
  app.get(pathname || '*', (req, res, next) => {
    const { reducers, routes } = getServerRenderModules(dev);

    if (ssr && req) {
      getRootComponent({
        ssr,
        req,
        reducers,
        routes,
      })
        .then(({
          component, store, CMPSSR,
        }) => {
          const preloadState = store.getState();
          const keyValues = preloadState.html || {};

          if (req.query.SSR_JSON) {
            // delete html ecsapt title for traffic optimization
            preloadState.html = {
              title: keyValues.title || '',
            };

            res.json(preloadState);
            return;
          }

          const page = toHtmlString({
            markup: CMPSSR ? renderToStaticMarkup(component) : '',
            view,
            keyValues,
            dev,
            entry,
            staticPath,
          });

          res.send(page);
        })
        .catch((error) => {
          next(error);
        });
    } else if (req && req.query.SSR_JSON) {
      res.json({});
    } else {
      const page = toHtmlString({
        view,
        dev,
        entry,
        staticPath,
      });

      res.send(page);
    }
  });
}

// watch files and hot reload when dev
export const ReactServerRenderWatch = () => {
  const {
    dev, compiler, ssr,
  } = myApp;

  if (dev) {
    // Do "hot-reloading" of express stuff on the server
    // Throw away cached modules and re-require next time
    // Ensure there's no important state in there!
    const watcher = chokidar.watch('./src/', {
      cwd,
    });

    watcher.on('ready', () => {
      watcher.on('all', (event, pathname) => {
        if (!/^src[/\\]client/.test(pathname)) {
          log(`Clearing ${pathname} module cache from server`);

          delete require.cache[path.resolve(pathname)];
        }
      });
    });

    if (ssr) {
      // Do "hot-reloading" of react stuff on the server
      // Throw away the cached client modules and let them be re-required next time
      compiler.hooks.done.tap('MyReRequirePlugin', () => {
        log('Clearing /client/ module cache from server');
        Object.keys(require.cache).forEach((id) => {
          if (/src[/\\]client[/\\]/.test(id)) {
            delete require.cache[id];
          }
        });
      });
    }
  }
};

export const ReactServerRenderListen = () => {
  const { app, port } = myApp;

  app.listen(port, (err) => {
    if (err) throw err;

    console.log('Listening at http://%s:%d', 'localhost', port);
  });

  ReactServerRenderWatch();
};
