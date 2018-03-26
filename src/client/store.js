import { createStore } from 'redux';

const configureStore = (initialState) => {
  // eslint-disable-next-line
  const store = createStore(require('./reducers'), initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line
      const nextRootReducer = require('./reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
