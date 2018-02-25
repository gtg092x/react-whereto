# React Whereto

Where to?

## Install

```
yarn add react-whereto
```

## Use

Make a dispatcher

```
// my-dispatcher.js
import { RouteDispatcher } from 'react-whereto'

async function myPromise(who) {
  return Promise.resolve(1);
}

export const routeDispatcher = new RouteDispatcher()
  .route('/', { strict: true, exact: true }, () => dispatch => dispatch({ type: 'MY_ACTION' }))
  .route('/hello/:who', ({ params: { who } }) =>  myPromise(who))
  .route('/world', { type: 'MY_OTHER_ACTION' });

```

Wrap it with whatever you like (probably a redux dispatcher)

```
// my-loader.js
import { dispatchLoader } from 'react-whereto'
import { createStore, applyMiddelware } from 'redux';
import thunk from 'redux-thunk';
import routeDispatcher from './my-dispatcher';

const reducer = state => state; //.. a reducer, you know

const store = createStore(reducer, {}, applyMiddelware(thunk))

const locationHandler = dispatchLoader(routeDispatcher)(store.dispatch);

locationHandler('/hello/bob').then(() => {
  console.log('myPromise ran!');
});

```

Or let it load automatically with every route change.

```
// my-app.js
import React from 'react';
import { Provider } from 'react-redux';
import { DispatcherProvider } from 'react-whereto';
import { BrowserRouter, withRouter } from 'react-router-dom';
import routeDispatcher from './my-dispatcher';

const reducer = state => state; //.. a reducer, you know

const store = createStore(reducer, {}, applyMiddelware(thunk))

class NavOnLoadBase extends React.Component {
  componentDidMount() {
    // now the promise will load again!
    this.props.history.push('/hello/bob');
  }
  render() {
    return <div>Hi App</div>;
  }
}

const NavOnLoad = withRouter(NavOnLoadBase);

const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <DispatcherProvider store={store} dispatcher={routeDispatcher}>
        <NavOnLoad />
      </DispatcherProvider>
    </Provider>
  </Router>
);

export App;

```

## Example

```
yarn install
yarn run example
```

Then open your browser to http://127.0.0.1:3000

## License

`react-whereto` is free software under the MIT license.
