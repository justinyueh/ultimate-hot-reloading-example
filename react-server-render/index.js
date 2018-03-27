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
import toHtmlString from './toHtmlString';
import {
  outputPublicPath,
  getGenerateScopedName,
  fileLoaderName,
} from './config';

const log = debug('ssr');
const cwd = process.cwd();

const myApp = {
  dev: false,
  app: null,
  compiler: null,
  ssr: false,
  staticPath: '/',
};

export const setExpress = () => {
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

export default ({
  dev,
  webpackConfig,
  app,
  ssr = true,
  staticPath,
}) => {
  myApp.dev = dev;
  myApp.app = app;
  myApp.ssr = ssr;
  myApp.staticPath = staticPath;

  if (dev) {
    myApp.compiler = webpack(webpackConfig({ dev: true, ssr: false }));
    // The require hook compiles CSS Modules in runtime
    cssModulesRequireHook({ generateScopedName: getGenerateScopedName(dev) });
    assetRequireHook({
      extensions: ['png', 'jpg', 'jpeg'],
      name: fileLoaderName,
      publicPath: outputPublicPath,
    })
  }

  setExpress();
};

function createScriptTag(src) {
  return `<script src=${src}></script>`;
}

function createCssTag(href) {
  return `<link rel="stylesheet" href=${href}></script>`;
}

export const getScript = (name) => {
  const { staticPath, dev } = myApp;
  let manifest = {};

  if (!dev) {
    try {
      // eslint-disable-next-line
      manifest = require('../build/manifest.json');
    } catch (e) { log(e); }
  }

  if (!manifest[name]) {
    return createScriptTag(`${staticPath}${name}.js`);
  } else if (Array.isArray(manifest[name])) {
    return createScriptTag(`${staticPath}${manifest[name][0]}`);
  }
  return createScriptTag(`${staticPath}${manifest[name]}`);
};

export const getCss = (name) => {
  const { staticPath, dev } = myApp;
  let manifest = {};

  if (!dev) {
    try {
      // eslint-disable-next-line
      manifest = require('../build/manifest.json');
    } catch (e) { log(e); }
  }

  if (manifest[name] && Array.isArray(manifest[name])) {
    return createCssTag(`${staticPath}${manifest[name][1]}`);
  }
  return '';
};

export const ReactServerRenderRouter = (pathname = null, entry = 'app') => {
  const {
    dev, app, ssr,
  } = myApp;

  // Anything else gets passed to the client app's server rendering
  app.get(pathname || '*', (req, res, next) => {
    // TODO:: programmically find server render file
    // eslint-disable-next-line
    const { reducers, Routes, routes } = require(dev ? path.resolve(cwd, './src/client/server-render') : path.resolve(cwd, './build/client/server-render'));

    let html = '';
    let page = '';

    if (ssr && req) {
      getRootComponent({
        ssr,
        req,
        reducers,
        Routes,
        routes,
      })
        .then(({
          component, store, CMPSSR,
        }) => {
          const preloadState = store.getState();

          if (req.query.SSR_JSON) {
            res.json(preloadState);
            return;
          }

          page = toHtmlString(CMPSSR ? renderToStaticMarkup(component) : '');

          html = page
            .replace(
              '<!-- STYLESHEET -->',
              getCss('vendor') + getCss(entry),
            )
            .replace(
              '<!-- JAVASCRIPT -->',
              getScript('vendor') + getScript(entry),
            );

          res.send(html);
        })
        .catch((error) => {
          next(error);
        });
    } else if (req && req.query.SSR_JSON) {
      res.json({});
    } else {
      page = toHtmlString();

      html = page
        .replace(
          '<!-- STYLESHEET -->',
          getCss('vendor') + getCss(entry),
        )
        .replace(
          '<!-- JAVASCRIPT -->',
          getScript('vendor') + getScript(entry),
        );

      res.send(html);
    }
  });
};

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

          delete require.cache[`${cwd}/${pathname}`];
          delete require.cache[`${cwd}\${pathname}`];
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

export const ReactServerRenderListen = (port) => {
  const { app } = myApp;

  app.listen(port, (err) => {
    if (err) throw err;

    console.log('Listening at http://%s:%d', 'localhost', port);
  });

  ReactServerRenderWatch();
};
