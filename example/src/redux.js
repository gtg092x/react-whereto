import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const reducers = combineReducers({
  pass: (state = null) => state,
});

export default function createApStore (state, extras = {}) {

  const middleware = [
    // logger,
    thunk.withExtraArgument(extras),
  ];

  return createStore(reducers, state, applyMiddleware(...middleware))
}
