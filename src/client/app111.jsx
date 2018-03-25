/* eslint-env browser */

import configureStore from './store';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom'

import reducers from './reducers' // Or wherever you keep your reducers
import HelloRouter from '../../hello/HelloRouter';
import Routes, { routes } from './Routes';

// const store = configureStore(window.initialStoreData);

HelloRouter({
  preloadState: window.preloadState,
  reducers,
  Routes,
  routes,
})
  .then(({ component, store, params }) => {
    hydrate(
      component,
      document.getElementById('root')
    );
  });
