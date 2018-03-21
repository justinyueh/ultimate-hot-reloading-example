import App from './components/App';
import configureStore from './store';
import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToStaticMarkup } from 'react-dom/server';

// eslint-disable-next-line no-sync

const template = `
<html>
  <head>
    <title>Sample App</title>
  </head>
  <body>
    <div id="root"><!-- CONTENT --></div>
    <script type="text/javascript">
      window.initialStoreData = "-- STORES --";
    </script>
    <script src="/vendor.js"></script>
    <script src="/app.js"></script>
  </body>
</html>
`;

function renderApp(path, callback) {
  const store = configureStore();
  const state = store.getState();

  const rendered = renderToStaticMarkup(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const page = template
    .replace('<!-- CONTENT -->', rendered)
    .replace('"-- STORES --"', JSON.stringify(state));

  callback(null, page);
}

module.exports = renderApp;
