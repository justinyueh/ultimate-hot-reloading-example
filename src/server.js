import express from 'express';

import ReactServerRender, {
  ReactServerRenderRouter,
  ReactServerRenderListen,
} from '../react-server-render';

import webpackConfig from './webpack/webpack.config';

const port = 3000;

// 是否开发环境
const dev = true;

// 服务端渲染总开关, default true
const ssr = true;

// 静态资源前缀，包括域名和path
const staticPath = '/';
const app = express();

ReactServerRender({
  dev,
  webpackConfig,
  app,
  ssr,
  staticPath,
});

app.use(express.static('./dist'));

app.use('/favicon.ico', (req, res) => {
  res.send(null);
});

app.use((req, res, next) => {
  // eslint-disable-next-line
  require('./app')(req, res, next);
});

// path, entry point name
ReactServerRenderRouter('/about', 'app111');
// path, entry point name
ReactServerRenderRouter('*', 'app');

ReactServerRenderListen(port);
