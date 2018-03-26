import { renderToStaticMarkup } from 'react-dom/server';

import reducers from './reducers'; // Or wherever you keep your reducers
import getRootComponent from '../../react-server-render/getRootComponent';
import toHtmlString from '../../react-server-render/toHtmlString';
import Routes, { routes } from './Routes';

export default function serverRender({ ssr, req }) {
  const preloadState = {};

  return new Promise((resolve) => {
    if (ssr && req) {
      getRootComponent({
        ssr,
        req,
        reducers,
        Routes,
        routes,
      })
        .then(({
          component, store, CMPSSR,
        }) => {
          resolve({
            page: toHtmlString(
              CMPSSR ? renderToStaticMarkup(component) : '',
              store.getState(),
            ),
          });
        })
        .catch((error) => {
          resolve({ error });
        });
    } else {
      resolve({ page: toHtmlString('', preloadState) });
    }
  });
}
