import { hydrate } from 'react-dom';

import reducers from './reducers'; // Or wherever you keep your reducers
import getRootComponent from '../../react-server-render/getRootComponent';
import Routes, { routes } from './Routes';

getRootComponent({
  preloadState: window.preloadState,
  reducers,
  Routes,
  routes,
})
  .then(({ component }) => {
    hydrate(
      component,
      document.getElementById('root'),
    );
  });
