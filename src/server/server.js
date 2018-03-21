import chokidar from 'chokidar';
import config from '../webpack/webpack.config.babel';
import cssModulesRequireHook from 'css-modules-require-hook';
import express from 'express';
import http from 'http';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();
const isDev = true;
let compiler;

if (isDev) {
  compiler = webpack(config);
  cssModulesRequireHook({generateScopedName: '[path][name]-[local]'});
}

if (isDev) {
  // Serve hot-reloading bundle to client
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: config.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('dist'));

// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./app')(req, res, next);
});

// Anything else gets passed to the client app's server rendering
app.get('*', function(req, res, next) {
  require('../client/server-render')(req.path, function(err, page) {
    if (err) return next(err);
    res.send(page);
  });
});

if (isDev) {
  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  const watcher = chokidar.watch('./');

  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log("Clearing /server/ module cache from server");
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  compiler.hooks.done.tap('MyReRequirePlugin', function() {
    console.log("Clearing /client/ module cache from server");
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
  });
}

app.listen(3000, function(err) {
  if (err) throw err;

  console.log('Listening at http://%s:%d', 'localhost', 3000);
});
