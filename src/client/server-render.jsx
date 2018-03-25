import configureStore from './store';
import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route } from 'react-router-dom'

import reducers from './reducers' // Or wherever you keep your reducers
import HelloRouter from '../../hello/HelloRouter';
import HelloPageToString from '../../hello/HelloPageToString';
import Routes, { routes } from './Routes';

export default function serverRender({ ssr, req }) {
  const preloadState = {
    count: {
      number: 10
    },
  };

  return new Promise(resolve => {
    if (ssr && req) {
      HelloRouter({
        ssr,
        req,
        preloadState,
        reducers,
        Routes,
        routes,
      })
        .then(({ component, store, params }) => {
          console.log(params);
          resolve({ page: HelloPageToString(renderToStaticMarkup(component), store.getState()) });
        })
        .catch(error => {
          resolve({ error })
        });
    } else {
      resolve({ page: HelloPageToString('', preloadState) });
    }
  });
}
