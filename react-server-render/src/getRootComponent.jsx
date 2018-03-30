import React from 'react';
import thunk from 'redux-thunk';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { StaticRouter, matchPath, Route, Switch } from 'react-router-dom';

import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

import qs from 'querystring';
import axios from 'axios';


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

function getInitialProps({
  component, dispatch, params, queryParams, isClient,
}) {
  return new Promise((resolve) => {
    if (component && component.getInitialProps) {
      component.getInitialProps({
        dispatch, params, queryParams, isClient,
      })
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

export default async function getRootComponent({
  ssr,
  req,
  reducers,
  routes,
}) {
  const Routes = (
    <Switch>
      {
      routes.map(route => (
        <Route key={route.path} exact path={route.path} component={route.component} />
      ))
    }
    </Switch>
  );
  const storeParams = [
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
  ];

  if (ssr) {
    const context = {};
    storeParams.push(applyMiddleware(thunk));
    const store = createStore(...storeParams);

    const { component, params } = getMathedPageComponent(req, routes);
    const queryParams = req.query;

    // client or server environment
    const isClient = false;

    if (component && component.getInitialProps) {
      await getInitialProps({
        component,
        dispatch: store.dispatch,
        params,
        queryParams,
        isClient,
      });
    }

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
      CMPSSR: component && component.CMPSSR !== false,
      store,
      params,
    };
  }

  const { location } = window;
  const query = qs.decode(location.search.replace(/^\?/, ''));

  query.SSR_JSON = true;

  try {
    const response = await axios.get(`${location.origin}${location.pathname}?${qs.encode(query)}`);
    storeParams.push(response.data);
  } catch (error) {
    console.error(error);
  }

  // Create a history of your choosing (we're using a browser history in this case)
  const history = createHistory();

  // Build the middleware for intercepting and dispatching navigation actions
  const middleware = routerMiddleware(history);

  // eslint-disable-next-line no-underscore-dangle
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
