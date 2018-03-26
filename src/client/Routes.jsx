/* eslint-env browser */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';

// const store = configureStore(window.initialStoreData);

export const routes = [{
  path: '/',
  component: Home,
  exact: true,
},
{
  path: '/about',
  component: About,
},
{
  path: '/:id/about',
  component: About,
}];

export default (
  <Switch>
    {
    routes.map(route => (
      <Route key={route.path} exact path={route.path} component={route.component} />
    ))
  }
  </Switch>
);
