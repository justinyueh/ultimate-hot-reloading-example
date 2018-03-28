import { hydrate } from 'react-dom';

import reducers from './reducers'; // Or wherever you keep your reducers
import getRootComponent from '../../react-server-render/lib/getRootComponent';
import routes from './routes';

getRootComponent({
  reducers,
  routes,
})
  .then(({ component }) => {
    hydrate(
      component,
      document.getElementById('root'),
    );
  });
