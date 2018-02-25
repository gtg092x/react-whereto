import React from 'react';
import { Provider } from 'react-redux';
import URL from 'url';
import { Router } from 'react-router';
import createStore from './redux';
import MyRoutes, { routeDispatcher } from './MyRoutes';
import dispatcherLoader from '../../src/dispatchLoader';
import createHistory from 'history/createMemoryHistory';

const preloader = dispatcherLoader(routeDispatcher);

export const createHistoryMiddleware = () => async (ctx, next) => {
  ctx.history = createHistory({
    initialEntries: [ ctx.url ],
  });
  return next();
};

export const createStoreMiddleware = () => async (ctx, next) => {
  ctx.store = await Promise.resolve(createStore({}, ctx));
  return next();
};

export const hydrateStoreMiddleware = () => async (ctx, next) => {
  await preloader(ctx.store.dispatch)(URL.parse(ctx.url));
  if(ctx.history.length > 1) {
    return ctx.redirect(ctx.history.location.pathname);
  }
  return next();
};

const App = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history} >
      <MyRoutes />
    </Router>
  </Provider>
);

export default App;
