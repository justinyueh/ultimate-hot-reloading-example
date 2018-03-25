import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { BrowserRouter, StaticRouter, Route, Router, Switch, matchPath } from 'react-router-dom'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

export const getMathedPageComponent = (req, routes) => {
  let matchedComponent;
  let matchedParams;
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    // eslint-disable-next-line no-underscore-dangle
    const match = matchPath(req._parsedUrl.pathname, route.path, route);
    if (match && (match.isExact || !route.exact)) {
      matchedComponent = route.component;
      matchedParams = match.params;
      break;
    }
  }

  return { component: matchedComponent, params: matchedParams };
};

function getInitialProps(component, dispatch, params) {
  return new Promise(resolve => {
    if (component.getInitialProps) {
      component.getInitialProps(dispatch, params)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(err);
          resolve();
        });
    } else {
      resolve();
    }
  });
}

export default async ({ ssr, req, preloadState, reducers, Routes, routes }) => {
  const storeParams = [
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
    preloadState,
  ];

  if (ssr) {
    const context = {};
    storeParams.push(applyMiddleware(thunk));
    const store = createStore(...storeParams);
    
    const { component, params } = getMathedPageComponent(req, routes);

    await getInitialProps(component, store.dispatch, params);

    return {
      component: (
        <Provider store={store}>
          <StaticRouter
            location={req.url}
            context={context}
          >
            {Routes}
          </StaticRouter>
        </Provider>
      ),
      store,
      params,
    };
  } else {
    // Create a history of your choosing (we're using a browser history in this case)
    const history = createHistory();

    // Build the middleware for intercepting and dispatching navigation actions
    const middleware = routerMiddleware(history);

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    // Add the reducer to your store on the `router` key
    // Also apply our middleware for navigating
    storeParams.push(composeEnhancers(
      applyMiddleware(middleware),
      applyMiddleware(thunk),
    ));

    const store = createStore(...storeParams);

    return {
      component: (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {Routes}
          </ConnectedRouter>
        </Provider>
      ),
      store,
      params: {},
    };
  }
};
