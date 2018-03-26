import chokidar from 'chokidar';
import cssModulesRequireHook from 'css-modules-require-hook';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import debug from 'debug';

const log = debug('ssr');

const myApp = {
  dev: false,
  app: null,
  config: null,
  compiler: null,
  ssr: false,
  staticPath: '/',
};

export const setExpress = () => {
  const {
    dev, config, compiler, app,
  } = myApp;

  if (dev) {
    // Serve hot-reloading bundle to client
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true, publicPath: config.output.publicPath,
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
    myApp.config = webpackConfig({ dev: true, ssr: false });
    myApp.compiler = webpack(myApp.config);
    cssModulesRequireHook({ generateScopedName: '[path][name]-[local]' });
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

export const ReactServerRenderRouter = (path = null, entry = 'app') => {
  const {
    dev, app, ssr,
  } = myApp;

  // Anything else gets passed to the client app's server rendering
  app.get(path || '*', (req, res, next) => {
    // TODO:: programmically find server render file
    // eslint-disable-next-line
    require(dev ? '../src/client/server-render' : '../build/client/server-render').default({
      ssr,
      req,
    })
      .then(({ page = '', error }) => {
        if (error) {
          next(error);
          return;
        }

        const html = page
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
      .catch((err) => {
        next(err);
      });
  });
};

export const ReactServerRenderWatch = () => {
  const {
    dev, compiler, ssr,
  } = myApp;

  if (dev) {
    const cwd = process.cwd();
    // Do "hot-reloading" of express stuff on the server
    // Throw away cached modules and re-require next time
    // Ensure there's no important state in there!
    const watcher = chokidar.watch('./src/', {
      cwd,
    });

    watcher.on('ready', () => {
      watcher.on('all', (event, path) => {
        if (!/^src[/\\]client/.test(path)) {
          log(`Clearing ${path} module cache from server`);

          delete require.cache[`${cwd}/${path}`];
          delete require.cache[`${cwd}\${path}`];
        }
      });
    });

    if (ssr) {
      // Do "hot-reloading" of react stuff on the server
      // Throw away the cached client modules and let them be re-required next time
      compiler.hooks.done.tap('MyReRequirePlugin', () => {
        log('Clearing /client/ module cache from server');
        Object.keys(require.cache).forEach((id) => {
          if (/[/\\]client[/\\]/.test(id)) {
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
