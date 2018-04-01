import express from 'express';

import ReactServerRender, {
  ReactServerRenderRouter,
  ReactServerRenderListen,
} from '../react-server-render/lib';

const app = express();

ReactServerRender({ app });

app.use(express.static('./dist/'));

app.use('/favicon.ico', (req, res) => {
  res.send(null);
});

app.use((req, res, next) => {
  // eslint-disable-next-line
  require('./app')(req, res, next);
});

// path, entry point name
ReactServerRenderRouter('/about', 'app111', 'index.html');

// path, entry point name
ReactServerRenderRouter('*', 'app', 'index.html');

ReactServerRenderListen();
