/* eslint-env browser */

import Home from './pages/Home';
import configureStore from './store';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

const store = configureStore(window.initialStoreData);

hydrate(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById('root')
);
