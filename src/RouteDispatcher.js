import { matchPath } from 'react-router';
import { parseRoute, isFunction } from './utils';

export default class Dispatcher {
  constructor() {
    this.routes = [];
  }
  getThunkForValidRoutes(location, lastLocation) {
    const validRoutes = this.getValidRoutesWithMatch(location, lastLocation);
    return dispatch => Promise.all(validRoutes.map((route) => {
      const action = isFunction(route.action)
        ? route.action({
          ...location,
          ...route.match,
        }, lastLocation ? {
          ...lastLocation,
          ...(route.lastMatch ? route.lastMatch : {}),
        } : null)
        : route.action;
      return dispatch(action);
    }));
  }
  getValidRoutesWithMatch(location, lastLocation) {
    return this.routes.map(route => ({
      ...route,
      match: matchPath(location.pathname, route),
      lastMatch: lastLocation ? matchPath(lastLocation.pathname, route) : null,
    })).filter(route => route.match);
  }
  route(path, ...rest) {
    const action = rest.pop();
    const config = rest.pop() || {};
    this.routes.push({
      ...parseRoute(path),
      ...config,
      action,
    });
    return this;
  }
}
