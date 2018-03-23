import express from 'express';

import hello, { setServerRender } from '../hello';
import webpackConfig from './webpack/webpack.config.babel';

const port = 3000;
const dev = false;
const ssr = true;
const staticPath = '/';
const app = express();

hello({ dev, webpackConfig, app, ssr, staticPath });

app.use(express.static('./dist'));

app.use(function(req, res, next) {
  require('./app')(req, res, next);
});

setServerRender();

app.listen(port, function(err) {
  if (err) throw err;

  console.log('Listening at http://%s:%d', 'localhost', port);
});
