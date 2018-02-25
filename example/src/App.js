import React from 'react';
import { Provider } from 'react-redux';
import createStore from './redux';
import MyRoutes from './MyRoutes';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const store = createStore(window.REDUX_STATE, { history });

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <MyRoutes />
    </Router>
  </Provider>
);

export default App;