import { matchPath } from 'react-router';
import QS from 'qs';
import { parseRoute, isFunction } from './utils';

export default class Dispatcher {
  constructor() {
    this.routes = [];
  }
  getThunkForValidRoutes(location) {
    const validRoutes = this.getValidRoutesWithMatch(location);
    return dispatch => Promise.all(validRoutes.map((route) => {
      const { match, ...rest } = route;
      const { query = '', ...restMatch } = match;
      const action = isFunction(route.action) ? route.action({ ...restMatch, ...rest, query: QS.parse(query.replace(/^\?/, '')) }) : route.action;
      return dispatch(action);
    }));
  }
  getValidRoutesWithMatch(location) {
    const {
      pathname,
      hash = '',
      search = '',
      query,
    } = location;
    const queryParse = query || (search && QS.parse(search.replace(/^\?/, ''))) || {};
    const hashParse = hash ? QS.parse(hash.replace(/^#/, '')) : {};
    return this.routes.map(route => ({
      ...route,
      match: matchPath(pathname, route),
      query: queryParse,
      hash: hashParse,
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
